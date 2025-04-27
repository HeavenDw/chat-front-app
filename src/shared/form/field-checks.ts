export const isEmailValid = (email: string) => {
  if (isEmpty(email)) return 'empty';
  if (email.length < 6 || !email.includes('@')) return 'invalid';
  return null;
};

export const isPasswordValid = (password: string) => {
  if (isEmpty(password)) return 'empty';
  if (password.length < 6) return 'invalid';
  return null;
};

const isEmpty = (string: string) => {
  return string.trim().length === 0;
};
