// Load saved live Penpot metadata for deterministic CI checks.
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { auditLibrarySnapshot } from "./audit-snapshot.mjs";
import { readBindingManifest } from "./validate.mjs";

const manifest = readBindingManifest();
const snapshot = JSON.parse(
  readFileSync(
    new URL("../../penpot/fixtures/library-bindings.json", import.meta.url),
    "utf8"
  )
);

describe("live library binding snapshot", () => {
  it("matches the manifest for every family and every variant", () => {
    expect(auditLibrarySnapshot(manifest, snapshot)).toStrictEqual([]);
  });

  it("rejects the observed stale Audio Player pin on a non-root variant", () => {
    const candidate = structuredClone(snapshot);
    const audio = candidate.components.find(
      (item) => item.id === "ai.audio-player"
    );
    const variant = audio.variants.find(
      (item) =>
        // Select one exact variant; this does not conditionally run assertions.
        // oxlint-disable-next-line eslint-plugin-jest(no-conditional-in-test)
        item.variantProps.State === "Playing" &&
        item.variantProps.Theme === "Light"
    );
    const stale = structuredClone(audio.bindings[variant.bindingIndex]);
    stale.sourcePin.revision = "6a9d5b1822ffb10bba4bd97175f01edd7d8651cd";
    stale.sourcePin.sha256 =
      "375c174c83cf3770f1cf8b56a3e18584a773bce2141e451bfefc779d4901b5f3";
    variant.bindingIndex = audio.bindings.length;
    audio.bindings.push(stale);
    expect(auditLibrarySnapshot(manifest, candidate)).toContain(
      "ai.audio-player Playing|Light: source pin does not match the contract"
    );
  });

  it("rejects missing families and variants", () => {
    const candidate = structuredClone(snapshot);
    const removed = candidate.components.pop();
    candidate.components[0].variants.pop();
    const errors = auditLibrarySnapshot(manifest, candidate);
    expect(errors).toContain(`Missing snapshot component: ${removed.id}`);
    expect(
      errors.some((error) => error.endsWith(": missing variant"))
    ).toBeTruthy();
  });

  it("rejects incorrect identities, missing metadata, and incomplete axes", () => {
    const candidate = structuredClone(snapshot);
    candidate.fileId = "00000000-0000-0000-0000-000000000000";
    candidate.components[0].variants[0].componentId = "unknown";
    candidate.components[0].variants[0].bindingIndex = -1;
    delete candidate.components[0].variants[1].variantProps.Theme;
    const errors = auditLibrarySnapshot(manifest, candidate);
    expect(errors).toContain(
      `${candidate.components[0].id}: wrong library file`
    );
    expect(
      errors.some((error) =>
        error.endsWith(": component identity does not match the contract")
      )
    ).toBeTruthy();
    expect(
      errors.some((error) => error.endsWith(": missing binding record"))
    ).toBeTruthy();
    expect(errors).toContain(
      `${candidate.components[0].id}: variant properties do not match the contract`
    );
  });

  it("rejects duplicates, undeclared components, and changed exports", () => {
    const candidate = structuredClone(snapshot);
    candidate.components[0].variants.push(candidate.components[0].variants[0]);
    candidate.components[0].bindings[0].exports.pop();
    candidate.components.push({ bindings: [], id: "ai.unknown", variants: [] });
    const errors = auditLibrarySnapshot(manifest, candidate);
    expect(
      errors.some((error) => error.endsWith(": duplicate variant"))
    ).toBeTruthy();
    expect(
      errors.some((error) =>
        error.endsWith(": exports do not match the contract")
      )
    ).toBeTruthy();
    expect(errors).toContain("Unknown snapshot component: ai.unknown");
  });

  it("rejects a missing snapshot schema", () => {
    expect(auditLibrarySnapshot(manifest, {})).toStrictEqual([
      "Library snapshot must have schemaVersion 1 and a components array",
    ]);
  });

  it("rejects an undeclared variant even when its UUID is absent", () => {
    const candidate = structuredClone(snapshot);
    const audio = candidate.components.find(
      (item) => item.id === "ai.audio-player"
    );
    const variant = structuredClone(audio.variants[0]);
    variant.variantProps.State = "Undeclared";
    delete variant.componentId;
    audio.variants.push(variant);
    expect(auditLibrarySnapshot(manifest, candidate)).toContain(
      `ai.audio-player Undeclared|${variant.variantProps.Theme}: component identity does not match the contract`
    );
  });
});
