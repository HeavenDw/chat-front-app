import { Flex } from '@mantine/core';

import { Chat } from '~/features/chat/ui';

export const MainPage = () => {
  return (
    <Flex justify="center" align="center" w="100%" h="100vh" p="md">
      <Chat />
    </Flex>
  );
};
