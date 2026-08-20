import { expectTypeOf, it } from "vitest";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  extendVariants,
  Input,
  Label,
  Separator,
  Textarea,
  TextField,
} from "../src";

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
  expectTypeOf(
    <div>
      <Label htmlFor="project-name">Project name</Label>
      <Input id="project-name" />
      <Textarea aria-label="Project notes" />
    </div>,
  ).toMatchTypeOf<React.ReactElement>();
  expectTypeOf(
    <Card>
      <CardHeader>
        <CardTitle>Delivery</CardTitle>
      </CardHeader>
      <CardContent>Ready</CardContent>
    </Card>,
  ).toMatchTypeOf<React.ReactElement>();
});
