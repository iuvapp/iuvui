import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@iuvui/utils";

const NAVBAR_COLLAPSE_AT = 30;
const NAVBAR_EXPAND_AT = 8;

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function useCollapsedState() {
  const [collapsed, setCollapsed] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const collapsedRef = useRef(false);

  useBrowserLayoutEffect(() => {
    let scrollFrame = 0;
    let readyFrame = 0;
    let secondReadyFrame = 0;

    const readScrollPosition = () => {
      scrollFrame = 0;
      const scrollY = Math.max(window.scrollY, 0);
      const nextCollapsed = collapsedRef.current
        ? scrollY > NAVBAR_EXPAND_AT
        : scrollY > NAVBAR_COLLAPSE_AT;

      if (nextCollapsed !== collapsedRef.current) {
        collapsedRef.current = nextCollapsed;
        setCollapsed(nextCollapsed);
      }
    };

    const scheduleScrollRead = () => {
      if (scrollFrame !== 0) {
        return;
      }

      scrollFrame = requestAnimationFrame(readScrollPosition);
    };

    readScrollPosition();
    window.addEventListener("scroll", scheduleScrollRead, { passive: true });

    readyFrame = requestAnimationFrame(() => {
      secondReadyFrame = requestAnimationFrame(() => {
        setMotionReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(readyFrame);
      cancelAnimationFrame(secondReadyFrame);
      window.removeEventListener("scroll", scheduleScrollRead);
    };
  }, []);

  return { collapsed, motionReady };
}

export type NavbarProps = ComponentPropsWithoutRef<"nav">;
export type NavbarBrandProps = ComponentPropsWithoutRef<"div">;
export type NavbarContentProps = ComponentPropsWithoutRef<"div">;
export type NavbarActionsProps = ComponentPropsWithoutRef<"div">;
export type NavbarSpacerProps = ComponentPropsWithoutRef<"span">;

export interface NavbarItemProps extends ComponentPropsWithoutRef<"a"> {
  /** Marks the item as the current page for assistive technology. */
  current?: boolean;
}

// Independent iuvui component. The scroll-aware capsule uses hysteresis
// thresholds and requestAnimationFrame batching; styling lives in
// @iuvui/styles.
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { className, children, ...props },
  ref,
) {
  const { collapsed, motionReady } = useCollapsedState();

  return (
    <nav
      {...props}
      ref={ref}
      className={cn("ui-navbar", className)}
      data-slot="navbar"
      data-ui-root=""
      data-collapsed={collapsed ? "true" : "false"}
      data-motion-ready={motionReady ? "true" : "false"}
    >
      <div className="ui-navbar__bar" data-slot="navbar-bar">
        <span aria-hidden="true" className="ui-navbar__surface">
          <span className="ui-navbar__surface-clip">
            <span className="ui-navbar__backdrop" />
          </span>
        </span>
        <div className="ui-navbar__header" data-slot="navbar-header">
          {children}
        </div>
      </div>
    </nav>
  );
});

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  function NavbarBrand({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-navbar__brand", className)}
        data-slot="navbar-brand"
      />
    );
  },
);

export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>(
  function NavbarContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-navbar__content", className)}
        data-slot="navbar-content"
      />
    );
  },
);

export const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(
  function NavbarActions({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-navbar__actions", className)}
        data-slot="navbar-actions"
      />
    );
  },
);

export const NavbarSpacer = forwardRef<HTMLSpanElement, NavbarSpacerProps>(
  function NavbarSpacer({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cn("ui-navbar__spacer", className)}
        data-slot="navbar-spacer"
      />
    );
  },
);

export const NavbarItem = forwardRef<HTMLAnchorElement, NavbarItemProps>(
  function NavbarItem({ className, current, ...props }, ref) {
    return (
      <a
        {...props}
        ref={ref}
        aria-current={current ? "page" : undefined}
        className={cn("ui-navbar__item", className)}
        data-slot="navbar-item"
        data-current={current ? "true" : undefined}
      />
    );
  },
);
