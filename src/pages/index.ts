import { createRoutesView } from 'atomic-router-react';

import { MainRoute } from './main';

export const Pages = createRoutesView({
  routes: [MainRoute],
});
