# Waymate — Neighborhood Carpool Matching

A responsive, frontend-only carpool dashboard built with plain HTML, CSS and vanilla JavaScript.

## Run locally
1. Extract the ZIP (if you downloaded it).
2. Open `index.html` in a browser, or run a local static server from this folder:
   - `python3 -m http.server 8000`
   - Visit `http://localhost:8000`

## Included interactions
- Ride feed with destination search and time-of-day filters.
- Request-to-join workflow with confirmation modal.
- My Requests list and request count.
- Route details form with client-side validation.
- Verified member labels, ratings and member report/block menu.
- Privacy toggles saved in `localStorage`.
- Responsive sidebar and mobile layout.

## Important: demo vs production
This is a frontend prototype. Ride listings are sample data in `app.js`; requests, blocks and privacy preferences are stored in the current browser using `localStorage`. The report action is a UI demonstration only. There is no authentication, real identity verification, live matching, messaging, payment processing, moderation service, or backend persistence.

Before deployment, connect a secure backend and database. Enforce authorization and validation server-side; never trust client-side verification badges or privacy settings. For a real carpool platform, add verified identity/contact flows, consent-based location sharing, moderation/audit logs, abuse reporting, rate limits, and clear emergency/safety guidance. Avoid exposing exact home addresses publicly.
