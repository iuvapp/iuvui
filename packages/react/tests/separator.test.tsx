import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "../src/separator";

describe("Separator", () => {
  it("defaults to a horizontal semantic separator", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Separator
        ref={ref}
        aria-label="Section boundary"
        className="consumer"
        style={{ opacity: 0.8 }}
      />,
    );

    const separator = screen.getByRole("separator", {
      name: "Section boundary",
    });
    expect(separator).toBe(ref.current);
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveClass("ui-separator", "consumer");
    expect(separator).toHaveStyle({ opacity: "0.8" });
  });

  it("exposes vertical orientation to assistive technology and styles", () => {
    render(<Separator orientation="vertical" />);

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("preserves separator semantics when rendered as a div", () => {
    render(<Separator elementType="div" aria-label="Related content" />);

    expect(
      screen.getByRole("separator", { name: "Related content" }),
    ).toHaveAttribute("data-slot", "separator");
  });
});
