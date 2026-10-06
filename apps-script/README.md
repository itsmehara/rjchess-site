# Enquiries, email alerts and visit counter → Google Sheet

`enquiry-to-sheet.gs` receives each enquiry from the website form and adds it as one row on
an **Enquiries** tab (created with headers on first use):

Received (IST) · Type · Name · Phone · Email · City · Pincode · Level · Preferred date ·
1st/2nd/3rd pref · Consent · Message · Source · Sent at · Status

It also:

- **Emails each enquiry** to `NOTIFY_TO` (top of the script — rjchesslearnings@gmail.com).
  Reply goes straight to the enquirer when they gave an email; the mail also has a
  WhatsApp link to their number and a link to the Sheet.
- **Counts site visits** for the footer counter: one per browser session, a running total
  plus one row per day on a **Visits** tab. No cookies, IPs or visitor details are stored.

Without it the form still works and just opens WhatsApp, and the counter stays hidden. With it, the form saves the row
first, then offers WhatsApp to continue the conversation.

## Setup (once, by the Sheet owner)

1. Open the Google Sheet → **Extensions → Apps Script**.
2. Delete the sample code, paste all of `enquiry-to-sheet.gs`, and **Save**.
3. In the function list pick **testRow** → **Run**. Approve the permission prompt (it asks to
   edit this spreadsheet and send email as you). A test row appears on the Enquiries tab and a
   test email arrives; delete the row.
4. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** (the website's visitors aren't signed in to Google)
5. **Deploy** and copy the **Web app URL** (ends in `/exec`). Opening it in a browser should
   show `{"ok":true,"service":"RJChess enquiries"}`.

## Connect the website

- **Live site (GitHub Pages):** repo **Settings → Secrets and variables → Actions →
  Variables → New repository variable**: name `NEXT_PUBLIC_ENQUIRY_ENDPOINT`, value = the
  `/exec` URL. Then re-run the deploy workflow (or push any commit).
- **Local dev:** put the same line in `.env.local` (not committed) and restart `npm run dev`.

## Changing it later

Edit the script, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
That keeps the same `/exec` URL. If an update needs a new permission (e.g. sending email),
run **testRow** once more and approve it. A brand-new deployment gives a new URL, which would then need
updating in the variable above.

## Spam protection

The script drops (silently, logged under **Executions**) any enquiry that: fills the hidden
trap field, has a name/city that isn't letters, a phone that isn't a real number, a bad
pincode, repeats within 2 minutes, or arrives after 20 in 10 minutes. The website shows real
visitors a message for the same field rules, so they never hit these.

### Cloudflare Turnstile (human check) — in this order

1. Cloudflare dashboard → **Turnstile → Add widget**: hostname `rjchess.com`, mode **Managed**.
   Copy the **Site key** and **Secret key**.
2. GitHub repo variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = site key → run the Deploy workflow.
3. In the script: paste the latest `enquiry-to-sheet.gs`, **Deploy → Manage deployments → ✏️ →
   New version**, then run **testRow** once and approve the new permission (it now contacts
   Cloudflare). Delete the test row.
4. Only then: **Project Settings → Script properties → Add**: `TURNSTILE_SECRET` = secret key.
   (Adding it before step 2 is live would drop real enquiries — they'd have no token.)
