import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarSpacer,
} from "../src/navbar";

describe("Navbar", () => {
  it("renders a navigation landmark with stable anatomy", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Navbar
        ref={ref}
        aria-label="Main navigation"
        className="consumer"
        style={{ opacity: 0.8 }}
      >
        <NavbarBrand>Brand</NavbarBrand>
        <NavbarSpacer />
        <NavbarContent>
          <NavbarItem href="#docs">Docs</NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <button type="button">Sign in</button>
        </NavbarActions>
      </Navbar>,
    );

    const navbar = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(navbar).toBe(ref.current);
    expect(navbar).toHaveAttribute("data-slot", "navbar");
    expect(navbar).toHaveAttribute("data-ui-root");
    expect(navbar).toHaveAttribute("data-collapsed", "false");
    expect(navbar).toHaveClass("ui-navbar", "consumer");
    expect(navbar).toHaveStyle({ opacity: "0.8" });
    expect(navbar.querySelector(".ui-navbar__bar")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__surface")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__backdrop")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__header")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__brand")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__content")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__actions")).not.toBeNull();
    expect(navbar.querySelector(".ui-navbar__spacer")).not.toBeNull();
  });

  it("marks the current item for assistive technology", () => {
    render(
      <Navbar aria-label="Main navigation">
        <NavbarItem current href="#docs">
          Docs
        </NavbarItem>
        <NavbarItem href="#blog">Blog</NavbarItem>
      </Navbar>,
    );

    const current = screen.getByRole("link", { name: "Docs" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("data-current", "true");
    expect(current).toHaveAttribute("data-slot", "navbar-item");
    expect(current).toHaveClass("ui-navbar__item");
    expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("collapses after scrolling past the threshold", async () => {
    render(<Navbar aria-label="Main navigation" />);

    const navbar = screen.getByRole("navigation", {
      name: "Main navigation",
    });

    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 500, writable: true });
      window.dispatchEvent(new Event("scroll"));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(navbar).toHaveAttribute("data-collapsed", "true");

    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 0, writable: true });
      window.dispatchEvent(new Event("scroll"));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(navbar).toHaveAttribute("data-collapsed", "false");
  });
});
