import axiosInstance from '@/axios-instance';
import { getQueryString } from '@/lib/utils';
import { TUserQuery, TUserResponse } from '@/types';

class UsersService {
  static async get(params: TUserQuery) {
    const queryString = getQueryString(params);

    try {
      const { data } = await axiosInstance.get<TUserResponse>(`/users?${queryString}`);

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default UsersService;
