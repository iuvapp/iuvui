import { describe, expect, it } from "vitest";
import { cn, createVariants } from "../src";

describe("cn", () => {
  it("lets later Tailwind utilities win predictably", () => {
    expect(cn("px-2 text-sm", "px-6", undefined)).toBe("text-sm px-6");
  });
});

describe("createVariants", () => {
  it("supports defaults, compounds, and slots", () => {
    const styles = createVariants({
      base: { root: "base", icon: "icon" },
      variants: {
        size: { sm: { root: "small", icon: "tiny" }, lg: { root: "large" } },
      },
      defaultVariants: { size: "sm" },
      compoundVariants: [{ size: "sm", className: { root: "compact" } }],
    });
    expect(styles().root).toBe("base small compact");
    expect(styles().icon).toBe("icon tiny");
  });
});
