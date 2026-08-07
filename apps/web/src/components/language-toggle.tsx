import { Button } from "@heroui/react";

import * as m from "../paraglide/messages.js";
import { getLocale, setLocale } from "../paraglide/runtime.js";

export function LanguageToggle() {
  const nextLocale = getLocale() === "en" ? "zh-CN" : "en";

  return (
    <Button
      aria-label={m.common_switch_language()}
      size="sm"
      variant="ghost"
      onPress={() => void setLocale(nextLocale)}
    >
      {nextLocale === "en" ? "EN" : "ZH"}
    </Button>
  );
}
