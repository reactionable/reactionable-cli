export default `<%

const imports = \`import { useRouteMatch } from "<%= it.routerPackage %>";
import { Update, IUpdateProps } from "<%= it.uiPackage %>";

import { I<%= it.entityName %>Values, I<%= it.entityName %>Data, use<%= it.entitiesName %>Config } from "../<%= it.entitiesName %>Config";\`;

const props = \`type IUpdate<%= it.entityName %>Props = {
  initialValues: IUpdateProps<I<%= it.entityName %>Values, I<%= it.entityName %>Data>["form"]["initialValues"];
  onSuccess?: IUpdateProps<I<%= it.entityName %>Values, I<%= it.entityName %>Data>["form"]["onSuccess"];
};\`;

const preRender = \`const matchParams = useRouteMatch().params;
const {
  onUpdate,
  initialValues,
  validationSchema,
  formChildren,
} = use<%= it.entitiesName %>Config();

const safeInitialValues: I<%= it.entityName %>Values & { id: I<%= it.entityName %>Data["id"] } = {
  ...initialValues,
  id: matchParams.<%= it.decapitalize(it.entityName) %>Id as I<%= it.entityName %>Data["id"],
};

Object.keys(safeInitialValues).forEach(value => {
  const key = value as keyof I<%= it.entityName %>Values;
  if (props.initialValues[key]) {
    safeInitialValues[key] = props.initialValues[key] as I<%= it.entityName %>Values[keyof I<%= it.entityName %>Values];
  }
});

const form = {
  title: t("Update <%= it.decamelize(it.entityName) %> \\\\"{{ label }}\\\\"", safeInitialValues),
  onSubmit: onUpdate,
  initialValues: safeInitialValues,
  validationSchema,
  children: formChildren,
  successMessage: "<%= it.entityName %> has been successfully updated",
  onSuccess: props.onSuccess,
};\`;

const render = \`<Update<I<%= it.entityName %>Values, I<%= it.entityName %>Data> modal form={form}>{props.children}</Update>\`;

%>

<%= include("@Component", {
  ...it,
  blocks: {
    importsHead: null,
    imports,
    props,
    head: null,
    renderTitle: null,
    preRender,
    render
  }
}) %>`;
