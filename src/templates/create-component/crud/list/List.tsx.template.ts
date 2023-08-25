export default `<%

const imports = \`import { generatePath, Suspense } from "@reactionable/core";
import { useRouteMatch } from "<%= it.routerPackage %>";
import { Link, ListTable } from "<%= it.uiPackage %>";
import { lazy } from "react";

import { I<%= it.entityName %>Data, use<%= it.entitiesName %>Config } from "../<%= it.entitiesName %>Config";

const Create<%= it.entityName %> = lazy(() => import("../create-<%=it.hyphenize(it.entityName) %>/Create<%= it.entityName %>"));
const Delete<%= it.entityName %> = lazy(() => import("../delete-<%=it.hyphenize(it.entityName) %>/Delete<%= it.entityName %>"));

type IGoTo<%= it.entityName %>LinkProps = { 
  data: I<%= it.entityName %>Data;
}

const GoTo<%= it.entityName %>Link = ({ data, children }: PropsWithChildren<IGoTo<%= it.entityName %>LinkProps>): ReactElement => {
  const match = useRouteMatch();
  const href = generatePath(
    match.path + ":<%= it.decapitalize(it.entitiesName) %>Id", 
    { ...match.params, <%= it.decapitalize(it.entitiesName) %>Id: data.id }
  );
  const title = t("Go to <%= it.decamelize(it.entityName) %> \\\\"{{ label }}\\\\"", data);

  return <Link href={href} title={title}>{data.label}</Link>;
}

type I<%= it.entityName %>ItemProps = { 
  data: I<%= it.entityName %>Data;
  refetch: () => void;
}

const <%= it.componentName %>Item = ({ data, refetch }: PropsWithChildren<I<%= it.entityName %>ItemProps>): ReactElement => {
  const { t } = useTranslation("<%= it.decapitalize(it.entitiesName) %>");

  return <tr key={"<%= it.decapitalize(it.entityName) %>-" + data.id}>
    <td>
      <GoTo<%= it.entityName %>Link data={data}>{data.label}</GoToEntityLink>
    </td>
    <td>
      <GoTo<%= it.entityName %>Link data={data}>{t("Go to <%= it.decamelize(it.entityName) %> \\\\"{{ label }}\\\\"", data)}</Link>
      <Suspense>
        <Delete<%= it.entityName %> id={data.id} onSuccess={refetch}>
          {t("Delete <%= it.decamelize(it.entityName) %> \\\\"{{ label }}\\\\"", data)}
        </Delete<%= it.entityName %>>
      </Suspense>
    </td>
  </tr>;
};\`;

const preRender = \`const { useList } = use<%= it.entitiesName %>Config();
  const listProps = useList();\`;

const render = \`<ListTable<I<%= it.entityName %>Data>
  {...listProps}
  head={[t("Label"), t("Actions")]}
  noData={<>
    <br /> <br />
    {t("You don't have any <%= it.decamelize(it.entitiesName) %> yet.")}
    <br />
    {t("Click the button to create a new <%= it.decamelize(it.entityName) %>")}
    <br /><br />
    <Suspense>
      <Create<%= it.entityName %> onSuccess={listProps.refetch}>
        <Link href="#">{t("Create a new <%= it.decamelize(it.entityName) %>")}</Link>
      </Create<%= it.entityName %>>
    </Suspense>
  </>}
  >
  {(data) => <<%= it.componentName %>Item data={data} refetch={listProps.refetch} />}</ListTable>\`;

%>

<%= include("@Component", {
  ...it,
  blocks: {
    imports,
    preRender,
    render
  }
}) %>`;
