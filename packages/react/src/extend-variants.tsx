import { createElement, type ComponentType } from "react";
import { createVariants, type VariantConfig } from "@iuvui/utils/variants";
import { cn } from "@iuvui/utils";

type VariantMap = Record<string, Record<string, string>>;
type ClassNameCapable = { className?: string | ((state: any) => string) };
type Selection<Variants extends VariantMap> = {
  [Key in keyof Variants]?: keyof Variants[Key] | null;
};

export function extendVariants<
  Props extends ClassNameCapable,
  const Variants extends VariantMap,
>(Component: ComponentType<Props>, config: VariantConfig<Variants>) {
  const resolve = createVariants(config);
  type ExtendedProps = Omit<Props, "className"> &
    Selection<Variants> & { className?: Props["className"] };

  function ExtendedComponent({ className, ...props }: ExtendedProps) {
    const variantKeys = new Set(Object.keys(config.variants ?? {}));
    const variants: Record<string, unknown> = {};
    const componentProps: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      (variantKeys.has(key) ? variants : componentProps)[key] = value;
    }
    const extensionClass = resolve(variants as Selection<Variants>);
    const mergedClassName =
      typeof className === "function"
        ? (state: any) => cn(extensionClass, className(state))
        : cn(extensionClass, className);
    return createElement(Component, {
      ...componentProps,
      className: mergedClassName,
    } as Props);
  }

  ExtendedComponent.displayName = `extendVariants(${Component.displayName ?? Component.name ?? "Component"})`;
  return ExtendedComponent;
}
