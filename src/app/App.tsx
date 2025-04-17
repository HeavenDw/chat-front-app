import { createTheme, MantineProvider } from '@mantine/core';
import { RouterProvider } from 'atomic-router-react';

import { Pages } from '~/pages';

import { Header } from '~/widgets/header';

import { router } from '~/shared/routing';

const theme = createTheme({});

export const App = () => {
  return (
    <RouterProvider router={router}>
      <MantineProvider theme={theme} defaultColorScheme="dark" withGlobalClasses>
        <Header />
        <Pages />
      </MantineProvider>
    </RouterProvider>
  );
};
