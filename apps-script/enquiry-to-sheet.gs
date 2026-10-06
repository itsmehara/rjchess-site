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

function doPost(e) {
  var lock = LockService.getScriptLock();
  var d, values;
  try {
    d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!d.name || !d.phone) return reply({ ok: false, error: "missing name or phone" });
    var spam = spamReason(d);
    if (spam) { console.warn("dropped enquiry: " + spam); return reply({ ok: true }); } // look normal to a bot
    values = COLUMNS.map(function (c) { return text(c[1](d)); });
    lock.waitLock(10000); // two enquiries at once must not land on the same row
    var sh = tab(ENQUIRIES, COLUMNS.map(function (c) { return c[0]; }));
    sh.getRange(sh.getLastRow() + 1, 1, 1, COLUMNS.length).setValues([values.map(cell)]);
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
  notify(d, values); // after the row is saved — a mail hiccup never loses an enquiry
  return reply({ ok: true });
}

function notify(d, values) {
  try {
    var lines = COLUMNS.map(function (c, i) { return values[i] && c[0] !== "Status" ? c[0] + ": " + values[i] : ""; }).filter(String);
    var digits = String(d.phone || "").replace(/\D/g, "");
    if (digits.length === 10) digits = "91" + digits; // Indian number typed without the country code
    var body = lines.join("\n") +
      (digits ? "\n\nReply on WhatsApp: https://wa.me/" + digits : "") +
      "\nAll enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    var mail = { to: NOTIFY_TO, subject: "New enquiry: " + (TYPES[d.type] || "Website") + " — " + text(d.name).slice(0, 80), body: body, name: "RJChess website" };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(d.email))) mail.replyTo = text(d.email); // Reply goes to the enquirer
    MailApp.sendEmail(mail);
  } catch (err) {
    console.error("notify failed: " + err);
  }
}

// ---------- spam guard ----------
// The /exec URL is public (it's in the site's code), so anyone could post to it. Real
// enquiries pass all of these; a dropped one is logged under Executions, not saved or mailed.
var MAX_PER_10_MIN = 20;

function spamReason(d) {
  if (text(d.company)) return "honeypot filled";                       // hidden field people never see
  var bad = checkFields(d);
  if (bad) return bad;
  if (!humanOk(d.turnstile)) return "failed the Cloudflare human check";
  var digits = String(d.phone).replace(/\D/g, "");
  var cache = CacheService.getScriptCache();
  var same = "dup:" + digits + ":" + text(d.type) + ":" + text(d.message).length;
  if (cache.get(same)) return "duplicate within 2 min";                 // double-click / resubmit
  var win = "burst:" + Math.floor(Date.now() / 600000);                // fixed 10-minute windows
  var n = Number(cache.get(win) || 0) + 1;
  if (n > MAX_PER_10_MIN) return "more than " + MAX_PER_10_MIN + " in 10 min";
  cache.put(win, String(n), 660);
  cache.put(same, "1", 120);
  return "";
}

// Same rules as the website's src/content/validate.ts — change both together. Real visitors are
// stopped in the browser with a message; anything reaching here that fails is a bot or a hand-made post.
function checkFields(d) {
  var name = text(d.name).trim(), city = text(d.city).trim(), pin = text(d.pincode).trim();
  var letters = function (v) { return (v.match(/\p{L}/gu) || []).length; };
  var word = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,59}$/u;
  if (!word.test(name) || letters(name) < 2) return "name not letters";
  if (!word.test(city) || letters(city) < 2) return "city not letters";
  if (!phoneOk(text(d.phone))) return "phone not valid";
  var indian = !/^\s*(\+|00)(?!91)/.test(text(d.phone));
  if (pin && !(/^\d+$/.test(pin) ? /^[1-9]\d{5}$/.test(pin) || (!indian && /^\d{4,5}$/.test(pin)) : /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(pin) && /\d/.test(pin))) return "pincode not valid";
  return "";
}

function phoneOk(raw) {
  var v = raw.trim(), same = function (s) { return /^(\d)\1+$/.test(s); };
  if (/[^\d+\s().-]/.test(v)) return false;
  var d = v.replace(/[\s().-]/g, "");
  if (d.indexOf("00") === 0) d = "+" + d.slice(2);
  if (d.charAt(0) === "+") {
    var n = d.slice(1);
    if (!/^\d+$/.test(n) || n.charAt(0) === "0" || n.length < 8 || n.length > 15 || same(n)) return false;
    return n.indexOf("91") !== 0 || /^91[6-9]\d{9}$/.test(n);
  }
  var local = d.replace(/^(0|91)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(local) && !same(local.slice(1));
}

// Cloudflare Turnstile. Off until the secret key is saved in Project Settings → Script properties
// as TURNSTILE_SECRET (add the site key to the website first, or real enquiries would be dropped).
function humanOk(token) {
  var secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  if (!secret) return true;
  if (!token) return false;
  try {
    var r = JSON.parse(UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post", payload: { secret: secret, response: String(token).slice(0, 2048) }, muteHttpExceptions: true
    }).getContentText());
    return r.success === true;
  } catch (err) {
    console.error("turnstile verify failed: " + err);
    return true; // Cloudflare unreachable: don't lose a real enquiry; the other checks still apply
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
    var total = Number(props.getProperty("visits") || 0) + 1;
    props.setProperty("visits", String(total));
    var sh = tab(VISITS, ["Date (IST)", "Visits"]);
    var today = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd"), last = sh.getLastRow();
    if (last > 1 && sh.getRange(last, 1).getDisplayValue() === today) sh.getRange(last, 2).setValue(Number(sh.getRange(last, 2).getValue()) + 1);
    else sh.appendRow(["'" + today, 1]);
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
  doPost({ postData: { contents: JSON.stringify({
    type: "trial", name: "Test Parent", phone: "+91 90000 00000", email: "", city: "Vijayawada", pincode: "520001",
    level: "Beginner", date: "2026-10-12", slots: ["1. 5–6 am", "2. 6–7 am", "3. 7–8 am"], consent: true,
    message: "Test row from the script editor — delete me.", source: "script-test", submittedAt: new Date().toISOString()
  }) } });
}

// Optional: run to reset the footer total (e.g. after testing). Change "0" to start from another number.
// The Visits tab rows are separate — clear them by hand if wanted.
function resetVisitTotal() {
  PropertiesService.getScriptProperties().setProperty("visits", "0");
}
