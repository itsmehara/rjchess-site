/**
 * RJChess website → Google Sheet: enquiries, email alerts and the visit counter.
 *
 * Paste this into the Sheet's Apps Script editor (Extensions → Apps Script), then
 * Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone.
 * The /exec URL it gives you goes in NEXT_PUBLIC_ENQUIRY_ENDPOINT (see README.md here).
 *
 * - POST (the enquiry form, src/components/EnquiryForm.tsx): one row on the "Enquiries" tab
 *   per enquiry, then an email to NOTIFY_TO. Keep COLUMNS in step with the form's fields.
 * - GET ?action=visit (the footer counter, src/components/VisitCounter.tsx): adds one visit
 *   to today's row on the "Visits" tab and returns the all-time total. ?action=count only reads.
 *   No cookies, IPs or visitor details are stored — just a number per day.
 */

var NOTIFY_TO = "rjchesslearnings@gmail.com"; // comma-separate to add more addresses
var ENQUIRIES = "Enquiries";
var VISITS = "Visits";
var TZ = "Asia/Kolkata";
var MAX_LEN = 2000; // per field — a pasted essay or junk payload can't flood the sheet

var TYPES = { trial: "Book a trial class", general: "General enquiry", callback: "Request a call back" };

// [header, how to read it from the posted JSON]
var COLUMNS = [
  ["Received (IST)", function (d) { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm"); }],
  ["Type",           function (d) { return TYPES[d.type] || d.type; }],
  ["Name",           function (d) { return d.name; }],
  ["Phone",          function (d) { return d.phone; }],
  ["Email",          function (d) { return d.email; }],
  ["City",           function (d) { return d.city; }],
  ["Pincode",        function (d) { return d.pincode; }],
  ["Level",          function (d) { return d.level; }],
  ["Preferred date", function (d) { return d.date; }],
  ["1st pref",       function (d) { return slot(d, 0); }],
  ["2nd pref",       function (d) { return slot(d, 1); }],
  ["3rd pref",       function (d) { return slot(d, 2); }],
  ["Consent",        function (d) { return d.consent === true ? "Yes" : ""; }],
  ["Message",        function (d) { return d.message; }],
  ["Source",         function (d) { return d.source; }],
  ["Sent at (browser, UTC)", function (d) { return d.submittedAt; }],
  ["Status",         function (d) { return "New"; }] // for the coach to update: Contacted, Booked…
];

// "2. 6–7 am" → "6–7 am"
function slot(d, i) {
  var s = (d.slots || [])[i];
  return s ? String(s).replace(/^\d+\.\s*/, "") : "";
}

function text(v) { return v === undefined || v === null ? "" : String(v).slice(0, MAX_LEN); }

// A leading apostrophe stores the value as plain text (Sheets hides the apostrophe): keeps
// "+91…" and leading-zero pincodes intact, and a value starting with = + - @ never runs as a formula.
function cell(v) { var s = text(v); return s ? "'" + s : ""; }

function tab(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

// ---------- enquiries ----------
// Replies are readable by the website (Apps Script answers with CORS), so the form shows
// "saved" only on { ok: true }. Error codes the form understands:
//   invalid:<field>  a field fails the rules        human-check  Cloudflare check failed
//   busy             flood limit reached             server       anything unexpected
// A filled honeypot or a repeat of an already-saved enquiry also gets { ok: true } but
// nothing is saved twice and bots learn nothing.

var MAX_PER_10_MIN = 20;
var SLOTS = ["5–6 am", "6–7 am", "7–8 am", "7–8 pm", "8–9 pm", "9–10 pm", "10–11 pm"]; // site/src/content/booking.ts
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  var d, values, lock = LockService.getScriptLock(), locked = false;
  try {
    d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (text(d.company)) { console.warn("dropped: honeypot"); return reply({ ok: true }); } // hidden field people never see
    var bad = checkFields(d);
    if (bad) { console.warn("rejected: " + bad); return reply({ ok: false, error: "invalid:" + bad }); }
    if (!humanOk(d.turnstile)) { console.warn("rejected: human check"); return reply({ ok: false, error: "human-check" }); }

    lock.waitLock(10000); locked = true; // counters, duplicate checks and the write happen as one step
    var cache = CacheService.getScriptCache();
    var req = text(d.requestId).slice(0, 64), reqKey = req && "req:" + req;
    var dupKey = "dup:" + fingerprint(d);
    if ((reqKey && cache.get(reqKey)) || cache.get(dupKey)) { console.warn("duplicate, already saved"); return reply({ ok: true }); }
    var win = "burst:" + Math.floor(Date.now() / 600000); // fixed 10-minute windows
    var n = Number(cache.get(win) || 0) + 1;
    if (n > MAX_PER_10_MIN) { console.warn("rejected: flood"); return reply({ ok: false, error: "busy" }); }

    values = COLUMNS.map(function (c) { return text(c[1](d)); });
    var sh = tab(ENQUIRIES, COLUMNS.map(function (c) { return c[0]; }));
    sh.getRange(sh.getLastRow() + 1, 1, 1, COLUMNS.length).setValues([values.map(cell)]);
    SpreadsheetApp.flush();
    cache.put(win, String(n), 660);
    cache.put(dupKey, "1", 120);
    if (reqKey) cache.put(reqKey, "1", 600);
  } catch (err) {
    console.error("enquiry failed: " + err);
    return reply({ ok: false, error: "server" });
  } finally {
    if (locked) try { lock.releaseLock(); } catch (ignore) {}
  }
  notify(d, values); // after the row is saved — a mail hiccup never loses an enquiry
  return reply({ ok: true });
}

// Same person + type + message within 2 minutes = one enquiry (double-click, resend).
function fingerprint(d) {
  var raw = [phoneE164(text(d.phone)), text(d.type), text(d.message).trim().toLowerCase(), text(d.date)].join("|");
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8));
}

function notify(d, values) {
  try {
    var lines = COLUMNS.map(function (c, i) { return values[i] && c[0] !== "Status" ? c[0] + ": " + values[i] : ""; }).filter(String);
    var wa = phoneE164(text(d.phone)).replace("+", "");
    var body = lines.join("\n") +
      (wa ? "\n\nReply on WhatsApp: https://wa.me/" + wa : "") +
      "\nAll enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    var mail = { to: NOTIFY_TO, subject: "New enquiry: " + (TYPES[d.type] || "Website") + " — " + text(d.name).slice(0, 80), body: body, name: "RJChess website" };
    if (EMAIL.test(text(d.email))) mail.replyTo = text(d.email); // Reply goes to the enquirer
    MailApp.sendEmail(mail);
  } catch (err) {
    console.error("notify failed: " + err);
  }
}

// ---------- field rules ----------
// Same rules as the website's src/content/validate.ts (+ the form's own required fields) —
// change both together. Returns the failing field's name, or "".
function checkFields(d) {
  var name = text(d.name).trim(), city = text(d.city).trim(), pin = text(d.pincode).trim(), phone = text(d.phone);
  var letters = function (v) { return (v.match(/\p{L}/gu) || []).length; };
  var word = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,59}$/u;
  if (!TYPES[d.type]) return "type";
  if (!word.test(name) || letters(name) < 2) return "name";
  if (!phoneE164(phone)) return "phone";
  if (!word.test(city) || letters(city) < 2) return "city";
  var indian = !/^\s*(\+|00)(?!91)/.test(phone);
  if (pin && !(/^\d+$/.test(pin) ? /^[1-9]\d{5}$/.test(pin) || (!indian && /^\d{4,5}$/.test(pin)) : /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(pin) && /\d/.test(pin))) return "pincode";
  var email = text(d.email).trim();
  if (email ? !EMAIL.test(email) : d.type === "general") return "email";
  if (d.type === "trial") {
    var today = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
    var last = Utilities.formatDate(new Date(Date.now() + 15 * 864e5), TZ, "yyyy-MM-dd");
    var yest = Utilities.formatDate(new Date(Date.now() - 864e5), TZ, "yyyy-MM-dd"); // a visitor west of India may still be on "yesterday"
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text(d.date)) || d.date < yest || d.date > last) return "date";
    var picked = (Array.isArray(d.slots) ? d.slots : []).map(function (s) { return String(s).replace(/^\d+\.\s*/, ""); });
    var distinct = picked.filter(function (s, i) { return picked.indexOf(s) === i && SLOTS.indexOf(s) >= 0; });
    if (picked.length !== 3 || distinct.length !== 3) return "slots";
    if (d.consent !== true) return "consent";
  }
  return "";
}

// "+<country><number>" for a valid phone, else "". Indian 10-digit numbers (optionally with
// 0 / 91 / +91 / 0091 in front) become +91…; others must carry their country code.
function phoneE164(raw) {
  var v = String(raw).trim(), same = function (s) { return /^(\d)\1+$/.test(s); };
  if (/[^\d+\s().-]/.test(v)) return "";
  var d = v.replace(/[\s().-]/g, "");
  if (d.indexOf("00") === 0) d = "+" + d.slice(2);
  if (d.charAt(0) === "+") {
    var n = d.slice(1);
    if (!/^\d+$/.test(n) || n.charAt(0) === "0" || n.length < 8 || n.length > 15 || same(n)) return "";
    if (n.indexOf("91") === 0 && !/^91[6-9]\d{9}$/.test(n)) return "";
    return "+" + n;
  }
  var local = d.replace(/^(0|91)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(local) && !same(local.slice(1)) ? "+91" + local : "";
}

// Cloudflare Turnstile. Off until the secret key is saved in Project Settings → Script properties
// as TURNSTILE_SECRET (add the site key to the website first, or real enquiries would be refused).
// Fails closed: if Cloudflare can't confirm, the visitor is asked to retry or use WhatsApp.
var TURNSTILE_HOSTS = ["rjchess.com", "www.rjchess.com"];
function humanOk(token) {
  var secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  if (!secret) return true;
  if (!token) return false;
  try {
    var r = JSON.parse(UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post", payload: { secret: secret, response: String(token).slice(0, 2048) }, muteHttpExceptions: true
    }).getContentText());
    return r.success === true && TURNSTILE_HOSTS.indexOf(r.hostname) >= 0 && r.action === "enquiry";
  } catch (err) {
    console.error("turnstile verify failed: " + err);
    return false;
  }
}

// ---------- visit counter ----------

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === "visit" || action === "count") return reply({ ok: true, visits: visits(action === "visit") });
  return reply({ ok: true, service: "RJChess enquiries" }); // opening /exec in a browser: "is it deployed?"
}

// Total lives in Script Properties (fast); the Visits tab keeps one row per day for the owner.
function visits(add) {
  var props = PropertiesService.getScriptProperties();
  if (!add) return Number(props.getProperty("visits") || 0);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // Daily row first, then the total — if the Sheet write fails, the two never drift apart.
    var sh = tab(VISITS, ["Date (IST)", "Visits"]);
    var today = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd"), last = sh.getLastRow();
    if (last > 1 && sh.getRange(last, 1).getDisplayValue() === today) sh.getRange(last, 2).setValue(Number(sh.getRange(last, 2).getValue()) + 1);
    else sh.appendRow(["'" + today, 1]);
    var total = Number(props.getProperty("visits") || 0) + 1;
    props.setProperty("visits", String(total));
    return total;
  } finally {
    lock.releaseLock();
  }
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select testRow → Run): grants permissions, adds a sample row and
// sends a sample email to NOTIFY_TO. Delete the row afterwards.
function testRow() {
  var out = doPost({ postData: { contents: JSON.stringify({
    type: "trial", name: "Test Parent", phone: "+91 98765 43210", email: "", city: "Vijayawada", pincode: "520001",
    level: "Beginner", slots: ["1. 5–6 am", "2. 6–7 am", "3. 7–8 am"], consent: true,
    message: "Test row from the script editor — delete me.", source: "script-test", submittedAt: new Date().toISOString(),
    requestId: "test-" + Date.now(), date: Utilities.formatDate(new Date(Date.now() + 864e5), TZ, "yyyy-MM-dd")
  }) } });
  console.log(out.getContent()); // {"ok":true} = row saved and email sent
}

// Optional: run to reset the footer total (e.g. after testing). Change "0" to start from another number.
// The Visits tab rows are separate — clear them by hand if wanted.
function resetVisitTotal() {
  PropertiesService.getScriptProperties().setProperty("visits", "0");
}
