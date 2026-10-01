// Test fixture path resolution requires the Node.js path module
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { dirname, join } from "node:path";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { readBindingManifest, validateBindingManifest } from "./validate.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifest = readBindingManifest();

const cloneManifest = () => structuredClone(manifest);
const confirmationBinding = (candidate) =>
  candidate.components.find(({ id }) => id === "ai.confirmation");

const rejectAncestorCheck = (args) => {
  if (args[0] === "merge-base") {
    throw new Error("not an ancestor");
  }
  return "";
};

describe("penpot component binding validation", () => {
  it("inventories the complete Chatbot, Code, Voice, and Utilities sections", () => {
    expect(manifest.components).toHaveLength(42);
    expect(manifest.components.map(({ id }) => id).toSorted()).toStrictEqual([
      "ai.agent",
      "ai.artifact",
      "ai.attachments",
      "ai.audio-player",
      "ai.chain-of-thought",
      "ai.checkpoint",
      "ai.code-block",
      "ai.commit",
      "ai.confirmation",
      "ai.context",
      "ai.conversation",
      "ai.environment-variables",
      "ai.file-tree",
      "ai.image",
      "ai.inline-citation",
      "ai.jsx-preview",
      "ai.message",
      "ai.mic-selector",
      "ai.model-selector",
      "ai.open-in-chat",
      "ai.package-info",
      "ai.persona",
      "ai.plan",
      "ai.prompt-input",
      "ai.question",
      "ai.queue",
      "ai.reasoning",
      "ai.sandbox",
      "ai.schema-display",
      "ai.shimmer",
      "ai.snippet",
      "ai.sources",
      "ai.speech-input",
      "ai.stack-trace",
      "ai.suggestion",
      "ai.task",
      "ai.terminal",
      "ai.test-results",
      "ai.tool",
      "ai.transcription",
      "ai.voice-selector",
      "ai.web-preview",
    ]);
  });

  it("accepts the checked-in Confirmation binding", () => {
    expect(
      validateBindingManifest(cloneManifest(), { repoRoot })
    ).toStrictEqual([]);
  });

  it("rejects source checksum drift", () => {
    const candidate = cloneManifest();
    confirmationBinding(candidate).sourcePin.sha256 = "0".repeat(64);

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: source checksum does not match sourcePin.sha256"
    );
  });

  it("rejects incomplete state mappings", () => {
    const candidate = cloneManifest();
    delete confirmationBinding(candidate).variants.State.Rejected;

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: variantComponentIds must exhaust State × Theme"
    );
  });

  it("rejects exports that are absent from the pinned source", () => {
    const candidate = cloneManifest();
    confirmationBinding(candidate).code.exports.push(
      "MissingConfirmationExport"
    );

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: source does not export MissingConfirmationExport"
    );
  });

  it("rejects incomplete runtime mappings", () => {
    const candidate = cloneManifest();
    confirmationBinding(candidate).variants.State.Accepted.contentExport =
      "MissingConfirmationExport";
    confirmationBinding(candidate).variants.Theme.Dark.colorScheme = "light";

    const errors = validateBindingManifest(candidate, { repoRoot });
    expect(errors).toContain(
      "ai.confirmation: State.Accepted.contentExport must name a declared code export"
    );
    expect(errors).toContain(
      "ai.confirmation: Theme.Dark.colorScheme must equal dark"
    );
  });

  it("rejects a source revision that is not an ancestor of HEAD", () => {
    const candidate = cloneManifest();

    expect(
      validateBindingManifest(candidate, {
        repoRoot,
        runGit: rejectAncestorCheck,
      })
    ).toContain(
      "ai.confirmation: sourcePin.revision must be an ancestor of HEAD"
    );
  });

  it("accepts explicit component-specific variant axes", () => {
    const candidate = cloneManifest();
    const component = confirmationBinding(candidate);
    component.design.variantProperties = ["Variant", "Theme"];
    component.design.rootVariant = "Grid|Light";
    component.design.variantComponentIds = {
      "Grid|Light": "00000000-0000-0000-0000-000000000001",
      "Grid|Dark": "00000000-0000-0000-0000-000000000002",
      "List|Light": "00000000-0000-0000-0000-000000000003",
      "List|Dark": "00000000-0000-0000-0000-000000000004",
    };
    component.design.componentId =
      component.design.variantComponentIds[component.design.rootVariant];
    component.variants = {
      Variant: {
        Grid: { variant: "grid" },
        List: { variant: "list" },
      },
      Theme: {
        Light: { colorScheme: "light" },
        Dark: { colorScheme: "dark" },
      },
    };
    component.hiddenRuntimeStates = [];

    expect(validateBindingManifest(candidate, { repoRoot })).toStrictEqual([]);
  });

  it("rejects a missing component-specific variant combination", () => {
    const candidate = cloneManifest();
    const component = confirmationBinding(candidate);
    component.design.variantProperties = ["State", "Theme"];
    component.design.rootVariant = "Request|Light";
    delete component.design.variantComponentIds["Rejected|Dark"];

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: variantComponentIds must exhaust State × Theme"
    );
  });

  it("rejects incomplete public export inventories", () => {
    const candidate = cloneManifest();
    const component = confirmationBinding(candidate);
    component.code.typeExports = [
      "ConfirmationProps",
      "ConfirmationTitleProps",
      "ConfirmationRequestProps",
      "ConfirmationAcceptedProps",
      "ConfirmationRejectedProps",
      "ConfirmationActionsProps",
    ];

    const errors = validateBindingManifest(candidate, { repoRoot });
    expect(errors).toContain(
      "ai.confirmation: code.typeExports must inventory every public type export"
    );
  });

  it("rejects missing documentation and example source paths", () => {
    const candidate = cloneManifest();
    confirmationBinding(candidate).documentation = {
      examples: ["packages/examples/src/missing-confirmation.tsx"],
      page: "apps/docs/content/components/(chatbot)/missing-confirmation.mdx",
    };

    const errors = validateBindingManifest(candidate, { repoRoot });
    expect(errors).toContain(
      "ai.confirmation: documentation.page does not exist"
    );
    expect(errors).toContain(
      "ai.confirmation: documentation example does not exist: packages/examples/src/missing-confirmation.tsx"
    );
  });

  it("rejects an invalid visual reference export", () => {
    const candidate = cloneManifest();
    confirmationBinding(candidate).design.referenceExport = {
      format: "svg",
      shapeId: "missing",
    };

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: design.referenceExport must name a Penpot UUID and png format"
    );
  });
});
