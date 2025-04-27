import { attach, createEvent, createStore, sample } from 'effector';
import { and, every, not } from 'patronum';

import * as api from '~/shared/api';
import { createField } from '~/shared/factory/create-field';
import { isEmailValid, isPasswordValid } from '~/shared/form/field-checks';
import { routes } from '~/shared/routing';
import { chainAnonymous } from '~/shared/session';

const signInFx = attach({ effect: api.signInFx });

export const currentRoute = routes.auth.login;
export const anonymousRoute = chainAnonymous(currentRoute, { otherwise: routes.main.open });

export const $error = createStore<api.SignInError | null>(null).reset(currentRoute.opened);

export const $loginPending = signInFx.pending;
export const $formDisabled = $loginPending;

export const formSubmitted = createEvent();

export const emailField = createField<string, string>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isEmailValid,
  },
  resetOn: anonymousRoute.closed,
});
export const passwordField = createField<string, string>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isPasswordValid,
  },
  resetOn: anonymousRoute.closed,
});

const formValid = every({ stores: [emailField.error, passwordField.error], predicate: null });

$error.reset(formSubmitted);

sample({
  clock: formSubmitted,
  source: { email: emailField.value, password: passwordField.value },
  filter: and(not($formDisabled), formValid),
  target: signInFx,
});

sample({
  clock: signInFx.done,
  target: api.sessionGetFx,
});

$error.on(signInFx.failData, (_, error) => error);
