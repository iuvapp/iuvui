import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocumentationPage, getDocsPageData } from "../../docs/page";

export const Route = createFileRoute("/docs/")({
  component: DocsIndexRoute,
  loader: async () => {
    const data = await getDocsPageData([]);

    if (!data) {
      // TanStack Router represents route-level 404 responses as thrown values.
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }

    return data;
  },
});

function DocsIndexRoute() {
  return <DocumentationPage data={Route.useLoaderData()} />;
}
