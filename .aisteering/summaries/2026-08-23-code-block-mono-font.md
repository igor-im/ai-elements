# Code Block monospace correction

Date: 2026-08-23

## What changed

- Updated Code Block filenames and code-content layers across all six Light/Dark shared-library variants to Geist Mono while preserving existing weights.
- Propagated the published-library update to linked consumer-lab proofs, including nested Sandbox Code Blocks.
- Refreshed `penpot/exports/code/code-block.png` and saved Penpot version `Code Block Geist Mono @ 6a9d5b1`.

## Why

The pinned React source applies `font-mono` to `CodeBlockFilename` and the rendered `code` element; the Penpot components previously used Source Sans Pro.

## Validation

- Live shared library: 34/34 targeted filename and code-content layers use Geist Mono, with no target overflow.
- Live consumer lab: all six Code Block proof roots remain linked to their original UUIDs; 66/66 direct and nested targets use Geist Mono.
- `pnpm penpot:bindings:test`
- `pnpm penpot:bindings:validate`

## Notes

- The binding manifest, source pins, variant mappings, and public React API are unchanged.
- Voice retains the next shared Penpot writer slot; this correction did not begin Voice work.
