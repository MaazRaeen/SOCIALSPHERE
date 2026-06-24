import axiosClient from './axiosClient';
import type { NotificationItem } from '../types';

export async function getNotifications(username: string): Promise<NotificationItem[]> {
  const res = await axiosClient.get<NotificationItem[]>(`/notifications/${username}`);
  return res.data;
}

export async function getUnreadCount(username: string): Promise<number> {
  const res = await axiosClient.get<number>(`/notifications/${username}/unread-count`);
  return res.data;
}

export async function markAllRead(username: string): Promise<void> {
  await axiosClient.put(`/notifications/${username}/read-all`);
}