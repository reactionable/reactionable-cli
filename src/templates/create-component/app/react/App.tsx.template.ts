export default `import React, { ReactElement, lazy } from "react";
import { App as CoreApp, IAppProps, useTranslation } from "@reactionable/core";
import { useRouterProviderProps, IRouterProviderProps } from "@reactionable/router-dom";
import {
  useIdentityProviderProps,
  IIdentityProviderProps,
} from "{{ hostingPackage }}";
import {
  useUIProviderProps,
  IUIProviderProps,
  IUseLayoutProps,
} from "{{ uiPackage }}";
import "./App.scss";
import "./i18n/i18n";

// Lazy load these components
const HomeComponent = lazy(() => import("./components/home/Home"));
const NotFoundComponent = lazy(() => import("./components/not-found/NotFound"));

const {{componentName}} = (): ReactElement => {
  const { t } = useTranslation();

  // Configure app
  const appConfig: IAppProps<
    IIdentityProviderProps,
    IUIProviderProps,
    IUseLayoutProps,
    IRouterProviderProps
  > = {
    routes: [],
    HomeComponent,
    NotFoundComponent,
    layout: {
      header: {
        brand: t("{{projectName}}"),
      },
      footer: {
        brand: t("{{projectName}}"),
      },
    },
    router: useRouterProviderProps(),
    ui: useUIProviderProps(),
    identity: useIdentityProviderProps(),
  };

  return <CoreApp {...appConfig} />;
};
export default {{componentName}};`;
