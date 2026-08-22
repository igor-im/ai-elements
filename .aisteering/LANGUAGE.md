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
