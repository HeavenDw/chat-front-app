import { createRouteView } from 'atomic-router-react';

import { PageLoader } from '~/shared/ui/page-loader/page-loader';

import { anonymousRoute, currentRoute } from './model';
import { RegisterPage } from './page';

export const RegisterRoute = {
  view: createRouteView({
    route: anonymousRoute,
    view: RegisterPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
