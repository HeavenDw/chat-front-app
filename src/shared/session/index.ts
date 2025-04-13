import { chainRoute, RouteInstance, RouteParams, RouteParamsAndQuery } from 'atomic-router';
import { createEvent, createStore, Effect, Event, sample } from 'effector';

import { sessionGetFx } from '../api';
import { User } from '../types';

enum AuthStatus {
  initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

export const $user = createStore<User | null>(null);
const $authStatus = createStore<AuthStatus>(AuthStatus.initial);

$authStatus.on(sessionGetFx, (status) => {
  if (status === AuthStatus.initial) return AuthStatus.Pending;
  return status;
});

$user.on(sessionGetFx.doneData, (_, response) => response.user);
$authStatus.on(sessionGetFx.doneData, () => AuthStatus.Authenticated);

$authStatus.on(sessionGetFx.fail, () => AuthStatus.Anonymous);

interface ChainParams<Params extends RouteParams> {
  otherwise?: Effect<void, any, any>;
}

export const chainAuthorized = <Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<Params> = {},
): RouteInstance<Params> => {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const sessionReceivedAnonymous = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.initial,
    target: sessionGetFx,
  });

  sample({
    clock: [sessionGetFx.fail, alreadyAnonymous],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAnonymous,
      target: otherwise,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAuthenticated, sessionGetFx.done],
    cancelOn: sessionReceivedAnonymous,
  });
};

export const chainAnonymous = <Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<Params> = {},
): RouteInstance<Params> => {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const sessionReceivedAuth = createEvent<RouteParamsAndQuery<Params>>();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.initial,
    target: sessionGetFx,
  });

  sample({
    clock: [alreadyAuthenticated, sessionGetFx.done],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAuth,
  });

  if (otherwise) {
    sample({
      clock: sessionReceivedAuth,
      target: otherwise,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAnonymous, sessionGetFx.fail],
    cancelOn: sessionReceivedAuth,
  });
};

/*
  1. currentRoute.opened
  2. $authStatus === AuthStatus.initial
  3. sessionGetFx
  4. sessionGetFx.done
  5. authorizedRoute.opened
*/

/*
  1. currentRoute.opened
  2. $authStatus === AuthStatus.initial
  3. sessionGetFx
  4. sessionGetFx.fail
  5. redirect to /login
*/

/*
  1. currentRoute.opened
  2. $authStatus === AuthStatus.Authenticated
  3. authorizedRoute.opened
*/

/*
  1. currentRoute.opened
  2. $authStatus === AuthStatus.Anonymous
  3. redirect to /login
*/

/*
  1. currentRoute.opened
  2. $authStatus === AuthStatus.initial
  3. sessionGetFx
  4. currentRoute.closed
  5. sessionGetFx.done / .fail
  6. do nothing / ignore
*/
