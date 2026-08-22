# Validation

## Penpot binding tooling

```bash
pnpm penpot:bindings:test
pnpm penpot:bindings:validate
pnpm penpot:bindings:resolve penpot/fixtures/confirmation-component-lab.json
```

The test command covers valid and intentionally corrupted manifests plus successful and failed instance resolution. The validation command verifies the checked-in manifest against the current repository, source checksum, exports, required Penpot identities, and exhaustive variant mappings. The resolve command translates a Penpot instance snapshot into explicit React imports and render inputs.

## Existing Confirmation behavior

```bash
pnpm --filter @repo/elements exec vitest run __tests__/confirmation.test.tsx
```

Run this focused suite when binding work changes `packages/elements/src/confirmation.tsx` or its public behavior. Metadata-only changes do not require component behavior changes.

On Ubuntu 26.04, Playwright 1.58 requires its explicit compatibility override for the one-time browser download:

```bash
PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 packages/elements/node_modules/.bin/playwright install chromium
```

The current full Elements suite has eight unrelated baseline failures in `controls.test.tsx` and `panel.test.tsx` because React Flow reports a zero-size parent. The focused Confirmation suite passes independently.

## Live Penpot validation

1. Read the shared metadata from the `ai.confirmation` component.
2. Confirm the source pin and checksum match `penpot/component-bindings.json`.
3. Place a linked instance in the component-lab file.
4. Resolve the instance to the same component UUID and canonical component ID.
5. Export and inspect representative light and dark instances.
