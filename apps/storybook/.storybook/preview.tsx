import type { Preview } from "@storybook/react-vite";
import "@iuvui/styles";
import "../src/storybook.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    options: {
      storySort: { order: ["Foundation", "Components", "Contracts"] },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "12rem",
          padding: "2rem",
          background: "var(--ui-background)",
          color: "var(--ui-foreground)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
