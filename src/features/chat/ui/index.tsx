import { Button, Flex, Text, TextInput } from '@mantine/core';
import { useUnit } from 'effector-react';
import { useEffect, useRef } from 'react';
import { Comment } from '~/entity/message/ui';

import { $user } from '~/shared/session';

import {
  $comment,
  $commentSubmitDisabled,
  $messages,
  commentChanged,
  messageSended,
} from '../model';
import styles from './styles.module.css';
import { UsersOnline } from './users-online';

export const Chat = () => {
  const [messages, comment, commentSubmitDisabled, user] = useUnit([
    $messages,
    $comment,
    $commentSubmitDisabled,
    $user,
  ]);

  const commentListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Flex gap="8px">
      <div className={styles.chatContainer}>
        <Text>Chat with users</Text>

        <Flex direction="column" gap="8px" mih="0">
          <div className={styles.commentList} ref={commentListRef}>
            {messages.map((message) => (
              <Comment key={message.id} message={message} self={message.user?.id === user?.id} />
            ))}
          </div>

          <Flex align="center" gap="8px">
            <TextInput
              value={comment}
              onChange={(event) => commentChanged(event.target.value)}
              placeholder="Type here..."
              flex={1}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !commentSubmitDisabled) {
                  event.preventDefault();
                  messageSended();
                }
              }}
            />
            <Button onClick={() => messageSended()} disabled={commentSubmitDisabled}>
              Send message
            </Button>
          </Flex>
        </Flex>
      </div>
      <UsersOnline />
    </Flex>
  );
};
