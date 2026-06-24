export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}
export interface Post {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: User;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}
export interface UpdateProfileRequest {
  bio: string;
  profilePictureUrl: string;
}
export interface EchoRoom {
  id: number;
  name: string;
  description: string | null;
  creator: User;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sentAt: string;
  sender: User;
}
export interface NotificationItem {
  id: number;
  type: string;
  actorUsername: string;
  actorProfilePictureUrl: string | null;
  postId: number | null;
  read: boolean;
  createdAt: string;
}
export interface FollowCounts {
  followerCount: number;
  followingCount: number;
}
export interface Story {
  id: number;
  author: User;
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
}