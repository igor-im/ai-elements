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

const rejectAncestorCheck = (args) => {
  if (args[0] === "merge-base") {
    throw new Error("not an ancestor");
  }
  return "";
};

describe("penpot component binding validation", () => {
  it("accepts the checked-in Confirmation binding", () => {
    expect(
      validateBindingManifest(cloneManifest(), { repoRoot })
    ).toStrictEqual([]);
  });

  it("rejects source checksum drift", () => {
    const candidate = cloneManifest();
    candidate.components[0].sourcePin.sha256 = "0".repeat(64);

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: source checksum does not match sourcePin.sha256"
    );
  });

  it("rejects incomplete state mappings", () => {
    const candidate = cloneManifest();
    delete candidate.components[0].variants.State.Rejected;

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: State mappings must be exactly Request, Accepted, and Rejected"
    );
  });

  it("rejects exports that are absent from the pinned source", () => {
    const candidate = cloneManifest();
    candidate.components[0].code.exports.push("MissingConfirmationExport");

    expect(validateBindingManifest(candidate, { repoRoot })).toContain(
      "ai.confirmation: source does not export MissingConfirmationExport"
    );
  });

  it("rejects incomplete runtime mappings", () => {
    const candidate = cloneManifest();
    candidate.components[0].variants.State.Accepted.contentExport =
      "MissingConfirmationExport";
    candidate.components[0].variants.Theme.Dark.colorScheme = "light";

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
});
