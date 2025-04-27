export const isUsernameValid = (name: string) => {
  if (isEmpty(name)) return 'empty';
  if (name.length < 5) return 'Username must contain at least 5 characters';
  return null;
};

export const isEmailValid = (email: string) => {
  if (isEmpty(email)) return 'empty';
  if (email.length < 5 || !email.includes('@')) return 'Invalid email';
  return null;
};

export const isPasswordValid = (password: string) => {
  if (isEmpty(password)) return 'empty';
  if (password.length < 5) return 'Password must contain at least 5 characters';
  return null;
};

const isEmpty = (string: string) => {
  return string.trim().length === 0;
};
