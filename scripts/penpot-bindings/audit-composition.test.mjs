// Load independently captured Penpot evidence without network dependencies.
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { auditPrimitiveComposition } from "./audit-composition.mjs";
import { readBindingManifest } from "./validate.mjs";

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../../penpot/${name}`, import.meta.url), "utf8")
  );
const manifest = readBindingManifest();
const contract = read("primitive-contract.json");
const library = read("fixtures/primitive-composition.json");
const consumer = read("fixtures/consumer-primitive-composition.json");

describe("linked primitive composition", () => {
  it("keeps all 286 consumer variants and their 252 nested vendor instances linked", () => {
    expect(
      auditPrimitiveComposition(manifest, contract, library, consumer)
    ).toStrictEqual([]);
    expect(consumer.instances).toHaveLength(286);
    expect(
      consumer.instances.flatMap((instance) => instance.primitives)
    ).toHaveLength(252);
  });

  it("rejects the original all-native composition even if both snapshots agree", () => {
    const nativeLibrary = structuredClone(library);
    const nativeConsumer = structuredClone(consumer);
    for (const family of nativeLibrary.families) {
      for (const variant of family.variants) {
        variant.primitives = [];
      }
    }
    for (const instance of nativeConsumer.instances) {
      instance.primitives = [];
    }
    expect(
      auditPrimitiveComposition(
        manifest,
        contract,
        nativeLibrary,
        nativeConsumer
      )
    ).toContain(`Library primitive drift: ${contract.variants[0].componentId}`);
  });

  it("rejects consumer files that have not applied the library update", () => {
    const candidate = structuredClone(consumer);
    const instance = candidate.instances.find(
      (item) => item.primitives.length > 0
    );
    instance.primitives.pop();
    expect(
      auditPrimitiveComposition(manifest, contract, library, candidate)
    ).toContain(`Consumer primitive drift: ${instance.componentId}`);
  });

  it("rejects detached or foreign primitive copies", () => {
    const source = structuredClone(library);
    const candidate = structuredClone(consumer);
    const variant = source.families
      .flatMap((family) => family.variants)
      .find((item) => item.primitives.length > 0);
    const instance = candidate.instances.find(
      (item) => item.primitives.length > 0
    );
    variant.primitives[0].isCopy = false;
    instance.primitives[0].libraryId = "foreign";
    const errors = auditPrimitiveComposition(
      manifest,
      contract,
      source,
      candidate
    );
    expect(errors).toContain(
      `Detached library primitive: ${variant.primitives[0].shapeId}`
    );
    expect(errors).toContain(
      `Detached consumer primitive: ${instance.componentId} ${instance.primitives[0].name}`
    );
  });

  it("rejects missing consumer proof variants", () => {
    const candidate = structuredClone(consumer);
    const removed = candidate.instances.pop();
    expect(
      auditPrimitiveComposition(manifest, contract, library, candidate)
    ).toContain(`Missing consumer variant: ${removed.componentId}`);
  });
});

const baselines = [
  ...read("fixtures/button-migration-baseline.json"),
  ...read("fixtures/icon-button-migration-baseline.json"),
];
const findMigrated = (before) =>
  library.families
    .find((family) => family.id === before.family)
    .variants.find((variant) => variant.componentId === before.outerComponentId)
    .primitives.find(
      (primitive) =>
        primitive.name === before.shape.name &&
        Math.abs(primitive.shape.x - before.shape.x) < 0.001 &&
        Math.abs(primitive.shape.y - before.shape.y) < 0.001
    );

describe("preserved button appearance", () => {
  it.each(baselines)(
    "preserves $family $shape.name geometry and paint",
    (before) => {
      const actual = findMigrated(before);
      expect(actual).toBeDefined();
      expect(actual.shape.width).toBeCloseTo(before.shape.width, 6);
      expect(actual.shape.height).toBeCloseTo(before.shape.height, 6);
      expect(actual.shape.fills).toStrictEqual(before.shape.fills);
      expect(actual.shape.strokes).toStrictEqual(before.shape.strokes);
    }
  );

  it.each(baselines.filter((before) => before.label !== null))(
    "preserves $family $shape.name label and typography",
    (before) => {
      const actual = findMigrated(before).texts.find(
        (label) => label.characters === before.label.characters
      );
      expect(actual).toBeDefined();
      expect(actual.hidden).toBeFalsy();
      expect(actual.x).toBeCloseTo(before.label.x, 6);
      expect(actual.y).toBeCloseTo(before.label.y, 6);
      expect(actual).toMatchObject({
        fills: before.label.fills,
        fontFamily: before.label.fontFamily,
        fontSize: before.label.fontSize,
        fontWeight: before.label.fontWeight,
      });
    }
  );
});
