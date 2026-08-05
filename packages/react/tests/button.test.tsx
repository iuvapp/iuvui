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
        endContent={<span data-testid="end" />}
      >
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveClass("ui-button", "consumer");
    expect(button).toHaveStyle({ opacity: "0.9" });
    expect(screen.getByTestId("start").parentElement).toHaveAttribute(
      "data-slot",
      "button-start-content",
    );
    expect(screen.getByTestId("end").parentElement).toHaveAttribute(
      "data-slot",
      "button-end-content",
    );
    expect(
      button.querySelector("[data-slot='button-label']"),
    ).toHaveTextContent("Save");
  });

  it("supports keyboard press and reports the stable event shape", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    await userEvent.setup().tab();
    await userEvent.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledWith({ pointerType: "keyboard" });
  });

  it("supports Space and pointer activation", async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(<Button onPress={onPress}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await user.tab();
    await user.keyboard(" ");
    await user.click(button);

    expect(onPress).toHaveBeenNthCalledWith(1, { pointerType: "keyboard" });
    expect(onPress).toHaveBeenNthCalledWith(2, { pointerType: "mouse" });
  });

  it("does not trigger repeatedly while pending", () => {
    const onPress = vi.fn();
    render(
      <Button isPending onPress={onPress}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-pending", "true");
    expect(button.querySelector("[data-slot='button-spinner']")).not.toBeNull();
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

  it("exposes full-width and icon-only layout contracts", () => {
    render(
      <Button aria-label="Search" fullWidth isIconOnly>
        <span aria-hidden="true">⌕</span>
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toHaveAttribute("data-full-width", "true");
    expect(button).toHaveAttribute("data-icon-only", "true");
  });
});
