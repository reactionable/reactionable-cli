export default `{{#> Component }}
{{#*inline "imports-block"}}
import { Suspense } from "@reactionable/core";
import { useRouteMatch } from "{{ routerPackage }}";
import { Link, Read  } from "{{ uiPackage }}";
import { lazy } from "react";

import { I{{ entityName }}Data, use{{ entitiesName }}Config } from "../{{ entitiesName }}Config";

const Update{{ entityName }} = lazy(() => import("../update-{{hyphenize entityName }}/Update{{ entityName }}"));

type I{{entityName}}ItemProps = { 
  data: I{{ entityName }}Data;
  refetch: () => void;
}

const {{componentName}}Item = ({ data, refetch }: PropsWithChildren<I{{entityName}}ItemProps>): ReactElement => {
  const { t } = useTranslation("{{decapitalize entitiesName }}");

  return <>
    <Head>
      <title>{t("{{projectName}}", { ns: "common" })} - {t("{{capitalize (decamelize entityName)}} - \\{{label}}", data)}</title>
      <meta name="description" content={t("{{capitalize (decamelize entityName)}} - \\{{label}}", data)} />
    </Head>
    <h1>{t("{{capitalize (decamelize componentName)}} - {{label}}", data)}</h1>
    { data && <Suspense>
      <Update{{ entityName }}
        onSuccess={refetch}
        initialValues={data}
      >
        <Link href="#">{ t("Update {{decamelize entityName }} \\"\\{{label}}\\"", data) }</Link>
      </Update{{ entityName }}>
    </Suspense>}
  </>;
};
{{/inline}}
{{#*inline "head-block"}}{{/inline}}
{{#*inline "pre-render-block"}}const matchParams = useRouteMatch().params;

  const { useRead } = use{{ entitiesName }}Config();
  const readProps = useRead({
    id: matchParams.{{decapitalize entityName }}Id,
  });
{{/inline}}
{{#*inline "render-block-title"}}{{/inline}}
{{#*inline "render-block"}}<Read<I{{ entityName }}Data> {...readProps}>
  {(props) => <{{componentName}}Item {...props} refetch={readProps.refetch} />}
</Read>{{/inline}}
{{/Component}}`;
