# Code Penpot library rollout

Date: 2026-08-22

## What changed

- Added all 15 pinned Code component families to the shared `AI Elements` Penpot library with 98 representative Light/Dark variants.
- Added exact source pins, complete runtime/type export inventories, heterogeneous variant mappings, stable Penpot identities, and shared code-binding metadata to `penpot/component-bindings.json`.
- Added a 98-instance linked `Code Component Lab` consumer proof, its resolver fixture, and 15 checked PNG reference matrices.
- Extended binding inventory and resolution tests from 19 components / 82 variants to 34 components / 180 variants.

## Why

Code is the second serialized writer slot in the AI Elements rollout. Component-owned axes preserve each runtime contract without forcing Confirmation's state model onto unrelated families.

## Validation

- `pnpm penpot:bindings:test` — 18 tests passed.
- `pnpm penpot:bindings:validate` — 34 bindings passed.
- Focused Code Elements browser suites — 15 files and 256 tests passed.
- `NODE_ENV=production pnpm -C apps/docs build` — passed; all 15 `/en/components/<slug>` routes returned HTTP 200 from the production server.
- Live Penpot library — 15 Code families, 98 variants, zero variant errors, zero identity mismatches, and zero metadata mismatches.
- Live consumer lab — 98 linked roots, 49 Light / 49 Dark, zero detached proof shapes, and no foreign-library instances.
- The original 19-entry Chatbot manifest slice retained canonical SHA-256 `5a8f01e461e89540d0536d8422cab75947dffac639f187b57ffd28c68a6681a4`.
- Penpot publication status was verified and file version `Code @ 6a9d5b1` was saved after all gates passed.

## Notes and risks

- The full Elements suite retains eight unrelated React Flow zero-size failures in `controls.test.tsx` and `panel.test.tsx`; every focused Code suite passes.
- The host exports `NODE_ENV=development`; production docs validation must set `NODE_ENV=production` explicitly.

## Next step

Release the sole Penpot/manifest writer slot to Voice after the Code commit handoff. Do not start Voice from this task.
