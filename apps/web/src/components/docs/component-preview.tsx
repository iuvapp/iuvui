import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Label,
  Separator,
  Textarea,
  TextField,
} from "@iuvui/react";
import { useId } from "react";

import type { ComponentId } from "../../catalog";
import * as m from "../../paraglide/messages.js";

export function ComponentPreview({ id }: { id: ComponentId }) {
  const previewId = useId();

  if (id === "button") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button>{m.web_preview_primary()}</Button>
        <Button variant="secondary">{m.web_preview_secondary()}</Button>
        <Button variant="outline">{m.web_preview_outline()}</Button>
      </div>
    );
  }

  if (id === "card") {
    return (
      <Card className="max-w-xs gap-3 py-4 shadow-none">
        <CardHeader>
          <CardTitle>{m.web_preview_card_title()}</CardTitle>
          <CardDescription>{m.web_preview_card_description()}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          {m.web_preview_card_content()}
        </CardContent>
      </Card>
    );
  }

  if (id === "text-field") {
    return (
      <TextField.Root className="max-w-xs">
        <TextField.Label>{m.web_preview_email()}</TextField.Label>
        <TextField.Input placeholder="name@example.com" />
        <TextField.Description>
          {m.web_preview_text_field_description()}
        </TextField.Description>
      </TextField.Root>
    );
  }

  if (id === "dialog") {
    return (
      <Dialog.Root>
        <Dialog.Trigger className="ui-button">
          {m.web_preview_open_dialog()}
        </Dialog.Trigger>
        <Dialog.Backdrop>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Close aria-label={m.web_preview_close_dialog()} />
              <Dialog.Title>{m.web_preview_dialog_title()}</Dialog.Title>
              <Dialog.Description>
                {m.web_preview_dialog_description()}
              </Dialog.Description>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Dialog.Root>
    );
  }

  if (id === "input") {
    const inputId = `${previewId}-input`;

    return (
      <div className="grid max-w-xs gap-2">
        <Label htmlFor={inputId}>{m.web_preview_input_label()}</Label>
        <Input id={inputId} placeholder={m.web_preview_input_placeholder()} />
      </div>
    );
  }

  if (id === "label") {
    const inputId = `${previewId}-labelled-input`;

    return (
      <div className="grid max-w-xs gap-2">
        <Label htmlFor={inputId}>{m.web_preview_label_text()}</Label>
        <Input id={inputId} placeholder={m.web_preview_label_placeholder()} />
      </div>
    );
  }

  if (id === "textarea") {
    const textareaId = `${previewId}-textarea`;

    return (
      <div className="grid max-w-xs gap-2">
        <Label htmlFor={textareaId}>{m.web_preview_textarea_label()}</Label>
        <Textarea
          id={textareaId}
          placeholder={m.web_preview_textarea_placeholder()}
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Separator />
      <div className="flex h-8 items-center gap-4 text-sm text-muted">
        <span>{m.web_preview_before()}</span>
        <Separator className="h-6" orientation="vertical" />
        <span>{m.web_preview_after()}</span>
      </div>
    </div>
  );
}
