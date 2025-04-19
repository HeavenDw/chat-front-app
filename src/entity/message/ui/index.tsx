import { Flex, Text } from '@mantine/core';

import { Message } from '~/features/chat/model/types';

import { UserCell } from '~/shared/ui';

import styles from './styles.module.css';

type Props = {
  message: Message;
  self: boolean;
};

export const Comment = ({ message, self }: Props) => {
  const getText = () => {
    if (message.event === 'connect') return 'Joined the chat';
    if (message.event === 'disconnect') return 'Left the chat';
    return message?.body;
  };
  return (
    <div className={self ? styles.selfComment : styles.otherComment}>
      <Flex align="center" gap="8px">
        <UserCell user={message.user} />
        <Text fs="italic">
          {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(
            new Date(message.createdAt),
          )}
        </Text>
      </Flex>

      <Text className={styles.body}>{getText()}</Text>
    </div>
  );
};
