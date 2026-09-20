"use client";

import { useState, type FormEvent } from "react";
import { site, waLink } from "@/content/site";

const TYPES = [
  { value: "general", label: "General enquiry" },
  { value: "trial", label: "Book a trial class" },
  { value: "callback", label: "Request a call back" },
];

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; wa: string } | { kind: "err"; wa: string };

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const typeLabel = TYPES.find((t) => t.value === data.type)?.label ?? data.type;
    const text =
      `Hi Jagadeesh, this is ${data.name}.\n` +
      `${typeLabel}${data.level ? ` · Level: ${data.level}` : ""}\n` +
      (data.message ? `\n${data.message}` : "");
    const wa = waLink(text);

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
        body: JSON.stringify({ ...data, source: "website", submittedAt: new Date().toISOString() }),
      });
      setStatus({ kind: "ok", wa });
      form.reset();
    } catch {
      setStatus({ kind: "err", wa });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
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
          <span>What is this about?</span>
          <select name="type" defaultValue="general">
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Current level (optional)</span>
          <input name="level" placeholder="Beginner, 1200 on Lichess, school team…" />
        </label>
      </div>
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

      <button type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : site.enquiryEndpoint ? "Send enquiry" : "Continue on WhatsApp"}
      </button>
      <p className="form-note">
        Fees are shared on request. Your details are only used to reply to you; the conversation
        continues on WhatsApp.
      </p>
    </form>
  );
}
