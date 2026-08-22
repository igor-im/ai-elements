// Node.js validation script - Node.js modules are valid here
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { execFileSync } from "node:child_process";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { createHash } from "node:crypto";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { readFileSync } from "node:fs";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { dirname, isAbsolute, join, normalize, relative } from "node:path";
// oxlint-disable-next-line eslint-plugin-import(no-nodejs-modules)
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = join(scriptDirectory, "..", "..");
const defaultManifestPath = join(
  defaultRepoRoot,
  "penpot",
  "component-bindings.json"
);

const REQUIRED_STATE_VALUES = ["Request", "Accepted", "Rejected"];
const REQUIRED_THEME_VALUES = ["Light", "Dark"];
const REQUIRED_HIDDEN_STATES = ["input-streaming", "input-available"];
const REQUIRED_VARIANT_KEYS = REQUIRED_THEME_VALUES.flatMap((theme) =>
  REQUIRED_STATE_VALUES.map((state) => `${state}|${theme}`)
);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const REVISION_PATTERN = /^[0-9a-f]{40}$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const defaultRunGit = (args, repoRoot) =>
  execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

const sortedKeys = (value) => Object.keys(value ?? {}).sort();

const hasExactKeys = (value, expected) =>
  JSON.stringify(sortedKeys(value)) === JSON.stringify(expected.toSorted());

const isPathInside = (repoRoot, filePath) => {
  const relativePath = relative(repoRoot, filePath);
  return (
    relativePath !== "" &&
    !relativePath.startsWith("..") &&
    !isAbsolute(relativePath)
  );
};

const sourceExports = (source) => {
  const exports = new Set();
  const exportPattern =
    /export\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(exportPattern)) {
    exports.add(match[1]);
  }
  return exports;
};

export const readBindingManifest = (manifestPath = defaultManifestPath) =>
  JSON.parse(readFileSync(manifestPath, "utf8"));

export const validateBindingManifest = (
  manifest,
  { repoRoot = defaultRepoRoot, runGit = defaultRunGit } = {}
) => {
  const errors = [];

  if (manifest?.schemaVersion !== 1) {
    errors.push("schemaVersion must equal 1");
  }

  if (
    !Array.isArray(manifest?.components) ||
    manifest.components.length === 0
  ) {
    errors.push("components must be a non-empty array");
    return errors;
  }

  const componentIds = new Set();

  for (const component of manifest.components) {
    const prefix = component?.id ? `${component.id}: ` : "component: ";

    if (typeof component?.id !== "string" || component.id.length === 0) {
      errors.push("component id must be a non-empty string");
    } else if (componentIds.has(component.id)) {
      errors.push(`${prefix}component id must be unique`);
    } else {
      componentIds.add(component.id);
    }

    const pin = component?.sourcePin;
    if (pin?.kind !== "git-commit+sha256") {
      errors.push(`${prefix}sourcePin.kind must equal git-commit+sha256`);
    }
    if (typeof pin?.repository !== "string" || pin.repository.length === 0) {
      errors.push(`${prefix}sourcePin.repository must be explicit`);
    }
    if (!REVISION_PATTERN.test(pin?.revision ?? "")) {
      errors.push(
        `${prefix}sourcePin.revision must be a 40-character lowercase Git commit`
      );
    }
    if (!SHA256_PATTERN.test(pin?.sha256 ?? "")) {
      errors.push(
        `${prefix}sourcePin.sha256 must be a lowercase SHA-256 digest`
      );
    }
    if (
      typeof pin?.file !== "string" ||
      pin.file.length === 0 ||
      isAbsolute(pin.file)
    ) {
      errors.push(
        `${prefix}sourcePin.file must be an explicit repository-relative path`
      );
    }

    if (REVISION_PATTERN.test(pin?.revision ?? "")) {
      try {
        runGit(["cat-file", "-e", `${pin.revision}^{commit}`], repoRoot);
      } catch {
        errors.push(
          `${prefix}sourcePin.revision is not present in this repository`
        );
      }

      try {
        runGit(["merge-base", "--is-ancestor", pin.revision, "HEAD"], repoRoot);
      } catch {
        errors.push(`${prefix}sourcePin.revision must be an ancestor of HEAD`);
      }
    }

    let source = "";
    if (
      typeof pin?.file === "string" &&
      pin.file.length > 0 &&
      !isAbsolute(pin.file)
    ) {
      const sourcePath = normalize(join(repoRoot, pin.file));
      if (isPathInside(repoRoot, sourcePath)) {
        try {
          source = readFileSync(sourcePath, "utf8");
          const actualSha256 = createHash("sha256")
            .update(source)
            .digest("hex");
          if (actualSha256 !== pin.sha256) {
            errors.push(
              `${prefix}source checksum does not match sourcePin.sha256`
            );
          }
        } catch {
          errors.push(`${prefix}sourcePin.file does not exist`);
        }
      } else {
        errors.push(`${prefix}sourcePin.file must stay inside the repository`);
      }
    }

    if (
      typeof component?.code?.module !== "string" ||
      component.code.module.length === 0
    ) {
      errors.push(`${prefix}code.module must be explicit`);
    }
    if (
      !Array.isArray(component?.code?.exports) ||
      component.code.exports.length === 0
    ) {
      errors.push(`${prefix}code.exports must be a non-empty array`);
    } else if (source) {
      const availableExports = sourceExports(source);
      for (const exportName of component.code.exports) {
        if (!availableExports.has(exportName)) {
          errors.push(`${prefix}source does not export ${exportName}`);
        }
      }
    }

    const design = component?.design;
    for (const field of [
      "teamId",
      "projectId",
      "fileId",
      "componentId",
      "variantContainerId",
    ]) {
      if (!UUID_PATTERN.test(design?.[field] ?? "")) {
        errors.push(`${prefix}design.${field} must be a Penpot UUID`);
      }
    }
    if (design?.provider !== "penpot") {
      errors.push(`${prefix}design.provider must equal penpot`);
    }
    if (design?.sharedPluginData?.namespace !== "ai-elements") {
      errors.push(`${prefix}shared plugin namespace must equal ai-elements`);
    }
    if (design?.sharedPluginData?.key !== "code-binding") {
      errors.push(`${prefix}shared plugin key must equal code-binding`);
    }
    if (design?.sharedPluginData?.contractVersion !== manifest.schemaVersion) {
      errors.push(`${prefix}binding contract version must match schemaVersion`);
    }
    if (hasExactKeys(design?.variantComponentIds, REQUIRED_VARIANT_KEYS)) {
      for (const variantComponentId of Object.values(
        design.variantComponentIds
      )) {
        if (!UUID_PATTERN.test(variantComponentId)) {
          errors.push(
            `${prefix}every variant component id must be a Penpot UUID`
          );
        }
      }
    } else {
      errors.push(
        `${prefix}variantComponentIds must cover every State and Theme combination`
      );
    }
    if (
      design?.componentId !== design?.variantComponentIds?.["Request|Light"]
    ) {
      errors.push(
        `${prefix}design.componentId must identify the Request|Light root variant`
      );
    }
    for (const field of ["fileId", "pageId", "galleryId"]) {
      if (!UUID_PATTERN.test(design?.consumerProof?.[field] ?? "")) {
        errors.push(
          `${prefix}design.consumerProof.${field} must be a Penpot UUID`
        );
      }
    }

    if (!hasExactKeys(component?.variants?.State, REQUIRED_STATE_VALUES)) {
      errors.push(
        `${prefix}State mappings must be exactly Request, Accepted, and Rejected`
      );
    }
    if (!hasExactKeys(component?.variants?.Theme, REQUIRED_THEME_VALUES)) {
      errors.push(`${prefix}Theme mappings must be exactly Light and Dark`);
    }
    for (const stateName of REQUIRED_STATE_VALUES) {
      const stateMapping = component?.variants?.State?.[stateName];
      if (
        typeof stateMapping?.state !== "string" ||
        stateMapping.state === ""
      ) {
        errors.push(`${prefix}State.${stateName}.state must be explicit`);
      }
      if (!["pending", true, false].includes(stateMapping?.approval)) {
        errors.push(
          `${prefix}State.${stateName}.approval must be pending, true, or false`
        );
      }
      if (
        typeof stateMapping?.contentExport !== "string" ||
        !component?.code?.exports?.includes(stateMapping.contentExport)
      ) {
        errors.push(
          `${prefix}State.${stateName}.contentExport must name a declared code export`
        );
      }
      if (typeof stateMapping?.showsActions !== "boolean") {
        errors.push(`${prefix}State.${stateName}.showsActions must be boolean`);
      }
    }
    for (const themeName of REQUIRED_THEME_VALUES) {
      const themeMapping = component?.variants?.Theme?.[themeName];
      if (themeMapping?.colorScheme !== themeName.toLowerCase()) {
        errors.push(
          `${prefix}Theme.${themeName}.colorScheme must equal ${themeName.toLowerCase()}`
        );
      }
    }
    if (
      !Array.isArray(component?.hiddenRuntimeStates) ||
      JSON.stringify(component.hiddenRuntimeStates.toSorted()) !==
        JSON.stringify(REQUIRED_HIDDEN_STATES.toSorted())
    ) {
      errors.push(
        `${prefix}hiddenRuntimeStates must be exactly input-streaming and input-available`
      );
    }
  }

  return errors;
};

export const validateDefaultManifest = () => {
  const manifest = readBindingManifest();
  return validateBindingManifest(manifest);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validateDefaultManifest();
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    const manifest = readBindingManifest();
    console.log(
      `Validated ${manifest.components.length} Penpot component binding.`
    );
  }
}
