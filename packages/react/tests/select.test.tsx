import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import { Select } from "../src/select";

const Example = ({
  isDisabled = false,
  onValueChange,
}: {
  isDisabled?: boolean;
  onValueChange?: (value: string | null) => void;
}) => (
  <Select.Root
    isDisabled={isDisabled}
    {...(onValueChange ? { onValueChange } : {})}
  >
    <Select.Trigger>
      <Select.Value placeholder="Choose a fruit" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.GroupLabel>Fruit</Select.GroupLabel>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Separator />
        <Select.Item value="pear">Pear</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select.Root>
);

describe("Select", () => {
  it("keeps the public slots and opens a listbox from the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("combobox", { name: "Choose a fruit" });
    expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    expect(trigger).toHaveClass("ui-select__trigger");
    expect(
      screen.getByText("Choose a fruit").closest("[data-slot='select-value']"),
    ).not.toBeNull();

    await user.click(trigger);
    const listbox = await screen.findByRole("listbox");
    expect(listbox.closest("[data-slot='select-content']")).not.toBeNull();
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute(
      "data-slot",
      "select-item",
    );
    expect(document.body).toContainElement(listbox);
  });

  it("selects an option with the keyboard and reports the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("option", { name: "Apple" });
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("apple");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: "Apple" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("combobox", { name: "Apple" })).not.toHaveAttribute(
      "data-open",
    );
  });

  it("shows the item label for a default value before the popup opens", () => {
    render(
      <Select.Root defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Choose a fruit" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole("combobox", { name: "Apple" })).toHaveTextContent(
      "Apple",
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Example isDisabled />);
    const trigger = screen.getByRole("combobox", { name: "Choose a fruit" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("has no detectable axe violations when closed", async () => {
    const { container } = render(
      <main>
        <Example />
      </main>,
    );
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
