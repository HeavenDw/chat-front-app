import { Avatar, Box, Text } from '@mantine/core';

import { User } from '~/shared/types';

import styles from './styles.module.css';

interface Props {
  user: User;
}

export const UserCell = ({ user }: Props) => {
  return (
    <Box className={styles.container}>
      <Avatar name={user.name} />
      <Text>{user.name}</Text>
    </Box>
  );
};
