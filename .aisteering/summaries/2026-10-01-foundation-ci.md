# Penpot foundation CI and integration

Date: 2026-10-01
Status: branch

## Changes

- Added a dedicated `Validate Penpot Bindings` CI job for pull requests and
  pushes to `main`. It uses a frozen dependency lockfile, runs the existing
  validation/resolution tests, and validates the manifest against source.
- The job fetches complete Git history so immutable source-pin existence and
  ancestry checks work in a fresh CI checkout.
- Documented the requirement to preserve branch history with a merge commit;
  squash/rebase integration would invalidate the local Audio Player source pin.
- Paused Workflow implementation while library dependencies, CI, and repository
  integration are settled, as requested by the user.

## Validation

- Existing binding tests: 20 passed, including all 286 mapped variants and
  checked-in consumer fixtures.
- Manifest validator: all 42 bindings passed.
- Workflow YAML parsed and the job's commands, history depth, and read-only
  contents permission were checked.
- Changed-file formatting and `git diff --check` passed.

## Integration and live-design findings

- Fork PR #1 targets `igor-im/ai-elements/main`, is open, and includes Utilities.
  Upstream PR #495 is closed without merging.
- The fork's Actions UI explicitly reported that fork workflows had never been
  enabled. Enabled Actions to allow the PR test workflow to run; upstream-only
  Release and Generate Skills workflows are kept disabled on the fork.
- Before merging, verify the updated PR checks and obtain explicit approval for
  the fork destination, as required by the recorded prior approval rejection.
- The owned Penpot library's MCP plugin is disconnected. Its shadcn dependency
  cannot be verified until that connection is restored; no Penpot edits were made.
