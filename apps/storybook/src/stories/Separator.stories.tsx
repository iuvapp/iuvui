import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@iuvui/react";

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A visual or semantic boundary built on React Aria. Import `@iuvui/styles` once in your app.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="story-stack">
      <span>Account</span>
      <Separator />
      <span>Security</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="story-row" style={{ height: "3rem" }}>
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  ),
};

export const NamedBoundary: Story = {
  args: { "aria-label": "Related content" },
};
