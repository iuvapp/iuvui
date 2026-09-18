import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarSpacer,
} from "@iuvui/react";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A scroll-aware glass capsule navbar. It starts as a wide transparent pill and contracts into a blurred surface after scrolling past a hysteresis threshold. Import `@iuvui/styles` once in your app.",
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoNavbar() {
  return (
    <Navbar aria-label="Main navigation">
      <NavbarBrand>
        <a href="/">Acme</a>
      </NavbarBrand>
      <NavbarSpacer />
      <NavbarContent>
        <NavbarItem href="#features">Features</NavbarItem>
        <NavbarItem current href="#docs">
          Docs
        </NavbarItem>
        <NavbarItem href="#pricing">Pricing</NavbarItem>
      </NavbarContent>
      <NavbarSpacer />
      <NavbarActions>
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
        <Button size="sm">Get started</Button>
      </NavbarActions>
    </Navbar>
  );
}

export const ScrollCollapse: Story = {
  render: () => (
    <div style={{ minHeight: "160vh", padding: "6rem 1.5rem" }}>
      <DemoNavbar />
      <p>Scroll down to collapse the capsule, then scroll back up.</p>
    </div>
  ),
};

export const LongNavigation: Story = {
  render: () => (
    <div style={{ minHeight: "160vh", padding: "6rem 1.5rem" }}>
      <Navbar aria-label="Main navigation">
        <NavbarBrand>Acme</NavbarBrand>
        <NavbarSpacer />
        <NavbarContent>
          <NavbarItem href="#a">Explore all product features</NavbarItem>
          <NavbarItem href="#b">See what is possible</NavbarItem>
          <NavbarItem href="#c">Read customer stories</NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  ),
};
