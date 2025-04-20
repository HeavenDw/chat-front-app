import { createEffect } from 'effector';

import { requestFx } from '~/shared/api/request';

import { Message } from '../model/types';

export const wssUrl = 'ws://localhost:5000';

export const getMessagesFx = createEffect<void, Message[]>(async () => {
  const messages = await requestFx({ method: 'GET', url: 'messages' });
  return messages;
});
