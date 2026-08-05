import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, TextField } from "@iuvui/react";

const ContractPage = () => {
  const [presses, setPresses] = useState(0);
  return (
    <main className="story-stack" data-testid="contract-page">
      <Button onPress={() => setPresses((value) => value + 1)}>
        Keyboard action
      </Button>
      <output aria-label="Press count">{presses}</output>
      <TextField.Root isInvalid isRequired>
        <TextField.Label>Account email</TextField.Label>
        <TextField.Input />
        <TextField.ErrorMessage>Email is required</TextField.ErrorMessage>
      </TextField.Root>
      <Dialog.Root>
        <Dialog.Trigger className="ui-button">
          Open contract dialog
        </Dialog.Trigger>
        <Dialog.Backdrop isDismissable>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>Contract dialog</Dialog.Title>
              <Dialog.Description>Focus contract.</Dialog.Description>
              <input aria-label="Dialog input" />
              <button>Secondary action</button>
              <Dialog.Close />
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Dialog.Root>
      <div className="story-row">
        <button
          onClick={() => {
            document.documentElement.dataset.theme = "light";
          }}
        >
          Light theme
        </button>
        <button
          onClick={() => {
            document.documentElement.dataset.theme = "dark";
          }}
        >
          Dark theme
        </button>
      </div>
    </main>
  );
};

const meta = { title: "Contracts/E2E", component: ContractPage } satisfies Meta<
  typeof ContractPage
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
