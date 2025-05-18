import { z } from 'zod';

import { loginSchema, messageSchema, signupSchema } from '@/schemas';

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

export type TUserResponse = {
  users: TUser[];
  meta: {
    totalPages: number;
    totalCount: number;
    current: number;
    next: number | null;
    previous: number | null;
  };
};

export type TUserQuery = {
  offset: number,
  limit?: number,
  search?: string
}

export type TRoom = {
  id: number;
  name: string;
  users: TUser[];
};

export type TRoomBody = Pick<TRoom, 'name'> & {
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

export type TTypingIndicator = {
  isTyping: boolean;
  userId: number;
};
