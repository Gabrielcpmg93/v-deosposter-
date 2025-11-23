import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Comment, VideoData } from '../types';
import { CURRENT_USER } from '../constants';
import { generateAIComment } from '../services/geminiService';

interface CommentSectionProps {
  video: VideoData;
  isOpen: boolean;
  onClose: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ video, isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate fetching initial comments
    const initialComments: Comment[] = [
      {
        id: 'c1',
        userId: 'u5',
        username: 'fan_account',
        avatarUrl: 'https://picsum.photos/100/100?random=10',
        text: 'This is absolutely stunning! 😍',
        timestamp: '2h',
        likes: 12,
      },
      {
        id: 'c2',
        userId: 'u6',
        username: 'random_guy',
        avatarUrl: 'https://picsum.photos/100/100?random=11',
        text: 'Where is this location?',
        timestamp: '5h',
        likes: 4,
      },
    ];
    setComments(initialComments);
  }, [video.id]);

  const handleSend = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      avatarUrl: CURRENT_USER.avatarUrl,
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    // Randomize mood slightly
    const moods = ['funny', 'amazed', 'sarcastic', 'supportive'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    const aiText = await generateAIComment(video.description, randomMood);
    setNewComment(aiText);
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full sm:w-[400px] sm:h-[600px] h-[70vh] rounded-t-2xl sm:rounded-xl flex flex-col overflow-hidden animate-slide-up shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="w-6" /> {/* Spacer */}
          <h3 className="font-bold text-sm text-black">{comments.length} comments</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img 
                src={comment.avatarUrl} 
                alt={comment.username} 
                className="w-8 h-8 rounded-full object-cover border border-gray-100" 
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold">{comment.username} • {comment.timestamp}</p>
                <p className="text-sm mt-0.5 text-gray-900 leading-snug">{comment.text}</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span className="text-[10px] font-medium">{comment.likes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 bg-white">
          
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
             <button 
               onClick={handleAIGenerate}
               disabled={isGenerating}
               className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap disabled:opacity-50 hover:bg-gray-200 transition-colors"
             >
               <Sparkles size={12} className="text-purple-600" />
               {isGenerating ? 'Thinking...' : 'AI Suggestion'}
             </button>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src={CURRENT_USER.avatarUrl} 
              className="w-8 h-8 rounded-full border border-gray-100" 
              alt="Me" 
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment..."
                className="w-full bg-gray-100 text-gray-900 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-gray-300 transition-all pr-10 placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${newComment.trim() ? 'text-pink-600' : 'text-gray-400'}`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;