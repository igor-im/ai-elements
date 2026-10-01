# Blind Penpot implementation: first attempt

Date: 2026-08-22

## Isolation

The implementation agent received no conversation history and no expected screenshot. It received only the repo-local skill, raw Penpot MCP export, binding manifest, target project path, and a user-level implementation request.

## Automated evidence

- `pnpm penpot:bindings:validate`: passed; one binding validated.
- `pnpm penpot:bindings:resolve penpot/exports/approval-workspace.penpot.json`: passed; all three `ai.confirmation` instances resolved.
- `pnpm --filter penpot-demo test`: passed; five tests.
- `pnpm --filter penpot-demo build`: passed.
- 1280×800 browser geometry: request `288,216,640,96`; accepted `288,412,640,64`; rejected `288,520,640,64`; details `958,216,274,252`.
- 720×900 browser check: no horizontal overflow; all controls remained available.

## First-attempt findings

- Major board geometry and all native text were reproduced accurately.
- The implementation imported the pinned Confirmation compound component instead of redrawing it.
- Accepted and rejected icon/text content was vertically stacked instead of inline because the CSS targeted a nonexistent wrapper.
- Status icons used inferred green/red semantics, while the Penpot visual used foreground black.
- Request and response content inherited muted text, lighter than the Penpot visual.
- The declared Source Sans Pro family was unavailable locally, so the browser used its fallback.
- The only browser console error was a missing favicon request.

## Skill gap

The skill required a screenshot comparison but did not explicitly instruct the agent to export the reference board through Penpot MCP itself. Without a reference raster, geometry could be checked from JSON but compound-component internals could not be visually compared. The workflow should make MCP reference export an explicit validation step and treat an unavailable reference as a reported blocker.
