// Compare independently exported library and consumer composition evidence.
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { isDeepStrictEqual } from "node:util";

const inventory = (primitives) =>
  primitives
    .map(({ name, componentId }) => `${name}|${componentId}`)
    .toSorted();

export const auditPrimitiveComposition = (
  manifest,
  contract,
  library,
  consumer
) => {
  const errors = [];
  if (
    contract.schemaVersion !== 1 ||
    library.schemaVersion !== 1 ||
    consumer.schemaVersion !== 1
  ) {
    return ["Unsupported primitive snapshot schema"];
  }
  if (
    library.fileId !== contract.fileId ||
    library.vendorFileId !== contract.vendorFileId
  ) {
    errors.push("Wrong primitive library identity");
  }
  const declared = new Map(
    manifest.components.flatMap((family) =>
      Object.values(family.design.variantComponentIds).map((id) => [id, family])
    )
  );
  const variants = new Map();
  for (const family of library.families) {
    for (const variant of family.variants) {
      if (variants.has(variant.componentId)) {
        errors.push(`Duplicate library variant: ${variant.componentId}`);
      }
      if (declared.get(variant.componentId)?.id !== family.id) {
        errors.push(`Unknown library variant: ${variant.componentId}`);
      }
      variants.set(variant.componentId, variant);
    }
  }
  const instances = new Map();
  for (const instance of consumer.instances) {
    const family = declared.get(instance.componentId);
    if (!family || instance.libraryId !== contract.fileId || !instance.isCopy) {
      errors.push(`Unlinked consumer instance: ${instance.shapeId}`);
      continue;
    }
    if (consumer.fileId !== family.design.consumerProof.fileId) {
      errors.push("Wrong consumer file");
    }
    if (instances.has(instance.componentId)) {
      errors.push(`Duplicate consumer variant: ${instance.componentId}`);
    }
    instances.set(instance.componentId, instance);
    const source = variants.get(instance.componentId);
    if (
      !source ||
      !isDeepStrictEqual(
        inventory(source.primitives),
        inventory(instance.primitives)
      )
    ) {
      errors.push(`Consumer primitive drift: ${instance.componentId}`);
    }
    if (
      source &&
      !isDeepStrictEqual(source.variantProps, instance.variantProps)
    ) {
      errors.push(`Consumer variant drift: ${instance.componentId}`);
    }
    for (const primitive of instance.primitives) {
      if (!primitive.isCopy || primitive.libraryId !== contract.vendorFileId) {
        errors.push(
          `Detached consumer primitive: ${instance.componentId} ${primitive.name}`
        );
      }
    }
  }
  for (const id of declared.keys()) {
    if (!variants.has(id)) {
      errors.push(`Missing library variant: ${id}`);
    }
    if (!instances.has(id)) {
      errors.push(`Missing consumer variant: ${id}`);
    }
  }
  for (const expected of contract.variants) {
    if (declared.get(expected.componentId)?.id !== expected.family) {
      errors.push(
        `Unknown primitive contract variant: ${expected.componentId}`
      );
    }
    const actual = variants.get(expected.componentId);
    if (
      !actual ||
      !isDeepStrictEqual(
        inventory(expected.buttons),
        inventory(actual.primitives)
      )
    ) {
      errors.push(`Library primitive drift: ${expected.componentId}`);
      continue;
    }
    for (const primitive of actual.primitives) {
      if (!primitive.isCopy || primitive.libraryId !== contract.vendorFileId) {
        errors.push(`Detached library primitive: ${primitive.shapeId}`);
      }
    }
  }
  if (consumer.validationErrors.length !== 0) {
    errors.push("Consumer file validation failed");
  }
  return errors;
};
