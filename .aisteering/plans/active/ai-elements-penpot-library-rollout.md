# AI Elements Penpot library rollout

Date: 2026-08-22

## Objective

Port the remaining AI Elements component catalog into the shared Penpot `AI Elements` file and bind every design component to the pinned React implementation. Execute one documentation section at a time because all sections mutate the same live Penpot library and binding manifest.

## Shared contract

- Repository: `/home/igor/Documents/code/design-system/ai-sdk-elements-shared`
- Source revision: `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`
- Penpot library file: `f9c80ed1-fe5b-8098-8008-85f67c505174`
- Consumer lab file: `f9c80ed1-fe5b-8098-8008-8618092b66d2`
- Binding manifest: `penpot/component-bindings.json`
- Canonical IDs: `ai.<component-slug>`
- Every component requires an exact source-file SHA-256, code export inventory, Penpot UUIDs, explicit variant/state mapping, Light and Dark coverage where the component renders UI, focused tests, binding validation, and a consumer-file proof instance.
- Linked Penpot component instances remain opaque during page implementation and must resolve through the binding manifest.
- Publish and create a Penpot file version only after the whole section validates.
- Only one section task may mutate Penpot or `penpot/component-bindings.json` at a time.

## Section tasks

### 1. Chatbot — implementation active

- [ ] attachments
- [ ] chain-of-thought
- [ ] checkpoint
- [x] confirmation
- [ ] context
- [ ] conversation
- [ ] inline-citation
- [ ] message
- [ ] model-selector
- [ ] plan
- [ ] prompt-input
- [ ] question
- [ ] queue
- [ ] reasoning
- [ ] shimmer
- [ ] sources
- [ ] suggestion
- [ ] task
- [ ] tool

### 2. Code — staged after Chatbot

- [ ] agent
- [ ] artifact
- [ ] code-block
- [ ] commit
- [ ] environment-variables
- [ ] file-tree
- [ ] jsx-preview
- [ ] package-info
- [ ] sandbox
- [ ] schema-display
- [ ] snippet
- [ ] stack-trace
- [ ] terminal
- [ ] test-results
- [ ] web-preview

### 3. Voice — staged after Code

- [ ] audio-player
- [ ] mic-selector
- [ ] persona
- [ ] speech-input
- [ ] transcription
- [ ] voice-selector

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

- [ ] Source and documentation/example inventory is complete.
- [ ] Every component has representative Light and Dark Penpot visuals or an explicit documented nonvisual exception.
- [ ] Every design component has stable UUID metadata and a manifest entry.
- [ ] Manifest source hashes and variant mappings validate mechanically.
- [ ] A section gallery in the consumer lab resolves to library components rather than detached copies.
- [ ] Reference PNG exports are visually checked.
- [ ] Focused tests, binding tests, and binding validation pass.
- [ ] `.aisteering/LANGUAGE.md`, scratchpad, and section summary are current.
- [ ] Changes are committed on the feature branch before the next section starts.

## Execution order

Chatbot → Code → Voice → Workflow → Utilities. Later section tasks may inventory and plan while Chatbot is active, but they must not mutate Penpot, the manifest, or shared component tooling until explicitly released.
