import { attach, createEvent, createStore, Event, sample } from 'effector';
import { and, every, not } from 'patronum';

import * as api from '~/shared/api';
import { routes } from '~/shared/routing';
import { chainAnonymous } from '~/shared/session';

const signUpFx = attach({ effect: api.signUpFx });

export const currentRoute = routes.auth.register;
export const anonymousRoute = chainAnonymous(currentRoute, { otherwise: routes.main.open });

export const formSubmitted = createEvent();

export const emailField = createField<string, 'empty' | 'invalid'>({
  defaultValue: '',
  validate: {
    on: formSubmitted,
    fn: isEmailValid,
  },
  resetOn: anonymousRoute.closed,
});
export const passwordField = createField<string, 'empty' | 'invalid'>({
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
  stores: [emailField.error, passwordField.error],
  predicate: null,
});

$error.reset(formSubmitted);

sample({
  clock: formSubmitted,
  source: {
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

function isEmailValid(email: string) {
  if (isEmpty(email)) return 'empty';
  if (email.length < 6 || !email.includes('@')) return 'invalid';
  return null;
}

function isPasswordValid(password: string) {
  if (isEmpty(password)) return 'empty';
  if (password.length < 6) return 'invalid';
  return null;
}

const isEmpty = (string: string) => {
  return string.trim().length === 0;
};

interface CreateFieldParams<Value, Error> {
  defaultValue: Value;
  validate?: {
    fn: (value: Value) => Error | null;
    on: Event<void>;
  };
  resetOn?: Event<void>;
}

function createField<Value, Error>(params: CreateFieldParams<Value, Error>) {
  const $value = createStore(params.defaultValue);
  const $error = createStore<Error | null>(null);
  const changed = createEvent<Value>();
  $value.on(changed, (_, value) => value);
  $error.reset(changed);

  if (params.validate) {
    sample({
      clock: params.validate.on,
      source: $value,
      fn: params.validate?.fn,
      target: $error,
    });
  }

  if (params.resetOn) {
    $value.reset(params.resetOn);
  }

  return { value: $value, error: $error, changed };
}
