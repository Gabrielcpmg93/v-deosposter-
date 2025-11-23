import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Plus, Loader2, Play, Volume2, VolumeX, AlertCircle } from 'lucide-react';
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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isActive) {
      setIsLoading(true);
      setHasError(false);
      const videoEl = videoRef.current;
      
      // Safety: Force stop loading after 3 seconds if video hasn't started
      // This prevents the "infinite loading white screen"
      timeoutId = setTimeout(() => {
          if (isLoading) {
              console.log("Force removing loader due to timeout");
              setIsLoading(false);
          }
      }, 3000);

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

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            // Reset error on manual retry
            setHasError(false);
            const p = videoRef.current.play();
            if (p !== undefined) {
                p.then(() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                }).catch(e => {
                    console.error("Play failed", e);
                    setIsPlaying(false);
                });
            }
        }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div 
        className="relative w-full h-full bg-black snap-start overflow-hidden cursor-pointer"
        onClick={togglePlay}
    >
      
      {/* Loading Screen - visible when isLoading is true */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white text-black pointer-events-none transition-opacity duration-300">
           <Loader2 className="w-8 h-8 animate-spin mb-3 text-black" />
           <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">Carregando...</p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50">
              <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Erro ao carregar vídeo</p>
              <button className="mt-4 px-4 py-2 bg-black text-white text-xs rounded-full">Tentar novamente</button>
          </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="relative w-full h-full object-cover z-0"
        loop
        muted={isMuted}
        playsInline
        onDoubleClick={handleDoubleTap}
        onWaiting={() => {
            if (isActive && isPlaying) setIsLoading(true);
        }}
        onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
            setHasError(false);
        }}
        onLoadedData={() => {
            if (isActive) setIsLoading(false);
        }}
        onError={(e) => {
            console.error("Video error:", e);
            setIsLoading(false);
            setHasError(true);
        }}
      />

      {/* Play Icon Overlay (when paused and not loading) */}
      {!isPlaying && !isLoading && !hasError && (
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

      {/* Side Actions - Added gradient background for visibility on light videos */}
      <div className="absolute right-0 bottom-0 top-0 w-20 flex flex-col justify-end items-center gap-6 pb-32 pr-2 z-20 bg-gradient-to-l from-black/20 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-6">
            {/* Profile */}
            <div className="relative mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-white p-[1px] overflow-hidden shadow-lg bg-black">
                <img src={video.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="User" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 text-white shadow-sm border border-white">
                <Plus size={12} />
            </div>
            </div>

            {/* Like */}
            <div className="flex flex-col items-center gap-1">
            <button onClick={handleLike} className="active:scale-90 transition-transform p-1">
                <Heart 
                    size={32} 
                    className={`transition-colors duration-300 drop-shadow-xl filter ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                    strokeWidth={2.5}
                />
            </button>
            <span className="text-white text-xs font-bold drop-shadow-lg shadow-black">{likeCount.toLocaleString()}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-1">
            <button onClick={onOpenComments} className="active:scale-90 transition-transform p-1">
                <MessageCircle size={32} className="text-white drop-shadow-xl fill-white/10" strokeWidth={2.5} />
            </button>
            <span className="text-white text-xs font-bold drop-shadow-lg shadow-black">{video.comments}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1">
            <button className="active:scale-90 transition-transform p-1">
                <Share2 size={32} className="text-white drop-shadow-xl fill-white/10" strokeWidth={2.5} />
            </button>
            <span className="text-white text-xs font-bold drop-shadow-lg shadow-black">{video.shares}</span>
            </div>

            {/* Spinning Disc (Sound) */}
            <div className={`mt-4 relative ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gray-900 border-[3px] border-gray-200 flex items-center justify-center overflow-hidden">
                <img src={video.user.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
            </div>
            <div className="absolute -right-2 -bottom-2 text-white drop-shadow-md">
                <Music size={12} />
            </div>
            </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-16 left-0 w-full p-4 pr-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none">
        <h3 className="font-bold text-white text-lg mb-2 drop-shadow-md">@{video.user.username}</h3>
        <p className="text-white/95 text-sm mb-2 line-clamp-2 drop-shadow-sm font-medium leading-relaxed">
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