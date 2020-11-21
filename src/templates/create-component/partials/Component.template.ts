export default `import React, { PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "@reactionable/core";
{{#> imports-head-block}}{{!-- Custom imports could be added. --}}import { Head } from "{{ routerPackage }}";{{/imports-head-block}}
{{#> imports-block}}{{!-- Custom imports could be added. --}}{{/imports-block}}
{{#> props-block}}
type I{{componentName}}Props = unknown;
{{/props-block}}

const {{componentName}} = (props: PropsWithChildren<I{{componentName}}Props>): ReactElement => {
  const { t } = useTranslation();
  {{#> pre-render-block}}{{!-- Custom pre render script could be added. --}}{{/pre-render-block}}
  return <>{{#> head-block}}
    <Head>
      <title>{t("{{projectName}}")} - {t("{{capitalize (decamelize componentName)}}")}</title>
      <meta name="description" content={t("{{#> description-block}}{{capitalize (decamelize componentName)}} description{{/description-block}}")} />
    </Head>
    {{/head-block}}{{#> render-block-title}}<h1>{t("{{capitalize (decamelize componentName)}}")}</h1>{{/render-block-title}}
    {{#> render-block}}{{!-- Custom render content could be added. --}}{{/render-block}}
  </>;
};
export default {{componentName}};`;
