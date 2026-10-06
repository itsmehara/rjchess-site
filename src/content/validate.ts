// Enquiry-form field checks. Kept identical to checkFields() in
// apps-script/enquiry-to-sheet.gs — change both together.
//
// Each check returns "" when the value is fine, otherwise the message shown to the visitor.
// Built for India first but open to everyone: international phones need their country code,
// and city/postcode accept any language and format.

const same = (s: string) => /^(\d)\1+$/.test(s);

/** 10-digit Indian mobile (optionally 0 / 91 / +91 in front), or +country code and up to 15 digits. */
export function checkPhone(raw: string): string {
  const v = raw.trim();
  if (/[^\d+\s().-]/.test(v)) return "Use digits only — e.g. 98765 43210, or +44 7700 900123 outside India.";
  let d = v.replace(/[\s().-]/g, "");
  if (d.startsWith("00")) d = "+" + d.slice(2);
  if (d.startsWith("+")) {
    const n = d.slice(1);
    if (!/^\d+$/.test(n) || n.startsWith("0") || n.length < 8 || n.length > 15 || same(n)) return "Check the number — include the country code, e.g. +1 214 555 0142.";
    if (n.startsWith("91") && !/^91[6-9]\d{9}$/.test(n)) return "An Indian mobile number has 10 digits starting with 6, 7, 8 or 9.";
    return "";
  }
  const local = d.replace(/^(0|91)(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(local) || same(local.slice(1))) return "Enter a 10-digit mobile number, or add the country code (+…) if you're outside India.";
  return "";
}

/** Letters in any language, with spaces . ' - — e.g. Vijayawada, São Paulo, St. Louis. */
export function checkCity(raw: string): string {
  const v = raw.trim();
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,59}$/u.test(v) || (v.match(/\p{L}/gu) || []).length < 2) return "Enter your city name in letters (e.g. Vijayawada, Dallas).";
  return "";
}

/** An Indian number: no country code, or +91 / 0091 / 91 in front. */
export const indianPhone = (phone: string) => !/^\s*(\+|00)(?!91)/.test(phone);

/** Optional. India (Indian phone): 6 digits not starting with 0. Elsewhere: 3–10 letters/digits with at least one digit. */
export function checkPincode(raw: string, phone = ""): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^\d+$/.test(v)) return /^[1-9]\d{5}$/.test(v) || (!indianPhone(phone) && /^\d{4,5}$/.test(v)) ? "" : "An Indian pincode has 6 digits (e.g. 520001).";
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v) || !/\d/.test(v)) return "Check the postcode (e.g. 520001, or SW1A 1AA outside India).";
  return "";
}

/** Letters in any language, with spaces . ' - (no digits or links). */
export function checkName(raw: string): string {
  const v = raw.trim();
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,59}$/u.test(v) || (v.match(/\p{L}/gu) || []).length < 2) return "Enter your name in letters.";
  return "";
}

/** Field name → check; each gets the whole form so pincode can depend on the phone. */
export const fieldChecks: Record<string, (v: string, all: Record<string, string>) => string> = {
  name: checkName,
  phone: checkPhone,
  city: checkCity,
  pincode: (v, all) => checkPincode(v, all.phone ?? ""),
};
