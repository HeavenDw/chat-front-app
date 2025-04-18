import { attach, createEvent, sample } from 'effector';

import * as api from '~/shared/api';
import { routes } from '~/shared/routing';

const logoutFx = attach({ effect: api.logoutFx });

export const logoutClicked = createEvent();

sample({
  clock: logoutClicked,
  target: logoutFx,
});

sample({
  clock: logoutFx.doneData,
  target: api.sessionGetFx,
});

export const loginClicked = createEvent();

sample({
  clock: loginClicked,
  target: routes.auth.login.open,
});

export const registerClicked = createEvent();

sample({
  clock: registerClicked,
  target: routes.auth.register.open,
});

export const $loginButtonShown = routes.auth.register.$isOpened;
export const $registerButtonShown = routes.auth.login.$isOpened;
