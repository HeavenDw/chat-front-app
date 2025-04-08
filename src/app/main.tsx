import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { appStarted } from '~/shared/config/init.ts';

import { App } from './App.tsx';
import './index.css';

appStarted();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
