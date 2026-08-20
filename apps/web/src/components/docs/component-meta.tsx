import { Card, Chip, Link } from "@heroui/react";

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
      <Card.Header className="flex-row flex-wrap items-center justify-between gap-3">
        <code className="text-sm">{item.packagePath}</code>
        <div className="flex flex-wrap gap-2">
          <Chip size="sm" variant="soft">
            {item.delivery === "published"
              ? m.web_component_published()
              : m.web_component_workspace_preview()}
          </Chip>
          <Chip size="sm" variant="soft">
            v{item.version}
          </Chip>
        </div>
      </Card.Header>
      <Card.Footer className="flex-wrap justify-between gap-3">
        {item.sourceDelivery === "published" && item.registryPath ? (
          <Link href={item.registryPath} target="_blank">
            {m.web_registry_json()}
            <Link.Icon />
          </Link>
        ) : item.sourceDelivery === "workspace-preview" ? (
          <Chip size="sm" variant="soft">
            {m.web_source_workspace_preview()}
          </Chip>
        ) : (
          <Chip size="sm" variant="soft">
            {m.web_package_only()}
          </Chip>
        )}
        {item.sourceDelivery !== "package-only" ? (
          <span className="text-xs text-muted">{m.web_source_target()}</span>
        ) : null}
      </Card.Footer>
    </Card>
  );
}
