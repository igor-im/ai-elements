# Chatbot Penpot library rollout

Date: 2026-08-22

## What changed

- Added the 18 remaining pinned Chatbot component families to the shared `AI Elements` Penpot library while preserving Confirmation.
- Created 76 Light/Dark variants with shared code-binding metadata and a 76-instance linked consumer gallery.
- Expanded `penpot/component-bindings.json` to 19 exhaustive bindings and generalized the validator/resolver for component-specific variant axes.
- Added focused Attachments and Checkpoint tests, the two missing Chatbot suites.

## Why

The Chatbot section is the first serialized writer slot in the full AI Elements library rollout. Question is included from the pinned repository source/docs even though it is not yet in the deployed public sidebar.

## Validation

- `pnpm penpot:bindings:test` — 17 tests passed.
- `pnpm penpot:bindings:validate` — 19 bindings passed.
- Focused Elements browser suites — 19 files and 430 tests passed.
- Local docs — all 19 `/en/components/<slug>` routes rendered with the expected title.
- Live Penpot — 19 component families, 82 mapped variants, 76 new consumer instances, 38 Light/38 Dark, zero detached instances, zero variant errors, and no metadata mismatches.
- Reference PNGs for all 18 new families were exported and visually accepted.
- Penpot publication status was verified and file version `Chatbot @ 6a9d5b1` was saved after the gates passed.

## Notes and risks

- The full Elements suite still has the documented eight unrelated React Flow zero-size failures in `controls.test.tsx` and `panel.test.tsx`.
- `pnpm check` is not a clean repository-wide gate: unrelated pre-existing files have formatting drift, and the current Ultracite/Oxlint setup reports an unavailable `import/no-unresolved` rule. Changed files are checked separately with Oxfmt.

## Next step

Release the sole Penpot/manifest writer slot to the Code section. Its task must begin from the committed 19-binding baseline and must not alter Chatbot identities or mappings.
