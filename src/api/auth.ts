import { api, tokenStorage } from './client';
import { User, UserRole } from '@/types';

interface LoginPayload {
  phone: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (payload: LoginPayload): Promise<User> => {
  const { data } = await api.post<AuthResponse>('/login', payload);
  await tokenStorage.set(data.token);
  return data.user;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
  const { data } = await api.post<AuthResponse>('/register', payload);
  await tokenStorage.set(data.token);
  return data.user;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } finally {
    await tokenStorage.clear();
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/me');
  return data;
};
