# Audio Player hydration and Penpot synchronization

Date: 2026-08-25

- Added an SSR regression test and default `tabIndex={-1}` to `AudioPlayerElement`, matching the client mutation performed by `media-chrome` and removing the hydration mismatch.
- Repinned `ai.audio-player` to commit `e3292f6b2bb6c247fde4d74f716d3535a07f43e4` and source SHA-256 `99b4f7321aac91db54bb8dfa605c3f8326fdcd3f4f71c762a477aea332a4311c` in both the manifest and Penpot shared metadata.
- Applied the component lab's pending shared-library updates and reconnected the current MCP session. The consumer now reports no pending updates and zero Penpot validation errors.
- Validate with `pnpm --filter @repo/elements exec vitest run __tests__/audio-player.test.tsx`, `pnpm penpot:bindings:test`, `pnpm penpot:bindings:validate`, and `NODE_ENV=production pnpm --filter docs build`.
- Browser proof: `/en/components/audio-player` renders three media elements with `tabindex="-1"` and no console errors.
- Known tooling note: repository-wide `pnpm check` still reports the existing 19-file formatting baseline; the changed Audio Player files pass the pinned `oxlint` binary and targeted Ultracite formatting.
