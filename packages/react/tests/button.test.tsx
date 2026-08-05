import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/button";

describe("Button", () => {
  it("keeps slots, variants, className, and style as public contracts", () => {
    render(
      <Button
        variant="outline"
        size="lg"
        className="consumer"
        style={{ opacity: 0.9 }}
        startContent={<span data-testid="start" />}
      >
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveClass("ui-button", "consumer");
    expect(button).toHaveStyle({ opacity: "0.9" });
    expect(screen.getByTestId("start")).toBeInTheDocument();
  });

  it("supports keyboard press and reports the stable event shape", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    await userEvent.setup().tab();
    await userEvent.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledWith({ pointerType: "keyboard" });
  });

  it("does not trigger repeatedly while pending", () => {
    const onPress = vi.fn();
    render(
      <Button isPending onPress={onPress}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-pending", "true");
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders link semantics when href is provided", () => {
    render(<Button href="/docs">Docs</Button>);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    );
  });
});
