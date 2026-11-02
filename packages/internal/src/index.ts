// Private behavior adapter. Public packages consume these aliases but never re-export them or their types.
export { Button as BaseButton } from "@base-ui/react/button";
export { Dialog as BaseDialog } from "@base-ui/react/dialog";
export { Select as BaseSelect } from "@base-ui/react/select";
export {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  Separator as AriaSeparator,
  Text as AriaText,
  TextField as AriaTextField,
} from "react-aria-components";
