import { App as CoreApp, IAppProps, IIdentityContextProviderProps, IUIContextProviderProps, IUseLayoutProps } from '@reactionable/core';
import React, { FC, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';
import './App.scss';

const HomeComponent = lazy(() => import('./views/home/Home'));
const NotFoundComponent = lazy(() => import('./views/not-found/NotFound'));
const App: FC = () => {
  const { t } = useTranslation();

  // Configure app
  const appConfig: IAppProps<
    IIdentityContextProviderProps,
    IUIContextProviderProps,
    IUseLayoutProps
  > = {
    routes: [],
    HomeComponent,
    NotFoundComponent,
    ui: undefined, // You must provide UI context providers properties
    layout: {
      header: {
        brand: t('Tests'),
      },
      footer: {
        brand: t('Tests'),
      },
    },
    identity: undefined, // You must provide identity config to use private routes,
  };

  return <CoreApp {...appConfig} />;
};
export default App;