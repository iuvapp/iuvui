import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "../src/text-field";

describe("TextField", () => {
  it("associates label, description, and error while preserving slots", async () => {
    const onChange = vi.fn();
    render(
      <TextField.Root name="email" isRequired isInvalid onChange={onChange}>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input />
        <TextField.Description>Work email</TextField.Description>
        <TextField.ErrorMessage>Enter a valid email</TextField.ErrorMessage>
      </TextField.Root>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-describedby");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-slot", "text-field-input");
    expect(screen.getByText("Enter a valid email")).toHaveAttribute(
      "data-slot",
      "text-field-error",
    );
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenLastCalledWith("a");
  });
});
