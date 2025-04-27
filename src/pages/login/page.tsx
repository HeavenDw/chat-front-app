import {
  Anchor,
  Button,
  Container,
  Flex,
  Modal,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAt, IconFaceId, IconLock } from '@tabler/icons-react';
import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FormEventHandler } from 'react';

import { routes } from '~/shared/routing';

import {
  $email,
  $emailError,
  $error,
  $formDisabled,
  $password,
  $passwordError,
  $passwordLoginPending,
  emailChanged,
  formSubmitted,
  passwordChanged,
} from './model';

export const LoginPage = () => {
  const [passwordLoginPending, formDisabled] = useUnit([$passwordLoginPending, $formDisabled]);
  const handleSubmitForm = useUnit(formSubmitted);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    handleSubmitForm();
  };

  return (
    <>
      <Container size={420} my={40} w="100%" h="100%">
        <Modal opened={false} onClose={close} title="Verify yout identity" centered>
          <Flex justify="center" direction="column" align="center" gap="sm" mt="sm">
            <IconFaceId size="5rem" />
            <Text size="sm">needs to verify you</Text>
            <Button mt="lg" variant="subtle">
              use public key
            </Button>
          </Flex>
        </Modal>

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
          <Email />
          <Password />
          <ErrorView />
          <Button
            fullWidth
            type="submit"
            disabled={formDisabled && !passwordLoginPending}
            loading={passwordLoginPending}
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    </>
  );
};

const Email = () => {
  const [email, emailError, formDisabled] = useUnit([$email, $emailError, $formDisabled]);
  const handleChangeEmail = useUnit(emailChanged);

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
    $password,
    $passwordError,
    $formDisabled,
  ]);
  const handleChangePassword = useUnit(passwordChanged);

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

const ErrorView = () => {
  const error = useUnit($error);

  if (!error) {
    return <Space h="lg" />;
  }

  if (error?.error === 'invalid_credentials') {
    return <Text c="red">Неверный пароль и/или почта</Text>;
  }

  return <Text c="red">Что-то пошло не так</Text>;
};
