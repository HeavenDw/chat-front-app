import { createEffect } from 'effector';

import { requestFx } from '~/shared/api/request';
import { User } from '~/shared/types';

export const getUserFx = createEffect<string, User>(async (id: string) => {
  return await requestFx({ method: 'GET', url: `users/${id}` });
});

type EditUserParams = {
  userId: string;
  user: {
    email?: string;
    password?: string;
  };
};

export const editUserFx = createEffect<EditUserParams, User>(async (params) => {
  return await requestFx({ method: 'PATCH', url: `users/${params.userId}`, data: params.user });
});
