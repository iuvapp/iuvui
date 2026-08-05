import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@iuvui/react/button";
import { Dialog } from "@iuvui/react/dialog";

const Example = () => (
  <Dialog.Root>
    <Dialog.Trigger className="ui-button">Open dialog</Dialog.Trigger>
    <Dialog.Backdrop isDismissable>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Publish changes?</Dialog.Title>
          <Dialog.Description>
            Your changes will become visible to everyone with access.
          </Dialog.Description>
          <div className="story-row">
            <Dialog.Close>Cancel</Dialog.Close>
            <Button>Publish</Button>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Backdrop>
  </Dialog.Root>
);

const meta = {
  title: "Components/Dialog",
  component: Example,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Focus is trapped while open, Escape dismisses, and focus returns to the trigger. Motion honors `prefers-reduced-motion`.",
      },
    },
  },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <Example /> };
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
  render: () => <Example />,
};
export const CustomVariables: Story = {
  decorators: [
    (Story) => (
      <div style={{ "--ui-radius-lg": "1.5rem" } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
  render: () => <Example />,
};
export const CustomClassName: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger className="ui-button story-gradient">
        Open custom
      </Dialog.Trigger>
      <Dialog.Backdrop isDismissable>
        <Dialog.Positioner>
          <Dialog.Content className="story-stack">
            <Dialog.Title>Custom class</Dialog.Title>
            <Dialog.Description>
              Each public part accepts its own className.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Backdrop>
    </Dialog.Root>
  ),
};
