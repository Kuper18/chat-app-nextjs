import axiosInstance from '@/axios-instance';
import { TRoom, TRoomBody, TUser } from '@/types';

class RoomsService {
  static async get(peerId: number) {
    try {
      const { data } = await axiosInstance.get<TRoom | null>(
        `/rooms?peerId=${peerId}`,
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async post(body: TRoomBody) {
    try {
      const { data } = await axiosInstance.post<TRoom>('/rooms', body);

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default RoomsService;
