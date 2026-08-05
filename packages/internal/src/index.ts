// Private behavior adapter. Public packages consume these aliases but never re-export them or their types.
export {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  FieldError as AriaFieldError,
  Heading as AriaHeading,
  Input as AriaInput,
  Label as AriaLabel,
  Link as AriaLink,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  Text as AriaText,
  TextField as AriaTextField,
} from "react-aria-components";
export type {
  ButtonRenderProps as AriaButtonRenderProps,
  LinkRenderProps as AriaLinkRenderProps,
} from "react-aria-components";
