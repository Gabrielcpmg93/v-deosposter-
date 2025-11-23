import React, { useState, useEffect, useRef } from 'react';
import { MOCK_VIDEOS } from '../constants';
import VideoPost from './VideoPost';
import CommentSection from './CommentSection';
import { TopNav } from './Navbar';

const VideoFeed: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [commentModalVideoId, setCommentModalVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll detection to update current video index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== currentVideoIndex) {
        setCurrentVideoIndex(index);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentVideoIndex]);

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="relative w-full h-full bg-white">
      <TopNav />
      
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {MOCK_VIDEOS.map((video, index) => (
          <div key={video.id} className="w-full h-full snap-start snap-always">
            <VideoPost 
              video={video} 
              isActive={index === currentVideoIndex}
              isMuted={isMuted}
              toggleMute={toggleMute}
              onOpenComments={() => setCommentModalVideoId(video.id)}
            />
          </div>
        ))}
      </div>

      {commentModalVideoId && (
        <CommentSection 
            video={MOCK_VIDEOS.find(v => v.id === commentModalVideoId)!}
            isOpen={!!commentModalVideoId}
            onClose={() => setCommentModalVideoId(null)}
        />
      )}
    </div>
  );
};

export default VideoFeed;