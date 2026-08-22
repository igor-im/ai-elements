# Local AI Elements component lab

Date: 2026-08-22

## What changed

- Made the docs application use explicit locale routes instead of hiding its only locale.
- Documented the local launch command and canonical Confirmation URL.
- Launched and visually verified the real Confirmation documentation preview.

## Why

With the pinned Next.js and Fumadocs versions, hiding the default locale caused `/components/confirmation` and its internal `[lang]` rewrite to redirect to one another indefinitely.

## Validate

```bash
NODE_ENV=production pnpm --filter docs build
NODE_ENV=production pnpm --filter docs start --hostname 127.0.0.1 --port 3000
curl -I http://localhost:3000/en/components/confirmation
```

The localized page must return `200`; the unprefixed route must redirect once to `/en/components/confirmation`.

## Notes

- The local lab URL is `http://localhost:3000/en/components/confirmation`.
- This changes documentation routing only; the Confirmation component and its immutable source pin are unchanged.
