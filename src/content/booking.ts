// Trial-class booking options. The slots are the coach's usual teaching
// windows (IST) — a family picks three in order of preference and the coach
// confirms the one he can fit on WhatsApp. Edit the list here if his routine
// changes; the form renders whatever is listed.
export const enquiryTypes = [
  { value: "trial", label: "Book a trial class" },
  { value: "general", label: "General enquiry" },
  { value: "callback", label: "Request a call back" },
] as const;
export type EnquiryType = (typeof enquiryTypes)[number]["value"];

export const booking = {
  /** How many slots a family must choose, in order of preference. */
  choices: 3,
  /** How many days ahead a preferred date may be. */
  daysAhead: 14,
  slots: [
    { id: "0500", label: "5–6 am", part: "AM" },
    { id: "0600", label: "6–7 am", part: "AM" },
    { id: "0700", label: "7–8 am", part: "AM" },
    { id: "1900", label: "7–8 pm", part: "PM" },
    { id: "2000", label: "8–9 pm", part: "PM" },
    { id: "2100", label: "9–10 pm", part: "PM" },
    { id: "2200", label: "10–11 pm", part: "PM" },
  ],
  /** Shown on the chosen keys and preference tiles. */
  prefLabels: ["1st pref", "2nd pref", "3rd pref"],
  timezoneNote: "Times are IST — outside India, say so in your message.",
  disclaimer:
    "Slots depend on the coach's running batches. One of your three preferences is confirmed on WhatsApp — or he suggests the nearest alternative.",
  consent: "I understand slots depend on availability and confirmation comes via WhatsApp.",
};
