import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  checkAllContracts,
  inspectSource,
  validateAxisCssSelectors,
  validateContractAgainstRepository,
  validateContractShape,
  validatePackageDelivery,
} from "../check-component-contracts.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const button = JSON.parse(
  readFileSync(resolve(root, "contracts/components/button.json"), "utf8"),
);
const buttonSource = readFileSync(
  resolve(root, "packages/react/src/button.tsx"),
  "utf8",
);
const separator = JSON.parse(
  readFileSync(resolve(root, "contracts/components/separator.json"), "utf8"),
);
const separatorSource = readFileSync(
  resolve(root, "packages/react/src/separator.tsx"),
  "utf8",
);

function changed(edit) {
  const contract = structuredClone(button);
  edit(contract);
  return contract;
}

test("the published Button and Separator contracts match their source and Registry", () => {
  assert.equal(checkAllContracts(), 2);
});

test("unknown contract fields and duplicate slots fail validation", () => {
  assert.throws(
    () =>
      validateContractShape(
        changed((contract) => {
          contract.unreviewed = true;
        }),
      ),
    /Component contract must have exactly/u,
  );
  assert.throws(
    () =>
      validateContractShape(
        changed((contract) => {
          contract.slots.push("button-label");
        }),
      ),
    /slots contains duplicates/u,
  );
});

test("the root slot and Storybook inventory match their actual source", () => {
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.rootSlot = "button-label";
        }),
      ),
    /root slot mismatch/u,
  );
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.storybook.stories.pop();
        }),
      ),
    /Storybook stories mismatch/u,
  );
});

test("unknown axes and missing defaults fail validation", () => {
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.axes.push({
            prop: "tone",
            type: "ButtonTone",
            attribute: "data-tone",
            values: ["quiet"],
            default: "quiet",
            cssSelectorValues: ["quiet"],
          });
        }),
      ),
    /public axes mismatch/u,
  );
  assert.throws(
    () =>
      validateContractShape(
        changed((contract) => {
          delete contract.axes[0].default;
        }),
      ),
    /axes\[0\] must have exactly/u,
  );
});

test("undeclared semantic tokens and missing Registry delivery fail validation", () => {
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.tokens.push("--ui-missing");
        }),
      ),
    /semantic tokens mismatch/u,
  );
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.registry.sourcePath = "registry/default/missing.tsx";
        }),
      ),
    /Registry delivery differs/u,
  );
});

test("CSS states must be recorded in the contract", () => {
  assert.throws(
    () =>
      validateContractAgainstRepository(
        changed((contract) => {
          contract.states = contract.states.filter(
            (state) => state !== "data-hovered",
          );
        }),
      ),
    /CSS data attributes mismatch/u,
  );
});

test("default CSS selectors must match the contract", () => {
  const css = readFileSync(
    resolve(root, "packages/styles/components/separator.css"),
    "utf8",
  );
  const changedCss = css.replace(
    '.ui-separator[data-orientation="horizontal"]',
    ".ui-separator",
  );
  assert.notEqual(changedCss, css);
  assert.throws(
    () => validateAxisCssSelectors(separator, changedCss),
    /separator.orientation CSS selectors mismatch/u,
  );
});

test("package and style exports must point to the component's files", () => {
  const reactPackage = JSON.parse(
    readFileSync(resolve(root, "packages/react/package.json"), "utf8"),
  );
  const stylesPackage = JSON.parse(
    readFileSync(resolve(root, "packages/styles/package.json"), "utf8"),
  );
  const stylesIndex = readFileSync(
    resolve(root, "packages/styles/index.css"),
    "utf8",
  );
  const redirectedReact = structuredClone(reactPackage);
  redirectedReact.exports["./button"].import = "./dist/separator.js";
  assert.throws(
    () =>
      validatePackageDelivery(
        button,
        redirectedReact,
        stylesPackage,
        stylesIndex,
      ),
    /button package entry differs/u,
  );
  const redirectedStyles = structuredClone(stylesPackage);
  redirectedStyles.exports["./components/button.css"] =
    "./components/separator.css";
  assert.throws(
    () =>
      validatePackageDelivery(
        button,
        reactPackage,
        redirectedStyles,
        stylesIndex,
      ),
    /button style delivery differs/u,
  );
});

test("root slots require a statically rendered marker", () => {
  const buttonWithoutRoot = buttonSource.replace(
    '"data-ui-root": "",',
    '"data-ui-root": undefined,',
  );
  assert.notEqual(buttonWithoutRoot, buttonSource);
  assert.deepEqual(
    inspectSource(buttonWithoutRoot, "packages/react/src/button.tsx", "Button")
      .rootSlots,
    [],
  );

  const separatorWithoutRoot = separatorSource.replace(
    'data-ui-root=""',
    "data-ui-root={undefined}",
  );
  assert.notEqual(separatorWithoutRoot, separatorSource);
  assert.deepEqual(
    inspectSource(
      separatorWithoutRoot,
      "packages/react/src/separator.tsx",
      "Separator",
    ).rootSlots,
    [],
  );
});

test("attribute inspection distinguishes direct axes from transformed expressions", () => {
  const transformedAxis = buttonSource.replace(
    '"data-variant": variant,',
    '"data-variant": variant && "default",',
  );
  assert.notEqual(transformedAxis, buttonSource);
  const inspected = inspectSource(
    transformedAxis,
    "packages/react/src/button.tsx",
    "Button",
  );
  assert.notEqual(
    inspected.attributes.get("data-variant")?.identifier,
    "variant",
  );

  const transformedBoolean = buttonSource.replace(
    '"data-full-width": fullWidth || undefined,',
    '"data-full-width": fullWidth ?? undefined,',
  );
  assert.notEqual(transformedBoolean, buttonSource);
  const booleanInspection = inspectSource(
    transformedBoolean,
    "packages/react/src/button.tsx",
    "Button",
  );
  assert.notEqual(
    booleanInspection.attributes.get("data-full-width")?.booleanIdentifier,
    "fullWidth",
  );
});
