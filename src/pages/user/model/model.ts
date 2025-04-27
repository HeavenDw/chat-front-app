import { notifications } from '@mantine/notifications';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { every } from 'patronum';

import { createField } from '~/shared/factory/create-field';
import { isEmailValid, isPasswordValid } from '~/shared/form/field-checks';
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

export const formSubmitted = createEvent();

export const emailField = createField<string, string>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isEmailValid,
  },
});
export const passwordField = createField<string, string>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isPasswordValid,
  },
});

sample({
  clock: $user,
  fn: (user) => user?.email ?? '',
  target: emailField.value,
});

const formValid = every({ stores: [emailField.error, passwordField.error], predicate: null });

export const $submitDisabled = createStore(true);

sample({
  clock: [emailField.value, passwordField.value],
  source: { email: emailField.value, password: passwordField.value },
  fn: ({ email, password }) => {
    return password.length === 0 || email.length === 0;
  },
  target: $submitDisabled,
});

sample({
  clock: formSubmitted,
  source: { user: $user, email: emailField.value, password: passwordField.value },
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

export const $formDisabled = editUserFx.pending;

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
