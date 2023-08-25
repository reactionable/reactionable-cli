export default `<%

const imports = \`import { Delete, IDeleteProps } from "<%= it.uiPackage %>";

import { I<%= it.entityName %>Data, use<%= it.entitiesName %>Config } from "../<%= it.entitiesName %>Config";\`;

const props = \`type IDelete<%= it.entityName %>Props = {
  id: string; 
  onSuccess?: IDeleteProps<I<%= it.entityName %>Data>["onSuccess"];
  label?: boolean;
};\`;

const preRender = \`const { id, label, ...deleteProps} = props;
const { onDelete } = use<%= it.entitiesName %>Config();\`;

const render = \`<Delete
{...deleteProps}
title={t("Delete <%=it.decamelize(it.entityName) %>")}
confirmationMessage={t("Are you sure you want to delete this <%=it.decamelize(it.entityName) %> ?")}
successMessage={t("The <%= it.decamelize(it.entityName) %> has been deleted")}
onConfirm={() => onDelete(id)}
>
{label ? t("Delete <%= it.decamelize(it.entityName) %>") : undefined}
</Delete>\`;

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
