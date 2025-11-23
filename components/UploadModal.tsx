import React, { useState, useRef } from 'react';
import { X, UploadCloud, Sparkles } from 'lucide-react';
import { ViewState } from '../types';
import { generateVideoCaption } from '../services/geminiService';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerateCaption = async () => {
      setIsGenerating(true);
      // Wait a simulated delay for "processing"
      await new Promise(r => setTimeout(r, 1000));
      
      const generated = "POV: You just discovered the best thing ever! ✨ #viral #fyp";
      setCaption(generated);
      setIsGenerating(false);
  };

  return (
    <div className="w-full h-full bg-white text-black flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 shadow-sm">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        <h2 className="font-bold text-lg">Post</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {!previewUrl ? (
          <label className="w-full max-w-sm h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all bg-white">
            <div className="p-4 bg-gray-100 rounded-full">
                <UploadCloud size={40} className="text-gray-500" />
            </div>
            <div className="text-center">
                <span className="text-gray-800 font-bold block">Select video to upload</span>
                <span className="text-xs text-gray-500 mt-1 block">MP4 or WebM</span>
            </div>
            <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-4 animate-fade-in">
             <div className="relative w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg">
                <video 
                    ref={videoRef}
                    src={previewUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                />
             </div>
             
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Caption</label>
                <div className="relative">
                    <textarea 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Describe your video..."
                        className="w-full bg-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black outline-none resize-none h-24 placeholder:text-gray-400"
                    />
                    <button 
                        onClick={handleGenerateCaption}
                        disabled={isGenerating}
                        className="absolute right-2 bottom-2 px-2 py-1 bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50 hover:bg-gray-800 transition-colors"
                    >
                        <Sparkles size={12} />
                        {isGenerating ? 'AI Magic...' : 'Generate'}
                    </button>
                </div>
             </div>

             <div className="flex gap-3 mt-2">
                 <button 
                    onClick={() => { setFile(null); setPreviewUrl(null); }}
                    className="flex-1 py-3 text-gray-600 font-bold text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={onClose} 
                    className="flex-1 py-3 bg-red-500 text-white rounded-full font-bold shadow-md hover:bg-red-600 transition-colors"
                 >
                    Post
                 </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;