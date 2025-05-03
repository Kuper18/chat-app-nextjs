import axiosInstance from '@/axios-instance';
import { setCookies } from '@/lib/utils';
import { TLoginFormData, TSignupFormData, TTokens } from '@/types';

class AuthService {
  static async login(body: TLoginFormData) {
    try {
      const { data } = await axiosInstance.post<TTokens>('/users/login', body);

      setCookies(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async signup(body: TSignupFormData) {
    try {
      const { data } = await axiosInstance.post<TTokens>('/users/signup', body);

      setCookies(data);

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
