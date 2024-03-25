import { FormProps, FormSchema, createForm } from "remix-forms";
// For Remix, import it like this
import {
  Form as FrameworkForm,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";

const RemixForm = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
});

// function Form<Schema extends FormSchema>(props: FormProps<Schema>) {
//   return (
//     <RemixForm <Schema>
//       className={""}
//       fieldComponent={/* your custom Field */}
//       labelComponent={/* your custom Label */}
//       inputComponent={/* your custom Input */}
//       multilineComponent={/* your custom Multiline */}
//       selectComponent={/* your custom Select */}
//       checkboxComponent={/* your custom Checkbox */}
//       checkboxWrapperComponent={/* your custom checkbox wrapper */}
//       buttonComponent={/* your custom Button */}
//       fieldErrorsComponent={/* your custom FieldErrors */}
//       globalErrorsComponent={/* your custom GlobalErrors */}
//       errorComponent={/* your custom Error */}
//       {...props}
//     />
//   );
// }

export { RemixForm };
