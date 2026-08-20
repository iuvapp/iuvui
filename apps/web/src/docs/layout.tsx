import type { BaseLayoutProps, LayoutTab } from "fumadocs-ui/layouts/shared";

import { LanguageToggle } from "../components/language-toggle";
import * as m from "../paraglide/messages.js";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function docsTabs(): LayoutTab[] {
  return [
    {
      title: m.web_nav_guides(),
      url: "/docs/guides",
    },
    {
      title: m.web_nav_components(),
      url: "/docs/components",
    },
    {
      title: m.web_nav_styles(),
      url: "/docs/styles",
    },
  ];
}

export function docsLayoutOptions(): BaseLayoutProps {
  return {
    githubUrl,
    links: [
      {
        active: "nested-url",
        text: m.web_nav_guides(),
        type: "main",
        url: "/docs/guides",
      },
      {
        active: "nested-url",
        text: m.web_nav_components(),
        type: "main",
        url: "/docs/components",
      },
      {
        active: "nested-url",
        text: m.web_nav_styles(),
        type: "main",
        url: "/docs/styles",
      },
      {
        active: "none",
        external: true,
        text: m.web_nav_registry(),
        type: "main",
        url: "/r/registry.json",
      },
      {
        children: <LanguageToggle />,
        type: "custom",
      },
    ],
    nav: {
      title: "iuvui",
      transparentMode: "none",
      url: "/",
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
