export default `{{#> Component }}
{{#*inline "imports-block"}}
import { generatePath, Suspense } from "@reactionable/core";
import { useRouteMatch } from "{{ routerPackage }}";
import { Link, List } from "{{ uiPackage }}";
import { lazy } from "react";

import { I{{ entityName }}Data, use{{ entitiesName }}Config } from "../{{ entitiesName }}Config";

const Create{{ entityName }} = lazy(() => import("../create-{{hyphenize entityName }}/Create{{ entityName }}"));
const Delete{{ entityName }} = lazy(() => import("../delete-{{hyphenize entityName }}/Delete{{ entityName }}"));

type I{{entityName}}ItemProps = { 
  data: I{{ entityName }}Data;
  refetch: () => void;
}

const {{componentName}}Item = ({ data, refetch }: PropsWithChildren<I{{entityName}}ItemProps>): ReactElement => {
  const { t } = useTranslation("{{decapitalize entitiesName }}");
  const match = useRouteMatch();

  return <tr key={"{{ entityName }}-" + data.id}>
    <td>
      <Link
      href={generatePath(\`\${match.path}/:{{decapitalize entitiesName }}Id\`, { ...match.params, {{decapitalize entitiesName }}Id: data.id })}
        title={t("Go to {{decamelize entityName }} \\"\\{{label}}\\"", data)}
      >{data.label}</Link>
    </td>
    <td>
      <Link
        href={generatePath(\`\${match.path}/:{{decapitalize entitiesName }}Id\`, { ...match.params, {{decapitalize entitiesName }}Id: data.id })}
        title={t("Go to {{decamelize entityName }} \\"\\{{label}}\\"", data)}
      >{t("Go to {{decamelize entityName }} \\"\\{{label}}\\"", data)}</Link>
      <Suspense>
        <Delete{{ entityName }} id={data.id} onSuccess={refetch}>
          {t("Delete {{decamelize entityName }} \\"\\{{label}}\\"", data)}
        </Delete{{ entityName }}>
      </Suspense>
    </td>
  </tr>;
};
{{/inline}}
{{#*inline "pre-render-block"}}const { useList } = use{{ entitiesName }}Config();
  const listProps = useList();
{{/inline}}
{{#*inline "render-block"}}<List<I{{ entityName }}Data>
      {...listProps}
      head={[t("Label"), t("Actions")]}
      noData={<>
        <br /> <br />
        {t("You don't have any {{decamelize entitiesName }} yet.")}
        <br />
        {t("Click the button to create a new {{decamelize entityName }}")}
        <br /><br />
        <Suspense>
          <Create{{ entityName }} onSuccess={listProps.refetch}>
            <Link href="#">{t("Create a new {{decamelize entityName }}")}</Link>
          </Create{{ entityName }}>
        </Suspense>
      </>}
      >
      {(data) => <{{componentName}}Item data={data} refetch={listProps.refetch} />}</List>{{/inline}}
{{/Component}}`;
