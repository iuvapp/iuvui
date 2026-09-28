import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractDirectory = join(root, "contracts/components");

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function exactKeys(value, keys, label) {
  requireCondition(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).sort().join(",") === [...keys].sort().join(","),
    `${label} must have exactly: ${keys.join(", ")}`,
  );
}

function string(value, label, pattern = /\S/u) {
  requireCondition(
    typeof value === "string" && pattern.test(value),
    `${label} is invalid`,
  );
}

function uniqueStrings(value, label, pattern = /\S/u, allowEmpty = false) {
  requireCondition(
    Array.isArray(value) && (allowEmpty || value.length > 0),
    `${label} must be ${allowEmpty ? "an" : "a nonempty"} array`,
  );
  value.forEach((entry, index) => string(entry, `${label}[${index}]`, pattern));
  requireCondition(
    new Set(value).size === value.length,
    `${label} contains duplicates`,
  );
}

function repositoryPath(value, label) {
  string(value, label, /^[A-Za-z0-9][A-Za-z0-9/.-]*\.[a-z]+$/u);
  requireCondition(
    !value.split("/").includes(".."),
    `${label} must stay inside the repository`,
  );
}

function sameSet(actual, expected, label) {
  requireCondition(
    [...actual].sort().join("\0") === [...expected].sort().join("\0"),
    `${label} mismatch: expected [${[...expected].sort().join(", ")}], found [${[...actual].sort().join(", ")}]`,
  );
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

export function validateContractShape(contract) {
  exactKeys(
    contract,
    [
      "schemaVersion",
      "name",
      "exportName",
      "packageEntry",
      "sourcePath",
      "stylePath",
      "rootSlot",
      "slots",
      "axes",
      "booleanProps",
      "states",
      "tokens",
      "storybook",
      "registry",
    ],
    "Component contract",
  );
  requireCondition(
    contract.schemaVersion === 1,
    "Unsupported component contract version",
  );
  string(contract.name, "name", /^[a-z]+(?:-[a-z]+)*$/u);
  string(contract.exportName, "exportName", /^[A-Z][A-Za-z]+$/u);
  requireCondition(
    contract.packageEntry === `@iuvui/react/${contract.name}`,
    "packageEntry must identify the component subpath",
  );
  repositoryPath(contract.sourcePath, "sourcePath");
  repositoryPath(contract.stylePath, "stylePath");
  string(contract.rootSlot, "rootSlot", /^[a-z]+(?:-[a-z]+)*$/u);
  uniqueStrings(contract.slots, "slots", /^[a-z]+(?:-[a-z]+)*$/u);
  requireCondition(
    contract.slots.includes(contract.rootSlot),
    "rootSlot is missing from slots",
  );

  requireCondition(Array.isArray(contract.axes), "axes must be an array");
  for (const [index, axis] of contract.axes.entries()) {
    exactKeys(
      axis,
      ["prop", "type", "attribute", "values", "default", "cssSelectorValues"],
      `axes[${index}]`,
    );
    string(axis.prop, `axes[${index}].prop`, /^[a-z][A-Za-z]*$/u);
    string(axis.type, `axes[${index}].type`, /^[A-Z][A-Za-z]*$/u);
    string(axis.attribute, `axes[${index}].attribute`, /^data-[a-z-]+$/u);
    uniqueStrings(axis.values, `axes[${index}].values`, /^[a-z][a-z-]*$/u);
    uniqueStrings(
      axis.cssSelectorValues,
      `axes[${index}].cssSelectorValues`,
      /^[a-z][a-z-]*$/u,
      true,
    );
    requireCondition(
      axis.values.includes(axis.default),
      `axes[${index}] has no valid default`,
    );
    requireCondition(
      axis.cssSelectorValues.every((value) => axis.values.includes(value)) &&
        axis.values
          .filter((value) => value !== axis.default)
          .every((value) => axis.cssSelectorValues.includes(value)),
      `axes[${index}].cssSelectorValues must cover valid non-default values`,
    );
  }
  uniqueStrings(
    contract.axes.map((axis) => axis.prop),
    "axis props",
    /^[a-z][A-Za-z]*$/u,
    true,
  );
  uniqueStrings(
    contract.axes.map((axis) => axis.attribute),
    "axis attributes",
    /^data-[a-z-]+$/u,
    true,
  );

  requireCondition(
    Array.isArray(contract.booleanProps),
    "booleanProps must be an array",
  );
  for (const [index, flag] of contract.booleanProps.entries()) {
    exactKeys(
      flag,
      ["prop", "attribute", "emittedBy", "default"],
      `booleanProps[${index}]`,
    );
    string(flag.prop, `booleanProps[${index}].prop`, /^[a-z][A-Za-z]*$/u);
    string(
      flag.attribute,
      `booleanProps[${index}].attribute`,
      /^data-[a-z-]+$/u,
    );
    requireCondition(
      ["component", "primitive"].includes(flag.emittedBy),
      `booleanProps[${index}].emittedBy is invalid`,
    );
    requireCondition(
      typeof flag.default === "boolean",
      `booleanProps[${index}].default is invalid`,
    );
  }
  uniqueStrings(
    contract.booleanProps.map((flag) => flag.prop),
    "boolean props",
    /^[a-z][A-Za-z]*$/u,
    true,
  );
  uniqueStrings(
    contract.booleanProps.map((flag) => flag.attribute),
    "boolean attributes",
    /^data-[a-z-]+$/u,
    true,
  );
  uniqueStrings(
    [...contract.axes, ...contract.booleanProps].map((item) => item.prop),
    "all contract props",
    /^[a-z][A-Za-z]*$/u,
    true,
  );
  uniqueStrings(
    [...contract.axes, ...contract.booleanProps].map((item) => item.attribute),
    "all contract attributes",
    /^data-[a-z-]+$/u,
    true,
  );
  uniqueStrings(contract.states, "states", /^data-[a-z-]+$/u, true);
  uniqueStrings(contract.tokens, "tokens", /^--ui-[a-z-]+$/u);
  exactKeys(contract.storybook, ["path", "stories"], "storybook");
  repositoryPath(contract.storybook.path, "storybook.path");
  uniqueStrings(
    contract.storybook.stories,
    "storybook.stories",
    /^[A-Z][A-Za-z]+$/u,
  );
  exactKeys(contract.registry, ["name", "sourcePath"], "registry");
  requireCondition(
    contract.registry.name === contract.name,
    "Registry name does not match component name",
  );
  repositoryPath(contract.registry.sourcePath, "registry.sourcePath");
}

export function inspectSource(source, path, exportName) {
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const aliases = new Map();
  const propertyTypes = new Map();
  const defaults = new Map();
  const attributes = new Map();
  const slots = [];
  const rootSlots = [];

  function hasRootMarker(node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isObjectLiteralExpression(node.parent)
    )
      return node.parent.properties.some(
        (property) =>
          ts.isPropertyAssignment(property) &&
          (ts.isStringLiteral(property.name)
            ? property.name.text
            : property.name.getText(file)) === "data-ui-root" &&
          typeof initializerValue(property.initializer) === "string",
      );
    if (ts.isJsxAttribute(node) && ts.isJsxAttributes(node.parent))
      return node.parent.properties.some(
        (property) =>
          ts.isJsxAttribute(property) &&
          property.name.text === "data-ui-root" &&
          typeof initializerValue(property.initializer) === "string",
      );
    return false;
  }

  function recordAttribute(name, initializer, node) {
    if (!name.startsWith("data-")) return;
    attributes.set(name, initializer);
    if (name === "data-slot" && typeof initializer === "string") {
      slots.push(initializer);
      if (hasRootMarker(node)) rootSlots.push(initializer);
    }
  }

  function initializerValue(initializer) {
    if (!initializer) return undefined;
    if (ts.isStringLiteral(initializer)) return initializer.text;
    if (initializer.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (initializer.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isIdentifier(initializer)) return { identifier: initializer.text };
    if (ts.isJsxExpression(initializer))
      return initializerValue(initializer.expression);
    if (
      ts.isBinaryExpression(initializer) &&
      initializer.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
      ts.isIdentifier(initializer.left) &&
      ts.isIdentifier(initializer.right) &&
      initializer.right.text === "undefined"
    )
      return { booleanIdentifier: initializer.left.text };
    return { expression: initializer.getText(file) };
  }

  function visit(node) {
    if (ts.isTypeAliasDeclaration(node) && ts.isUnionTypeNode(node.type)) {
      const values = node.type.types.map((type) =>
        ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)
          ? type.literal.text
          : undefined,
      );
      if (values.every((value) => value !== undefined))
        aliases.set(node.name.text, values);
    }
    if (ts.isInterfaceDeclaration(node)) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name && member.type) {
          propertyTypes.set(member.name.getText(file), member.type);
        }
      }
    }
    if (ts.isFunctionExpression(node) && node.name?.text === exportName) {
      const binding = node.parameters[0]?.name;
      if (binding && ts.isObjectBindingPattern(binding)) {
        for (const element of binding.elements) {
          if (ts.isIdentifier(element.name)) {
            defaults.set(
              element.name.text,
              initializerValue(element.initializer),
            );
          }
        }
      }
    }
    if (ts.isJsxAttribute(node)) {
      recordAttribute(node.name.text, initializerValue(node.initializer), node);
    }
    if (ts.isPropertyAssignment(node)) {
      const name = ts.isStringLiteral(node.name)
        ? node.name.text
        : node.name.getText(file);
      recordAttribute(name, initializerValue(node.initializer), node);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  const axes = new Map();
  for (const [prop, type] of propertyTypes) {
    if (
      ts.isTypeReferenceNode(type) &&
      aliases.has(type.typeName.getText(file))
    ) {
      axes.set(prop, {
        type: type.typeName.getText(file),
        values: aliases.get(type.typeName.getText(file)),
      });
    }
  }
  return { axes, propertyTypes, defaults, attributes, slots, rootSlots };
}

function storyExports(source, path) {
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const names = new Set();
  for (const statement of file.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    }
  }
  return names;
}

export function validateAxisCssSelectors(contract, css) {
  for (const axis of contract.axes) {
    const values = new Set(
      [
        ...css.matchAll(
          new RegExp(`\\[${axis.attribute}="([a-z][a-z-]*)"\\]`, "gu"),
        ),
      ].map((match) => match[1]),
    );
    sameSet(
      values,
      axis.cssSelectorValues,
      `${contract.name}.${axis.prop} CSS selectors`,
    );
  }
}

export function validatePackageDelivery(
  contract,
  reactPackage,
  stylesPackage,
  stylesIndex,
) {
  const reactEntry = reactPackage.exports?.[`./${contract.name}`];
  requireCondition(
    reactPackage.name === "@iuvui/react" &&
      reactEntry?.types === `./dist/${contract.name}.d.ts` &&
      reactEntry?.import === `./dist/${contract.name}.js`,
    `${contract.name} package entry differs from contract`,
  );
  const styleEntry = `./components/${contract.name}.css`;
  requireCondition(
    stylesPackage.name === "@iuvui/styles" &&
      stylesPackage.exports?.[styleEntry] === styleEntry &&
      stylesIndex.includes(styleEntry),
    `${contract.name} style delivery differs from contract`,
  );
}

export function validateContractAgainstRepository(contract) {
  validateContractShape(contract);
  const source = read(contract.sourcePath);
  const css = read(contract.stylePath);
  const storySource = read(contract.storybook.path);
  const inspected = inspectSource(
    source,
    contract.sourcePath,
    contract.exportName,
  );
  const axisProps = contract.axes.map((axis) => axis.prop);
  sameSet(
    [...inspected.axes.keys()],
    axisProps,
    `${contract.name} public axes`,
  );
  for (const axis of contract.axes) {
    const actual = inspected.axes.get(axis.prop);
    requireCondition(
      actual?.type === axis.type,
      `${contract.name}.${axis.prop} type differs from source`,
    );
    requireCondition(
      JSON.stringify(actual.values) === JSON.stringify(axis.values),
      `${contract.name}.${axis.prop} values differ from source`,
    );
    requireCondition(
      inspected.defaults.get(axis.prop) === axis.default,
      `${contract.name}.${axis.prop} default differs from source`,
    );
    requireCondition(
      inspected.attributes.get(axis.attribute)?.identifier === axis.prop,
      `${contract.name}.${axis.prop} attribute differs from source`,
    );
  }
  validateAxisCssSelectors(contract, css);
  for (const flag of contract.booleanProps) {
    const type = inspected.propertyTypes.get(flag.prop);
    requireCondition(
      type?.kind === ts.SyntaxKind.BooleanKeyword,
      `${contract.name}.${flag.prop} is not a boolean prop`,
    );
    requireCondition(
      inspected.defaults.get(flag.prop) === flag.default,
      `${contract.name}.${flag.prop} default differs from source`,
    );
    if (flag.emittedBy === "component") {
      requireCondition(
        inspected.attributes.get(flag.attribute)?.booleanIdentifier ===
          flag.prop,
        `${contract.name}.${flag.prop} attribute differs from source`,
      );
    }
    requireCondition(
      css.includes(`[${flag.attribute}]`),
      `${contract.name}.${flag.prop} has no CSS selector`,
    );
  }
  sameSet(inspected.slots, contract.slots, `${contract.name} slots`);
  sameSet(
    inspected.rootSlots,
    [contract.rootSlot],
    `${contract.name} root slot`,
  );
  for (const state of contract.states) {
    requireCondition(
      css.includes(`[${state}]`),
      `${contract.name} state ${state} has no CSS selector`,
    );
  }
  const cssAttributes = new Set(
    [...css.matchAll(/\[(data-[a-z-]+)(?=[\]=])/gu)].map((match) => match[1]),
  );
  sameSet(
    cssAttributes,
    new Set([
      ...contract.axes.map((axis) => axis.attribute),
      ...contract.booleanProps.map((flag) => flag.attribute),
      ...contract.states,
    ]),
    `${contract.name} CSS data attributes`,
  );
  requireCondition(
    css.includes(`.ui-${contract.name}`),
    `${contract.name} root CSS selector is missing`,
  );

  const usedTokens = [
    ...new Set(
      [...css.matchAll(/var\((--ui-[a-z-]+)/gu)]
        .map((match) => match[1])
        .filter((token) => !token.startsWith(`--ui-${contract.name}-`)),
    ),
  ];
  sameSet(usedTokens, contract.tokens, `${contract.name} semantic tokens`);
  const theme = read("packages/tokens/theme.css");
  for (const token of contract.tokens) {
    requireCondition(
      theme.includes(`${token}:`),
      `${contract.name} token ${token} is undeclared`,
    );
  }

  const reactPackage = readJson("packages/react/package.json");
  const stylesPackage = readJson("packages/styles/package.json");
  validatePackageDelivery(
    contract,
    reactPackage,
    stylesPackage,
    read("packages/styles/index.css"),
  );
  requireCondition(
    read("packages/react/src/index.ts").includes(
      `export { ${contract.exportName} } from "./${contract.name}";`,
    ),
    `${contract.name} root package export is missing`,
  );
  const exports = storyExports(storySource, contract.storybook.path);
  sameSet(
    exports,
    contract.storybook.stories,
    `${contract.name} Storybook stories`,
  );
  requireCondition(
    storySource.includes(`component: ${contract.exportName}`),
    `${contract.name} Storybook component differs from contract`,
  );

  const catalog = readJson("registry/registry.json");
  const item = catalog.items.find(
    (entry) => entry.name === contract.registry.name,
  );
  requireCondition(item, `${contract.name} Registry item is missing`);
  requireCondition(
    item.meta.iuvui.releaseStatus === "published" &&
      item.meta.iuvui.provenance.path === contract.sourcePath &&
      item.files.some((file) => file.path === contract.registry.sourcePath),
    `${contract.name} Registry delivery differs from contract`,
  );
  const publicItem = readJson(`apps/web/public/r/${contract.name}.json`);
  requireCondition(
    publicItem.name === contract.name &&
      publicItem.meta.iuvui.version === item.meta.iuvui.version &&
      publicItem.files.some(
        (file) => file.path === contract.registry.sourcePath,
      ),
    `${contract.name} public Registry output differs from contract`,
  );
}

export function checkAllContracts() {
  const files = readdirSync(contractDirectory).filter((name) =>
    name.endsWith(".json"),
  );
  const contracts = files.map((name) =>
    readJson(`contracts/components/${name}`),
  );
  uniqueStrings(
    contracts.map((contract) => contract.name),
    "contract names",
  );
  const catalog = readJson("registry/registry.json");
  const published = catalog.items
    .filter((item) => item.meta?.iuvui?.releaseStatus === "published")
    .map((item) => item.name);
  sameSet(
    published,
    contracts.map((contract) => contract.name),
    "published Registry contracts",
  );
  for (const contract of contracts) validateContractAgainstRepository(contract);
  return contracts.length;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const count = checkAllContracts();
    console.log(`Validated ${count} component contracts.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
