import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { logoutClicked } from '~/widgets/header/model/model';

import { appClosing } from '~/shared/config/init';
import { $user } from '~/shared/session';
import { User } from '~/shared/types';

import { Message } from './types';

export const chatInit = createEvent();
export const chatClosed = createEvent();

const $socket = createStore<WebSocket | null>(null);

const connectWebSocketFx = createEffect<{ url: string; user: User }, WebSocket>(({ url, user }) => {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection opened.');

    socket.send(
      JSON.stringify({
        event: 'connect',
        user: user,
        id: Date.now(),
        createdAt: new Date(),
      } as Message),
    );
  };

  socket.onmessage = (event) => {
    const message: Message = JSON.parse(event.data);
    messageReceived(message);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  return socket;
});

sample({
  clock: [chatInit, $user],
  source: { user: $user, socket: $socket },
  filter: ({ user, socket }) => Boolean(user) && socket === null,
  fn: ({ user }) => ({ url: 'ws://localhost:4000', user: user! }),
  target: connectWebSocketFx,
});

sample({
  clock: connectWebSocketFx.done,
  fn: ({ result }) => result,
  target: $socket,
});

sample({
  clock: connectWebSocketFx.fail,
  fn: () => null,
  target: $socket,
});

const disconnectWebSocketFx = createEffect(
  ({ socket, user }: { socket: WebSocket; user: User | null }) => {
    if (user) {
      socket.send(
        JSON.stringify({
          event: 'disconnect',
          user: user,
          id: Date.now(),
          createdAt: new Date(),
        } as Message),
      );
    }
    socket.close();
  },
);

sample({
  clock: [logoutClicked, appClosing, chatClosed],
  source: { socket: $socket, user: $user },
  fn: ({ socket, user }) => ({ socket: socket!, user }),
  target: disconnectWebSocketFx,
});

sample({
  clock: disconnectWebSocketFx.done,
  fn: () => null,
  target: $socket,
});

export const $comment = createStore<string>('');
export const commentChanged = createEvent<string>();
export const $commentSubmitDisabled = not($comment);

sample({
  clock: commentChanged,
  target: $comment,
});

export const $messages = createStore<Message[]>([]);
const messageReceived = createEvent<Message>();

$messages.on(messageReceived, (prev, message) => [...prev, message]);

export const messageSended = createEvent();
const sendWebSocketMessageFx = createEffect<{ socket: WebSocket; message: Message }, void>(
  ({ socket, message }) => {
    socket.send(JSON.stringify(message));
  },
);

sample({
  clock: messageSended,
  source: { socket: $socket, comment: $comment, user: $user },
  filter: ({ socket, user }): boolean => Boolean(socket) && Boolean(user),
  fn: ({ socket, comment, user }) => ({
    socket: socket!,
    message: {
      user: user!,
      id: Date.now(),
      event: 'message',
      body: comment,
      createdAt: new Date(),
    } as Message,
  }),
  target: sendWebSocketMessageFx,
});

sample({
  clock: messageSended,
  fn: () => '',
  target: $comment,
});
