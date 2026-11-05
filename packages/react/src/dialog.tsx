import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { BaseDialog } from "@iuvui/internal";
import { CloseIcon } from "@iuvui/icons/close";
import { cn } from "@iuvui/utils";
import { chainEvent, usePressableState } from "./use-pressable-state";

interface DialogFlags {
  dismissable: boolean;
  keyboardDismissDisabled: boolean;
}

const DialogFlagsContext = createContext<((next: DialogFlags) => void) | null>(
  null,
);

const transitionAttributes = (
  status: "ending" | "idle" | "starting" | undefined,
) => ({
  "data-entering": status === "starting" ? "" : undefined,
  "data-exiting": status === "ending" ? "" : undefined,
});

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
}: DialogRootProps) => {
  const flags = useRef<DialogFlags>({
    dismissable: false,
    keyboardDismissDisabled: false,
  });
  const setFlags = useCallback((next: DialogFlags) => {
    flags.current = next;
  }, []);

  return (
    <DialogFlagsContext.Provider value={setFlags}>
      <BaseDialog.Root
        defaultOpen={defaultOpen}
        open={isOpen}
        onOpenChange={(open, details) => {
          if (
            !open &&
            details.reason === "outside-press" &&
            !flags.current.dismissable
          ) {
            details.cancel();
            return;
          }
          if (
            !open &&
            details.reason === "escape-key" &&
            flags.current.keyboardDismissDisabled
          ) {
            details.cancel();
            return;
          }
          onOpenChange?.(open);
        }}
      >
        {children}
      </BaseDialog.Root>
    </DialogFlagsContext.Provider>
  );
};

const Trigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function DialogTrigger({ className, ...props }, ref) {
  const press = usePressableState();
  return (
    <BaseDialog.Trigger
      {...props}
      {...press.dataProps}
      ref={ref}
      className={className}
      data-slot="dialog-trigger"
      onBlur={chainEvent(props.onBlur, press.listeners.onBlur)}
      onFocus={chainEvent(props.onFocus, press.listeners.onFocus)}
      onKeyDown={chainEvent(props.onKeyDown, press.listeners.onKeyDown)}
      onKeyUp={chainEvent(props.onKeyUp, press.listeners.onKeyUp)}
      onPointerDown={chainEvent(
        props.onPointerDown,
        press.listeners.onPointerDown,
      )}
      onPointerEnter={chainEvent(
        props.onPointerEnter,
        press.listeners.onPointerEnter,
      )}
      onPointerLeave={chainEvent(
        props.onPointerLeave,
        press.listeners.onPointerLeave,
      )}
      onPointerUp={chainEvent(props.onPointerUp, press.listeners.onPointerUp)}
    />
  );
});

export interface DialogBackdropProps extends HTMLAttributes<HTMLDivElement> {
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}
const Backdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop(
    {
      children,
      className,
      isDismissable = false,
      isKeyboardDismissDisabled = false,
      ...props
    },
    ref,
  ) {
    const setFlags = useContext(DialogFlagsContext);
    useLayoutEffect(() => {
      setFlags?.({
        dismissable: isDismissable,
        keyboardDismissDisabled: isKeyboardDismissDisabled,
      });
    }, [isDismissable, isKeyboardDismissDisabled, setFlags]);

    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          {...props}
          ref={ref}
          className={cn("ui-dialog__backdrop", className)}
          data-slot="dialog-backdrop"
          render={(domProps, state) => (
            <div
              {...domProps}
              {...transitionAttributes(state.transitionStatus)}
            />
          )}
        />
        {children}
      </BaseDialog.Portal>
    );
  },
);

const Positioner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogPositioner({ className, ...props }, ref) {
    return (
      <BaseDialog.Viewport
        {...props}
        ref={ref}
        className={cn("ui-dialog__positioner", className)}
        data-slot="dialog-positioner"
        render={(domProps, state) => (
          <div
            {...domProps}
            {...transitionAttributes(state.transitionStatus)}
          />
        )}
      />
    );
  },
);

const Content = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function DialogContent({ className, ...props }, ref) {
    return (
      <BaseDialog.Popup
        {...props}
        ref={ref as Ref<HTMLDivElement>}
        className={cn("ui-dialog__content", className)}
        data-slot="dialog-content"
        data-ui-root=""
        render={(domProps, state) => (
          <div
            {...domProps}
            {...transitionAttributes(state.transitionStatus)}
          />
        )}
      />
    );
  },
);

const Title = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <BaseDialog.Title
      {...props}
      ref={ref}
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
    <BaseDialog.Description
      {...props}
      ref={ref}
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
    const press = usePressableState();
    return (
      <BaseDialog.Close
        {...props}
        {...press.dataProps}
        ref={ref}
        aria-label={ariaLabel}
        className={cn("ui-dialog__close", className)}
        data-slot="dialog-close"
        onBlur={chainEvent(props.onBlur, press.listeners.onBlur)}
        onFocus={chainEvent(props.onFocus, press.listeners.onFocus)}
        onKeyDown={chainEvent(props.onKeyDown, press.listeners.onKeyDown)}
        onKeyUp={chainEvent(props.onKeyUp, press.listeners.onKeyUp)}
        onPointerDown={chainEvent(
          props.onPointerDown,
          press.listeners.onPointerDown,
        )}
        onPointerEnter={chainEvent(
          props.onPointerEnter,
          press.listeners.onPointerEnter,
        )}
        onPointerLeave={chainEvent(
          props.onPointerLeave,
          press.listeners.onPointerLeave,
        )}
        onPointerUp={chainEvent(props.onPointerUp, press.listeners.onPointerUp)}
      >
        {children ?? <CloseIcon size={18} />}
      </BaseDialog.Close>
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
