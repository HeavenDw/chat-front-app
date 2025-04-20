import { createRouteView } from 'atomic-router-react';

import { PageLoader } from '~/shared/ui';

import { authorizedRoute, currentRoute } from './model/model';
import { UserPage } from './ui/page';

export const UserRoute = {
  view: createRouteView({
    route: authorizedRoute,
    view: UserPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
