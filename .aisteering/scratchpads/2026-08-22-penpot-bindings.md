# Penpot binding scratchpad

Date: 2026-08-22

- Repository cloned from `https://github.com/vercel/ai-elements.git`.
- Feature branch: `codex/penpot-design-bindings`.
- Upstream source pin: `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`.
- Confirmation source SHA-256: `7cc0befed99499ed9010643e7a90ec619180a3f6e79cba5668cfc84126b96a10`.
- Bound source: `packages/elements/src/confirmation.tsx`.
- Package import inside the monorepo: `@repo/elements/confirmation`.
- Penpot file UUID: `f9c80ed1-fe5b-8098-8008-85f67c505174`.
- Penpot component UUID: `a46a744a-db75-80c4-8008-85fc2b7972aa`.
- Shared metadata: namespace `ai-elements`, key `code-binding`.
- Exact Git commit is authoritative; semantic release labels may be added later without weakening the pin.
- Penpot library file was renamed `AI Elements` and published.
- Penpot file version label: `ai.confirmation @ 6a9d5b1`.
- Consumer file: `AI Elements Component Lab` (`f9c80ed1-fe5b-8098-8008-8618092b66d2`), page `f9c80ed1-fe5b-8098-8008-8618092b66d3`.
- Component-lab gallery: `15a57ee0-be05-809c-8008-8618768ee905`.
- Instantiate concrete `LibraryVariantComponent` objects in consumer files. `switchVariant()` silently left new copies on `Request/Light` during this pilot.
- Binding validation: 9 focused tooling tests pass; Confirmation behavior: 17 tests pass.
- Full Elements baseline currently has eight unrelated React Flow zero-size failures in `controls.test.tsx` and `panel.test.tsx`.
