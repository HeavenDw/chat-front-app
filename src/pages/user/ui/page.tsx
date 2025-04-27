import { Button, Container, Flex, PasswordInput, Stack, TextInput } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';

import { routes } from '~/shared/routing';
import { ErrorView } from '~/shared/ui';

import { $error, $formDisabled, $submitDisabled, formSubmitted } from '../model/model';
import { emailField, passwordField } from '../model/model';
import styles from './styles.module.css';

export const UserPage = () => {
  const [submitDisabled, formError] = useUnit([$submitDisabled, $error]);
  const handleSubmitForm = useUnit(formSubmitted);
  return (
    <Container size={420} my={40} w="100%" h="100%">
      <Stack gap="xl">
        <Email />
        <Password />
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

const Email = () => {
  const [email, emailError, formDisabled] = useUnit([
    emailField.value,
    emailField.error,
    $formDisabled,
  ]);
  const handleChangeEmail = useUnit(emailField.changed);

  return (
    <TextInput
      value={email}
      onChange={(event) => handleChangeEmail(event.target.value)}
      label="email"
      placeholder="email"
      required
      leftSection={<IconAt size="0.8rem" />}
      disabled={formDisabled}
      error={emailError}
    />
  );
};

const Password = () => {
  const [password, passwordError, formDisabled] = useUnit([
    passwordField.value,
    passwordField.error,
    $formDisabled,
  ]);
  const handleChangePassword = useUnit(passwordField.changed);

  return (
    <PasswordInput
      value={password}
      onChange={(event) => handleChangePassword(event.target.value)}
      label="password"
      placeholder="your password"
      required
      mt="md"
      leftSection={<IconLock size="0.8rem" />}
      disabled={formDisabled}
      error={passwordError}
    />
  );
};
