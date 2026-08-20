import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "../src";

describe("shadcn-derived foundation components", () => {
  it("keeps Input and Label native semantics, slots, and consumer classes", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <div>
        <Label htmlFor="email" className="consumer-label">
          Email
        </Label>
        <Input
          ref={ref}
          className="consumer-input"
          id="email"
          aria-invalid="true"
          placeholder="name@example.com"
        />
      </div>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBe(ref.current);
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-ui-root");
    expect(input).toHaveClass("ui-input", "consumer-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email")).toHaveAttribute("data-slot", "label");
    expect(screen.getByText("Email")).toHaveClass("ui-label", "consumer-label");
  });

  it("keeps Textarea as a native multiline control", () => {
    render(
      <Textarea
        aria-label="Notes"
        className="consumer-textarea"
        defaultValue="Initial notes"
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea).toHaveAttribute("data-slot", "textarea");
    expect(textarea).toHaveAttribute("data-ui-root");
    expect(textarea).toHaveClass("ui-textarea", "consumer-textarea");
    expect(textarea).toHaveValue("Initial notes");
  });

  it("preserves the Card part anatomy", () => {
    render(
      <Card className="consumer-card">
        <CardHeader>
          <CardTitle>Project</CardTitle>
          <CardDescription>Current delivery status.</CardDescription>
          <CardAction>Active</CardAction>
        </CardHeader>
        <CardContent>Ready for review.</CardContent>
        <CardFooter>Updated today.</CardFooter>
      </Card>,
    );

    const card = screen.getByText("Project").closest("[data-slot='card']");
    expect(card).toHaveClass("ui-card", "consumer-card");
    expect(card).toHaveAttribute("data-ui-root");
    expect(screen.getByText("Project")).toHaveAttribute(
      "data-slot",
      "card-title",
    );
    expect(screen.getByText("Current delivery status.")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
    expect(screen.getByText("Active")).toHaveAttribute(
      "data-slot",
      "card-action",
    );
    expect(screen.getByText("Ready for review.")).toHaveAttribute(
      "data-slot",
      "card-content",
    );
    expect(screen.getByText("Updated today.")).toHaveAttribute(
      "data-slot",
      "card-footer",
    );
  });
});
