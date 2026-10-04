# Watford Velmurugan Hindu Temple Website

Website for the Watford Velmurugan Hindu Temple, built with Vue 3 and Vite.

## Quick start

```bash
npm install
cp .env.example .env.local   # then add your Web3Forms key
npm run dev                  # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Project layout

- `src/views/` — pages (Home, About Us, Committee, Register, Contact Us, Donate)
- `src/components/` — shared parts such as the header and page banner
- `src/data/temple.js` — temple details (address, phone, email, opening hours, bank details, social links)
- `public/` — static files, including `_redirects` so refreshing a page doesn't 404 on Netlify

## Carousel photos

The home page carousel uses small web-sized copies of the photos so the page loads quickly.

1. Put the original photos in `photos/carousel/`, named by number (`1.jpg`, `2.jpg`, ...). Any size or extension is fine.
2. Run `npm run images`. Web-sized copies are written to `src/assets/carousel/`, replacing the old ones.
3. The carousel shows every photo there, in number order.

Don't put full-size camera photos straight into `src/assets/carousel/` — they make the home page slow.

## Contact form

The Contact Us form emails enquiries through [Web3Forms](https://web3forms.com) (free). Set `VITE_WEB3FORMS_KEY` in `.env.local` for local use and in the hosting environment variables for the live site. Emails go to the address the key was created with.

## Devotee registration

The `/register` page sends registrations to the same-site `/api/register` server function, which appends them to the existing Google Sheet. Visitors stay on the temple website and Google credentials are never exposed to the browser.

The response sheet must have these columns in `A:I`:

`Timestamp | Full Name | Email | Address | Phone number | Comments | PostCode | UK GDPR Consent | Communication preferences`

To configure it:

1. In Google Cloud, create a service account and enable the Google Sheets API for its project.
2. Create a JSON key for that service account.
3. Share the existing response spreadsheet with the service account's email as an Editor.
4. Add `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`, and `GOOGLE_SHEET_NAME` to the Vercel project's environment variables. The spreadsheet ID is the value between `/d/` and `/edit` in its URL. Keep the private key server-only and preserve its `\n` line breaks.
5. Redeploy the site so the new environment variables are available to the server function.

For local end-to-end testing, put the same variables in `.env.local` and restart `npm run dev`. A development-only Vite middleware runs the same registration handler used by Vercel.

## Land appeal progress

The land appeal fetches its live amount raised and fundraising goal from Zeffy through the same-site `/api/land-appeal-progress` server function. The progress bar stays hidden if Zeffy is not configured or temporarily unavailable, while the rest of the appeal remains visible.

1. A Zeffy organization admin generates an API key under **Settings → Organization → Integrations**.
2. Add `ZEFFY_API_KEY` to the Vercel project's environment variables. Keep it server-only; never use a `VITE_` prefix.
3. Optionally add `ZEFFY_CAMPAIGN_ID` to select the campaign directly. Without it, the server matches the campaign against the public Zeffy URL in `src/data/temple.js`.
4. Redeploy the site. Successful responses are cached for five minutes, so the total updates without making a Zeffy request for every visitor.

For local testing, add the same variables to `.env.local` and restart `npm run dev`.
