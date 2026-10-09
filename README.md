# WARE — Performance. Elevated.

Marketing website for WARE: premium teamwear, ceremonial caps and custom sports
apparel for clubs, schools and champions.

## Stack

Static site — no build step required.

- `index.html` — single-page site
- `css/styles.css` — styles
- `js/main.js` — nav, gallery/lightbox, and the quote-form submission
- `assets/` — images (optimized versions live in `assets/opt/`)
- `LOGO/` — source logo files

## Running locally

Because the quote form posts to a third-party endpoint (Formspree), open the
site through a local web server rather than the `file://` protocol, or form
submissions will be blocked by the browser. For example, with the VS Code
"Live Server" extension: right-click `index.html` → "Open with Live Server".

## Deployment

Deployed as a static site on Vercel. No framework preset or build command is
needed — Vercel serves the files as-is.

## Quote form

The quote form submits to Formspree. The endpoint is set in `js/main.js`
(`FORMSPREE_URL`). Where submissions are delivered is configured in the
Formspree dashboard for that form, not in this codebase.
