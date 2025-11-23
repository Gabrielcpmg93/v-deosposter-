export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface VideoData {
  id: string;
  url: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  user: User;
  songName: string;
}

export enum ViewState {
  FEED = 'FEED',
  UPLOAD = 'UPLOAD',
  PROFILE = 'PROFILE'
}