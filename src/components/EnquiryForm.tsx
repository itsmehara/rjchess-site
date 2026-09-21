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
      isTrial && data.timing ? `Timing notes: ${data.timing}` : "",
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

      {isTrial && (
        <div className="trial">
          <label className="field">
            <span>Preferred date</span>
            <input name="date" type="date" min={isoDate(today)} max={isoDate(maxDate)} required />
          </label>

          <fieldset className="field choice">
            <legend>
              Preferred time slots — pick {booking.choices}, in order of preference
              <b className={slotsDone ? "count done" : "count"}>{slots.length} of {booking.choices} chosen</b>
            </legend>
            {["Early morning", "Evening"].map((part) => (
              <div key={part} className="slot-group">
                <small>{part}</small>
                <div className="slots">
                  {booking.slots.filter((s) => s.part === part).map((s) => {
                    const rank = slots.indexOf(s.id);
                    const locked = rank < 0 && slotsDone;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={rank >= 0 ? "slot on" : "slot"}
                        aria-pressed={rank >= 0}
                        disabled={locked}
                        onClick={() => toggleSlot(s.id)}
                      >
                        {rank >= 0 && <i aria-hidden="true">{rank + 1}</i>}
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="fine">{booking.timezoneNote}</p>
          </fieldset>

          <label className="field">
            <span>Anything about timing? (optional)</span>
            <input name="timing" placeholder="Only weekends, US Eastern time, after school…" />
          </label>

          <div className="notice" role="note">
            <b>Please note</b>
            <p>{booking.disclaimer}</p>
          </div>
          <label className="consent">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>{booking.consent}</span>
          </label>
        </div>
      )}

      <label className="field">
        <span>Message</span>
        <textarea name="message" placeholder="Who is the training for, and what would you like to achieve?" />
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
        {status.kind === "sending" ? "Sending…" : site.enquiryEndpoint ? "Send enquiry" : "Continue on WhatsApp"}
      </button>
      {isTrial && !canSubmit && status.kind !== "sending" && (
        <p className="form-note gate">
          {!slotsDone ? `Choose ${booking.choices - slots.length} more time slot${booking.choices - slots.length === 1 ? "" : "s"}` : "Tick the box above"} to continue.
        </p>
      )}
      <p className="form-note">
        Fees are shared on request. Your details are only used to reply to you; the conversation
        continues on WhatsApp.
      </p>
    </form>
  );
}
