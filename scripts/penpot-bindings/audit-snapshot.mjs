// Snapshot comparison runs in Node.js, alongside the binding validator.
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { isDeepStrictEqual } from "node:util";

export const auditLibrarySnapshot = (manifest, snapshot) => {
  const errors = [];
  if (snapshot?.schemaVersion !== 1 || !Array.isArray(snapshot.components)) {
    return [
      "Library snapshot must have schemaVersion 1 and a components array",
    ];
  }
  const expected = new Map(manifest.components.map((item) => [item.id, item]));
  const seen = new Set();
  for (const component of snapshot.components) {
    const contract = expected.get(component.id);
    if (!contract) {
      errors.push(`Unknown snapshot component: ${component.id}`);
      continue;
    }
    if (seen.has(component.id)) {
      errors.push(`Duplicate snapshot component: ${component.id}`);
    }
    seen.add(component.id);
    if (snapshot.fileId !== contract.design.fileId) {
      errors.push(`${component.id}: wrong library file`);
    }
    if (
      !Array.isArray(component.variants) ||
      !Array.isArray(component.bindings)
    ) {
      errors.push(`${component.id}: variants and bindings must be arrays`);
      continue;
    }
    const seenVariants = new Set();
    for (const variant of component.variants) {
      const props = variant.variantProps;
      if (
        !props ||
        !isDeepStrictEqual(
          Object.keys(props).toSorted(),
          [...contract.design.variantProperties].toSorted()
        )
      ) {
        errors.push(
          `${component.id}: variant properties do not match the contract`
        );
        continue;
      }
      const key = contract.design.variantProperties
        .map((prop) => props[prop])
        .join("|");
      const prefix = `${component.id} ${key}`;
      if (seenVariants.has(key)) {
        errors.push(`${prefix}: duplicate variant`);
      }
      seenVariants.add(key);
      if (
        !Object.hasOwn(contract.design.variantComponentIds, key) ||
        contract.design.variantComponentIds[key] !== variant.componentId
      ) {
        errors.push(
          `${prefix}: component identity does not match the contract`
        );
      }
      if (
        !Number.isInteger(variant.bindingIndex) ||
        variant.bindingIndex < 0 ||
        variant.bindingIndex >= component.bindings.length
      ) {
        errors.push(`${prefix}: missing binding record`);
        continue;
      }
      const binding = component.bindings[variant.bindingIndex];
      if (
        !binding ||
        binding.id !== component.id ||
        binding.framework !== "react" ||
        binding.module !== contract.code.module ||
        binding.contractVersion !==
          contract.design.sharedPluginData.contractVersion
      ) {
        errors.push(`${prefix}: binding identity does not match the contract`);
      }
      if (!isDeepStrictEqual(binding?.sourcePin, contract.sourcePin)) {
        errors.push(`${prefix}: source pin does not match the contract`);
      }
      if (
        !Array.isArray(binding?.exports) ||
        !isDeepStrictEqual(
          [...binding.exports].toSorted(),
          [...contract.code.exports].toSorted()
        )
      ) {
        errors.push(`${prefix}: exports do not match the contract`);
      }
    }
    for (const key of Object.keys(contract.design.variantComponentIds)) {
      if (!seenVariants.has(key)) {
        errors.push(`${component.id} ${key}: missing variant`);
      }
    }
  }
  for (const id of expected.keys()) {
    if (!seen.has(id)) {
      errors.push(`Missing snapshot component: ${id}`);
    }
  }
  return errors;
};
