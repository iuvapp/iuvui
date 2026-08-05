import { expectTypeOf, it } from "vitest";
import { Button, extendVariants, Separator, TextField } from "../src";

it("keeps public variants type safe", () => {
  const BrandButton = extendVariants(Button, {
    variants: { tone: { brand: "bg-fuchsia-600", danger: "bg-red-600" } },
    defaultVariants: { tone: "brand" },
  });
  expectTypeOf(
    <BrandButton tone="danger">Delete</BrandButton>,
  ).toMatchTypeOf<React.ReactElement>();
  expectTypeOf(
    <TextField.Root>
      <TextField.Input />
    </TextField.Root>,
  ).toMatchTypeOf<React.ReactElement>();
  expectTypeOf(
    <Separator orientation="vertical" />,
  ).toMatchTypeOf<React.ReactElement>();
});
