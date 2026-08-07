import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LanguageToggle } from "../components/language-toggle";
import * as m from "../paraglide/messages.js";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function docsLayoutOptions(): BaseLayoutProps {
  return {
    githubUrl,
    links: [
      {
        active: "nested-url",
        text: m.web_nav_components(),
        type: "main",
        url: "/docs/components",
      },
      {
        active: "url",
        text: m.web_nav_styles(),
        type: "main",
        url: "/docs/styles",
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
