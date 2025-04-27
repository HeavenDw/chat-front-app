import { Button, Container, Flex, PasswordInput, Stack, TextInput } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';

import { routes } from '~/shared/routing';
import { ErrorView } from '~/shared/ui';

import {
  $email,
  $emailError,
  $error,
  $password,
  $passwordError,
  $submitDisabled,
  emailChanged,
  formSubmitted,
  passwordChanged,
} from '../model/model';
import styles from './styles.module.css';

export const UserPage = () => {
  const [email, password, submitDisabled, emailError, passwordError, formError] = useUnit([
    $email,
    $password,
    $submitDisabled,
    $emailError,
    $passwordError,
    $error,
  ]);
  const [handleChangeEmail, handleChangePassword, handleSubmitForm] = useUnit([
    emailChanged,
    passwordChanged,
    formSubmitted,
  ]);
  return (
    <Container size={420} my={40} w="100%" h="100%">
      <Stack gap="xl">
        <TextInput
          value={email}
          onChange={(event) => handleChangeEmail(event.target.value)}
          label="email"
          placeholder="email"
          required
          leftSection={<IconAt size="0.8rem" />}
          error={emailError}
        />
        <PasswordInput
          value={password}
          onChange={(event) => handleChangePassword(event.target.value)}
          label="password"
          placeholder="your password"
          required
          leftSection={<IconLock size="0.8rem" />}
          error={passwordError}
        />
        <ErrorView error={formError?.message} />

        <Flex gap="xl" justify="space-between">
          <Link to={routes.main} className={styles.link}>
            <Button fullWidth>Back to chat</Button>
          </Link>

          <Button flex="1 1 50%" disabled={submitDisabled} onClick={() => handleSubmitForm()}>
            Save
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};
