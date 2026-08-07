import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { ButtonVariantExplorer } from "../components/docs/button-variant-explorer";
import { ComponentMeta } from "../components/docs/component-meta";
import { ComponentPreview } from "../components/docs/component-preview";
import { StyleExports } from "../components/docs/style-exports";

export function getMdxComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ButtonVariantExplorer,
    ComponentMeta,
    ComponentPreview,
    StyleExports,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMdxComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMdxComponents>;
}
