import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  AriaButton,
  AriaDialog,
  AriaDialogTrigger,
  AriaHeading,
  AriaModal,
  AriaModalOverlay,
  AriaText,
} from "@iuvui/internal";
import { CloseIcon } from "@iuvui/icons/close";
import { cn } from "@iuvui/utils";

const InternalButton: any = AriaButton;
const InternalDialog: any = AriaDialog;
const InternalDialogTrigger: any = AriaDialogTrigger;
const InternalHeading: any = AriaHeading;
const InternalModal: any = AriaModal;
const InternalModalOverlay: any = AriaModalOverlay;
const InternalText: any = AriaText;

export interface DialogRootProps {
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}
const Root = ({
  children,
  defaultOpen,
  isOpen,
  onOpenChange,
}: DialogRootProps) => (
  <InternalDialogTrigger
    defaultOpen={defaultOpen}
    isOpen={isOpen}
    onOpenChange={onOpenChange}
  >
    {children}
  </InternalDialogTrigger>
);

const Trigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function DialogTrigger({ className, ...props }, ref) {
  return (
    <InternalButton
      {...props}
      ref={ref}
      className={className}
      data-slot="dialog-trigger"
    />
  );
});

export interface DialogBackdropProps extends HTMLAttributes<HTMLDivElement> {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}
const Backdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ className, ...props }, ref) {
    return (
      <InternalModalOverlay
        {...props}
        ref={ref}
        className={cn("ui-dialog__backdrop", className)}
        data-slot="dialog-backdrop"
        data-open=""
      />
    );
  },
);

const Positioner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogPositioner({ className, ...props }, ref) {
    return (
      <InternalModal
        {...props}
        ref={ref}
        className={cn("ui-dialog__positioner", className)}
        data-slot="dialog-positioner"
        data-open=""
      />
    );
  },
);

const Content = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function DialogContent({ className, ...props }, ref) {
    return (
      <InternalDialog
        {...props}
        ref={ref}
        className={cn("ui-dialog__content", className)}
        data-slot="dialog-content"
        data-ui-root=""
        data-open=""
      />
    );
  },
);

const Title = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <InternalHeading
      {...props}
      ref={ref}
      slot="title"
      className={cn("ui-dialog__title", className)}
      data-slot="dialog-title"
    />
  );
});

const Description = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <InternalText
      {...props}
      ref={ref}
      slot="description"
      className={cn("ui-dialog__description", className)}
      data-slot="dialog-description"
    />
  );
});

export interface DialogCloseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  children?: ReactNode;
}
const Close = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
    { "aria-label": ariaLabel = "Close dialog", children, className, ...props },
    ref,
  ) {
    return (
      <InternalButton
        {...props}
        ref={ref}
        slot="close"
        aria-label={ariaLabel}
        className={cn("ui-dialog__close", className)}
        data-slot="dialog-close"
      >
        {children ?? <CloseIcon size={18} />}
      </InternalButton>
    );
  },
);

export const Dialog = {
  Root,
  Trigger,
  Backdrop,
  Positioner,
  Content,
  Title,
  Description,
  Close,
} as const;
