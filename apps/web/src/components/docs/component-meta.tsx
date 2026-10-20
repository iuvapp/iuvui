import { Card, CardHeader, CardFooter } from "@iuvui/react";
import { ActionLink, StatusBadge } from "@iuvui/site-ui";

import {
  componentCatalog,
  type ComponentCatalogItem,
  type ComponentId,
} from "../../catalog";
import * as m from "../../paraglide/messages.js";

export function ComponentMeta({ id }: { id: ComponentId }) {
  const item = componentCatalog.find((component) => component.id === id) as
    ComponentCatalogItem | undefined;

  if (!item) {
    throw new Error(`Unknown component metadata: ${id}`);
  }

  return (
    <Card className="not-prose my-6">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <code className="text-sm">{item.packagePath}</code>
        <div className="flex flex-wrap gap-2">
          <StatusBadge>
            {item.delivery === "published"
              ? m.web_component_published()
              : m.web_component_workspace_preview()}
          </StatusBadge>
          <StatusBadge>v{item.version}</StatusBadge>
        </div>
      </CardHeader>
      <CardFooter className="flex-wrap justify-between gap-3">
        {item.sourceDelivery === "published" && item.registryPath ? (
          <ActionLink
            arrow
            href={item.registryPath}
            target="_blank"
            rel="noreferrer"
          >
            {m.web_registry_json()}
          </ActionLink>
        ) : item.sourceDelivery === "workspace-preview" ? (
          <StatusBadge>{m.web_source_workspace_preview()}</StatusBadge>
        ) : (
          <StatusBadge>{m.web_package_only()}</StatusBadge>
        )}
        {item.sourceDelivery !== "package-only" ? (
          <span className="text-xs text-muted-foreground">
            {m.web_source_target()}
          </span>
        ) : null}
      </CardFooter>
    </Card>
  );
}
