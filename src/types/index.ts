import { loginSchema, signupSchema } from '@/schemas';
import { z } from 'zod';

export type TTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TLoginFormData = z.infer<typeof loginSchema>;
export type TSignupFormData = z.infer<typeof signupSchema>;
