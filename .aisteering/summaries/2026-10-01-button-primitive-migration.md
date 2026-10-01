# Linked Button primitive migration

Date: 2026-10-01
Status: branch

## Delivered checkpoint

Replaced 240 native control backgrounds and labels with connected vendor Button
instances. Twelve nested instances inherited these changes through existing
Code Block and Stack Trace compositions, giving 252 vendor instances across
26 AI Elements families. Existing outer component UUIDs, variant mappings,
and all 286 code-binding records remain unchanged and validate against the
manifest. The imported vendor library remains read-only.

The pass covers confirmation actions; copy, navigation, and terminal controls;
suggestions and message actions; submit controls; attachment removal; plan and
queue actions; model/microphone/voice selectors and voice preview controls;
speech input; and Audio Player play/seek controls. This is a selected-control
migration, not a claim that every primitive or every compound subpart is done.

Vendor Button variants used are default, outline, ghost, and destructive.
Existing theme colors, dimensions, glyphs, and typography are explicit instance
overrides. Auto-width labels retain their absolute position with top alignment;
Confirmation's fixed-size centered labels retain centered alignment. Icon-only
controls use transparent backgrounds. Speech and voice selector controls whose
content uses several independent layers retain those layers alongside the
linked background, with the vendor placeholder label hidden. Open in Chat
retains an owned wrapper for its custom chevron because Penpot prohibits adding
children to a component copy. No vendor instance was detached.

Penpot briefly displayed an internal error after a large batch. Reloading
restored the saved design, all 126 completed replacements at that point were
present, and file validation returned no errors. Subsequent batches were smaller.

## Evidence

- Saved library versions before migration and after the verified pass:
  `Before primitive composition migration 2026-10-01` and
  `Linked Button primitives across AI Elements 2026-10-01`.
- Saved a consumer version before updating shared libraries, applied the actual
  shared-library update through Penpot, then saved
  `252 linked Button primitives validated 2026-10-01`.
- Consumer readback: 286 linked outer instances and 252 linked vendor instances;
  composition identities/counts match the owned library for every variant.
  Both files validate with zero errors.
- Exported and visually inspected all 26 affected matrices. Refreshed existing
  Code/Voice/Utilities references and added Chatbot PNG references. The Sandbox
  reference now also shows the existing inherited Geist Mono typography change
  that its old PNG had not reflected.
- `primitive-contract.json` records the accepted named Button dependencies.
  Separate library and consumer snapshots record observed linkage. Baseline
  fixtures for the later 114 replacements preserve pre-migration geometry,
  paint, labels, and typography for deterministic comparison.
- Added regressions rejecting the original all-native composition, a stale
  consumer update, detached/foreign copies, and missing consumer variants.
  All 240 binding/composition tests and all 42 manifest entries pass locally.

## Remaining foundation work

Migrate other supported primitives, beginning with Collapsible. Add explicit
owned primitives for missing Alert, Badge, Button Group, Carousel, Card, Input
Group, and Spinner. Complete remaining compound subparts and reconcile visual
anatomy where the earlier static representations differ from React (for example,
Question options currently use checkbox/radio shapes while QuestionOption is
implemented with Button). Preserve current outer component identities.

Workflow's seven families remain paused until these foundations are complete.
The Button checkpoint does not complete the entire shadcn composition migration.

Automated validation: passed
Real scenario validation: passed
Blockers: none for this checkpoint
