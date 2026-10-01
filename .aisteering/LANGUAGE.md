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

## Heterogeneous variant axes

Component-owned Penpot dimensions such as `State`, `Variant`, `Header`, `Visibility`, or `Change`, followed by `Theme`. The binding validator derives the required Cartesian product from each component's declared axes rather than imposing one shared state model.

## Penpot page export

A versioned JSON scene graph captured through Penpot MCP. It records a board's native nodes, linked component identities, reference dimensions, and explicit implementation contract without embedding an expected screenshot or generated code.

## Implementation contract

Board metadata that names the target source file, route, theme, and binding manifest for a design-to-code task. Missing contract values block implementation rather than selecting defaults.

## Blind implementation run

An evaluation in which an agent receives only the implementation skill, raw design export, binding manifest, target project, and user-level request. It does not receive the design conversation, expected screenshot, or a hand-written solution.

## Section gallery

A consumer-lab board containing linked instances for every mapped variant in one rollout section. A section gallery is proof of library consumption, not a source for detached design copies.

## Reference export

The explicit Penpot shape UUID and PNG format recorded for visual verification of a component family. It points to the stable variant container rendered and inspected during the release gate.

## Composite binding dependency

A linked library instance embedded inside another bound component, such as Code Block or Stack Trace inside Sandbox. The nested instance remains attached to its source component and is never replaced by a detached copy.

## Device-conditioned state

A visual state whose live data depends on browser media APIs, permissions, or hardware enumeration. Penpot proofs use named synthetic devices and record permission, loading, and error behavior explicitly rather than querying the designer's host.

## Animated media snapshot

A deterministic raster captured from an animated source at a declared component state. Persona snapshots preserve the pinned Rive visual for each style, runtime state, and theme while the React implementation remains responsible for animation and model playback.
