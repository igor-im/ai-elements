# Penpot design binding and source pin

Date: 2026-08-22

Status: completed

## Objective

Resolve the Penpot `ai.confirmation` component to the exact AI Elements React implementation without relying on a moving branch, implicit package version, or inferred variant behavior.

## Acceptance criteria

- [x] A checked-in manifest records the immutable upstream Git commit and SHA-256 checksum for `packages/elements/src/confirmation.tsx`.
- [x] The manifest records the Penpot file/component identities and shared-plugin-data location.
- [x] The manifest maps all `State` and `Theme` values explicitly to runtime semantics.
- [x] Validation fails for a mismatched source checksum, missing required variant, missing export, invalid identity, or non-ancestor source revision.
- [x] Tests cover the valid manifest and representative invalid manifests.
- [x] Penpot shared metadata carries the same source pin and binding contract version.
- [x] A linked consumer instance resolves back to the same component and source pin.
- [x] Existing Confirmation component behavior remains unchanged.

## Boundaries

- Do not modify the Confirmation component API for metadata needs.
- Do not infer or default missing mappings.
- Do not use a mutable branch name such as `main` as the authoritative source version.
- Do not publish credentials, browser state, or Penpot MCP tokens.
