# Penpot MCP page export contract

Read the export as a scene graph plus a code-binding contract.

## Root fields

- `schemaVersion`: supported contract version. Reject an unknown version.
- `provider`: expected to identify the Penpot MCP exporter.
- `file`, `page`, `board`: stable Penpot identities and names.
- `board.width`, `board.height`: the reference viewport in CSS pixels.
- `board.fill`: page background.
- `board.implementationContract`: explicit target file, route, theme, and binding-manifest path.
- `board.children`: direct visual children in back-to-front paint order.
- `instances`: linked component instances duplicated in resolver-friendly form.

Identity fields are opaque UUIDs. Compare them exactly; names are only for human orientation.

## Native nodes

Native nodes have a `type` such as `rect`, `text`, `path`, or `group`, plus `x`, `y`, `width`, and `height`. Coordinates are relative to the exported board origin unless the node explicitly declares another parent.

Common style fields include:

- `fills` or `fill`;
- `strokes` or `stroke`;
- `strokeWidth`;
- `borderRadius` or per-corner radii;
- `opacity`;
- text content, font family, font size, font weight, line height, letter spacing, and alignment.

Omitted values are absent information, not permission to guess. Preserve numeric values at the reference viewport. Infer layout relationships only when repeated edges, gaps, or containment make them observable.

Text bounds are layout evidence. Preserve the exact string and intended wrap width, while allowing browser font metrics to differ minimally. Use the closest repository-provided font only when the application already declares it; otherwise load or declare the exported family explicitly.

## Linked component instances

A linked instance has `type: "component-instance"` and includes:

- `id`: the instance UUID;
- `componentLibraryId`: source library UUID;
- `componentId`: source component UUID;
- `variantSetId`: optional variant-set UUID;
- `variantProps`: explicit design variant values;
- geometry and an optional instance name.

The instance is opaque. Its children may be omitted deliberately. Resolve it through `penpot/component-bindings.json`; do not use missing child geometry as justification to redraw it.

The binding resolver emits an import contract and render contract. Those are authoritative for the code symbol and prop mapping. The pinned source and its examples are authoritative for public composition APIs and content slots.

## Translation rules

- Paint order controls overlap; it does not require DOM order when semantic order differs.
- Repeated x/y edges and gaps justify grid or flex alignment.
- Large containing rectangles commonly become sections, cards, sidebars, or backgrounds rather than separate decorative DOM nodes.
- Small vector paths may be recreated with an existing repository icon only when the semantic icon is explicit and the match is exact. Otherwise preserve the exported asset.
- Reference dimensions are the primary visual target. Responsive behavior is an additional constraint, not a license to alter the reference layout.
- Theme is explicit. Implement only the contracted theme unless multiple exported boards or an explicit contract require more.
