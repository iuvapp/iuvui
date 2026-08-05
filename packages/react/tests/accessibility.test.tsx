import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { Button } from "../src/button";
import { Separator } from "../src/separator";
import { TextField } from "../src/text-field";

describe("automated accessibility", () => {
  it("has no detectable axe violations in representative components", async () => {
    const { container } = render(
      <main>
        <Button>Save</Button>
        <Separator />
        <TextField.Root>
          <TextField.Label>Name</TextField.Label>
          <TextField.Input />
        </TextField.Root>
      </main>,
    );
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
