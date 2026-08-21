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

## Authentication integration

The `/login`, `/register`, `/verify`, and `/auth/callback` routes use the API base URL in `VITE_AUTH_API_BASE_URL` (see `.env.example`). OAuth client secrets and OTP delivery credentials must remain on that server, never in Vite variables.

The frontend expects these secure, cookie-based endpoints:

- `GET /auth/session`
- `GET /auth/oauth/google` and `GET /auth/oauth/apple`
- `POST /auth/otp/request` → `{ challengeId, maskedDestination }`
- `POST /auth/otp/verify` → an authenticated session, or `{ requiresProfile, verificationToken, requiredFields }`
- `POST /auth/register`

Error responses may include a stable `code` and user-safe `message`. Supported codes include `INVALID_OTP`, `OTP_EXPIRED`, `ACCOUNT_EXISTS`, `ACCOUNT_NOT_FOUND`, and `SESSION_EXPIRED`.
