# Library linkage and binding audit

Date: 2026-10-01
Status: branch

## Live changes and evidence

- Connected the owned AI Elements file `f9c80ed1-fe5b-8098-8008-85f67c505174`
  to vendor `@shadcn/ui - Design System (Community)` file
  `f9c80ed1-fe5b-8098-8008-85f0bfe960dc`. The vendor file was not modified.
- Instantiated its default Button as a temporary probe, verified its vendor
  component/library IDs and copy-instance status, and visually inspected its
  PNG. Removed the probe after verification; it is not production composition.
- Audited shared metadata on all 286 variants across 42 owned families. Five
  Audio Player variants retained the old upstream pin; only Paused|Light had
  the repository-local SSR fix pin. Updated just those five sourcePin records
  to the manifest's `e3292f6b2bb6c247fde4d74f716d3535a07f43e4` identity.
- Saved Penpot versions before and after the changes. The final version is
  `shadcn connected; Audio Player pins repaired 2026-10-01`.
- Re-read all 286 records and exported the live snapshot to
  `penpot/fixtures/library-bindings.json`. The audit compares every variant's
  actual metadata, including its immutable source pin, rather than checking
  only each family's root variant. The positive snapshot test failed on the
  original five stale records and passed after the repair.
- Visually inspected the unchanged six-state Audio Player matrix. Both library
  and consumer files returned zero file-validation errors.
- Independently checked all consumer galleries: Confirmation 6, Chatbot 76,
  Code 98, Voice 100, Utilities 6. All 286 roots remain linked to the owned
  library with matching component UUIDs and source pins, including all six
  Audio Player variants; no variant errors were reported.

## Remaining composition work

Connection is operational, but existing AI Elements designs contain zero
nested vendor component instances. Their 12 nested component heads belong to
owned Code Block and Stack Trace compositions. Other controls remain native
Penpot shapes. The React source uses 25 distinct shadcn primitives across 37
of the 42 bound families.

The imported vendor kit has named equivalents for 18 primitives. It lacks
exact families for Alert, Badge, Button Group, Carousel, Card, Input Group,
and Spinner. Alert Dialog and the Tab Card example are not substitutes for
Alert or Card. Its Button variants also do not provide the Light/Dark axis
used by the owned library.

Next, migrate reusable controls while preserving the outer AI Elements UUIDs
and source bindings. Begin with Button (22 source families), Collapsible (14),
and Badge (8), with an explicit owned implementation for missing primitives
and theme handling. Validate each changed matrix and consumer instances.
Connecting the vendor file alone does not complete that migration. Keep
Workflow's seven component families paused until this foundation is resolved.

## Repository integration

Fork PR #1 merged after five successful CI jobs, preserving the Audio Player
source pin in Git ancestry. This audit and regression coverage are on
`codex/shadcn-library-linkage`. CI uses saved live evidence; it does not poll
Penpot or prove the snapshot remains current after later design edits.

Automated validation: passed
Real scenario validation: passed
Blockers: none for this audit; primitive composition migration remains work
