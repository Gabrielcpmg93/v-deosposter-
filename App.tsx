import React, { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import UploadModal from './components/UploadModal';
import { BottomNav } from './components/Navbar';
import { ViewState } from './types';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.FEED);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.FEED:
        return <VideoFeed />;
      case ViewState.UPLOAD:
        return <UploadModal onClose={() => setCurrentView(ViewState.FEED)} />;
      case ViewState.PROFILE:
        return (
            <div className="w-full h-full flex flex-col bg-black text-white p-6 pt-20 overflow-y-auto">
                <div className="flex flex-col items-center mb-8">
                    <img src={CURRENT_USER.avatarUrl} className="w-24 h-24 rounded-full mb-4 border-2 border-gray-700" />
                    <h1 className="text-xl font-bold">@{CURRENT_USER.username}</h1>
                    <div className="flex gap-8 mt-6">
                        <div className="text-center"><div className="font-bold">142</div><div className="text-xs text-gray-400">Following</div></div>
                        <div className="text-center"><div className="font-bold">10.5k</div><div className="text-xs text-gray-400">Followers</div></div>
                        <div className="text-center"><div className="font-bold">45k</div><div className="text-xs text-gray-400">Likes</div></div>
                    </div>
                    <button className="mt-6 px-8 py-2 bg-gray-800 rounded-sm font-semibold text-sm">Edit profile</button>
                </div>
                <div className="border-t border-gray-800 pt-4 grid grid-cols-3 gap-1">
                     <div className="aspect-[3/4] bg-gray-800"></div>
                     <div className="aspect-[3/4] bg-gray-800"></div>
                     <div className="aspect-[3/4] bg-gray-800"></div>
                     <div className="aspect-[3/4] bg-gray-800"></div>
                </div>
            </div>
        );
      default:
        return <VideoFeed />;
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden font-sans">
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
      
      {/* Show Bottom Nav only on main screens, hide on full modals usually, but keeping it simple here */}
      {currentView !== ViewState.UPLOAD && (
         <BottomNav currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;