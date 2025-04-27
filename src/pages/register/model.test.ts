import { allSettled, fork } from 'effector';
import { expect, test, vitest } from 'vitest';

import { sessionGetFx } from '~/shared/api';
import { isEmailValid, isPasswordValid, isUsernameValid } from '~/shared/form/field-checks';

import { emailField, formSubmitted, formValid, nameField, passwordField, signUpFx } from './model';

test('correct registration flow', async () => {
  const signUpMock = vitest.fn();
  const sessionGetMock = vitest.fn();

  const scope = fork({
    handlers: [
      [
        signUpFx,
        () => {
          signUpMock();
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
  const testEmail = 'test@email.com';
  const testPassword = 'password123';

  expect(scope.getState(nameField.value)).toBe('');
  expect(scope.getState(emailField.value)).toBe('');
  expect(scope.getState(passwordField.value)).toBe('');

  await allSettled(nameField.changed, { scope, params: testName });
  await allSettled(emailField.changed, { scope, params: testEmail });
  await allSettled(passwordField.changed, { scope, params: testPassword });

  expect(scope.getState(nameField.value)).toBe(testName);
  expect(scope.getState(emailField.value)).toBe(testEmail);
  expect(scope.getState(passwordField.value)).toBe(testPassword);

  await allSettled(formSubmitted, { scope });

  expect(signUpMock).toBeCalledTimes(1);
  expect(sessionGetMock).toBeCalledTimes(1);
});

test('field validations', async () => {
  const signUpMock = vitest.fn();

  const scope = fork({
    handlers: [
      [
        signUpFx,
        () => {
          signUpMock();
        },
      ],
    ],
  });

  const testName = 'test';
  const testEmail = 'test';
  const testPassword = '1234';

  expect(scope.getState(nameField.value)).toBe('');
  expect(scope.getState(emailField.value)).toBe('');
  expect(scope.getState(passwordField.value)).toBe('');

  await allSettled(formSubmitted, { scope });

  expect(scope.getState(formValid)).toBe(false);
  expect(scope.getState(nameField.error)).toBe('empty');
  expect(scope.getState(emailField.error)).toBe('empty');
  expect(scope.getState(passwordField.error)).toBe('empty');

  await allSettled(nameField.changed, { scope, params: testName });
  await allSettled(emailField.changed, { scope, params: testEmail });
  await allSettled(passwordField.changed, { scope, params: testPassword });

  expect(scope.getState(formValid)).toBe(true);
  expect(scope.getState(nameField.error)).toBe(null);
  expect(scope.getState(emailField.error)).toBe(null);
  expect(scope.getState(passwordField.error)).toBe(null);

  await allSettled(formSubmitted, { scope });

  expect(scope.getState(nameField.value)).toBe(testName);
  expect(scope.getState(emailField.value)).toBe(testEmail);
  expect(scope.getState(passwordField.value)).toBe(testPassword);

  expect(scope.getState(nameField.error)).toBe(isUsernameValid(testName));
  expect(scope.getState(emailField.error)).toBe(isEmailValid(testEmail));
  expect(scope.getState(passwordField.error)).toBe(isPasswordValid(testPassword));

  expect(signUpMock).toBeCalledTimes(0);
});
