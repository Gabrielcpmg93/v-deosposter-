import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Plus, Loader2, Play, Volume2, VolumeX } from 'lucide-react';
import { VideoData } from '../types';

interface VideoPostProps {
  video: VideoData;
  isActive: boolean;
  toggleMute: () => void;
  isMuted: boolean;
  onOpenComments: () => void;
}

const VideoPost: React.FC<VideoPostProps> = ({ video, isActive, toggleMute, isMuted, onOpenComments }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsLoading(true);
      const videoEl = videoRef.current;
      
      if (videoEl) {
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsLoading(false);
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.log('Autoplay blocked or waiting for interaction', error);
                    // Critical fix: remove loading screen even if autoplay fails
                    setIsLoading(false);
                    setIsPlaying(false);
                });
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setIsLoading(true); 
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    if (!isLiked) {
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 800);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent pausing on double tap
    if (!isLiked) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
    }
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 800);
  };

  return (
    <div className="relative w-full h-full bg-white snap-start overflow-hidden">
      
      {/* Modern White Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white">
           <Loader2 className="w-8 h-8 text-black animate-spin mb-3" />
           <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">Carregando vídeo...</p>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="relative w-full h-full object-cover z-0 cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
        onWaiting={() => {
            if (isActive && isPlaying) setIsLoading(true);
        }}
        onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
        }}
        onLoadedData={() => {
            if (isActive) setIsLoading(false);
        }}
      />

      {/* Play Icon Overlay (when paused and not loading) */}
      {!isPlaying && !isLoading && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div className="bg-black/30 p-5 rounded-full backdrop-blur-sm animate-pulse">
                <Play size={40} className="text-white fill-white ml-1" />
             </div>
         </div>
      )}

      {/* Mute Toggle Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-24 right-4 z-30 p-2.5 bg-black/20 rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-transform"
      >
         {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
      </button>

      {/* Big Like Animation */}
      {likeAnimation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            <Heart size={120} className="text-red-500 fill-red-500 animate-bounce-in" />
        </div>
      )}

      {/* Side Actions */}
      <div className="absolute right-2 bottom-32 flex flex-col items-center gap-6 z-20">
        
        {/* Profile */}
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white p-[1px] overflow-hidden shadow-lg">
            <img src={video.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="User" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 text-white shadow-sm">
            <Plus size={12} />
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={handleLike} className="active:scale-90 transition-transform">
            <Heart 
                size={32} 
                className={`transition-colors duration-300 drop-shadow-lg ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </button>
          <span className="text-white text-xs font-semibold drop-shadow-md">{likeCount.toLocaleString()}</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={onOpenComments} className="active:scale-90 transition-transform">
            <MessageCircle size={32} className="text-white drop-shadow-lg fill-white/10" />
          </button>
          <span className="text-white text-xs font-semibold drop-shadow-md">{video.comments}</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1">
          <button className="active:scale-90 transition-transform">
            <Share2 size={32} className="text-white drop-shadow-lg fill-white/10" />
          </button>
          <span className="text-white text-xs font-semibold drop-shadow-md">{video.shares}</span>
        </div>

        {/* Spinning Disc (Sound) */}
        <div className={`mt-4 relative ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
           <div className="w-10 h-10 rounded-full bg-black border-[3px] border-gray-800 flex items-center justify-center overflow-hidden">
             <img src={video.user.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
           </div>
           <div className="absolute -right-2 -bottom-2 text-white drop-shadow-md">
               <Music size={12} />
           </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-16 left-0 w-full p-4 pr-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
        <h3 className="font-bold text-white text-lg mb-2 drop-shadow-md">@{video.user.username}</h3>
        <p className="text-white/95 text-sm mb-2 line-clamp-2 drop-shadow-sm font-medium">
            {video.description}
        </p>
        <div className="flex items-center gap-2">
            <Music size={14} className="text-white" />
            <div className="overflow-hidden w-1/2">
                <p className={`text-white text-xs font-medium whitespace-nowrap ${isPlaying ? 'animate-marquee' : ''}`}>
                    {video.songName} &nbsp; • &nbsp; {video.songName}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;