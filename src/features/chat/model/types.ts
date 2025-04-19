import { User } from '~/shared/types';

export type Message = {
  id: number;
  user: User;
  event: 'connect' | 'disconnect' | 'message';
  createdAt: Date | string;
  body?: string;
};
