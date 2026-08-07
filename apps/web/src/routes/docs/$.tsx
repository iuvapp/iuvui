import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { Suspense, use } from "react";

import { docsLayoutOptions } from "../../docs/layout";
import { useMDXComponents } from "../../docs/mdx";
import { docs, source } from "../../docs/source";

const loadDocsPage = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);

    if (!page) return null;

    return {
      description: page.data.description,
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
      title: page.data.title,
    };
  });

export const Route = createFileRoute("/docs/$")({
  component: DocsRoute,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await loadDocsPage({ data: slugs });

    if (!data) {
      // TanStack Router represents route-level 404 responses as thrown values.
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }

    await docs.getPage(data.path)?.preload();

    return data;
  },
});

function DocsContent({ path }: { path: string }) {
  const page = docs.getPage(path);

  if (!page) {
    throw new Error(`Unknown documentation page: ${path}`);
  }

  const { toc } = use(page.load());
  const MDXContent = page.body;

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <MDXContent components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function DocsRoute() {
  const { pageTree, path } = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...docsLayoutOptions()} tree={pageTree}>
      <Suspense>
        <DocsContent path={path} />
      </Suspense>
    </DocsLayout>
  );
}
