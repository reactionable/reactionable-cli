export default `{{#> Component }}
{{#*inline "imports-head-block"}}{{/inline}}
{{#*inline "imports-block"}}
import { Create, ICreateProps } from "{{ uiPackage }}";

import { 
  I{{ entityName }}Values, 
  I{{ entityName }}Data, 
  use{{ entitiesName }}Config
} from "../{{ entitiesName }}Config";
{{/inline}}
{{#*inline "props-block"}}
type ICreate{{ entityName }}Props = {
  onSuccess?: ICreateProps<I{{ entityName }}Values, I{{ entityName }}Data>["form"]["onSuccess"];
};
{{/inline}}
{{#*inline "head-block"}}{{/inline}}
{{#*inline "pre-render-block"}}
  const {
    onCreate,
    initialValues,
    validationSchema,
    formChildren,
  } = use{{ entitiesName }}Config();

  const form = {
    title: t("Create a new {{decamelize entityName }}"),
    onSubmit: onCreate,
    initialValues,
    validationSchema,
    children: formChildren,
    successMessage: "{{ entityName }} has been successfully created",
    onSuccess: props.onSuccess,
  };
{{/inline}}
{{#*inline "render-block-title"}}{{/inline}}
{{#*inline "render-block"}}<Create<I{{ entityName }}Values, I{{ entityName }}Data> modal form={form}>{props.children}</Create>{{/inline}}{{/Component}}`;
