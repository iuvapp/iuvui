import {
  Button as HeroButton,
  Card,
  Chip,
  Link,
  SearchField,
} from "@heroui/react";
import {
  Button as IuvButton,
  Dialog as IuvDialog,
  Separator as IuvSeparator,
  TextField as IuvTextField,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant,
} from "@iuvui/react";
import { useState } from "react";

import {
  buttonRadii,
  buttonSizes,
  buttonVariants,
  componentCatalog,
  matchesCatalogQuery,
  separatorOrientations,
  styleExports,
  type ComponentCatalogItem,
  type ComponentId,
} from "./catalog";
import * as m from "./paraglide/messages.js";
import { getLocale, setLocale } from "./paraglide/runtime.js";

const packageCommand = "pnpm add @iuvui/react @iuvui/styles";
const githubUrl = "https://github.com/iuv-tech/iuvui";

function LanguageToggle() {
  const nextLocale = getLocale() === "en" ? "zh-CN" : "en";

  return (
    <HeroButton
      aria-label={m.common_switch_language()}
      size="sm"
      variant="ghost"
      onPress={() => void setLocale(nextLocale)}
    >
      {nextLocale === "en" ? "EN" : "ZH"}
    </HeroButton>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-separator bg-surface px-4 py-2">
      <code className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {command}
      </code>
      <HeroButton size="sm" variant="ghost" onPress={() => void copy()}>
        {copied ? m.common_copied() : m.common_copy()}
      </HeroButton>
    </div>
  );
}

function componentCopy(id: ComponentId) {
  const copy = {
    button: {
      description: m.web_component_button_description(),
      title: m.web_component_button(),
    },
    dialog: {
      description: m.web_component_dialog_description(),
      title: m.web_component_dialog(),
    },
    separator: {
      description: m.web_component_separator_description(),
      title: m.web_component_separator(),
    },
    "text-field": {
      description: m.web_component_text_field_description(),
      title: m.web_component_text_field(),
    },
  } as const;

  return copy[id];
}

function categoryLabel(category: ComponentCatalogItem["category"]) {
  return {
    actions: m.web_category_actions(),
    forms: m.web_category_forms(),
    layout: m.web_category_layout(),
    overlays: m.web_category_overlays(),
  }[category];
}

function ComponentPreview({ id }: { id: ComponentId }) {
  if (id === "button") {
    return (
      <div className="flex flex-wrap gap-2">
        <IuvButton>{m.web_preview_primary()}</IuvButton>
        <IuvButton variant="secondary">{m.web_preview_secondary()}</IuvButton>
        <IuvButton variant="outline">{m.web_preview_outline()}</IuvButton>
      </div>
    );
  }

  if (id === "text-field") {
    return (
      <IuvTextField.Root className="max-w-xs">
        <IuvTextField.Label>{m.web_preview_email()}</IuvTextField.Label>
        <IuvTextField.Input placeholder="name@example.com" />
        <IuvTextField.Description>
          {m.web_preview_text_field_description()}
        </IuvTextField.Description>
      </IuvTextField.Root>
    );
  }

  if (id === "dialog") {
    return (
      <IuvDialog.Root>
        <IuvDialog.Trigger className="ui-button">
          {m.web_preview_open_dialog()}
        </IuvDialog.Trigger>
        <IuvDialog.Backdrop>
          <IuvDialog.Positioner>
            <IuvDialog.Content>
              <IuvDialog.Close aria-label={m.web_preview_close_dialog()} />
              <IuvDialog.Title>{m.web_preview_dialog_title()}</IuvDialog.Title>
              <IuvDialog.Description>
                {m.web_preview_dialog_description()}
              </IuvDialog.Description>
            </IuvDialog.Content>
          </IuvDialog.Positioner>
        </IuvDialog.Backdrop>
      </IuvDialog.Root>
    );
  }

  return (
    <div className="grid gap-4">
      <IuvSeparator />
      <div className="flex h-8 items-center gap-4 text-sm text-muted">
        <span>{m.web_preview_before()}</span>
        <IuvSeparator className="h-6" orientation="vertical" />
        <span>{m.web_preview_after()}</span>
      </div>
    </div>
  );
}

function ComponentCard({ item }: { item: ComponentCatalogItem }) {
  const copy = componentCopy(item.id);

  return (
    <Card className="h-full">
      <Card.Header className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Chip size="sm" variant="soft">
            {categoryLabel(item.category)}
          </Chip>
          <span className="text-xs text-muted">v{item.version}</span>
        </div>
        <div>
          <Card.Title>{copy.title}</Card.Title>
          <Card.Description>{copy.description}</Card.Description>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="min-h-32 rounded-xl bg-surface-secondary p-5">
          <ComponentPreview id={item.id} />
        </div>
      </Card.Content>
      <Card.Footer className="flex-wrap justify-between gap-3">
        <code className="text-xs text-muted">{item.packagePath}</code>
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

function OptionGroup<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <HeroButton
            key={option}
            size="sm"
            variant={value === option ? "primary" : "ghost"}
            onPress={() => onChange(option)}
          >
            {option}
          </HeroButton>
        ))}
      </div>
    </div>
  );
}

function VariantExplorer() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [size, setSize] = useState<ButtonSize>("md");
  const [radius, setRadius] = useState<ButtonRadius>("md");
  const code = `<Button variant="${variant}" size="${size}" radius="${radius}">\n  Button\n</Button>`;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card className="min-w-0">
        <Card.Header>
          <Card.Title>{m.web_variant_matrix_title()}</Card.Title>
          <Card.Description>
            {m.web_variant_matrix_description()}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-3 rounded-xl bg-surface-secondary p-5 sm:grid-cols-2 xl:grid-cols-3">
            {buttonVariants.map((item) => (
              <div className="grid gap-2" key={item}>
                <span className="text-xs text-muted">{item}</span>
                <IuvButton fullWidth variant={item}>
                  {m.web_preview_button()}
                </IuvButton>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      <Card className="min-w-0">
        <Card.Header>
          <Card.Title>{m.web_variant_configure_title()}</Card.Title>
          <Card.Description>
            {m.web_variant_configure_description()}
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-5">
          <div className="grid min-h-24 place-items-center rounded-xl border border-separator bg-surface-secondary p-4">
            <IuvButton radius={radius} size={size} variant={variant}>
              {m.web_preview_button()}
            </IuvButton>
          </div>
          <OptionGroup
            label={m.web_variant_label()}
            options={buttonVariants}
            value={variant}
            onChange={setVariant}
          />
          <OptionGroup
            label={m.web_size_label()}
            options={buttonSizes}
            value={size}
            onChange={setSize}
          />
          <OptionGroup
            label={m.web_radius_label()}
            options={buttonRadii}
            value={radius}
            onChange={setRadius}
          />
        </Card.Content>
        <Card.Footer>
          <pre className="w-full overflow-x-auto rounded-xl bg-surface-secondary p-4 text-xs leading-5">
            <code>{code}</code>
          </pre>
        </Card.Footer>
      </Card>
    </div>
  );
}

function StylesCatalog() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
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

function DocsSidebar() {
  const links = [
    ["#overview", m.web_nav_overview()],
    ["#components", m.web_nav_components()],
    ["#variants", m.web_nav_variants()],
    ["#styles", m.web_nav_styles()],
    ["/r/registry.json", m.web_nav_registry()],
  ] as const;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-separator py-8 pr-6 lg:block">
      <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted">
        {m.web_sidebar_title()}
      </p>
      <nav aria-label={m.web_docs_navigation()} className="mt-3 grid gap-1">
        {links.map(([href, label]) => (
          <Link
            className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function App() {
  const [query, setQuery] = useState("");
  const localizedCatalog = componentCatalog.map((item) => ({
    ...item,
    copy: componentCopy(item.id),
  }));
  const filteredCatalog = localizedCatalog.filter((item) =>
    matchesCatalogQuery(
      item,
      query,
      `${item.copy.title} ${item.copy.description} ${categoryLabel(item.category)}`,
    ),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-separator bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link
            className="shrink-0 text-lg font-semibold text-foreground"
            href="#overview"
          >
            iuvui
          </Link>
          <nav
            aria-label={m.web_primary_navigation()}
            className="hidden items-center gap-5 md:flex"
          >
            <Link href="#components">{m.web_nav_components()}</Link>
            <Link href="#variants">{m.web_nav_variants()}</Link>
            <Link href="#styles">{m.web_nav_styles()}</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              className="hidden sm:inline-flex"
              href={githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <DocsSidebar />

        <main className="min-w-0 pb-24">
          <section
            className="scroll-mt-24 border-b border-separator py-14 sm:py-16"
            id="overview"
          >
            <Chip color="accent" variant="soft">
              {m.web_status()}
            </Chip>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {m.web_slogan()}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {m.web_summary()}
            </p>
            <div className="mt-8 max-w-2xl">
              <CopyCommand command={packageCommand} />
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span>
                {m.web_component_count({ count: componentCatalog.length })}
              </span>
              <span>{m.web_package_version({ version: "0.0.1" })}</span>
              <span>{m.web_license()}</span>
            </div>
          </section>

          <section className="scroll-mt-24 py-14" id="components">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-accent">
                  {m.web_catalog_eyebrow()}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  {m.web_components_title()}
                </h2>
                <p className="mt-3 leading-7 text-muted">
                  {m.web_components_description()}
                </p>
              </div>
              <SearchField
                aria-label={m.web_search_label()}
                className="w-full sm:max-w-xs"
                value={query}
                variant="secondary"
                onChange={setQuery}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder={m.web_search_placeholder()} />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </div>

            {filteredCatalog.length ? (
              <div className="mt-8 grid gap-4 xl:grid-cols-2">
                {filteredCatalog.map((item) => (
                  <ComponentCard item={item} key={item.id} />
                ))}
              </div>
            ) : (
              <Card className="mt-8">
                <Card.Header>
                  <Card.Title>{m.web_no_components_title()}</Card.Title>
                  <Card.Description>
                    {m.web_no_components_description()}
                  </Card.Description>
                </Card.Header>
              </Card>
            )}
          </section>

          <section
            className="scroll-mt-24 border-t border-separator py-14"
            id="variants"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-accent">
                {m.web_variants_eyebrow()}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {m.web_variants_title()}
              </h2>
              <p className="mt-3 leading-7 text-muted">
                {m.web_variants_description()}
              </p>
            </div>
            <div className="mt-8">
              <VariantExplorer />
            </div>
            <Card className="mt-4" variant="secondary">
              <Card.Header>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Card.Title>
                      {m.web_separator_orientation_title()}
                    </Card.Title>
                    <Card.Description>
                      {m.web_separator_orientation_description()}
                    </Card.Description>
                  </div>
                  <div className="flex gap-2">
                    {separatorOrientations.map((orientation) => (
                      <Chip key={orientation} variant="soft">
                        {orientation}
                      </Chip>
                    ))}
                  </div>
                </div>
              </Card.Header>
            </Card>
          </section>

          <section
            className="scroll-mt-24 border-t border-separator py-14"
            id="styles"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-accent">
                {m.web_styles_eyebrow()}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {m.web_styles_title()}
              </h2>
              <p className="mt-3 leading-7 text-muted">
                {m.web_styles_description()}
              </p>
            </div>
            <div className="mt-8">
              <StylesCatalog />
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-separator">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-medium text-foreground">iuvui</span>
          <span>{m.web_independence_notice()}</span>
          <span>© 2026 iuvui</span>
        </div>
      </footer>
    </div>
  );
}
