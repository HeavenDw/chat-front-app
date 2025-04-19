export function formatTelegramDate(date: Date | string) {
  const now = new Date();
  const messageDate = new Date(date);

  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(
      messageDate,
    );
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  if (messageDate.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(messageDate);
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(messageDate);
}
