import { createEffect } from 'effector';

import { LocalStorageKeys, SignResponse, User } from '../types';
import { requestFx } from './request';

interface SignIn {
  name: string;
  password: string;
}

export type SignInError = { message: string };

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
  name: string;
  email: string;
  password: string;
}

export type signUpError = { message: string };

export const signUpFx = createEffect<SignUpParams, User, signUpError>(async (form) => {
  try {
    const response = await fetch('http://localhost:5000/api/registration', {
      method: 'post',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data: SignResponse = await response.json();

    if (!response.ok) {
      return Promise.reject(data);
    }

    localStorage.setItem(LocalStorageKeys.accessToken, data.accessToken);

    return data.user;
  } catch (error) {
    return Promise.reject(error);
  }
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
