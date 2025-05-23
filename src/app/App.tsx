import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { RouterProvider } from 'atomic-router-react';

import { Pages } from '~/pages';

import { Header } from '~/widgets/header/ui';

import { router } from '~/shared/routing';

const theme = createTheme({});

export const App = () => {
  return (
    <RouterProvider router={router}>
      <MantineProvider theme={theme} defaultColorScheme="dark" withGlobalClasses>
        <Notifications />
        <Header />
        <Pages />
      </MantineProvider>
    </RouterProvider>
  );
};
