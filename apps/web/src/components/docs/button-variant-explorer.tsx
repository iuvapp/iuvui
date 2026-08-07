import { Button as HeroButton, Card } from "@heroui/react";
import {
  Button,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant,
} from "@iuvui/react";
import { useState } from "react";

import { buttonRadii, buttonSizes, buttonVariants } from "../../catalog";
import * as m from "../../paraglide/messages.js";

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

export function ButtonVariantExplorer() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [size, setSize] = useState<ButtonSize>("md");
  const [radius, setRadius] = useState<ButtonRadius>("md");
  const code = `<Button variant="${variant}" size="${size}" radius="${radius}">
  Button
</Button>`;

  return (
    <div className="not-prose grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
                <Button fullWidth variant={item}>
                  {m.web_preview_button()}
                </Button>
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
            <Button radius={radius} size={size} variant={variant}>
              {m.web_preview_button()}
            </Button>
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
