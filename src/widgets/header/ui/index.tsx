import { Button } from '@mantine/core';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';

import { routes } from '~/shared/routing';
import { $user } from '~/shared/session';
import { SchemeSwitcher, UserCell } from '~/shared/ui';

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
      {user ? (
        <Link to={routes.user} params={{ userId: user.id }}>
          <UserCell user={user} />
        </Link>
      ) : (
        <div />
      )}

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
