export default `
import React, { PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "@reactionable/core";
<%= it.block('importsHead','import { Head } from "' + it.routerPackage + '";') %>
<%= it.block('imports') %>
<%= it.block('props', "type I" + it.componentName + "Props = unknown;") %>

const <%= it.componentName %> = (props: PropsWithChildren<I<%= it.componentName %>Props>): ReactElement => {
  const { t } = useTranslation();
  <%= it.block('preRender') %>
  return <>
    <%= it.block('head', \`<Head>
        <title>{t("<%= it.projectName %>")} - {t("<%= it.capitalize(it.decamelize(it.componentName)) %>")}</title>
        <meta name="description" content={t("<%= it.descriptionBlock ? it.descriptionBlock : it.capitalize(it.decamelize(it.componentName)) + " description" %>")} />
    </Head>\`) %>
    <%= it.block('renderTitle', '<h1>{t("' + it.capitalize(it.decamelize(it.componentName)) + '")}</h1>') %>
    <%= it.block('render') %>
  </>;
};
export default <%= it.componentName %>;`;
