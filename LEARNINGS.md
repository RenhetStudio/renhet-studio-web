# Reusable Engineering Knowledge

## Web Development

### Server-side proxy to a private spreadsheet

**Simple explanation**

A public website can use a private spreadsheet safely when the browser never receives spreadsheet credentials. The server validates the form, then calls a controlled backend endpoint.

**How it works**

The careers page reads published positions on the server. Applications go through a server action, which validates the form and confirms the selected role before forwarding the application to a Google Apps Script web app. Apps Script runs as the spreadsheet owner and appends the row.

**Why it matters**

This avoids exposing service-account keys or making the sheet public. It is useful for low-volume integrations when a full database is unnecessary.

**In this project**

The website bridge is in `src/lib/careers/google-sheets.ts`; the spreadsheet-side endpoint is `integrations/google-apps-script/Code.gs`.

**Tradeoffs / pitfalls**

Apps Script has quotas and is less observable than a dedicated API. Keep the POST secret in Script Properties and server environment variables only. The GET endpoint intentionally exposes published roles but no private sheet data.
