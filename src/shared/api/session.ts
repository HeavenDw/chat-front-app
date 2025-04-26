import { createEffect } from 'effector';

import { LocalStorageKeys, SignResponse, User } from '../types';
import { requestFx } from './request';

interface SignIn {
  email: string;
  password: string;
}

export type SignInError = { error: 'invalid_request' } | { error: 'invalid_credentials' };

export const signInFx = createEffect<SignIn, User, SignInError>(async (form) => {
  const response: SignResponse = await requestFx({ url: 'login', method: 'POST', data: form });

  localStorage.setItem(LocalStorageKeys.accessToken, response.accessToken);

  return response.user;
});

export const logoutFx = createEffect<void, void>(async () => {
  await requestFx({ url: 'logout', method: 'POST' });

  localStorage.removeItem(LocalStorageKeys.accessToken);

  return;
});

interface SignUpParams {
  email: string;
  password: string;
}

export type signUpError = { error: 'user_exist' };

export const signUpFx = createEffect<SignUpParams, User, signUpError>(async (form) => {
  const response: SignResponse = await fetch('http://localhost:5000/api/registration', {
    method: 'post',
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());

  localStorage.setItem(LocalStorageKeys.accessToken, response.accessToken);

  return response.user;
});

type SessionGetError = { error: 'unauthorized' };

export const sessionGetFx = createEffect<void, SignResponse, SessionGetError>(async () => {
  try {
    const response = await fetch('http://localhost:5000/api/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const fetchedData = await response.json();

    if (response.ok) {
      localStorage.setItem(LocalStorageKeys.accessToken, fetchedData.accessToken);
      return await fetchedData;
    } else {
      throw new Error(fetchedData?.message);
    }
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
});
