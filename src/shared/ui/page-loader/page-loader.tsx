import { Box, Loader } from '@mantine/core';

import styles from './styles.module.css';

export const PageLoader = () => {
  return (
    <Box className={styles.container}>
      <Loader size="xl" type="bars" />
    </Box>
  );
};
