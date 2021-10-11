export default `import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import { App as CoreApp, IAppProps } from "@reactionable/core";
import { useRouterProviderProps, IRouterProviderProps } from "@reactionable/nextjs";
import {
  useIdentityProviderProps,
  IIdentityProviderProps,
} from "<%= it.hostingPackage %>";
import {
  useUIProviderProps,
  IUIProviderProps,
} from "<%= it.uiPackage %>";
import "../styles/globals.css";
import "../lib/i18n/i18n";

const <%= it.componentName %> = ({ Component, pageProps }: AppProps): ReactElement => {
  // Configure app
  const appConfig: IAppProps<
    IIdentityProviderProps,
    IUIProviderProps,
    IRouterProviderProps
  > = {
    router: useRouterProviderProps(),
    ui: useUIProviderProps(),
    identity: useIdentityProviderProps(),
  };

  return (
    <CoreApp {...appConfig}>
      <Component {...pageProps} />
    </CoreApp>
  );
};
export default <%= it.componentName %>;`;
