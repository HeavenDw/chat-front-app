import { createRouteView } from 'atomic-router-react';

import { PageLoader } from '~/shared/ui';

import { currentRoute } from './model';
import { MainPage } from './page';

export const MainRoute = {
  view: createRouteView({
    view: MainPage,
    route: currentRoute,
    otherwise: PageLoader,
  }),
  route: currentRoute,
};
