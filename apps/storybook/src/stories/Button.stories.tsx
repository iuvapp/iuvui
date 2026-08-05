import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, extendVariants } from "@iuvui/react";
import { SearchIcon } from "@iuvui/icons/search";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Keyboard-operable button/link with stable variants. Import `@iuvui/styles` once in your app.",
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Continue" } };
export const AllVariants: Story = {
  render: () => (
    <div className="story-row">
      {(
        [
          "primary",
          "secondary",
          "tertiary",
          "outline",
          "ghost",
          "danger",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  render: () => (
    <div className="story-row">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
export const Disabled: Story = {
  args: { children: "Unavailable", isDisabled: true },
};
export const Loading: Story = {
  args: { children: "Publishing", isPending: true },
};
export const WithContent: Story = {
  args: {
    children: "Search",
    endContent: <SearchIcon size={17} />,
    startContent: <SearchIcon size={17} />,
  },
};
export const IconOnly: Story = {
  args: {
    "aria-label": "Search",
    children: <SearchIcon size={17} />,
    isIconOnly: true,
  },
};
export const FullWidth: Story = {
  args: { children: "Continue", fullWidth: true },
};
export const Link: Story = {
  args: { children: "Documentation", href: "#documentation" },
};
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
  args: { children: "Dark action" },
};
export const CustomVariables: Story = {
  render: () => (
    <div
      style={{ "--ui-accent": "oklch(0.62 0.25 320)" } as React.CSSProperties}
    >
      <Button>Token override</Button>
    </div>
  ),
};
export const CustomClassName: Story = {
  args: { children: "Gradient", className: "story-gradient" },
};

const BrandButton = extendVariants(Button, {
  variants: { tone: { brand: "story-gradient", danger: "bg-red-600" } },
  defaultVariants: { tone: "brand" },
});
export const ExtendedVariants: Story = {
  render: () => <BrandButton tone="brand">Brand variant</BrandButton>,
  parameters: {
    docs: {
      description: {
        story:
          "`extendVariants` adds typed style variants without replacing Button behavior.",
      },
    },
  },
};
