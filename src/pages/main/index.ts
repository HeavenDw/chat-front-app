import { PageLoader } from '~/shared/ui';

import { currentRoute } from './model';
import { MainPage } from './page';

export const MainRoute = {
  view: MainPage,
  route: currentRoute,
  otherwise: PageLoader,
};
