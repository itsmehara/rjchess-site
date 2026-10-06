"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { site, waLink } from "@/content/site";
import { booking, enquiryTypes, type EnquiryType } from "@/content/booking";
import { fieldChecks } from "@/content/validate";
import { Turnstile } from "./Turnstile";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; wa: string } | { kind: "err"; wa: string; why: string };

// What the visitor sees for each Apps Script error code (see apps-script/enquiry-to-sheet.gs).
const FIELD_LABEL: Record<string, string> = {
  name: "your name", phone: "the phone number", city: "the city", pincode: "the pincode", email: "the email",
  date: "the preferred date", slots: "the three time slots", consent: "the confirmation tick box", type: "the enquiry type",
};
function why(error: string): string {
  if (error.startsWith("invalid:")) return `Please check ${FIELD_LABEL[error.slice(8)] ?? "the form"} and try again.`;
  if (error === "human-check") return "We couldn't confirm the check that you're human — please try again in a moment.";
  if (error === "busy") return "We're receiving a lot of enquiries right now.";
  return "That didn't go through.";
}
const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [type, setType] = useState<EnquiryType>("trial");
  // Chosen slot ids in order of preference (1st, 2nd, 3rd).
  const [slots, setSlots] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  // Human check (Cloudflare Turnstile) — only when enquiries are saved and a site key is set.
  const needsCheck = !!site.enquiryEndpoint && !!site.turnstileSiteKey;
  const [humanToken, setHumanToken] = useState<string | null>(null);
  const [checkReset, setCheckReset] = useState(0);
  // One id per enquiry: a retry after a network blip is recognised by the script, never saved twice.
  const requestId = useRef<string>("");
  // The trial panel animates between its measured height and 0. Height is
  // set imperatively at click time (auto → px → target) so the transition
  // has real numbers to run between; after opening it returns to auto.
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLFieldSetElement>(null);
  const choose = useCallback((t: EnquiryType) => {
    const w = wrapRef.current, p = panelRef.current;
    if (w && p) {
      w.style.setProperty("height", `${t === "trial" ? 0 : p.offsetHeight}px`);
      void w.offsetHeight; // commit the start value before the target
      w.style.setProperty("height", `${t === "trial" ? p.offsetHeight : 0}px`);
    }
    setType(t);
  }, []);

  // A link can pre-select the type: /?enquiry=general#contact (used by the
  // Play and Co-trainers pages). Deferred a tick so hydration sees the default.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("enquiry");
    if (!t || t === "trial" || !enquiryTypes.some((x) => x.value === t)) return;
    const id = window.setTimeout(() => choose(t as EnquiryType), 0);
    return () => window.clearTimeout(id);
  }, [choose]);

  const isTrial = type === "trial";
  const slotsDone = slots.length === booking.choices;
  const canSubmit = status.kind !== "sending" && (!isTrial || (slotsDone && agreed)) && (!needsCheck || !!humanToken);

  const today = new Date();
  const maxDate = new Date(today.getTime() + booking.daysAhead * 86400000);

  const toggleSlot = (id: string) =>
    setSlots((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : cur.length < booking.choices ? [...cur, id] : cur));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    // Same checks as the Apps Script: show the first problem on its field and stop.
    for (const [name, check] of Object.entries(fieldChecks)) {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      const msg = check(data[name] ?? "", data);
      if (input && msg) {
        input.setCustomValidity(msg);
        input.reportValidity();
        input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
        return;
      }
    }
    const typeLabel = enquiryTypes.find((t) => t.value === type)?.label ?? type;
    const slotLabels = slots.map((id, i) => `${i + 1}. ${booking.slots.find((s) => s.id === id)?.label ?? id}`);

    const lines = [
      `Hi Jagadeesh, this is ${data.name}.`,
      typeLabel + (data.level ? ` · Level: ${data.level}` : ""),
      data.email ? `Email: ${data.email}` : "",
      `City: ${data.city}${data.pincode ? ` ${data.pincode}` : ""}`,
      isTrial && data.date ? `Preferred date: ${data.date}` : "",
      isTrial && slotLabels.length ? `Preferred slots (IST): ${slotLabels.join("  ")}` : "",
      data.message ? `\n${data.message}` : "",
    ].filter(Boolean);
    const wa = waLink(lines.join("\n"));

    // No endpoint configured yet: WhatsApp is the whole flow.
    if (!site.enquiryEndpoint) {
      window.open(wa, "_blank", "noopener");
      return;
    }

    setStatus({ kind: "sending" });
    try {
      // The script answers with CORS, so its reply is readable: "saved" is shown only when
      // it confirms. Anything else keeps what the visitor typed and offers WhatsApp.
      requestId.current ||= newId();
      const body = JSON.stringify({
        ...data,
        type,
        slots: isTrial ? slotLabels : [],
        consent: isTrial ? agreed : undefined,
        turnstile: humanToken ?? undefined,
        requestId: requestId.current,
        source: "website",
        submittedAt: new Date().toISOString(),
      });
      // On a slow (cold) run Google sometimes loses the reply page (404) after the row is
      // already saved. Ask once more with the same requestId: the script recognises it and
      // answers "ok" without saving twice.
      let reply: { ok?: boolean; error?: string } = {};
      for (let attempt = 0; attempt < 2 && typeof reply.ok !== "boolean"; attempt++) {
        const res = await fetch(site.enquiryEndpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" }, // a "simple" request: no CORS preflight
          body,
        }).catch(() => null);
        reply = ((await res?.json().catch(() => null)) ?? {}) as typeof reply;
      }
      setCheckReset((n) => n + 1); // a Turnstile token is single-use
      if (reply.ok !== true) {
        setStatus({ kind: "err", wa, why: why(reply.error ?? "") });
        return;
      }
      requestId.current = "";
      setStatus({ kind: "ok", wa });
      form.reset();
      setSlots([]);
      setAgreed(false);
    } catch {
      setStatus({ kind: "err", wa, why: why("") });
      setCheckReset((n) => n + 1);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      {/* Spam trap: hidden from people, but bots fill every field. The Apps Script drops
          any enquiry where it has a value. */}
      <label className="hp" aria-hidden="true">
        Company <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <fieldset className="field choice">
        <legend>What is this about?</legend>
        <div className="pills" role="radiogroup">
          {enquiryTypes.map((t) => (
            <label key={t.value} className={type === t.value ? "pill on" : "pill"}>
              <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => choose(t.value)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" required autoComplete="name" maxLength={60} />
        </label>
        <label className="field">
          <span>Phone / WhatsApp</span>
          <input name="phone" required type="tel" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="98765 43210 · outside India +1 …" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          {/* A general enquiry is answered by email as well as WhatsApp, so it needs one. */}
          <span>{type === "general" ? "Email" : "Email (optional)"}</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" required={type === "general"} />
        </label>
        <label className="field">
          <span>Current level (optional)</span>
          <input name="level" placeholder="Beginner, rated 1200, school team…" />
        </label>
      </div>
      <div className="form-row city-row">
        <label className="field">
          <span>City</span>
          <input name="city" required autoComplete="address-level2" maxLength={60} placeholder="Vijayawada, Hyderabad, Dallas…" />
        </label>
        <label className="field">
          <span>Pincode (optional)</span>
          <input name="pincode" autoComplete="postal-code" maxLength={10} placeholder="520001 · or postcode" />
        </label>
      </div>

      {/* Always mounted, so switching type animates the height instead of jumping. */}
      <div
        ref={wrapRef}
        className={isTrial ? "trial-wrap open" : "trial-wrap"}
        aria-hidden={!isTrial}
        onTransitionEnd={(e) => { if (e.target === wrapRef.current && isTrial) wrapRef.current.style.setProperty("height", "auto"); }}
      >
        <fieldset className="trial" disabled={!isTrial} ref={panelRef}>
          <div className="prefs">
            <label className="field">
              <span>Preferred date</span>
              <input name="date" type="date" min={isoDate(today)} max={isoDate(maxDate)} required />
            </label>
            {booking.prefLabels.map((label, i) => {
              const id = slots[i];
              const slot = id ? booking.slots.find((s) => s.id === id) : undefined;
              return (
                <div key={label} className={slot ? "pref on" : "pref"}>
                  <span>{label}</span>
                  {slot ? (
                    <button type="button" onClick={() => toggleSlot(slot.id)} aria-label={`Clear ${label}: ${slot.label}`}>
                      {slot.label} <i aria-hidden="true">&times;</i>
                    </button>
                  ) : (
                    <em>{i === slots.length ? "tap a time ↓" : "—"}</em>
                  )}
                </div>
              );
            })}
          </div>

          <div className="field choice">
            <div className="slots" role="group" aria-label={`Time slots (IST) — choose ${booking.choices} in order of preference`}>
              {["AM", "PM"].map((part) => (
                <div key={part} className="slot-part">
                  <small>{part}</small>
                  {booking.slots.filter((s) => s.part === part).map((s) => {
                    const rank = slots.indexOf(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={rank >= 0 ? "slot on" : "slot"}
                        aria-pressed={rank >= 0}
                        disabled={rank < 0 && slotsDone}
                        onClick={() => toggleSlot(s.id)}
                      >
                        {rank >= 0 && <b>{booking.prefLabels[rank]}</b>}
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="fine">{booking.timezoneNote}</p>
          </div>

          <div className="notice" role="note">
            <b>Please note</b>
            <p>{booking.disclaimer}</p>
          </div>
          <label className="consent">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>{booking.consent}</span>
          </label>
        </fieldset>
      </div>

      <label className="field msg">
        <span>Message</span>
        <textarea name="message" maxLength={1500} placeholder={isTrial ? "Who is the class for, and anything about timing — only weekends, your time zone, after school…" : "Who is the training for, and what would you like to achieve?"} />
      </label>

      {status.kind === "ok" && (
        <p className="form-status ok">
          Thanks — your enquiry is saved. To continue the conversation now,{" "}
          <a href={status.wa} target="_blank" rel="noopener">open WhatsApp</a>.
        </p>
      )}
      {status.kind === "err" && (
        <p className="form-status err" role="alert">
          {status.why} Your details are still here — try again, or <a href={status.wa} target="_blank" rel="noopener">send it on WhatsApp</a> instead.
        </p>
      )}

      {needsCheck && <Turnstile siteKey={site.turnstileSiteKey} onToken={setHumanToken} resetKey={checkReset} />}

      <button type="submit" disabled={!canSubmit}>
        {status.kind === "sending"
          ? "Sending…"
          : needsCheck && !humanToken && (!isTrial || (slotsDone && agreed))
            ? "Checking you're human…"
          : isTrial && !slotsDone
            ? `Pick your ${booking.prefLabels[slots.length]}erence`
            : isTrial && !agreed
              ? "Tick the box to continue"
              : site.enquiryEndpoint
                ? "Send enquiry"
                : "Continue on WhatsApp"}
      </button>
      <p className="form-note">
        Fees are shared on request. Your details are only used to reply to you; the conversation
        continues on WhatsApp. <a href="/privacy/">Privacy</a>
      </p>
    </form>
  );
}
