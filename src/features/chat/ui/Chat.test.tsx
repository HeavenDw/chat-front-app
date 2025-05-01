import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { fork } from 'effector';
import { Provider } from 'effector-react';
import { describe, expect, test } from 'vitest';

import { Chat } from '.';

describe('Chat tests', () => {
  test('add comment flow', async () => {
    const scope = fork();

    render(
      <MantineProvider>
        <Provider value={scope}>
          <Chat />
        </Provider>
      </MantineProvider>,
    );

    const input = screen.getByTestId('commentInput') as HTMLInputElement;
    const button = screen.getByTestId('commentSubmit') as HTMLButtonElement;

    expect(input.value).toBe('');
    expect(button.disabled).toBe(true);

    fireEvent.change(input, { target: { value: 'Hello!' } });

    expect(input.value).toBe('Hello!');
    expect(button.disabled).toBe(false);

    fireEvent.click(button);

    expect(input.value).toBe('');
    expect(button.disabled).toBe(true);

    const comment = screen.findByText('Hello!');
    expect(comment).toBeDefined();
  });
});
