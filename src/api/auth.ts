import type { LoginInput, SignupInput, User } from '../types';
import { api } from './client';

export const authApi = {
  signup: (data: SignupInput) => api.post<User>('/v1/auth/signup', data),

  login: (data: LoginInput) =>
    api.post<{ user: User; token: string }>('/v1/auth/login', data),

  me: () => api.authGet<User>('/v1/auth/me'),
};
