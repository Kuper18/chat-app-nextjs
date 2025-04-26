import axiosInstance from '@/axios-instance';
import { TMessage, TMessageBody, TMessageBodyPatch, TReadMessageBody, TUnreadCount } from '@/types';

class MessagesService {
  static async get(roomId: number) {
    try {
      const { data } = await axiosInstance.get<TMessage[]>(
        `/messages/${roomId}`,
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getUnreadCount() {
    try {
      const { data } = await axiosInstance.get<TUnreadCount[]>(
        `/messages/unread-counts`,
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async post(body: TMessageBody) {
    try {
      const { data } = await axiosInstance.post<TMessage>('/messages', body);

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async patch({ id, ...body}: TMessageBodyPatch) {
    try {
      const { data } = await axiosInstance.patch<TMessage>(`/messages/${id}`, body);

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async readMessage({ id, ...body}: TReadMessageBody) {
    try {
      const { data } = await axiosInstance.patch<TMessage>(`/messages/read/${id}`, body);

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default MessagesService;
