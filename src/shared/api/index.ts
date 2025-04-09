import { createEffect } from 'effector';

export type User = {
  email: string;
  username: string;
};

interface SignIn {
  email: string;
  password: string;
}

export type SignInError = { error: 'invalid_request' } | { error: 'invalid_credentials' };

export const signInFx = createEffect<SignIn, User, SignInError>(async (form) => {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'post',
    body: JSON.stringify(form),
  });

  return await response.json();
});

type SessionGetError = { error: 'unauthorized' };

export const sessionGetFx = createEffect<
  void,
  { user: User; accessToken: string; refreshToken: string },
  SessionGetError
>(async () => {
  const response = await fetch('http://localhost:5000/api/refresh', {
    method: 'get',
  });

  return await response.json();
});
