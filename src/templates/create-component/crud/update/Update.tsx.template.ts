export default `{{#> Component }}
{{#*inline "imports-head-block"}}{{/inline}}
{{#*inline "imports-block"}}
import { useRouteMatch } from "{{ routerPackage }}";
import { Update, IUpdateProps } from "{{ uiPackage }}";

import { I{{ entityName }}Values, I{{ entityName }}Data, use{{ entitiesName }}Config } from "../{{ entitiesName }}Config";
{{/inline}}
{{#*inline "props-block"}}
type IUpdate{{ entityName }}Props = {
  initialValues: IUpdateProps<I{{ entityName }}Values, I{{ entityName }}Data>["form"]["initialValues"];
  onSuccess?: IUpdateProps<I{{ entityName }}Values, I{{ entityName }}Data>["form"]["onSuccess"];
};
{{/inline}}
{{#*inline "head-block"}}{{/inline}}
{{#*inline "pre-render-block"}}const matchParams = useRouteMatch().params;
  const {
    onUpdate,
    initialValues,
    validationSchema,
    formChildren,
  } = use{{ entitiesName }}Config();

  const safeinitialValues: I{{ entityName }}Data = {
    ...initialValues,
    id: matchParams.{{decapitalize entityName }}Id as I{{ entityName }}Data["id"],
  };

  Object.keys(safeinitialValues).forEach(value => {
    const key = value as keyof I{{ entityName }}Values;
    if (props.initialValues[key]) {
      safeinitialValues[key] = props.initialValues[key] as I{{ entityName }}Values[keyof I{{ entityName }}Values];
    }
  });

  const form = {
    title: t("Update {{decamelize entityName }} \\"\\{{label}}\\"", safeinitialValues),
    onSubmit: onUpdate,
    initialValues: safeinitialValues,
    validationSchema,
    children: formChildren,
    onSuccess: props.onSuccess,
  };
{{/inline}}
{{#*inline "render-block-title"}}{{/inline}}
{{#*inline "render-block"}}<Update<I{{ entityName }}Values, I{{ entityName }}Data> modal form={form} >{props.children}</Update>{{/inline}}
{{/Component}}`;
