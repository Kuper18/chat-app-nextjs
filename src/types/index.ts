import { loginSchema, messageSchema, signupSchema } from '@/schemas';
import { z } from 'zod';

export type TTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TLoginFormData = z.infer<typeof loginSchema>;
export type TSignupFormData = z.infer<typeof signupSchema>;
export type TMessageFormData = z.infer<typeof messageSchema>;

export type TUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type TRoom = {
  id: number;
  name: string;
};

export type TRoomBody = Omit<TRoom, 'id'> & {
  peerId: number;
};

export type TMessage = {
  id: number;
  userId: number;
  roomId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type TMessageBody = Pick<TMessage, 'content' | 'roomId' | 'userId'>;
