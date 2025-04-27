import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconLock, IconUser } from '@tabler/icons-react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FormEventHandler } from 'react';

import { routes } from '~/shared/routing';
import { ErrorView } from '~/shared/ui';

import {
  $error,
  $formDisabled,
  $loginPending,
  formSubmitted,
  nameField,
  passwordField,
} from './model';

export const LoginPage = () => {
  const [loginPending, formDisabled, formError] = useUnit([$loginPending, $formDisabled, $error]);
  const handleSubmitForm = useUnit(formSubmitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    handleSubmitForm();
  };

  return (
    <>
      <Container size={420} my={40} w="100%" h="100%">
        <Title
          style={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text size="sm" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component={Link} to={routes.auth.register}>
            Create account
          </Anchor>
        </Text>

        <Paper
          component="form"
          onSubmit={onFormSubmit}
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
        >
          <Username />
          <Password />
          <ErrorView error={formError?.message} />
          <Button
            fullWidth
            type="submit"
            disabled={formDisabled && !loginPending}
            loading={loginPending}
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    </>
  );
};

const Username = () => {
  const [name, usernameError, formDisabled] = useUnit([
    nameField.value,
    nameField.error,
    $formDisabled,
  ]);

  return (
    <TextInput
      value={name}
      onChange={(event) => nameField.changed(event.target.value)}
      label="name"
      placeholder="name"
      leftSection={<IconUser size="0.8rem" />}
      disabled={formDisabled}
      error={usernameError}
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
