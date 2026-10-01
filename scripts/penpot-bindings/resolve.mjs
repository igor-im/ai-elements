// Node.js resolver script - Node.js modules are valid here
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFileSync } from "node:fs";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { fileURLToPath } from "node:url";

import { readBindingManifest, validateBindingManifest } from "./validate.mjs";

const variantKey = (component, variantProps) =>
  component.design.variantProperties
    .map((property) => variantProps?.[property] ?? "")
    .join("|");

const findBinding = (manifest, instance) =>
  manifest.components.find((component) => {
    const expectedComponentId =
      component.design.variantComponentIds?.[
        variantKey(component, instance.variantProps)
      ];
    return (
      component.design.fileId === instance.componentLibraryId &&
      component.design.variantContainerId === instance.variantSetId &&
      expectedComponentId === instance.componentId
    );
  });

export const resolvePenpotInstance = (manifest, instance) => {
  const binding = findBinding(manifest, instance);
  if (!binding) {
    throw new Error(`Unmapped Penpot component instance: ${instance.id}`);
  }

  const render = {};
  for (const property of binding.design.variantProperties) {
    const value = instance.variantProps?.[property];
    const mapping = binding.variants[property]?.[value];
    if (!mapping) {
      throw new Error(`Unmapped Penpot variant values: ${instance.id}`);
    }
    Object.assign(render, mapping);
  }

  return {
    canonicalId: binding.id,
    import: {
      exports: binding.code.exports,
      module: binding.code.module,
    },
    instanceId: instance.id,
    render,
    sourcePin: binding.sourcePin,
  };
};

export const resolvePenpotSnapshot = (manifest, snapshot) => {
  if (!Array.isArray(snapshot?.instances)) {
    throw new TypeError("Penpot snapshot must contain an instances array");
  }
  return snapshot.instances.map((instance) =>
    resolvePenpotInstance(manifest, instance)
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const snapshotPath = process.argv.at(2);
  if (!snapshotPath) {
    throw new Error("Usage: pnpm penpot:bindings:resolve <snapshot.json>");
  }

  const manifest = readBindingManifest();
  const manifestErrors = validateBindingManifest(manifest);
  if (manifestErrors.length > 0) {
    throw new Error(manifestErrors.join("\n"));
  }

  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
  console.log(
    JSON.stringify(resolvePenpotSnapshot(manifest, snapshot), null, 2)
  );
}
