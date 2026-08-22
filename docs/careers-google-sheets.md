# Careers Google Sheet

The careers page reads published roles and writes applications through a Google Apps Script web app. The spreadsheet stays private and this setup does not require a Google Cloud billing project.

## Tabs and headers

Create a `Positions` tab with this exact first row:

```text
Status | Slug | Title | Department | Location | Type | Summary | Responsibilities | Requirements | Nice to have
```

- Set `Status` to `published` to show a role. Any other value keeps it private.
- Use a unique kebab-case `Slug`, for example `senior-gameplay-programmer`.
- Put each responsibility, requirement, and nice-to-have item on a new line within its cell.
- Row order controls the order on the website.

Create an `Applications` tab with this exact first row:

```text
Submitted at | Position ID | Position | Name | Email | Location / Time Zone | Portfolio URL | LinkedIn URL | Resume URL | Message | Consent | Status
```

## Apps Script setup

1. Open [script.google.com](https://script.google.com) and choose **New project**.
2. Replace the default script with `integrations/google-apps-script/Code.gs` from this repository.
3. In Apps Script, open **Project Settings → Script Properties** and add:
   - `RENHET_SPREADSHEET_ID`: the ID from the Google Sheets URL
   - `RENHET_CAREERS_SECRET`: the same long random value used in `GOOGLE_APPS_SCRIPT_SECRET`
4. Click **Save** and run `doGet` once from the editor. Approve the Google authorization prompt.
5. Deploy through **Deploy → New deployment → Web app**.
6. Set **Execute as** to yourself and **Who has access** to anyone.
7. Copy the deployment URL into `GOOGLE_APPS_SCRIPT_URL`.
8. Add both environment variables to local `.env.local` and production hosting.

The GET endpoint only returns published roles and only needs `GOOGLE_APPS_SCRIPT_URL`. The POST endpoint requires `GOOGLE_APPS_SCRIPT_SECRET` and appends applications to the private sheet. Never prefix either environment variable with `NEXT_PUBLIC_`.
