import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { BaseSelect } from "@iuvui/internal";
import { cn } from "@iuvui/utils";
import { chainEvent, usePressableState } from "./use-pressable-state";

type SelectRegistration = {
  registerLabel: (value: string, label: string) => void;
  valueId: string;
};

const SelectRegistrationContext = createContext<SelectRegistration | null>(
  null,
);

function collectLabels(node: ReactNode, labels: Map<string, string>) {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as { children?: ReactNode; value?: unknown };
    if (
      child.type === Item &&
      typeof props.value === "string" &&
      typeof props.children === "string"
    ) {
      labels.set(props.value, props.children);
    }
    if (props.children) collectLabels(props.children, labels);
  });
}

export interface SelectRootProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string | null;
  isDisabled?: boolean;
  isOpen?: boolean;
  isRequired?: boolean;
  name?: string;
  onOpenChange?: (isOpen: boolean) => void;
  onValueChange?: (value: string | null) => void;
  value?: string | null;
}

const Root = ({
  children,
  className,
  defaultOpen,
  defaultValue,
  isDisabled = false,
  isOpen,
  isRequired = false,
  name,
  onOpenChange,
  onValueChange,
  value,
}: SelectRootProps) => {
  const valueId = useId();
  const collectedLabels = useMemo(() => {
    const found = new Map<string, string>();
    collectLabels(children, found);
    return found;
  }, [children]);
  const [registeredLabels, setRegisteredLabels] = useState<
    ReadonlyMap<string, string>
  >(() => new Map());
  const labels = useMemo(() => {
    const next = new Map(collectedLabels);
    for (const [nextValue, label] of registeredLabels) {
      next.set(nextValue, label);
    }
    return next;
  }, [collectedLabels, registeredLabels]);
  const registerLabel = useCallback((nextValue: string, label: string) => {
    setRegisteredLabels((current) => {
      if (current.get(nextValue) === label) return current;
      const next = new Map(current);
      next.set(nextValue, label);
      return next;
    });
  }, []);
  const registration = useMemo(
    () => ({ registerLabel, valueId }),
    [registerLabel, valueId],
  );

  return (
    <BaseSelect.Root
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      disabled={isDisabled}
      itemToStringLabel={(next) => {
        if (next == null) return "";
        return labels.get(String(next)) ?? String(next);
      }}
      name={name}
      onOpenChange={(open) => onOpenChange?.(open)}
      onValueChange={(next) => onValueChange?.(next)}
      open={isOpen}
      required={isRequired}
      value={value}
    >
      <SelectRegistrationContext.Provider value={registration}>
        <div
          className={cn("ui-select", className)}
          data-disabled={isDisabled || undefined}
          data-required={isRequired || undefined}
          data-slot="select"
          data-ui-root=""
        >
          {children}
        </div>
      </SelectRegistrationContext.Provider>
    </BaseSelect.Root>
  );
};

export type SelectTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;
const Trigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, ...props }, ref) {
    const press = usePressableState();
    const registration = useContext(SelectRegistrationContext);
    return (
      <BaseSelect.Trigger
        {...props}
        {...press.dataProps}
        ref={ref}
        className={cn("ui-select__trigger", className)}
        data-slot="select-trigger"
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
        render={(domProps, state) => {
          const labelledBy =
            domProps["aria-label"] || domProps["aria-labelledby"]
              ? domProps["aria-labelledby"]
              : registration?.valueId;
          return (
            <button
              {...domProps}
              aria-labelledby={labelledBy || undefined}
              data-open={state.open ? "" : undefined}
            />
          );
        }}
      />
    );
  },
);

export interface SelectValueProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  children?: ReactNode | ((value: string | null) => ReactNode);
  placeholder?: ReactNode;
}
const Value = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ className, id, ...props }, ref) {
    const registration = useContext(SelectRegistrationContext);
    return (
      <BaseSelect.Value
        {...props}
        ref={ref}
        className={cn("ui-select__value", className)}
        data-slot="select-value"
        id={id ?? registration?.valueId}
      />
    );
  },
);

const Icon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function SelectIcon({ children, className, ...props }, ref) {
    return (
      <BaseSelect.Icon
        {...props}
        ref={ref}
        className={cn("ui-select__icon", className)}
        data-slot="select-icon"
      >
        {children ?? <span className="ui-select__chevron" />}
      </BaseSelect.Icon>
    );
  },
);

export type SelectContentProps = HTMLAttributes<HTMLDivElement>;
const Content = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent({ children, className, ...props }, ref) {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner>
          <BaseSelect.Popup
            {...props}
            ref={ref}
            className={cn("ui-select__content", className)}
            data-slot="select-content"
          >
            <BaseSelect.List>{children}</BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
);

export interface SelectItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "value"
> {
  isDisabled?: boolean;
  value: string;
}
const Item = forwardRef<HTMLElement, SelectItemProps>(function SelectItem(
  { children, className, isDisabled = false, value, ...props },
  ref,
) {
  const registration = useContext(SelectRegistrationContext);
  const label = typeof children === "string" ? children : undefined;
  useLayoutEffect(() => {
    if (label) registration?.registerLabel(value, label);
  }, [label, registration, value]);
  return (
    <BaseSelect.Item
      {...props}
      ref={ref}
      className={cn("ui-select__item", className)}
      data-slot="select-item"
      disabled={isDisabled}
      label={typeof children === "string" ? children : undefined}
      value={value}
    >
      <BaseSelect.ItemText className="ui-select__item-text">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator
        className="ui-select__item-indicator"
        data-slot="select-item-indicator"
      />
    </BaseSelect.Item>
  );
});

const Group = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SelectGroup({ className, ...props }, ref) {
    return (
      <BaseSelect.Group
        {...props}
        ref={ref}
        className={cn("ui-select__group", className)}
        data-slot="select-group"
      />
    );
  },
);

const GroupLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SelectGroupLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.GroupLabel
        {...props}
        ref={ref}
        className={cn("ui-select__group-label", className)}
        data-slot="select-group-label"
      />
    );
  },
);

const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SelectSeparator({ className, ...props }, ref) {
    return (
      <BaseSelect.Separator
        {...props}
        ref={ref}
        className={cn("ui-select__separator", className)}
        data-slot="select-separator"
      />
    );
  },
);

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Content,
  Item,
  Group,
  GroupLabel,
  Separator,
} as const;
