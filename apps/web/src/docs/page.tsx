import { createServerFn } from "@tanstack/react-start";
import {
  useFumadocsLoader,
  type SerializedPageTree,
} from "fumadocs-core/source/client";
import { GlassLayout } from "fumadocs-ui/layouts/glass";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/glass/page";
import { Suspense, use } from "react";

import { docsLayoutOptions } from "./layout";
import { useMDXComponents } from "./mdx";
import { docs, source } from "./source";

export type DocsPageData = {
  description: string | undefined;
  pageTree: SerializedPageTree;
  path: string;
  title: string;
};

export const loadDocsPage = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);

    if (!page) return null;

    return {
      description: page.data.description,
      pageTree: await source.serializePageTree(source.getPageTree()),
      path: page.path,
      title: page.data.title,
    } satisfies DocsPageData;
  });

export async function getDocsPageData(slugs: string[]) {
  const data = await loadDocsPage({ data: slugs });

  if (!data) return null;

  await docs.getPage(data.path)?.preload();

  return data;
}

function getDocumentationTabs(pageTree: Parameters<typeof getLayoutTabs>[0]) {
  return getLayoutTabs(pageTree, {
    transform: (tab) => {
      const transformedTab = { ...tab };
      delete transformedTab.$folder;
      return transformedTab;
    },
  });
}

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

export function DocumentationPage({ data }: { data: DocsPageData }) {
  const { pageTree, path } = useFumadocsLoader(data);

  return (
    <GlassLayout
      {...docsLayoutOptions()}
      tabs={getDocumentationTabs(pageTree)}
      tree={pageTree}
    >
      <Suspense>
        <DocsContent path={path} />
      </Suspense>
    </GlassLayout>
  );
}
