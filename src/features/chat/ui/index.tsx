import { Button, Flex, Text, TextInput } from '@mantine/core';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { $user } from '~/shared/session';

import {
  $comment,
  $commentSubmitDisabled,
  $messages,
  chatClosed,
  chatInit,
  commentChanged,
  messageSended,
} from '../model';
import styles from './styles.module.css';

chatInit();

export const Chat = () => {
  const [messages, comment, commentSubmitDisabled, user] = useUnit([
    $messages,
    $comment,
    $commentSubmitDisabled,
    $user,
  ]);

  useEffect(() => {
    return () => {
      chatClosed();
    };
  }, []);

  return (
    <div className={styles.chatContainer}>
      <Text>Chat</Text>

      {messages.map((message) => {
        if (message.event !== 'message' && message.userEmail === user?.email) return null;
        if (message.event === 'connect') {
          return <Text key={message.id}>{message.userEmail} joined the chat</Text>;
        }
        if (message.event === 'disconnect') {
          return <Text key={message.id}>{message.userEmail} left the chat</Text>;
        }
        return (
          <Text key={message.id}>
            {message.userEmail}: {message.body}
          </Text>
        );
      })}

      <Flex align="center" gap="xs">
        <TextInput
          value={comment}
          onChange={(event) => commentChanged(event.target.value)}
          placeholder="Type here..."
          flex={1}
        />
        <Button onClick={() => messageSended()} disabled={commentSubmitDisabled}>
          Send message
        </Button>
      </Flex>
    </div>
  );
};
