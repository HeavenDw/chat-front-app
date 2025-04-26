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
  user: createRoute<{ userId?: string }>(),
};

const routesMap: UnmappedRouteObject<object>[] = [
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
  {
    path: '/user/:userId',
    route: routes.user,
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
