import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { logoutClicked } from '~/widgets/header/model/model';

import { appClosing } from '~/shared/config/init';
import { $user } from '~/shared/session';
import { User } from '~/shared/types';

import { getMessagesFx, getUsersOnlineFx, wssUrl } from '../api';
import { Message } from './types';

export const chatOpened = createEvent();
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
  clock: [chatOpened, $user],
  source: { user: $user, socket: $socket },
  filter: ({ user, socket }) => Boolean(user) && socket === null,
  fn: ({ user }) => ({ url: wssUrl, user: user! }),
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

sample({
  clock: chatOpened,
  target: getMessagesFx,
});

sample({
  clock: getMessagesFx.doneData,
  target: $messages,
});

sample({
  clock: chatClosed,
  fn: () => [],
  target: $messages,
});

const messageReceived = createEvent<Message>();
$messages.on(messageReceived, (prev, message) => [...prev, message]);

export const $usersOnline = createStore<User[]>([]);

sample({
  clock: chatOpened,
  target: getUsersOnlineFx,
});

sample({
  clock: getUsersOnlineFx.doneData,
  source: $usersOnline,
  fn: (users, response) => {
    const uniqueUsers = [...users];
    response.forEach((user) => {
      if (!uniqueUsers.some(({ id }) => id === user.id)) uniqueUsers.push(user);
    });
    return uniqueUsers;
  },
  target: $usersOnline,
});

sample({
  clock: messageReceived,
  source: $usersOnline,
  fn: (users, message) => {
    if (message.event === 'connect' && !users.some(({ id }) => id === message.user.id)) {
      return [...users, message.user];
    }
    if (message.event === 'disconnect') {
      return users.filter((user) => user.id !== message.user.id);
    }
    return users;
  },
  target: $usersOnline,
});

sample({
  clock: chatClosed,
  fn: () => [],
  target: $usersOnline,
});

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
