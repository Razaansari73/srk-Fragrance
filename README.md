# SRK Fragrance

A framework-free, responsive fragrance storefront built with semantic HTML, modular CSS, and ES modules.

## Run locally

ES modules require a local web server. From this directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Architecture

- `js/products.js`: centralized product and category data
- `js/components.js`: common header/footer and global navigation
- `js/store.js`: defensive localStorage cart/favorites state
- `js/app.js`: reusable product cards and shared interactions
- page controllers: carousel, catalog, product gallery, cart, favorites, contact
- `css/variables.css`: design tokens
- `css/global.css`, `components.css`, `pages.css`, `responsive.css`: layered presentation

Checkout and contact submission are intentionally demonstration-only; no payment or message is sent.
