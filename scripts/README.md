# Storefront launch assets

After changing the catalog, card markup, sizes, colors or pricing in `drop-one.js`, run:

    node scripts/render-storefront.cjs

Commit the regenerated `index.html` and any pages whose asset versions changed with the JavaScript changes. Card styles live in `styles.css`. The shared renderer remains the source of truth; the generated HTML lets crawlers read the current catalog without executing JavaScript. Static purchase buttons are disabled until JavaScript initializes the bag.

`social-preview.html` is the source for the 1200 × 630 launch social card at `assets/harvie-wilder-drop-one-social.png`. Render at that viewport with a device scale of 1. It uses the existing brand logo and palette. Open Graph and Twitter metadata in `index.html` reference the PNG.

The sitemap contains the public homepage. Preorder, success and error pages intentionally use `noindex, follow`.

Run `node scripts/version-assets.cjs` after editing CSS or JavaScript directly. It changes their query-string versions to content hashes, so long-lived browser caches cannot serve an older release. Optimized image copies have content hashes in their filenames; the approved full-resolution artwork stays in `assets/drop-one/`.

To notify participating search engines after a public homepage update, run `python scripts/submit-indexnow.py` after deployment. It verifies the published key before POSTing the public homepage to IndexNow. The key is a public ownership-verification file, not a private account credential. Preorder and confirmation pages are excluded. HTTP 200 confirms receipt; HTTP 202 means receipt with key validation pending. Neither response confirms indexing.
