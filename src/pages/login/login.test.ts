import { allSettled, fork } from 'effector';
import { expect, test, vitest } from 'vitest';

import { sessionGetFx } from '~/shared/api';
import { isPasswordValid, isUsernameValid } from '~/shared/form/field-checks';

import { formSubmitted, formValid, nameField, passwordField, signInFx } from './model';

test('correct sign in', async () => {
  const signInMock = vitest.fn();
  const sessionGetMock = vitest.fn();

  const scope = fork({
    handlers: [
      [
        signInFx,
        () => {
          signInMock();
        },
      ],
      [
        sessionGetFx,
        () => {
          sessionGetMock();
        },
      ],
    ],
  });

  const testName = 'testname';
  const testPassword = 'password123';

  expect(scope.getState(nameField.value)).toBe('');
  expect(scope.getState(passwordField.value)).toBe('');

  await allSettled(nameField.changed, { scope, params: testName });
  await allSettled(passwordField.changed, { scope, params: testPassword });

  expect(scope.getState(nameField.value)).toBe(testName);
  expect(scope.getState(passwordField.value)).toBe(testPassword);

  await allSettled(formSubmitted, { scope });

  expect(signInMock).toBeCalledTimes(1);
  expect(sessionGetMock).toBeCalledTimes(1);
});

test('field validations', async () => {
  const signInMock = vitest.fn();

  const scope = fork({
    handlers: [
      [
        signInFx,
        () => {
          signInMock();
        },
      ],
    ],
  });

  const testName = 'test';
  const testPassword = '1234';

  expect(scope.getState(nameField.value)).toBe('');
  expect(scope.getState(passwordField.value)).toBe('');

  await allSettled(formSubmitted, { scope });

  expect(scope.getState(formValid)).toBe(false);
  expect(scope.getState(nameField.error)).toBe('empty');
  expect(scope.getState(passwordField.error)).toBe('empty');

  await allSettled(nameField.changed, { scope, params: testName });
  await allSettled(passwordField.changed, { scope, params: testPassword });

  expect(scope.getState(formValid)).toBe(true);
  expect(scope.getState(nameField.error)).toBe(null);
  expect(scope.getState(passwordField.error)).toBe(null);

  await allSettled(formSubmitted, { scope });

  expect(scope.getState(nameField.value)).toBe(testName);
  expect(scope.getState(passwordField.value)).toBe(testPassword);

  expect(scope.getState(nameField.error)).toBe(isUsernameValid(testName));
  expect(scope.getState(passwordField.error)).toBe(isPasswordValid(testPassword));

  expect(signInMock).toBeCalledTimes(0);
});
