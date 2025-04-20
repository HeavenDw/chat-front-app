import { Text } from '@mantine/core';
import { useUnit } from 'effector-react';

import { UserCell } from '~/shared/ui';

import { $usersOnline } from '../model';
import styles from './styles.module.css';

export const UsersOnline = () => {
  const users = useUnit($usersOnline);

  return (
    <div className={styles.usersOnlineContainer}>
      <Text>Users in chat</Text>
      <div className={styles.userList}>
        {users.map((user) => (
          <UserCell key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};
