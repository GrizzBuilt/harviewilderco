# Harvie Wilder Co.

Static HTML/CSS/JavaScript site deployed from `main` to Netlify (publish directory `.`; no build command). The existing Lulu book purchase and preview remain independent of apparel.

## Born Wilder: Drop One

Four active designs use existing artwork in `assets/drop-one/`. Baby Bodysuit $22, Toddler Tee $24, Youth Tee $26. Born Wilder and Little Varmit are upcoming, not orderable.

`drop-one.js` maintains a variant-aware preorder bag in localStorage. No customer contact details are persisted. Prices are displayed estimates; submitted totals must be reviewed against the catalog before invoicing. Requested sizes and colors require blank availability confirmation.

The static `drop-one-preorder` form is detected by Netlify Forms on deployment. Requests POST URL-encoded form data to `/`, then redirect to `preorder-thanks.html` only after a successful response. Failures retain the bag and allow retry. First Dibs uses the separate existing `first-dibs` form.

## Operations

Check Netlify Forms → `drop-one-preorder` for incoming requests and enable email notifications in Netlify. Review the requested garments, sizes, colors, quantities and delivery preference. Confirm actual blank measurements, availability, tax, shipping, production/ship estimate, and cancellation/return terms with the customer before sending an invoice through the existing business payment provider. Production starts after approval and payment.

There is no configured apparel payment gateway, inventory service, guaranteed ship date, or automatic customer email in this repository. This release accepts preorder requests; it does not collect payments or promise a reservation. Do not change the CTA to paid checkout without connecting a real payment backend and verifying it.

## Verification

Serve with `python -m http.server 8000`. Check desktop and mobile, garment-dependent sizes/prices, bag totals/removal/reload, required customer fields, and failed/successful form response behavior. Avoid sending synthetic customer requests to production. Netlify Forms capture can be verified with a genuine request and its entry in the Netlify dashboard.
