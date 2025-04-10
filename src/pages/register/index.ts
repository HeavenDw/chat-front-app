import { PageLoader } from '~/shared/ui/page-loader';

import { currentRoute } from './model';
import { RegisterPage } from './page';

export const RegisterRoute = {
  view: RegisterPage,
  route: currentRoute,
  otherwise: PageLoader,
};
