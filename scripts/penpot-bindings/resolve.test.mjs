// Test fixture loading requires Node.js modules
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFile } from "node:fs/promises";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { resolvePenpotInstance, resolvePenpotSnapshot } from "./resolve.mjs";
import { readBindingManifest } from "./validate.mjs";

const manifest = readBindingManifest();
const snapshot = JSON.parse(
  await readFile(
    join(
      import.meta.dirname,
      "..",
      "..",
      "penpot",
      "fixtures",
      "confirmation-component-lab.json"
    ),
    "utf8"
  )
);
const codeSnapshot = JSON.parse(
  await readFile(
    join(
      import.meta.dirname,
      "..",
      "..",
      "penpot",
      "fixtures",
      "code-component-lab.json"
    ),
    "utf8"
  )
);

describe("penpot component binding resolution", () => {
  it("resolves every mapped Chatbot and Code variant without detached or guessed state", () => {
    const instances = manifest.components.flatMap((component) =>
      Object.entries(component.design.variantComponentIds).map(
        ([variantKey, componentId], index) => ({
          componentId,
          componentLibraryId: component.design.fileId,
          id: `${component.id}:${index}`,
          variantProps: Object.fromEntries(
            component.design.variantProperties.map(
              (property, propertyIndex) => [
                property,
                variantKey.split("|")[propertyIndex],
              ]
            )
          ),
          variantSetId: component.design.variantContainerId,
        })
      )
    );

    const resolved = resolvePenpotSnapshot(manifest, { instances });

    expect(resolved).toHaveLength(180);
    expect(new Set(resolved.map(({ canonicalId }) => canonicalId))).toEqual(
      new Set(manifest.components.map(({ id }) => id))
    );
  });

  it("resolves every linked component-lab instance", () => {
    const resolved = resolvePenpotSnapshot(manifest, snapshot);

    expect(resolved).toHaveLength(6);
    expect(resolved.map((item) => item.canonicalId)).toStrictEqual(
      Array.from({ length: 6 }, () => "ai.confirmation")
    );
    expect(resolved[0].render).toStrictEqual({
      approval: "pending",
      colorScheme: "light",
      contentExport: "ConfirmationRequest",
      showsActions: true,
      state: "approval-requested",
    });
    expect(resolved[5].render).toStrictEqual({
      approval: false,
      colorScheme: "dark",
      contentExport: "ConfirmationRejected",
      showsActions: false,
      state: "output-denied",
    });
  });

  it("resolves all 98 linked Code component-lab instances", () => {
    const resolved = resolvePenpotSnapshot(manifest, codeSnapshot);

    expect(resolved).toHaveLength(98);
    expect(new Set(resolved.map(({ canonicalId }) => canonicalId))).toEqual(
      new Set([
        "ai.agent",
        "ai.artifact",
        "ai.code-block",
        "ai.commit",
        "ai.environment-variables",
        "ai.file-tree",
        "ai.jsx-preview",
        "ai.package-info",
        "ai.sandbox",
        "ai.schema-display",
        "ai.snippet",
        "ai.stack-trace",
        "ai.terminal",
        "ai.test-results",
        "ai.web-preview",
      ])
    );
  });

  it("rejects an unknown component id", () => {
    const instance = structuredClone(snapshot.instances[0]);
    instance.componentId = "00000000-0000-0000-0000-000000000000";

    expect(() => resolvePenpotInstance(manifest, instance)).toThrow(
      `Unmapped Penpot component instance: ${instance.id}`
    );
  });

  it("rejects missing variant values", () => {
    const instance = structuredClone(snapshot.instances[0]);
    delete instance.variantProps.Theme;

    expect(() => resolvePenpotInstance(manifest, instance)).toThrow(
      `Unmapped Penpot component instance: ${instance.id}`
    );
  });

  it("resolves component-specific axes without guessing", () => {
    const candidateManifest = structuredClone(manifest);
    const component = candidateManifest.components[0];
    component.design.variantProperties = ["Variant", "Theme"];
    component.design.rootVariant = "Grid|Dark";
    component.design.componentId = "00000000-0000-0000-0000-000000000002";
    component.design.variantComponentIds = {
      "Grid|Light": "00000000-0000-0000-0000-000000000001",
      "Grid|Dark": "00000000-0000-0000-0000-000000000002",
    };
    component.variants = {
      Variant: {
        Grid: { sampleData: "four mixed attachments", variant: "grid" },
      },
      Theme: {
        Light: { colorScheme: "light" },
        Dark: { colorScheme: "dark" },
      },
    };
    component.hiddenRuntimeStates = [];

    const resolved = resolvePenpotInstance(candidateManifest, {
      componentId: component.design.componentId,
      componentLibraryId: component.design.fileId,
      id: "00000000-0000-0000-0000-000000000010",
      variantProps: { Theme: "Dark", Variant: "Grid" },
      variantSetId: component.design.variantContainerId,
    });

    expect(resolved.render).toStrictEqual({
      colorScheme: "dark",
      sampleData: "four mixed attachments",
      variant: "grid",
    });
  });
});
