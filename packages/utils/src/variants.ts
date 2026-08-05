import type { ClassValue } from "clsx";
import { cn } from "./index";

type VariantMap = Record<string, Record<string, ClassValue>>;
export type SlotClasses<Slot extends string> = Partial<
  Record<Slot, ClassValue>
>;
type SlotVariantMap<Slot extends string> = Record<
  string,
  Record<string, SlotClasses<Slot>>
>;

type Selection<V extends VariantMap | SlotVariantMap<string>> = {
  [Key in keyof V]?: keyof V[Key] | null;
};

export interface VariantConfig<
  V extends VariantMap | SlotVariantMap<Slot>,
  Slot extends string = never,
> {
  base?: [Slot] extends [never] ? ClassValue : SlotClasses<Slot>;
  variants?: V;
  defaultVariants?: Selection<V>;
  compoundVariants?: Array<
    Selection<V> & {
      className: [Slot] extends [never] ? ClassValue : SlotClasses<Slot>;
    }
  >;
}

export type VariantProps<Config extends VariantConfig<any, any>> =
  Config extends VariantConfig<infer V, any> ? Selection<V> : never;

const matches = (
  selection: Record<string, unknown>,
  condition: Record<string, unknown>,
): boolean =>
  Object.entries(condition).every(
    ([key, value]) => key === "className" || selection[key] === value,
  );

export function createVariants<
  const Slot extends string,
  const V extends SlotVariantMap<Slot>,
>(
  config: VariantConfig<V, Slot> & { base: SlotClasses<Slot> },
): (
  props?: Selection<V> & { className?: SlotClasses<Slot> },
) => Record<Slot, string>;
export function createVariants<const V extends VariantMap>(
  config: VariantConfig<V>,
): (props?: Selection<V> & { className?: ClassValue }) => string;
export function createVariants(config: any): any {
  const runtime = config as {
    base?: ClassValue | Record<string, ClassValue>;
    variants?: Record<string, Record<string, unknown>>;
    defaultVariants?: Record<string, unknown>;
    compoundVariants?: Array<
      Record<string, unknown> & {
        className: ClassValue | Record<string, ClassValue>;
      }
    >;
  };
  return (props: Record<string, unknown> = {}) => {
    const selection = { ...runtime.defaultVariants, ...props } as Record<
      string,
      unknown
    >;
    const chosen = Object.entries(runtime.variants ?? {}).map(
      ([name, values]) => {
        const value = selection[name];
        const key =
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
            ? String(value)
            : undefined;
        return key === undefined ? undefined : values[key];
      },
    );
    const compounds = (runtime.compoundVariants ?? [])
      .filter((item) => matches(selection, item))
      .map((item) => item.className);

    if (
      typeof runtime.base === "object" &&
      runtime.base !== null &&
      !Array.isArray(runtime.base)
    ) {
      const slots = new Set<string>([
        ...Object.keys(runtime.base),
        ...chosen.flatMap((value: unknown) =>
          typeof value === "object" && value ? Object.keys(value) : [],
        ),
        ...compounds.flatMap((value: unknown) =>
          typeof value === "object" && value ? Object.keys(value) : [],
        ),
        ...(typeof props.className === "object" && props.className
          ? Object.keys(props.className)
          : []),
      ]);
      return Object.fromEntries(
        [...slots].map((slot) => [
          slot,
          cn(
            (runtime.base as Record<string, ClassValue>)[slot],
            ...chosen.map(
              (value: unknown) =>
                (value as Record<string, ClassValue> | undefined)?.[slot],
            ),
            ...compounds.map(
              (value: unknown) =>
                (value as Record<string, ClassValue> | undefined)?.[slot],
            ),
            (props.className as Record<string, ClassValue> | undefined)?.[slot],
          ),
        ]),
      ) as Record<string, string>;
    }

    return cn(
      runtime.base as ClassValue,
      ...(chosen as ClassValue[]),
      ...(compounds as ClassValue[]),
      props.className as ClassValue,
    );
  };
}
