import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAt, IconLock, IconUser } from '@tabler/icons-react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FormEventHandler } from 'react';

import { routes } from '~/shared/routing';
import { ErrorView } from '~/shared/ui';

import {
  $error,
  $formDisabled,
  emailField,
  formSubmitted,
  nameField,
  passwordField,
} from './model';

export const RegisterPage = () => {
  const formError = useUnit($error);
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
        <Text color="dimmed" size="sm" mt={5}>
          Already have account?{' '}
          <Anchor size="sm" component={Link} to={routes.auth.login}>
            Log in
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
          <Email />
          <Password />
          <ErrorView error={formError?.message} />
          <Group mt="lg">
            <Anchor size="sm" component={Link} to={routes.auth.login}>
              Already have account?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign up
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

const Email = () => {
  const [email, emailError, formDisabled] = useUnit([
    emailField.value,
    emailField.error,
    $formDisabled,
  ]);

  return (
    <TextInput
      value={email}
      onChange={(event) => emailField.changed(event.target.value)}
      label="email"
      placeholder="email"
      mt="md"
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

  return (
    <PasswordInput
      value={password}
      onChange={(event) => passwordField.changed(event.target.value)}
      label="password"
      placeholder="password"
      mt="md"
      leftSection={<IconLock size="0.8rem" />}
      disabled={formDisabled}
      error={passwordError}
    />
  );
};
