import { Space, Text } from '@mantine/core';

export const ErrorView = ({ error }: { error: string | undefined }) => {
  if (!error) {
    return <Space h="lg" />;
  }

  return <Text c="red">{error ?? 'Something went wrong'}</Text>;
};
