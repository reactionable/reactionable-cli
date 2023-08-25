export default `<%

const imports = \`import { Suspense } from "@reactionable/core";
import { useRouteMatch } from "<%= it.routerPackage %>";
import { Link, Read  } from "<%= it.uiPackage %>";
import { lazy } from "react";

import { I<%= it.entityName %>Data, use<%= it.entitiesName %>Config } from "../<%= it.entitiesName %>Config";

const Update<%= it.entityName %> = lazy(() => import("../update-<%= it.hyphenize(it.entityName) %>/Update<%= it.entityName %>"));

type I<%= it.entityName %>ItemProps = { 
  data: I<%= it.entityName %>Data;
  refetch: () => void;
}

const <%= it.componentName %>Item = ({ data, refetch }: PropsWithChildren<I<%= it.entityName %>ItemProps>): ReactElement => {
  const { t } = useTranslation("<%= it.decapitalize(it.entitiesName) %>");

  return <>
    <Head>
      <title>{t("<%= it.projectName %>", { ns: "common" })} - {t("<%= it.capitalize(it.decamelize(it.entityName)) %> - {{ label }}", data)}</title>
      <meta name="description" content={t("<%= it.capitalize(it.decamelize(it.entityName)) %> - {{ label }}", data)} />
    </Head>
    <h1>{t("<%= it.capitalize(it.decamelize(it.entityName)) %> - {{ label }}", data)}</h1>
    <Suspense>
      <Update<%= it.entityName %>
        onSuccess={refetch}
        initialValues={data}
      >
        <Link href="#">{ t("Update <%= it.decamelize(it.entityName) %> \\\\"{{ label }}\\\\"", data) }</Link>
      </Update<%= it.entityName %>>
    </Suspense>
  </>;
};\`;

const preRender = \`const matchParams = useRouteMatch().params;

const { useRead } = use<%= it.entitiesName %>Config();
const readProps = useRead({
  id: matchParams.<%= it.decapitalize(it.entityName) %>Id,
});
\`;

const render = \`<Read<I<%= it.entityName %>Data> {...readProps}>
{(props) => <<%= it.componentName %>Item {...props} refetch={readProps.refetch} />}
</Read>\`;

%>

<%= include("@Component", {
  ...it,
  blocks: {
    imports,
    head: null,
    renderTitle: null,
    preRender,
    render
  }
}) %>`;
