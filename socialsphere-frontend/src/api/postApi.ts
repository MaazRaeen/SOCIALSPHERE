import axiosClient from './axiosClient';
import type { Post, Comment } from '../types';

export async function getAllPosts(): Promise<Post[]> {
  const res = await axiosClient.get<Post[]>('/posts');
  return res.data;
}

export async function createPost(
  username: string,
  content: string,
  imageUrl?: string
): Promise<Post> {
  const res = await axiosClient.post<Post>(`/posts/${username}`, { content, imageUrl });
  return res.data;
}

export async function toggleLike(postId: number, username: string): Promise<string> {
  const res = await axiosClient.post<string>(`/posts/${postId}/likes/${username}`);
  return res.data;
}

export async function getLikeCount(postId: number): Promise<number> {
  const res = await axiosClient.get<number>(`/posts/${postId}/likes/count`);
  return res.data;
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await axiosClient.get<Comment[]>(`/posts/${postId}/comments`);
  return res.data;
}

export async function addComment(
  postId: number,
  username: string,
  content: string
): Promise<Comment> {
  const res = await axiosClient.post<Comment>(`/posts/${postId}/comments/${username}`, { content });
  return res.data;
}
export async function getPostsByUsername(username: string): Promise<Post[]> {
  const res = await axiosClient.get<Post[]>(`/posts/user/${username}`);
  return res.data;
}
export async function updatePost(
  postId: number,
  username: string,
  content: string,
  imageUrl?: string
): Promise<Post> {
  const res = await axiosClient.put<Post>(`/posts/${postId}/${username}`, { content, imageUrl });
  return res.data;
}

export async function deletePost(postId: number, username: string): Promise<void> {
  await axiosClient.delete(`/posts/${postId}/${username}`);
}