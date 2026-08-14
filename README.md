# SRK Fragrance

A responsive React storefront for attars, perfumes, bakhoor, incense, and gift sets.

## Development

```bash
npm install
npm run dev
```

Use `npm run build` for a production build and `npm run preview` to inspect it locally.

## Architecture

- `src/components`: reusable layout, navigation, product, feedback, and content components
- `src/pages`: route-level React components
- `src/store/StoreContext.jsx`: reactive cart, favorites, toast, and localStorage state
- `src/data/products.jsx`: centralized product and collection data
- `css`: the existing responsive design system
- `public/images`: static product and editorial imagery

Checkout and contact submission remain demonstration-only; no payment or message is sent.
