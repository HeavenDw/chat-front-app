export type Message = {
  id: number;
  userEmail: string;
  event: 'connect' | 'disconnect' | 'message';
  body?: string;
};
