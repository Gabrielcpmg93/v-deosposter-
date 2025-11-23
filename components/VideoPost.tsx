import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Plus } from 'lucide-react';
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

  useEffect(() => {
    if (isActive) {
      // Small timeout to ensure seamless scroll completion before playing
      const timeout = setTimeout(() => {
        videoRef.current?.play().catch(e => console.log('Autoplay blocked', e));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    if (!isLiked) {
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 800);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
    }
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 800);
  };

  return (
    <div className="relative w-full h-full bg-black snap-start overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={toggleMute}
        onDoubleClick={handleDoubleTap}
      />

      {/* Mute Indicator overlay if muted and clicked */}
      {isMuted && isActive && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full pointer-events-none opacity-0 animate-fade-in-out">
            <span className="text-white font-bold">Unmute</span>
         </div>
      )}

      {/* Big Like Animation */}
      {likeAnimation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Heart size={120} className="text-red-500 fill-red-500 animate-bounce-in" />
        </div>
      )}

      {/* Side Actions */}
      <div className="absolute right-2 bottom-32 flex flex-col items-center gap-6 z-20">
        
        {/* Profile */}
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white p-[1px] overflow-hidden">
            <img src={video.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="User" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 text-white">
            <Plus size={12} />
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={handleLike} className="active:scale-90 transition-transform">
            <Heart 
                size={32} 
                className={`transition-colors duration-300 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white drop-shadow-lg'}`} 
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
        <div className="mt-4 animate-[spin_4s_linear_infinite] relative">
           <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center overflow-hidden">
             <img src={video.user.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
           </div>
           <div className="absolute -right-2 -bottom-2 text-gray-200">
               <Music size={12} />
           </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-16 left-0 w-full p-4 pr-16 bg-gradient-to-t from-black/60 to-transparent z-10">
        <h3 className="font-bold text-white text-lg mb-2">@{video.user.username}</h3>
        <p className="text-white/90 text-sm mb-2 line-clamp-2">
            {video.description}
        </p>
        <div className="flex items-center gap-2">
            <Music size={14} className="text-white" />
            <div className="overflow-hidden w-1/2">
                <p className="text-white text-xs font-medium whitespace-nowrap animate-marquee">
                    {video.songName} &nbsp; • &nbsp; {video.songName}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;