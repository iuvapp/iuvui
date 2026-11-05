import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@iuvui/react";

const Example = () => (
  <Select.Root defaultValue="apple">
    <Select.Trigger aria-label="Fruit">
      <Select.Value placeholder="Choose a fruit" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="pear">Pear</Select.Item>
    </Select.Content>
  </Select.Root>
);

const meta = {
  title: "Components/Select",
  component: Example,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single-value select with a combobox trigger, listbox popup, and keyboard selection.",
      },
    },
  },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <Example /> };
