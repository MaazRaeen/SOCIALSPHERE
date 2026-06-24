import axiosClient from './axiosClient';
import type { User, FollowCounts } from '../types';

export async function toggleFollow(targetUsername: string, username: string): Promise<string> {
  const res = await axiosClient.post<string>(`/follow/${targetUsername}/${username}`);
  return res.data;
}

export async function getFollowStatus(targetUsername: string, username: string): Promise<boolean> {
  const res = await axiosClient.get<boolean>(`/follow/${targetUsername}/status/${username}`);
  return res.data;
}

export async function getFollowCounts(username: string): Promise<FollowCounts> {
  const res = await axiosClient.get<FollowCounts>(`/follow/${username}/counts`);
  return res.data;
}

export async function getFollowers(username: string): Promise<User[]> {
  const res = await axiosClient.get<User[]>(`/follow/${username}/followers`);
  return res.data;
}

export async function getFollowing(username: string): Promise<User[]> {
  const res = await axiosClient.get<User[]>(`/follow/${username}/following`);
  return res.data;
}