import { createRoutesView } from 'atomic-router-react';

import { LoginRoute } from './login';
import { MainRoute } from './main';

export const Pages = createRoutesView({
  routes: [MainRoute, LoginRoute],
});
