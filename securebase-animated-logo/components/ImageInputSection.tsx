import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react';
import HolographicLogo from './HolographicLogo';

interface ImageInputSectionProps {
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onImageSelected: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  previewSrc: string | null;
}

const ImageInputSection: React.FC<ImageInputSectionProps> = ({
  imageUrl,
  onUrlChange,
  onImageSelected,
  onAnalyze,
  isAnalyzing,
  previewSrc
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-800 flex">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Image URL
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          File Upload
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {activeTab === 'url' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">External Image URL</label>
            <div className="relative">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              />
              {imageUrl && (
                 <div className="absolute right-3 top-3 text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                   May require download due to CORS
                 </div>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-start gap-2">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Note: Some external URLs might be blocked by browser security (CORS). If analysis fails, please save the image and use "File Upload".
            </p>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 hover:border-indigo-500 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-white">Click to upload image</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {previewSrc && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2 px-1">
                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">3D Preview</p>
                 <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Hover to interact</span>
            </div>
            <HolographicLogo src={previewSrc} />
          </div>
        )}

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !previewSrc}
          className={`w-full mt-6 py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isAnalyzing || !previewSrc
              ? 'bg-slate-700 cursor-not-allowed text-slate-400'
              : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Logo
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageInputSection;