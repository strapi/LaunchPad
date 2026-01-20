import React from 'react';
import { Sparkles, ScanEye } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <ScanEye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Gemini <span className="text-indigo-400">Logo Lens</span>
            </h1>
            <p className="text-xs text-slate-400">Powered by Google Gemini 2.5 Flash</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-900 py-1.5 px-3 rounded-full border border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Brand Analysis</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
