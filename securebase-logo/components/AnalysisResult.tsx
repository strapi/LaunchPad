import React from 'react';
import { LogoAnalysis } from '../types';
import { Palette, Layers, Lightbulb, Tag, Building2, Heart } from 'lucide-react';

interface AnalysisResultProps {
  analysis: LogoAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Layers className="w-24 h-24 text-indigo-500" />
        </div>
        <div className="relative z-10">
            <div className="flex items-baseline gap-3 mb-2">
                 <h2 className="text-2xl font-bold text-white">{analysis.brandName}</h2>
                 <span className="text-sm font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                     {analysis.designStyle}
                 </span>
            </div>
          <p className="text-slate-300 leading-relaxed text-lg">{analysis.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-white">Color Palette</h3>
          </div>
          <div className="space-y-4 flex-1">
            {analysis.colorPalette.map((color, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div 
                  className="w-12 h-12 rounded-xl shadow-inner ring-2 ring-white/5 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{color.name}</span>
                    <span className="text-xs text-slate-500 uppercase font-mono">{color.hex}</span>
                  </div>
                  <p className="text-sm text-slate-400">{color.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Personality & Vibe */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-white">Brand Personality</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300 italic mb-4">"{analysis.sentiment}"</p>
            <div className="flex flex-wrap gap-2">
              {analysis.brandPersonality.split(',').map((trait, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
                  {trait.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
             <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Potential Industries</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {analysis.potentialIndustries.map((ind, i) => (
                    <span key={i} className="text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                        {ind}
                    </span>
                ))}
             </div>
          </div>
        </div>
      </div>

       {/* Visual Elements */}
       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Key Visual Elements</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.visualElements.map((el, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                    <Tag className="w-4 h-4 text-indigo-400 mt-1" />
                    <span className="text-slate-300 text-sm">{el}</span>
                </div>
            ))}
          </div>
       </div>

    </div>
  );
};

export default AnalysisResult;
