import { attach, createEvent, createStore, sample } from 'effector';
import { and, every, not, reset } from 'patronum';

import * as api from '~/shared/api';
import { routes } from '~/shared/routing';

const signInFx = attach({ effect: api.signInFx });

export const currentRoute = routes.auth.login;

export const $email = createStore('');
export const $emailError = createStore<null | 'empty' | 'invalid'>(null);
export const $password = createStore('');
export const $passwordError = createStore<null | 'empty' | 'invalid'>(null);

export const $error = createStore<api.SignInError | null>(null);

export const $passwordLoginPending = signInFx.pending;
export const $formDisabled = $passwordLoginPending;
const formValid = every({ stores: [$emailError, $passwordError], predicate: null });

reset({
  clock: currentRoute.open,
  target: [$email, $emailError, $password, $passwordError, $error],
});

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

$email.on(emailChanged, (_, email) => email);

$password.on(passwordChanged, (_, password) => password);

$error.reset(formSubmitted);

sample({
  clock: formSubmitted,
  source: $email,
  fn: (email) => {
    if (isEmpty(email)) return 'empty';
    if (!isEmailValid(email)) return 'invalid';
    return null;
  },
  target: $emailError,
});

sample({
  clock: formSubmitted,
  source: $password,
  fn: (password) => {
    if (isEmpty(password)) return 'empty';
    if (!isPasswordValid(password)) return 'invalid';
    return null;
  },
  target: $passwordError,
});

sample({
  clock: formSubmitted,
  source: { email: $email, password: $password },
  filter: and(not($formDisabled), formValid),
  target: signInFx,
});

sample({
  clock: signInFx.done,
  target: api.sessionGetFx,
});

$error.on(signInFx.failData, (_, error) => error);

const isEmailValid = (email: string) => {
  return email.includes('@') && email.length > 5;
};

const isPasswordValid = (password: string) => {
  return password.length > 5;
};

const isEmpty = (string: string) => {
  return string.trim().length === 0;
};
