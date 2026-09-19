# Validation

## Local component documentation

```bash
pnpm --filter docs dev --hostname 127.0.0.1 --port 3000
```

Open `http://localhost:3000/en/components/<component-slug>`. The explicit English prefix is required because the docs application stores every rendered route under `[lang]`; hiding the only locale causes a rewrite/redirect loop with the pinned Next.js and Fumadocs versions. The Chatbot release smoke-checks all 19 routes from `attachments` through `tool`, including the source-ahead `question` route. The Code release smoke-checks `agent`, `artifact`, `code-block`, `commit`, `environment-variables`, `file-tree`, `jsx-preview`, `package-info`, `sandbox`, `schema-display`, `snippet`, `stack-trace`, `terminal`, `test-results`, and `web-preview`. The Voice release smoke-checks `audio-player`, `mic-selector`, `persona`, `speech-input`, `transcription`, and `voice-selector`. The Utilities release smoke-checks `image` and `open-in-chat`.

## Penpot binding tooling

```bash
pnpm penpot:bindings:test
pnpm penpot:bindings:validate
pnpm penpot:bindings:resolve penpot/fixtures/confirmation-component-lab.json
pnpm penpot:bindings:resolve penpot/fixtures/code-component-lab.json
pnpm penpot:bindings:resolve penpot/fixtures/voice-component-lab.json
pnpm penpot:bindings:resolve penpot/fixtures/utilities-component-lab.json
```

The test command covers valid and intentionally corrupted manifests plus successful and failed instance resolution. It synthesizes and resolves every declared variant combination; the Chatbot, Code, Voice, and Utilities manifest resolves 286 variants across 42 components. The validation command verifies the checked-in manifest against the current repository, source checksum, exhaustive runtime/type exports, documentation/example paths, required Penpot identities, PNG reference targets, and exhaustive variant mappings. The resolve command translates a Penpot instance snapshot into explicit React imports and render inputs.

## Utilities component behavior

```bash
cd packages/elements
pnpm exec vitest run __tests__/image.test.tsx __tests__/open-in-chat.test.tsx
```

The Utilities release runs two focused browser suites, including the Open in Chat example query regression. Reference matrices are stored under `penpot/exports/utilities/` after visual inspection.

## Voice component behavior

```bash
cd packages/elements
pnpm exec vitest run \
  __tests__/audio-player.test.tsx __tests__/mic-selector.test.tsx \
  __tests__/persona.test.tsx __tests__/speech-input.test.tsx \
  __tests__/transcription.test.tsx __tests__/voice-selector.test.tsx
```

The Voice release runs six focused browser suites. Reference matrices are stored under `penpot/exports/voice/` after visual inspection. Device and media tests use deterministic browser mocks; they do not require a host microphone, permission prompt, audio output, or a live voice service.

The Audio Player suite includes an SSR regression assertion for the media element's default `tabindex="-1"`. Runtime validation must also load `/en/components/audio-player` in a real browser and confirm hydration produces no console errors.

## Code component behavior

```bash
cd packages/elements
pnpm exec vitest run \
  __tests__/agent.test.tsx __tests__/artifact.test.tsx \
  __tests__/code-block.test.tsx __tests__/commit.test.tsx \
  __tests__/environment-variables.test.tsx __tests__/file-tree.test.tsx \
  __tests__/jsx-preview.test.tsx __tests__/package-info.test.tsx \
  __tests__/sandbox.test.tsx __tests__/schema-display.test.tsx \
  __tests__/snippet.test.tsx __tests__/stack-trace.test.tsx \
  __tests__/terminal.test.tsx __tests__/test-results.test.tsx \
  __tests__/web-preview.test.tsx
```

The Code release runs 15 focused browser suites. Reference matrices are stored under `penpot/exports/code/` after visual inspection.

## Chatbot component behavior

```bash
cd packages/elements
pnpm exec vitest run \
  __tests__/attachments.test.tsx __tests__/chain-of-thought.test.tsx \
  __tests__/checkpoint.test.tsx __tests__/confirmation.test.tsx \
  __tests__/context.test.tsx __tests__/conversation.test.tsx \
  __tests__/inline-citation.test.tsx __tests__/message.test.tsx \
  __tests__/model-selector.test.tsx __tests__/plan.test.tsx \
  __tests__/prompt-input.test.tsx __tests__/question.test.tsx \
  __tests__/queue.test.tsx __tests__/reasoning.test.tsx \
  __tests__/shimmer.test.tsx __tests__/sources.test.tsx \
  __tests__/suggestion.test.tsx __tests__/task.test.tsx \
  __tests__/tool.test.tsx
```

Run these focused suites for a Chatbot binding release. The Attachments and Checkpoint tests close the two gaps that existed in the pinned source test inventory.

On Ubuntu 26.04, Playwright 1.58 requires its explicit compatibility override for the one-time browser download:

```bash
PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 packages/elements/node_modules/.bin/playwright install chromium
```

The full Elements suite now uses explicitly sized Canvas fixtures in `controls.test.tsx` and `panel.test.tsx`, avoiding React Flow's zero-size parent warning in browser tests. Run `pnpm test` before a PR; the September 2026 pre-PR run passed all 967 Elements tests and six Penpot demo tests.

## Live Penpot validation

1. Read shared `ai-elements/code-binding` metadata from every component variant.
2. Confirm each source pin, checksum, export inventory, documentation path, and variant axis matches `penpot/component-bindings.json`.
3. Verify the `Chatbot Component Lab` gallery (`fdc5d385-a945-806e-8008-864e7d404d82`) contains 76 linked instances from library `f9c80ed1-fe5b-8098-8008-85f67c505174`, with no detached copies or variant errors.
4. Confirm the gallery has 38 Light and 38 Dark instances and all 18 newly ported component families. Confirmation remains in its preserved six-instance gallery.
5. Export and inspect the PNG target recorded in each binding's `design.referenceExport`.
6. Verify `Code Component Lab` (`cebd822e-5596-8078-8008-865a8fdf6abb`) contains 98 linked instances: 49 Light, 49 Dark, 15 families, zero detached proof shapes, and no foreign-library roots.
7. Verify `Voice Component Lab` (`8633c2af-b930-8087-8008-87a4b8475c0f`) contains 100 linked instances across six families, zero detached proof shapes, no foreign-library roots, and no file validation errors.
8. Verify `Utilities Component Lab` (`ef8ecfcc-e8fd-8021-8008-a99e412158e1`) contains six linked instances across Image and Open in Chat, three Light and three Dark, no detached proof shapes, no foreign-library roots, and no file validation errors.
