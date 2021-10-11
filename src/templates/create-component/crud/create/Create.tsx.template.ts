export default `<%

const imports = \`import { Create, ICreateProps } from "<%= it.uiPackage %>";

import { 
  I<%= it.entityName %>Values, 
  I<%= it.entityName %>Data, 
  use<%= it.entitiesName %>Config
} from "../<%= it.entitiesName %>Config";\`;

const props = \`type ICreate<%= it.entityName %>Props = {
  onSuccess?: ICreateProps<I<%= it.entityName %>Values, I<%= it.entityName %>Data>["form"]["onSuccess"];
};\`;

const preRender = \`const {
  onCreate,
  initialValues,
  validationSchema,
  formChildren,
} = use<%= it.entitiesName %>Config();

const form = {
  title: t("Create a new <%= it.decamelize(it.entityName) %>"),
  onSubmit: onCreate,
  initialValues,
  validationSchema,
  children: formChildren,
  successMessage: "<%= it.entityName %> has been successfully created",
  onSuccess: props.onSuccess,
};\`;

const render = \`<Create<I<%= it.entityName %>Values, I<%= it.entityName %>Data> modal form={form}>{props.children}</Create>\`;

%>

<%= include("Component", {
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
