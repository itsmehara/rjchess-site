"use client";

import { useState, type FormEvent } from "react";
import { site, waLink } from "@/content/site";
import { booking, enquiryTypes, type EnquiryType } from "@/content/booking";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; wa: string } | { kind: "err"; wa: string };

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [type, setType] = useState<EnquiryType>("trial");
  // Chosen slot ids in order of preference (1st, 2nd, 3rd).
  const [slots, setSlots] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const isTrial = type === "trial";
  const slotsDone = slots.length === booking.choices;
  const canSubmit = status.kind !== "sending" && (!isTrial || (slotsDone && agreed));

  const today = new Date();
  const maxDate = new Date(today.getTime() + booking.daysAhead * 86400000);

  const toggleSlot = (id: string) =>
    setSlots((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : cur.length < booking.choices ? [...cur, id] : cur));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const typeLabel = enquiryTypes.find((t) => t.value === type)?.label ?? type;
    const slotLabels = slots.map((id, i) => `${i + 1}. ${booking.slots.find((s) => s.id === id)?.label ?? id}`);

    const lines = [
      `Hi Jagadeesh, this is ${data.name}.`,
      typeLabel + (data.level ? ` · Level: ${data.level}` : ""),
      data.email ? `Email: ${data.email}` : "",
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
      // Apps Script web apps don't send CORS headers, so the response is
      // opaque; a resolved fetch is the best signal we get that it landed.
      await fetch(site.enquiryEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...data,
          type,
          slots: isTrial ? slotLabels : [],
          consent: isTrial ? agreed : undefined,
          source: "website",
          submittedAt: new Date().toISOString(),
        }),
      });
      setStatus({ kind: "ok", wa });
      form.reset();
      setSlots([]);
      setAgreed(false);
    } catch {
      setStatus({ kind: "err", wa });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <fieldset className="field choice">
        <legend>What is this about?</legend>
        <div className="pills" role="radiogroup">
          {enquiryTypes.map((t) => (
            <label key={t.value} className={type === t.value ? "pill on" : "pill"}>
              <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>Phone / WhatsApp</span>
          <input name="phone" required type="tel" autoComplete="tel" inputMode="tel" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Email (optional)</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" />
        </label>
        <label className="field">
          <span>Current level (optional)</span>
          <input name="level" placeholder="Beginner, 1200 on Lichess, school team…" />
        </label>
      </div>

      {/* Always mounted, so switching type animates the height instead of jumping. */}
      <div className={isTrial ? "trial-wrap open" : "trial-wrap"} aria-hidden={!isTrial}>
        <fieldset className="trial" disabled={!isTrial}>
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

      <label className="field">
        <span>Message</span>
        <textarea name="message" placeholder={isTrial ? "Who is the class for, and anything about timing — only weekends, your time zone, after school…" : "Who is the training for, and what would you like to achieve?"} />
      </label>

      {status.kind === "ok" && (
        <p className="form-status ok">
          Thanks — your enquiry is saved. To continue the conversation now,{" "}
          <a href={status.wa} target="_blank" rel="noopener">open WhatsApp</a>.
        </p>
      )}
      {status.kind === "err" && (
        <p className="form-status err">
          That didn&apos;t go through. <a href={status.wa} target="_blank" rel="noopener">Send it on WhatsApp</a> instead.
        </p>
      )}

      <button type="submit" disabled={!canSubmit}>
        {status.kind === "sending"
          ? "Sending…"
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
        continues on WhatsApp.
      </p>
    </form>
  );
}
