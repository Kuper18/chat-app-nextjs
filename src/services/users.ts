import axiosInstance from '@/axios-instance';
import { TUser } from '@/types';

class UsersService {
  static async get() {
    try {
      const { data } = await axiosInstance.get<TUser[]>('/users');

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default UsersService;
