import { Button } from '@mantine/core';
import { useUnit } from 'effector-react';

import { $user } from '~/shared/session';
import { AvatarCell } from '~/shared/ui/avatar-cell/avatar-cell';
import { SchemeSwitcher } from '~/shared/ui/scheme-switcher';

import {
  $loginButtonShown,
  $registerButtonShown,
  loginClicked,
  logoutClicked,
  registerClicked,
} from '../model/model';
import styles from './styles.module.css';

export const Header = () => {
  const [user, loginButtonShown, registerButtonShown] = useUnit([
    $user,
    $loginButtonShown,
    $registerButtonShown,
  ]);

  return (
    <div className={styles.header}>
      {user ? <AvatarCell user={user} /> : <div />}

      <div className={styles.rightSideContainer}>
        {!user && (
          <div className={styles.buttonsContainer}>
            {loginButtonShown && <Button onClick={() => loginClicked()}>Login</Button>}
            {registerButtonShown && <Button onClick={() => registerClicked()}>Register</Button>}
          </div>
        )}
        {user && <Button onClick={() => logoutClicked()}>Log out</Button>}
        <SchemeSwitcher />
      </div>
    </div>
  );
};
