import React from 'react';
import { Home, Search, PlusSquare, MessageSquare, User as UserIcon } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-gray-200 flex items-center justify-between px-6 z-40 shadow-sm">
      <button 
        onClick={() => onChangeView(ViewState.FEED)}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.FEED ? 'text-black' : 'text-gray-400'}`}
      >
        <Home size={24} fill={currentView === ViewState.FEED ? "currentColor" : "none"} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-gray-400">
        <Search size={24} />
        <span className="text-[10px] font-medium">Discover</span>
      </button>

      {/* Upload Button */}
      <button 
        onClick={() => onChangeView(ViewState.UPLOAD)}
        className="relative -top-1 active:scale-95 transition-transform"
      >
        <div className="w-12 h-8 bg-black rounded-lg flex items-center justify-center relative shadow-md">
            <div className="absolute left-[-2px] h-full w-[4px] bg-cyan-400 rounded-l-lg -z-10 opacity-80"></div>
            <div className="absolute right-[-2px] h-full w-[4px] bg-red-500 rounded-r-lg -z-10 opacity-80"></div>
            <PlusSquare size={20} className="text-white" />
        </div>
      </button>

      <button className="flex flex-col items-center gap-1 text-gray-400">
        <MessageSquare size={24} />
        <span className="text-[10px] font-medium">Inbox</span>
      </button>

      <button 
        onClick={() => onChangeView(ViewState.PROFILE)}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.PROFILE ? 'text-black' : 'text-gray-400'}`}
      >
        <UserIcon size={24} fill={currentView === ViewState.PROFILE ? "currentColor" : "none"} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};

export const TopNav: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full p-4 pt-6 z-40 flex justify-center items-center gap-4 text-sm font-bold bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm transition-all">
            <span className="cursor-pointer text-gray-400 hover:text-black transition-colors">Following</span>
            <span className="text-gray-300">|</span>
            <span className="text-black cursor-pointer border-b-2 border-black pb-1">For You</span>
        </div>
    )
}