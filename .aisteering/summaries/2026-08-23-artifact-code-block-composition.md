# Artifact Code Block composition correction

Date: 2026-08-23

## What changed

- Replaced the replicated code rectangle and four text layers in every Artifact variant with a linked Numbered Code Block instance.
- Used Light/Dark Code Block variants to match the containing Artifact theme and retained the example's borderless, headerless slot through instance overrides.
- Propagated the published update to all four linked consumer-lab Artifact proofs and refreshed `penpot/exports/code/artifact.png`.
- Saved Penpot version `Artifact composes Code Block @ 6a9d5b1`.

## Why

The pinned Artifact example composes `CodeBlock` inside `ArtifactContent`. The previous Penpot implementation copied its appearance with primitive layers, so shared Code Block typography and visual updates could not propagate.

## Validation

- Source-composition audit: Artifact and Sandbox are the only Code examples that import another Code-family component; Sandbox was already correctly linked.
- Live shared library: four Artifact variants, one linked Code Block head per variant, zero replicated Artifact content layers, zero Penpot file validation errors.
- Live consumer lab: four original Artifact roots remain linked; every nested Code Block remains linked to the correct Light/Dark Numbered UUID.
- Focused Artifact behavior: 14 tests passed.
- Binding tooling: 18 tests passed and 34 bindings validated.

## Notes

- Artifact, Code Block, variant, manifest, source-pin, and consumer-proof UUIDs are unchanged.
- The React API and repository binding manifest are unchanged.
- Voice retains the next shared Penpot writer slot.
