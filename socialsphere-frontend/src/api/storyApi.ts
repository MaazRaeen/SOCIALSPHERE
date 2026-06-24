import axiosClient from './axiosClient';
import type { Story } from '../types';

export async function getActiveStories(): Promise<Story[]> {
  const res = await axiosClient.get<Story[]>('/stories');
  return res.data;
}

export async function getStoriesByUser(username: string): Promise<Story[]> {
  const res = await axiosClient.get<Story[]>(`/stories/user/${username}`);
  return res.data;
}

export async function createStory(username: string, imageUrl: string): Promise<Story> {
  const res = await axiosClient.post<Story>(`/stories/${username}`, { imageUrl });
  return res.data;
}

export async function deleteStory(storyId: number, username: string): Promise<void> {
  await axiosClient.delete(`/stories/${storyId}/${username}`);
}