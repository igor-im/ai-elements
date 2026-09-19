# Voice Penpot library rollout

Date: 2026-08-23

## What changed

- Added the six pinned Voice component families to the shared `AI Elements` Penpot library with 100 representative variants.
- Added exact source pins, public export inventories, explicit state mappings, stable Penpot identities, and shared code-binding metadata to `penpot/component-bindings.json`.
- Added a 100-instance linked `Voice Component Lab` consumer proof, its resolver fixture, and six checked PNG reference matrices.
- Extended binding inventory and resolution tests from 34 components / 180 variants to 40 components / 280 variants.

## Why

Voice is the third serialized writer slot in the AI Elements rollout. The design contract represents media controls, device/voice selection, transcription timing, speech capture, and Persona animation states without depending on the designer's host devices or live media services.

## Validation

- `pnpm penpot:bindings:test` — 19 tests passed.
- `pnpm penpot:bindings:validate` — 40 bindings passed.
- Focused Voice browser suites — six files and 220 tests passed.
- All six local documentation routes returned HTTP 200.
- Live Penpot library — six Voice families, 100 variants, identical metadata within every family, and zero file validation errors.
- `Voice Component Lab` — 100 linked instances, zero detached roots, and zero foreign-library roots.
- Penpot publication remained active and file version `Voice @ 6a9d5b1` was pinned after all Voice gates passed.

## Notes and risks

- Browser microphone enumeration, permission failures, and real audio playback remain runtime-only behaviors; Penpot uses explicit synthetic content and the manifest records nonvisual device failure states.
- Persona preserves the pinned Rive appearance as deterministic state snapshots. Animation timing and model playback remain owned by the React implementation.
- The first 34 manifest entries and the existing Confirmation binding are byte-semantically unchanged.

## Next step

Release the sole Penpot/manifest writer slot to Workflow after the Voice commit handoff.
