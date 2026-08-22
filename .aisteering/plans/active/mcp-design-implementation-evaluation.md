# MCP design-to-implementation evaluation

Date: 2026-08-22

## Objective

Test whether a fresh agent can implement a simple Penpot page from raw MCP artifacts by following a reusable repo-local skill, without access to the design conversation or an expected implementation.

## Acceptance criteria

- [ ] A new Penpot page contains ordinary layout/text plus linked `ai.confirmation` component instances.
- [ ] The page exposes an explicit implementation contract and can be exported through MCP.
- [ ] A repo-local skill explains identity checks, binding resolution, layout translation, asset handling, and validation.
- [ ] An empty demo project defines its framework, commands, and acceptance tests without containing the solution.
- [ ] A fresh agent with no conversation context implements the page using only the skill and raw artifacts.
- [ ] The resulting project builds, runs, resolves linked components correctly, and is visually compared against Penpot.
- [ ] Any skill gaps discovered by the blind run are corrected and revalidated.

## Isolation rules

- Do not show the fresh agent the expected screenshot, intended DOM, or a hand-written solution.
- Do not pass this conversation or conclusions about likely mistakes.
- Pass only the skill path, raw MCP artifact path, binding manifest path, demo-project path, and user-level implementation request.
- Preserve the first agent attempt for evaluation before making corrections.
