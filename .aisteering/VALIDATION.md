# Validation

## Local component documentation

```bash
pnpm --filter docs dev --hostname 127.0.0.1 --port 3000
```

Open `http://localhost:3000/en/components/<component-slug>`. The explicit English prefix is required because the docs application stores every rendered route under `[lang]`; hiding the only locale causes a rewrite/redirect loop with the pinned Next.js and Fumadocs versions. The Chatbot release smoke-checks all 19 routes from `attachments` through `tool`, including the source-ahead `question` route.

## Penpot binding tooling

```bash
pnpm penpot:bindings:test
pnpm penpot:bindings:validate
pnpm penpot:bindings:resolve penpot/fixtures/confirmation-component-lab.json
```

The test command covers valid and intentionally corrupted manifests plus successful and failed instance resolution. It synthesizes and resolves every declared variant combination; the Chatbot manifest currently resolves 82 variants across 19 components. The validation command verifies the checked-in manifest against the current repository, source checksum, exhaustive runtime/type exports, documentation/example paths, required Penpot identities, PNG reference targets, and exhaustive variant mappings. The resolve command translates a Penpot instance snapshot into explicit React imports and render inputs.

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

The current full Elements suite has eight unrelated baseline failures in `controls.test.tsx` and `panel.test.tsx` because React Flow reports a zero-size parent. The focused Confirmation suite passes independently.

## Live Penpot validation

1. Read shared `ai-elements/code-binding` metadata from every component variant.
2. Confirm each source pin, checksum, export inventory, documentation path, and variant axis matches `penpot/component-bindings.json`.
3. Verify the `Chatbot Component Lab` gallery (`fdc5d385-a945-806e-8008-864e7d404d82`) contains 76 linked instances from library `f9c80ed1-fe5b-8098-8008-85f67c505174`, with no detached copies or variant errors.
4. Confirm the gallery has 38 Light and 38 Dark instances and all 18 newly ported component families. Confirmation remains in its preserved six-instance gallery.
5. Export and inspect the PNG target recorded in each binding's `design.referenceExport`.
