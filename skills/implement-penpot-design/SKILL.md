---
name: implement-penpot-design
description: Implement a React/TypeScript page from a Penpot MCP JSON export. Use when the export contains native Penpot shapes, text, or linked design-system components that must resolve through penpot/component-bindings.json.
---

# Implement a Penpot design

Translate a raw Penpot MCP export into maintainable React while preserving the design-system identity of linked components. Treat the export and binding manifest as contracts, not inspiration.

## Required inputs

Before editing, locate all of these:

- the raw `*.penpot.json` MCP export;
- `penpot/component-bindings.json`;
- the target application and route from `implementationContract`;
- the repository's `.aisteering/` policies and validation instructions.

Read [references/export-contract.md](references/export-contract.md) completely. Stop and report the missing input if any required input or explicit contract value is absent. Do not invent a target, theme, route, component mapping, asset, or fallback.

## Workflow

### 1. Establish the contract

1. Read `.aisteering/README.md`, `.aisteering/LANGUAGE.md`, `.aisteering/VALIDATION.md`, the active task plan, and the relevant scratchpad.
2. Read the export and binding manifest as structured data. Record the file, page, board, target, route, theme, reference dimensions, and every linked instance ID.
3. Inspect the target package's scripts, framework, styling conventions, and existing tests before choosing implementation details.
4. Run `pnpm penpot:bindings:validate`. A failed source pin, hash, file ID, or component ID blocks implementation.
5. Run `pnpm penpot:bindings:resolve <export-path>`. Preserve the resolver result as implementation evidence. Every linked instance must resolve; an unmapped instance is an error.

### 2. Plan from the scene graph

Interpret `board.children` in array order from back to front. Group nodes by visual region and repeated alignment rather than turning every rectangle into a component.

- Use board-relative geometry to infer rows, columns, gaps, padding, and hierarchy.
- Preserve exact text, colors, borders, radii, and supported font weights from the export.
- Convert coordinates into semantic CSS layout: grid, flexbox, normal flow, and scoped absolute positioning only for genuine overlays.
- Match the reference board at its exported dimensions, then add sensible behavior below that width without changing the design's meaning.
- Use accessible HTML landmarks, heading order, lists, buttons, and labels. Decorative geometry must not pollute the accessibility tree.
- Do not infer hidden interactions or content that the export does not specify.

Write or update deterministic acceptance tests before replacing the placeholder UI. Cover the visible page structure and stateful controls represented by the design.

### 3. Resolve linked components

For each `component-instance`:

1. Match the export's `componentLibraryId` and `componentId` to one manifest entry's `design.fileId` and variant component IDs.
2. Use the resolver's exact `import` and `render` contracts. Do not reconstruct the component's internal border, icon, text, or layout with local markup.
3. Inspect the pinned source and repository examples to learn the public React API and canonical content composition.
4. Derive state and theme from the resolved `variantProps`. Do not decide state from a visually similar native frame.
5. Place the imported component at the instance's exported position and size within the semantic page layout.

If the component's required content is not present in the export, source, examples, or implementation contract, stop and identify the missing design data. Never substitute a different component or silently approximate it.

### 4. Implement and verify

Keep the page implementation modular, but avoid abstractions used only once. Reuse repository tokens and components where they express the exported design exactly; otherwise use explicit local styles.

Run, in order:

1. the target package's focused tests;
2. its typecheck or build;
3. `pnpm penpot:bindings:validate` again;
4. the real application on an explicit unused port;
5. a browser smoke test at the contracted route and viewport;
6. a screenshot comparison against the Penpot board.

Check geometry, type scale, wrapping, colors, radii, component states, overflow, keyboard focus, and one narrower viewport. Fix implementation differences rather than weakening tests or changing the export.

## Completion report

Report the export path, target route, resolved component IDs, changed files, validation commands, screenshot path, and any remaining visual difference. Use the repository-required completion-gate format. Do not claim completion if any linked instance is unresolved or the real page was not exercised.
