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

describe("penpot component binding resolution", () => {
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
});
