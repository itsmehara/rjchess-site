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
    { id: "0500", label: "5:00 – 6:00 am", part: "Early morning" },
    { id: "0600", label: "6:00 – 7:00 am", part: "Early morning" },
    { id: "0700", label: "7:00 – 8:00 am", part: "Early morning" },
    { id: "1900", label: "7:00 – 8:00 pm", part: "Evening" },
    { id: "2000", label: "8:00 – 9:00 pm", part: "Evening" },
    { id: "2100", label: "9:00 – 10:00 pm", part: "Evening" },
    { id: "2200", label: "10:00 – 11:00 pm", part: "Evening" },
  ],
  timezoneNote: "All times are India Standard Time (IST). Outside India? Mention your time zone below.",
  disclaimer:
    "Trial slots depend on the coach's availability around his running batches. If one of your three choices is free, the class is confirmed back to you on WhatsApp; if none is, he will suggest the nearest alternative.",
  consent: "I understand slots are subject to availability and that confirmation comes via WhatsApp.",
};
