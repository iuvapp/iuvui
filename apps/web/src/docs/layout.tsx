import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LanguageToggle } from "../components/language-toggle";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function docsLayoutOptions(): BaseLayoutProps {
  return {
    githubUrl,
    links: [
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
