import type { I18nProviderProps } from "fumadocs-ui/contexts/i18n";

import * as m from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";

export function fumadocsI18n(): Omit<I18nProviderProps, "children"> {
  return {
    locale: getLocale(),
    translations: {
      "Close Search(search dialog)(aria-label)": m.web_fumadocs_close_search(),
      "Close Sidebar(aria-label)": m.web_fumadocs_close_sidebar(),
      "Close Sidebar(sidebar)(aria-label)": m.web_fumadocs_close_sidebar(),
      "Hide Sidebar(sidebar)": m.web_fumadocs_hide_sidebar(),
      "Next Page(pagination)": m.web_fumadocs_next_page(),
      "No Headings(table of contents)": m.web_fumadocs_no_headings(),
      "No results found(search dialog)": m.web_fumadocs_no_results(),
      "On this page(table of contents)": m.web_fumadocs_on_this_page(),
      "Open Search(search trigger)(aria-label)": m.web_fumadocs_open_search(),
      "Open Sidebar(sidebar)(aria-label)": m.web_fumadocs_open_sidebar(),
      "Previous Page(pagination)": m.web_fumadocs_previous_page(),
      "Search(search dialog)": m.web_fumadocs_search(),
      "Search(search trigger)": m.web_fumadocs_search(),
      "Show Sidebar(sidebar)": m.web_fumadocs_show_sidebar(),
      "Toggle Menu(mobile menu)(aria-label)": m.web_fumadocs_toggle_menu(),
    },
  };
}
