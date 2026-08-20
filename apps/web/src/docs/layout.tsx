import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function docsLayoutOptions(): BaseLayoutProps {
  return {
    githubUrl,
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
