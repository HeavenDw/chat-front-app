import { User } from './user';

export type SignResponse = { accessToken: string; refreshToken: string; user: User };
