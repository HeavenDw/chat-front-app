import { createRoutesView } from 'atomic-router-react';

import { LoginRoute } from './login';
import { MainRoute } from './main';
import { RegisterRoute } from './register';
import { UserRoute } from './user';

export const Pages = createRoutesView({
  routes: [MainRoute, LoginRoute, RegisterRoute, UserRoute],
});
