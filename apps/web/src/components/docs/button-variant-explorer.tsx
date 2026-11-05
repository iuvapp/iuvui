import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={value === option ? "default" : "ghost"}
            aria-pressed={value === option}
            onPress={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </fieldset>
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
        <CardHeader>
          <CardTitle>{m.web_variant_matrix_title()}</CardTitle>
          <CardDescription>
            {m.web_variant_matrix_description()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 rounded-xl bg-muted p-5 sm:grid-cols-2 xl:grid-cols-3">
            {buttonVariants.map((item) => (
              <div className="grid gap-2" key={item}>
                <span className="text-xs text-muted-foreground">{item}</span>
                <Button fullWidth variant={item}>
                  {m.web_preview_button()}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{m.web_variant_configure_title()}</CardTitle>
          <CardDescription>
            {m.web_variant_configure_description()}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid min-h-24 place-items-center rounded-xl border border-border bg-muted p-4">
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
        </CardContent>
        <CardFooter>
          <pre className="w-full overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-5">
            <code>{code}</code>
          </pre>
        </CardFooter>
      </Card>
    </div>
  );
}
