import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
  UnmappedRouteObject,
} from 'atomic-router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';

import { appStarted } from './config/init';

export const routes = {
  main: createRoute(),
  auth: {
    login: createRoute(),
    register: createRoute(),
  },
};

const routesMap: UnmappedRouteObject<any>[] = [
  {
    path: '/',
    route: routes.main,
  },
  {
    path: '/login',
    route: routes.auth.login,
  },
  {
    path: '/register',
    route: routes.auth.register,
  },
];

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: routesMap,
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});
