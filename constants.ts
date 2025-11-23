import { VideoData } from './types';

export const MOCK_VIDEOS: VideoData[] = [
  {
    id: '1',
    // Nature / Waterfall
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
    description: 'Nature is amazing! 🌿 #nature #waterfall #peace',
    tags: ['nature', 'waterfall', 'travel'],
    likes: 1205,
    comments: 45,
    shares: 12,
    user: {
      id: 'u1',
      username: 'nature_lover',
      avatarUrl: 'https://picsum.photos/100/100?random=1',
    },
    songName: 'Sounds of Nature - Original Audio',
  },
  {
    id: '2',
    // Urban / City
    url: 'https://assets.mixkit.co/videos/preview/mixkit-night-sky-with-stars-at-a-calm-lake-time-lapse-1704-large.mp4',
    description: 'Starry nights ✨ #stars #nightsky #timelapse',
    tags: ['stars', 'night', 'chill'],
    likes: 8500,
    comments: 320,
    shares: 500,
    user: {
      id: 'u2',
      username: 'sky_watcher',
      avatarUrl: 'https://picsum.photos/100/100?random=2',
    },
    songName: 'Midnight Dreams - LoFi Beats',
  },
  {
    id: '3',
    // Tech / Coding
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
    description: 'Late night coding sessions 💻 #coding #developer #react',
    tags: ['tech', 'programming', 'work'],
    likes: 4200,
    comments: 150,
    shares: 89,
    user: {
      id: 'u3',
      username: 'dev_life',
      avatarUrl: 'https://picsum.photos/100/100?random=3',
    },
    songName: 'Keyboard ASMR - Tech Sounds',
  },
  {
    id: '4',
    // Waves
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    description: 'Ocean vibes 🌊 #ocean #beach #summer',
    tags: ['summer', 'vibes', 'sea'],
    likes: 15300,
    comments: 890,
    shares: 1200,
    user: {
      id: 'u4',
      username: 'travel_addict',
      avatarUrl: 'https://picsum.photos/100/100?random=4',
    },
    songName: 'Summer Breeze - Pop Hits',
  },
];

export const CURRENT_USER = {
  id: 'me',
  username: 'cool_user',
  avatarUrl: 'https://picsum.photos/100/100?random=99',
};