# Utilities Penpot library rollout

Date: 2026-09-19
Status: pr-open

## What changed

- Added Image and Open in Chat to the published `AI Elements` Penpot library with two and four Light/Dark variants respectively. Open in Chat covers closed/open states and six provider links.
- Bound both families to exact pinned source hashes and complete public exports, with shared metadata on all six variants. The upstream component source files remain untouched.
- Added six linked consumer proofs in `Utilities Component Lab`, a resolver fixture, and two visually checked PNG matrices. The library was saved as version `Utilities @ 6a9d5b1`.
- Corrected both Open in Chat examples to supply `query` to the parent context, with a regression test for the resulting ChatGPT URL.
- Updated the rollout plan and validation map to 42 component bindings / 286 mapped variants.

## Validation

- Binding tooling: 20 tests passed; manifest validation: 42 entries passed; all six consumer proofs resolved.
- Focused Utilities browser suites: 19 tests passed. Full Elements suite: 968 tests passed. Penpot demo: six tests passed.
- Local `/en/components/image` and `/en/components/open-in-chat` returned HTTP 200; Image rendered its preview and Open in Chat opened six provider items.
- Live library and consumer files each returned zero Penpot validation errors. All six consumer instances remain linked to the expected shared-library variants.
- Pinned Image/Open in Chat SHA-256 values and the pre-Utilities Confirmation binding hash were verified unchanged.

## Risks and handoff

- The Image bitmap is the existing repository example asset; design matrices are illustrative and do not replace generated-image runtime behavior. Open in Chat links are visual states; provider URL construction remains in React.
- Standalone examples TypeScript checking reports existing errors in unrelated examples and component files, but none in the corrected Open in Chat example. The complete CI test suites pass.
- Existing upstream PR `vercel/ai-elements#495` and fork PR `igor-im/ai-elements#1` target this feature branch; an update to the branch carries Utilities into those PRs. Upstream merge still requires Vercel review and is not claimed here.
- Release the sole Penpot/manifest writer slot to Workflow after the Utilities branch commit and PR update.
