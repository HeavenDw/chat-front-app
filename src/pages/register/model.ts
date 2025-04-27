import { attach, createEvent, createStore, sample } from 'effector';
import { and, every, not } from 'patronum';

import * as api from '~/shared/api';
import { createField } from '~/shared/factory/create-field';
import { isEmailValid, isPasswordValid, isUsernameValid } from '~/shared/form/field-checks';
import { routes } from '~/shared/routing';
import { chainAnonymous } from '~/shared/session';

const signUpFx = attach({ effect: api.signUpFx });

export const currentRoute = routes.auth.register;
export const anonymousRoute = chainAnonymous(currentRoute, { otherwise: routes.main.open });

export const formSubmitted = createEvent();

export const nameField = createField<string, string>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isUsernameValid,
  },
  resetOn: anonymousRoute.closed,
});
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

export const $error = createStore<api.signUpError | null>(null);

export const $formDisabled = signUpFx.pending;
const formValid = every({
  stores: [nameField.error, emailField.error, passwordField.error],
  predicate: null,
});

$error.reset(formSubmitted);

sample({
  clock: formSubmitted,
  source: {
    name: nameField.value,
    email: emailField.value,
    password: passwordField.value,
  },
  filter: and(not($formDisabled), formValid),
  target: signUpFx,
});

sample({
  clock: signUpFx.done,
  target: api.sessionGetFx,
});

$error.on(signUpFx.failData, (_, error) => error);

$error.reset(anonymousRoute.closed);
