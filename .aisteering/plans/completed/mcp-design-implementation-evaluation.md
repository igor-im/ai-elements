# MCP design-to-implementation evaluation

Date: 2026-08-22

## Objective

Test whether a fresh agent can implement a simple Penpot page from raw MCP artifacts by following a reusable repo-local skill, without access to the design conversation or an expected implementation.

## Acceptance criteria

- [x] A new Penpot page contains ordinary layout/text plus linked `ai.confirmation` component instances.
- [x] The page exposes an explicit implementation contract and can be exported through MCP.
- [x] A repo-local skill explains identity checks, binding resolution, layout translation, asset handling, and validation.
- [x] An empty demo project defines its framework, commands, and acceptance tests without containing the solution.
- [x] A fresh agent with no conversation context implements the page using only the skill and raw artifacts.
- [x] The resulting project builds, runs, resolves linked components correctly, and is visually compared against Penpot.
- [x] Skill gaps discovered by the blind run were corrected and revalidated.

## Isolation rules used

- The fresh agent did not receive the expected screenshot, intended DOM, or a hand-written solution.
- The fresh agent did not receive the design conversation or conclusions about likely mistakes.
- The handoff contained only the skill path, raw MCP artifact path, binding manifest path, demo-project path, and user-level request.
- The first attempt was committed before corrections and documented in `penpot/evaluations/2026-08-22-blind-first-attempt.md`.
