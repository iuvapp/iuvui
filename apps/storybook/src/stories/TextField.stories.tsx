import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@iuvui/react/text-field";

const Example = ({
  disabled = false,
  invalid = false,
  className,
}: {
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) => (
  <TextField.Root
    isDisabled={disabled}
    isInvalid={invalid}
    isRequired
    className={className}
  >
    <TextField.Label>Email address</TextField.Label>
    <TextField.Input placeholder="you@example.com" />
    <TextField.Description>
      We only use this for account notices.
    </TextField.Description>
    <TextField.ErrorMessage>
      Enter a valid email address.
    </TextField.ErrorMessage>
  </TextField.Root>
);

const meta = {
  title: "Components/TextField",
  component: Example,
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <Example /> };
export const Invalid: Story = { render: () => <Example invalid /> };
export const Disabled: Story = { render: () => <Example disabled /> };
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ padding: "2rem", background: "var(--ui-background)" }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => <Example invalid />,
};
export const CustomVariables: Story = {
  render: () => (
    <div
      style={
        { "--ui-focus-ring": "oklch(0.68 0.22 145)" } as React.CSSProperties
      }
    >
      <Example />
    </div>
  ),
};
export const CustomClassName: Story = {
  render: () => <Example className="story-stack" />,
};
