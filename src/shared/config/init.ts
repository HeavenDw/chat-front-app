import { createEvent } from 'effector';

export const appStarted = createEvent();

export const appClosing = createEvent();

window.addEventListener('beforeunload', () => {
  appClosing();
});
