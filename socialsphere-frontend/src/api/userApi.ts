import axiosClient from './axiosClient';
import type { User, UpdateProfileRequest } from '../types';

export async function getUserProfile(username: string): Promise<User> {
  const res = await axiosClient.get<User>(`/users/${username}`);
  return res.data;
}

export async function updateProfile(
  username: string,
  data: UpdateProfileRequest
): Promise<User> {
  const res = await axiosClient.put<User>(`/users/${username}`, data);
  return res.data;
}
export async function searchUsers(query: string): Promise<User[]> {
  const res = await axiosClient.get<User[]>('/users/search', { params: { query } });
  return res.data;
}