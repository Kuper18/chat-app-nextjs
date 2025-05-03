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
  recipientId: number;
  senderId: number;
  roomId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TMessageResponse = {
  messages: TMessage[];
  nextCursor: number | null;
  previousCursor: number | null;
};

export type TMessageBody = Pick<
  TMessage,
  'content' | 'roomId' | 'senderId' | 'recipientId'
>;

export type TMessageBodyPatch = Pick<TMessage, 'content' | 'id'>;
export type TReadMessageBody = Pick<TMessage, 'recipientId' | 'id' | 'isRead'>;

export type TUnreadCount = {
  senderId: number;
  count: number;
};

export type TSocketQuery = {
  roomId?: number;
  userId?: number;
};

export type TOnlineUsers = {
  socketId: number;
  userId: number;
};
