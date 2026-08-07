import { Card, Chip } from "@heroui/react";

import { styleExports } from "../../catalog";
import * as m from "../../paraglide/messages.js";

export function StyleExports() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2">
      {styleExports.map((style) => (
        <Card key={style.path}>
          <Card.Header className="flex-row items-start justify-between gap-4">
            <div className="min-w-0">
              <Card.Title className="break-all font-mono text-sm">
                {style.path}
              </Card.Title>
              <Card.Description>
                {style.group === "foundation"
                  ? m.web_style_foundation_description()
                  : m.web_style_component_description()}
              </Card.Description>
            </div>
            <Chip color="success" size="sm" variant="soft">
              {m.web_included()}
            </Chip>
          </Card.Header>
        </Card>
      ))}
    </div>
  );
}
