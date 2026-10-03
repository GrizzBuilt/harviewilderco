# Storefront launch assets

After changing the catalog, card markup, sizes, colors or pricing in `drop-one.js`, run:

    node scripts/render-storefront.cjs

Commit the regenerated `index.html` and `styles.css` with the JavaScript changes. The browser renderer remains the source of truth; the generated HTML lets crawlers read the current catalog without executing JavaScript. Static purchase buttons are disabled until JavaScript initializes the bag.

`social-preview.html` is the source for the 1200 × 630 launch social card at `assets/harvie-wilder-drop-one-social.png`. Render at that viewport with a device scale of 1. It uses the existing brand logo and palette. Open Graph and Twitter metadata in `index.html` reference the PNG.

The sitemap contains the public homepage. Preorder, success and error pages intentionally use `noindex, follow`.
