import { createTheme, MantineProvider } from '@mantine/core';
import { RouterProvider } from 'atomic-router-react';

import { Pages } from '~/pages';

import { router } from '~/shared/routing';
import { SchemeSwitcher } from '~/shared/ui/SchemeSwitcher';

const theme = createTheme({});

export const App = () => {
  return (
    <RouterProvider router={router}>
      <MantineProvider theme={theme} defaultColorScheme="dark" withGlobalClasses>
        <SchemeSwitcher />
        <Pages />
      </MantineProvider>
    </RouterProvider>
  );
};
