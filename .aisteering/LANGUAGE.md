# Project language

## Binding contract

The explicit record connecting a Penpot library component to repository source, package exports, variant semantics, and an immutable source pin.

## Source pin

An immutable Git commit plus a SHA-256 checksum of the bound component source file. The commit identifies the upstream repository state; the checksum detects source drift on the feature branch.

## Design identity

The Penpot team, project, file, component, and variant identifiers used to resolve an exact design asset.

## Canonical component ID

A portable identifier such as `ai.confirmation` shared by Penpot metadata and the repository manifest.

## Binding contract version

An integer that versions the metadata shape and resolution semantics. It is separate from the source pin and from future package release versions.

## Variant mapping

An exhaustive translation from Penpot variant values to React state, approval data, compound exports, or theme context. Missing mappings are errors; the tooling does not guess.

## Penpot page export

A versioned JSON scene graph captured through Penpot MCP. It records a board's native nodes, linked component identities, reference dimensions, and explicit implementation contract without embedding an expected screenshot or generated code.

## Implementation contract

Board metadata that names the target source file, route, theme, and binding manifest for a design-to-code task. Missing contract values block implementation rather than selecting defaults.

## Blind implementation run

An evaluation in which an agent receives only the implementation skill, raw design export, binding manifest, target project, and user-level request. It does not receive the design conversation, expected screenshot, or a hand-written solution.
