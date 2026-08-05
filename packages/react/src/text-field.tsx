import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import {
  AriaFieldError,
  AriaInput,
  AriaLabel,
  AriaText,
  AriaTextField,
} from "@iuvui/internal";
import { cn } from "@iuvui/utils";

const InternalTextField: any = AriaTextField;
const InternalLabel: any = AriaLabel;
const InternalInput: any = AriaInput;
const InternalText: any = AriaText;
const InternalFieldError: any = AriaFieldError;

export interface TextFieldRootProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  children: ReactNode;
  defaultValue?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const Root = forwardRef<HTMLDivElement, TextFieldRootProps>(
  function TextFieldRoot(
    { className, isDisabled, isInvalid, isRequired, ...props },
    ref,
  ) {
    return (
      <InternalTextField
        {...props}
        ref={ref}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isRequired={isRequired}
        className={cn("ui-text-field", className)}
        data-slot="text-field"
        data-ui-root=""
      />
    );
  },
);

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(function TextFieldLabel({ className, ...props }, ref) {
  return (
    <InternalLabel
      {...props}
      ref={ref}
      className={cn("ui-text-field__label", className)}
      data-slot="text-field-label"
    />
  );
});

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function TextFieldInput({ className, ...props }, ref) {
  return (
    <InternalInput
      {...props}
      ref={ref}
      className={cn("ui-text-field__input", className)}
      data-slot="text-field-input"
    />
  );
});

const Description = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function TextFieldDescription({ className, ...props }, ref) {
  return (
    <InternalText
      {...props}
      ref={ref}
      slot="description"
      className={cn("ui-text-field__description", className)}
      data-slot="text-field-description"
    />
  );
});

const ErrorMessage = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function TextFieldErrorMessage({ className, ...props }, ref) {
    return (
      <InternalFieldError
        {...props}
        ref={ref}
        className={cn("ui-text-field__error", className)}
        data-slot="text-field-error"
      />
    );
  },
);

export const TextField = {
  Root,
  Label,
  Input,
  Description,
  ErrorMessage,
} as const;
