import api from './axios';
import { User } from '../types';

interface AuthPayload {
  name?: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export const registerUser = async (payload: AuthPayload): Promise<User> => {
  const res = await api.post<{ success: boolean; data: User }>('/auth/register', payload);
  return res.data.data;
};

export const loginUser = async (payload: Pick<AuthPayload, 'email' | 'password'>): Promise<User> => {
  const res = await api.post<{ success: boolean; data: User }>('/auth/login', payload);
  return res.data.data;
};