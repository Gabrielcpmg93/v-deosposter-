import React from 'react';
import { Home, Search, PlusSquare, MessageSquare, User as UserIcon } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[60px] bg-black border-t border-gray-800 flex items-center justify-between px-6 z-40">
      <button 
        onClick={() => onChangeView(ViewState.FEED)}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.FEED ? 'text-white' : 'text-gray-500'}`}
      >
        <Home size={24} fill={currentView === ViewState.FEED ? "currentColor" : "none"} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-gray-500">
        <Search size={24} />
        <span className="text-[10px] font-medium">Discover</span>
      </button>

      {/* Upload Button */}
      <button 
        onClick={() => onChangeView(ViewState.UPLOAD)}
        className="relative -top-1"
      >
        <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center relative">
            <div className="absolute left-[-2px] h-full w-[4px] bg-cyan-400 rounded-l-lg -z-10"></div>
            <div className="absolute right-[-2px] h-full w-[4px] bg-red-500 rounded-r-lg -z-10"></div>
            <PlusSquare size={20} className="text-black" />
        </div>
      </button>

      <button className="flex flex-col items-center gap-1 text-gray-500">
        <MessageSquare size={24} />
        <span className="text-[10px] font-medium">Inbox</span>
      </button>

      <button 
        onClick={() => onChangeView(ViewState.PROFILE)}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.PROFILE ? 'text-white' : 'text-gray-500'}`}
      >
        <UserIcon size={24} fill={currentView === ViewState.PROFILE ? "currentColor" : "none"} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};

export const TopNav: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full p-4 pt-6 z-40 flex justify-center items-center gap-4 text-sm font-semibold text-white/60 pointer-events-none">
            <span className="cursor-pointer pointer-events-auto hover:text-white transition-colors">Following</span>
            <span className="text-gray-600">|</span>
            <span className="text-white cursor-pointer pointer-events-auto border-b-2 border-white pb-1">For You</span>
        </div>
    )
}
