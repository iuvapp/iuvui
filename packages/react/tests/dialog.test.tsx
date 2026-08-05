import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog } from "../src/dialog";

const Example = () => (
  <Dialog.Root>
    <Dialog.Trigger>Open settings</Dialog.Trigger>
    <Dialog.Backdrop isDismissable>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Update preferences.</Dialog.Description>
          <input aria-label="First field" />
          <button>Last action</button>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Backdrop>
  </Dialog.Root>
);

describe("Dialog", () => {
  it("portals, traps focus, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("data-slot", "dialog-content");
    expect(dialog).toHaveAttribute("data-open");
    expect(document.body).toContainElement(dialog);
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root isOpen onOpenChange={() => undefined}>
        <Dialog.Trigger>Open controlled</Dialog.Trigger>
        <Dialog.Backdrop>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>Controlled</Dialog.Title>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Dialog.Root>,
    );
    expect(
      await screen.findByRole("dialog", { name: "Controlled" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("dialog", { name: "Controlled" }),
    ).toBeInTheDocument();
  });
});
