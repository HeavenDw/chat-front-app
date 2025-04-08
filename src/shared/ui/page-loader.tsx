import {Center, Loader} from '@mantine/core';

export const PageLoader = () => {
  return (
    <Center h="100vh">
      <Loader size="xl" variant="bars" />
    </Center>
  );
};
