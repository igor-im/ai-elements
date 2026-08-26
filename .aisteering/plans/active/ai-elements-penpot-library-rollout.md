# AI Elements Penpot library rollout

Date: 2026-08-22

## Objective

Port the remaining AI Elements component catalog into the shared Penpot `AI Elements` file and bind every design component to the pinned React implementation. Execute one documentation section at a time because all sections mutate the same live Penpot library and binding manifest.

## Shared contract

- Repository: `/home/igor/Documents/code/design-system/ai-sdk-elements-shared`
- Upstream baseline revision: `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`
- Audio Player SSR fix revision: `e3292f6b2bb6c247fde4d74f716d3535a07f43e4`
- Penpot library file: `f9c80ed1-fe5b-8098-8008-85f67c505174`
- Consumer lab file: `f9c80ed1-fe5b-8098-8008-8618092b66d2`
- Binding manifest: `penpot/component-bindings.json`
- Canonical IDs: `ai.<component-slug>`
- Every component requires an exact source-file SHA-256, code export inventory, Penpot UUIDs, explicit variant/state mapping, Light and Dark coverage where the component renders UI, focused tests, binding validation, and a consumer-file proof instance.
- Linked Penpot component instances remain opaque during page implementation and must resolve through the binding manifest.
- Publish and create a Penpot file version only after the whole section validates.
- Only one section task may mutate Penpot or `penpot/component-bindings.json` at a time.

## Section tasks

### 1. Chatbot — complete

- [x] attachments
- [x] chain-of-thought
- [x] checkpoint
- [x] confirmation
- [x] context
- [x] conversation
- [x] inline-citation
- [x] message
- [x] model-selector
- [x] plan
- [x] prompt-input
- [x] question
- [x] queue
- [x] reasoning
- [x] shimmer
- [x] sources
- [x] suggestion
- [x] task
- [x] tool

Question is intentionally included from the pinned repository source and docs even though it is source-ahead of the deployed public sidebar.

### 2. Code — complete

- [x] agent
- [x] artifact
- [x] code-block
- [x] commit
- [x] environment-variables
- [x] file-tree
- [x] jsx-preview
- [x] package-info
- [x] sandbox
- [x] schema-display
- [x] snippet
- [x] stack-trace
- [x] terminal
- [x] test-results
- [x] web-preview

Code adds 15 component families, 98 mapped variants, 98 linked consumer instances, and 15 checked reference PNGs. Code Block filenames and code-content layers use Geist Mono in every Light/Dark variant. Artifact composes linked Numbered Code Block instances, while Sandbox composes linked Code Block or Stack Trace instances according to the pinned examples. The preserved 19-entry Chatbot manifest slice retains its pre-Code canonical hash.

### 3. Voice — complete

- [x] audio-player
- [x] mic-selector
- [x] persona
- [x] speech-input
- [x] transcription
- [x] voice-selector

Voice adds six component families, 100 mapped variants, 100 linked consumer instances, and six checked reference PNGs. Persona uses source-faithful Rive snapshots across six visual styles, five runtime states, and both themes. Device-backed selectors use deterministic synthetic devices and voices for design proof while browser permission, enumeration, and media playback remain runtime concerns.

Audio Player carries a repository-local source pin at `e3292f6b2bb6c247fde4d74f716d3535a07f43e4`. It preserves the upstream component API while emitting the media controller's default `tabindex="-1"` during SSR so `media-chrome` does not introduce a client-only hydration difference.

### 4. Workflow — staged after Voice

- [ ] canvas
- [ ] connection
- [ ] controls
- [ ] edge
- [ ] node
- [ ] panel
- [ ] toolbar

### 5. Utilities — staged after Workflow

- [ ] image
- [ ] open-in-chat

## Per-section acceptance gates

- [x] Source and documentation/example inventory is complete.
- [x] Every component has representative Light and Dark Penpot visuals or an explicit documented nonvisual exception.
- [x] Every design component has stable UUID metadata and a manifest entry.
- [x] Manifest source hashes and variant mappings validate mechanically.
- [x] A section gallery in the consumer lab resolves to library components rather than detached copies.
- [x] Reference PNG exports are visually checked.
- [x] Focused tests, binding tests, and binding validation pass.
- [x] `.aisteering/LANGUAGE.md`, scratchpad, and section summary are current.
- [x] Changes are committed on the feature branch before the next section starts.

## Execution order

Chatbot → Code → Voice → Workflow → Utilities. Chatbot, Code, and Voice are accepted; Workflow owns the next writer slot after the Voice commit handoff. Later section tasks may inventory and plan, but they must not mutate Penpot, the manifest, or shared component tooling until explicitly released.
