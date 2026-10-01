# Penpot binding tooling summary

Date: 2026-08-22

## What changed

- Added a checked-in `ai.confirmation` binding manifest with exact Penpot identities, exhaustive variant mappings, upstream commit pin, and source checksum.
- Added validation and resolution tools plus nine focused tests.
- Added a live component-lab snapshot fixture covering all six linked variants.
- Preserved the existing Confirmation React implementation and API.

## Why

The design-to-code bridge must resolve to an immutable implementation revision and reject unknown components, variants, exports, or source drift rather than guessing.

## Validate

```bash
pnpm penpot:bindings:test
pnpm penpot:bindings:validate
pnpm penpot:bindings:resolve penpot/fixtures/confirmation-component-lab.json
pnpm --filter @repo/elements exec vitest run __tests__/confirmation.test.tsx
```

## Notes and risks

- The full Elements suite has eight unrelated baseline failures in Canvas controls/panel tests caused by a zero-size React Flow parent.
- The authoritative version is Git commit `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd` plus the checked source checksum.
- Semantic package or design release labels can be added later without replacing the immutable pin.

## Next steps

- Extend the manifest and Penpot library component-by-component.
- Automate snapshot extraction from Penpot MCP when a stable noninteractive transport is available.
