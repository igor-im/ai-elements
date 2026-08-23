# Penpot binding scratchpad

Date: 2026-08-22

- Repository cloned from `https://github.com/vercel/ai-elements.git`.
- Feature branch: `codex/penpot-design-bindings`.
- Upstream source pin: `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`.
- Confirmation source SHA-256: `7cc0befed99499ed9010643e7a90ec619180a3f6e79cba5668cfc84126b96a10`.
- Bound source: `packages/elements/src/confirmation.tsx`.
- Package import inside the monorepo: `@repo/elements/confirmation`.
- Penpot file UUID: `f9c80ed1-fe5b-8098-8008-85f67c505174`.
- Penpot component UUID: `a46a744a-db75-80c4-8008-85fc2b7972aa`.
- Shared metadata: namespace `ai-elements`, key `code-binding`.
- Exact Git commit is authoritative; semantic release labels may be added later without weakening the pin.
- Penpot library file was renamed `AI Elements` and published.
- Penpot file version label: `ai.confirmation @ 6a9d5b1`.
- Consumer file: `AI Elements Component Lab` (`f9c80ed1-fe5b-8098-8008-8618092b66d2`), page `f9c80ed1-fe5b-8098-8008-8618092b66d3`.
- Component-lab gallery: `15a57ee0-be05-809c-8008-8618768ee905`.
- Instantiate concrete `LibraryVariantComponent` objects in consumer files. `switchVariant()` silently left new copies on `Request/Light` during this pilot.
- Binding validation: 9 focused tooling tests pass; Confirmation behavior: 17 tests pass.
- Full Elements baseline currently has eight unrelated React Flow zero-size failures in `controls.test.tsx` and `panel.test.tsx`.
- The docs app must use explicit locale routes such as `/en/components/confirmation`; `hideLocale: "default-locale"` loops between the hidden path and `[lang]` route with the pinned Next.js/Fumadocs runtime.
- Implementation-test page: `Implementation Test` (`15a57ee0-be05-809c-8008-86250cb64c01`), board `Approval Workspace` (`15a57ee0-be05-809c-8008-86250cc51d90`).
- Raw page artifact: `penpot/exports/approval-workspace.penpot.json`; implementation skill: `skills/implement-penpot-design`; demo: `apps/penpot-demo`.
- The blind run reproduced exact major geometry and correct bindings but missed compound-content color/alignment without a reference raster. The skill now requires agents to export the board PNG through MCP themselves.
- Source Sans Pro 400/600/700 assets were copied from the local Penpot frontend into the demo, with the Adobe OFL-1.1 license.
- Full library rollout is section-sequenced in `.aisteering/plans/active/ai-elements-penpot-library-rollout.md`: Chatbot, Code, Voice, Workflow, then Utilities. Only one section task may mutate the shared Penpot file or binding manifest at a time.
- Chatbot rollout adds 18 component families and 76 variants to the preserved Confirmation family, for 19 bindings and 82 mapped variants total.
- The new consumer proof is `Chatbot Component Lab` (`fdc5d385-a945-806e-8008-864e7d404d82`): 76 linked instances, 38 Light and 38 Dark, no variant errors or detached copies.
- Question is included from pinned `packages/elements/src/question.tsx` and its repository docs even though it is source-ahead of the deployed public sidebar.
- Every new variant carries shared `ai-elements/code-binding` metadata with exact source SHA-256, complete runtime/type export inventory, docs/examples, and explicit variant axes.
- Attachments and Checkpoint gained focused component tests; all 19 Chatbot suites pass with 430 tests. Binding tooling passes 17 tests and validates all 19 entries.
- Chatbot visuals were accepted by the user after Light/Dark reference exports; Attachments and Suggestion were corrected before acceptance.
- The already-published `AI Elements` library was verified in published state and saved as explicit version `Chatbot @ 6a9d5b1` after all section gates passed.
- Chatbot is the completed writer slot. Code is next and must revalidate the current 19-binding baseline before mutating the shared file or manifest.
