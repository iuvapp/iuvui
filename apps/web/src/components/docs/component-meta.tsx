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
        <Chip size="sm" variant="soft">
          v{item.version}
        </Chip>
      </Card.Header>
      <Card.Footer>
        {item.registryPath ? (
          <Link href={item.registryPath} target="_blank">
            {m.web_registry_json()}
            <Link.Icon />
          </Link>
        ) : (
          <Chip size="sm" variant="soft">
            {m.web_package_only()}
          </Chip>
        )}
      </Card.Footer>
    </Card>
  );
}
