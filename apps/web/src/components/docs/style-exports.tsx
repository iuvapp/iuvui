import { Card, CardHeader, CardTitle, CardDescription } from "@iuvui/react";
import { StatusBadge } from "@iuvui/site-ui";

import { styleExports } from "../../catalog";
import * as m from "../../paraglide/messages.js";

export function StyleExports() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2">
      {styleExports.map((style) => (
        <Card key={style.path}>
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="break-all font-mono text-sm">
                {style.path}
              </CardTitle>
              <CardDescription>
                {style.group === "foundation"
                  ? m.web_style_foundation_description()
                  : m.web_style_component_description()}
              </CardDescription>
            </div>
            <StatusBadge>
              {style.delivery === "published"
                ? m.web_included()
                : m.web_component_workspace_preview()}
            </StatusBadge>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
