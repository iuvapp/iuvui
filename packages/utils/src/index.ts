import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type { ClassValue } from "clsx";
export { createVariants } from "./variants";
export type { SlotClasses, VariantConfig, VariantProps } from "./variants";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
