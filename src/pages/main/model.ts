import { sample } from 'effector';

import { chatClosed, chatOpened } from '~/features/chat/model';

import { routes } from '~/shared/routing';
import { chainAuthorized } from '~/shared/session';

export const currentRoute = routes.main;
export const authorizedRoute = chainAuthorized(currentRoute, { otherwise: routes.auth.login.open });

sample({
  clock: currentRoute.opened,
  target: chatOpened,
});

sample({
  clock: currentRoute.closed,
  target: chatClosed,
});
