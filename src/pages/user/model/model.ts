import { notifications } from '@mantine/notifications';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { every } from 'patronum';

import { routes } from '~/shared/routing';
import { chainAuthorized } from '~/shared/session';
import { User } from '~/shared/types';

import { editUserFx, getUserFx } from '../api';

export const currentRoute = routes.user;
export const authorizedRoute = chainAuthorized(currentRoute, { otherwise: routes.auth.login.open });

export const $user = createStore<User | null>(null);

sample({
  clock: currentRoute.opened,
  fn: ({ params }) => params.userId!,
  target: getUserFx,
});

sample({
  clock: getUserFx.doneData,
  target: $user,
});

export const $email = createStore('');
$email.on($user, (_, user) => user?.email);
export const $emailError = createStore<null | 'empty' | 'invalid'>(null);

export const emailChanged = createEvent<string>();
$email.on(emailChanged, (_, email) => email);
$emailError.reset(emailChanged);

export const $password = createStore('');
export const $passwordError = createStore<null | string>(null);
export const passwordChanged = createEvent<string>();
$password.on(passwordChanged, (_, password) => password);
$passwordError.reset(passwordChanged);

const formValid = every({ stores: [$emailError, $passwordError], predicate: null });

export const $submitDisabled = createStore(true);

sample({
  clock: [$email, $password],
  source: { email: $email, password: $password },
  fn: ({ email, password }) => {
    return password.length === 0 || email.length === 0;
  },
  target: $submitDisabled,
});

export const formSubmitted = createEvent();

sample({
  clock: formSubmitted,
  source: $email,
  fn: (email) => {
    if (!isEmailValid(email)) return 'invalid';
    return null;
  },
  target: $emailError,
});

sample({
  clock: formSubmitted,
  source: $password,
  fn: (password) => {
    if (!isPasswordValid(password)) return 'minimum password length is 5';
    return null;
  },
  target: $passwordError,
});

sample({
  clock: formSubmitted,
  source: { user: $user, email: $email, password: $password },
  filter: formValid,
  fn: ({ user, email, password }) => {
    return {
      userId: user!.id,
      user: {
        email: email.length > 0 ? email : undefined,
        password: password.length > 0 ? password : undefined,
      },
    };
  },
  target: editUserFx,
});

sample({
  clock: editUserFx.doneData,
  target: $user,
});

const showSuccessNotification = createEffect(() => {
  notifications.show({
    message: 'Data updated',
  });
});

sample({
  clock: editUserFx.doneData,
  target: showSuccessNotification,
});

export const $error = createStore<Error | null>(null);
$error.reset(formSubmitted);
$error.on(editUserFx.failData, (_, error) => error);

const isEmailValid = (email: string) => {
  return email.includes('@') && email.length > 5;
};

const isPasswordValid = (password: string) => {
  return password.length > 5;
};
