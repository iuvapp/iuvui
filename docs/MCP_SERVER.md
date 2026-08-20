# iuvui MCP Server

## Purpose

The iuvui MCP server is a free, public documentation and capability-discovery service. It helps agents find component documentation, Registry metadata, examples, and public descriptions of Pro capabilities. It never delivers paid assets.

## Ownership and deployment

The server belongs in a separate public `iuv-tech/iuvui-mcp` repository rather
than the public website or the future private `iuv-pro` repository.

```text
iuvui-mcp-dev   -> mcp.iuvdev.com/mcp
iuvui-mcp-prod  -> mcp.iuvui.com/mcp
```

The first implementation is a stateless Cloudflare Worker using the current Streamable HTTP transport and `createMcpHandler`. It does not require Durable Objects, Clerk, Convex, or a database. Documentation and catalog data are imported as a versioned build-time snapshot from the public iuvui repository.

## Initial protocol surface

Resource templates:

```text
iuvui://docs/{locale}/{slug}
iuvui://components/{name}
iuvui://registry/{name}
iuvui://catalog/{assetType}/{id}
```

Initial tools:

- `search`: find public documentation and catalog entries;
- `read`: retrieve one public document or Registry record.

English is the default locale. English and Simplified Chinese documentation may be returned when the requested locale exists.

## Free and Pro boundary

Free entries may include complete public documentation, examples, Registry contents, and installation instructions. Pro entries expose only public metadata:

- capability name and description;
- asset type such as style, variant, or animation;
- compatible public component and package versions;
- the fact that `@iuvui/pro` and an entitled CLI session are required;
- the documented CLI command that an authorized user may run.

The MCP server must never return Pro source, compiled paid CSS, animation presets, signed download URLs, access tokens, Clerk session data, or entitlement decisions. The open-source CLI performs login, asks the iuvui backend to verify entitlement, downloads authorized assets, validates integrity, and records non-secret provenance locally.

## Versioning and provenance

Every MCP build records the public documentation snapshot revision and Registry item versions it indexes. Component results preserve shadcn upstream provenance from the public Registry so agents can distinguish upstream source identity, iuvui adaptations, and the version installed in a consumer project.

MCP releases remain in the `0.0.x` range until the project explicitly unlocks `0.1.0`. No deployment or npm publication occurs automatically from this repository.
