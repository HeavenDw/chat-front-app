import { createRouteView } from 'atomic-router-react';

import { PageLoader } from '~/shared/ui/page-loader';

import { currentRoute } from './model';
import { LoginPage } from './page';

export const LoginRoute = {
  view: createRouteView({
    route: currentRoute,
    view: LoginPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
