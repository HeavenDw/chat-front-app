import { Box, Button } from '@mantine/core';
import { useUnit } from 'effector-react';

import { $user } from '~/shared/session';
import { SchemeSwitcher } from '~/shared/ui/scheme-switcher';

import {
  $loginButtonShown,
  $registerButtonShown,
  loginClicked,
  logoutClicked,
  registerClicked,
} from './model';
import styles from './styles.module.css';

export const Header = () => {
  const [user, loginButtonShown, registerButtonShown] = useUnit([
    $user,
    $loginButtonShown,
    $registerButtonShown,
  ]);

  return (
    <Box className={styles.header}>
      {!user && (
        <Box className={styles.buttonsContainer}>
          {loginButtonShown && <Button onClick={() => loginClicked()}>Login</Button>}
          {registerButtonShown && <Button onClick={() => registerClicked()}>Register</Button>}
        </Box>
      )}
      {user && <Button onClick={() => logoutClicked()}>Log out</Button>}
      <SchemeSwitcher />
    </Box>
  );
};
