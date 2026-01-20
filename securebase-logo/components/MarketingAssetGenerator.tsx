import React, { useState, useRef } from 'react';
import { LogoAnalysis } from '../types';
import HolographicCard from './HolographicCard';
import { Download, Layout, Palette, ShieldCheck, Sparkles, Type } from 'lucide-react';
import { toPng } from 'html-to-image';

interface MarketingAssetGeneratorProps {
  analysis: LogoAnalysis;
  logoSrc: string;
}

const THEMES = {
  secure: {
    name: "Cyber Vault",
    bg: "bg-slate-950",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    gradient: "from-emerald-900/40 via-slate-900 to-slate-950",
    blob: "bg-emerald-500",
    cardBg: "bg-slate-900/60",
    grid: true
  },
  gold: {
    name: "Executive Gold",
    bg: "bg-slate-950",
    accent: "text-amber-400",
    border: "border-amber-500/30",
    gradient: "from-amber-900/40 via-slate-900 to-slate-950",
    blob: "bg-amber-500",
    cardBg: "bg-black/60",
    grid: true
  },
  neon: {
    name: "Midnight Pulse",
    bg: "bg-[#050510]",
    accent: "text-purple-400",
    border: "border-purple-500/30",
    gradient: "from-indigo-900/50 via-purple-900/30 to-slate-950",
    blob: "bg-purple-600",
    cardBg: "bg-slate-900/40",
    grid: false
  }
};

const FORMATS = {
  square: { label: "Post (1:1)", aspect: "aspect-square", w: "w-[500px]" },
  story: { label: "Story (9:16)", aspect: "aspect-[9/16]", w: "w-[360px]" },
  landscape: { label: "Social (16:9)", aspect: "aspect-[16/9]", w: "w-[600px]" }
};

const MarketingAssetGenerator: React.FC<MarketingAssetGeneratorProps> = ({ analysis, logoSrc }) => {
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>('gold');
  const [activeFormat, setActiveFormat] = useState<keyof typeof FORMATS>('landscape');
  const [showBadge, setShowBadge] = useState(true);
  const [customTitle, setCustomTitle] = useState(analysis.brandName || "SECUREBASE");
  const [customTagline, setCustomTagline] = useState("Official Verified Asset");
  const [isDownloading, setIsDownloading] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  const theme = THEMES[activeTheme];
  const format = FORMATS[activeFormat];

  const handleDownload = async () => {
    if (captureRef.current) {
      setIsDownloading(true);
      try {
        // Double resolution for better quality
        const dataUrl = await toPng(captureRef.current, { 
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: '#020617' // slate-950
        });
        
        const link = document.createElement('a');
        link.download = `brand-asset-${activeTheme}-${activeFormat}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to generate image', err);
        alert('Could not generate image. If using an external URL, this may be due to browser security restrictions (CORS). Try uploading the file directly.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-20 mb-20 animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-amber-400" />
            Brand Asset Studio
        </h2>
        <p className="text-slate-400">Generate high-end 3D marketing assets for social media.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* Theme Selection */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Aesthetics
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTheme(t)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    activeTheme === t 
                      ? `bg-slate-800 ${THEMES[t].border} shadow-lg shadow-${THEMES[t].blob}/10` 
                      : 'border-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${THEMES[t].gradient}`} />
                  <span className={`font-medium ${activeTheme === t ? 'text-white' : 'text-slate-400'}`}>
                    {THEMES[t].name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4" /> Format
            </h3>
            <div className="flex gap-2">
              {(Object.keys(FORMATS) as Array<keyof typeof FORMATS>).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFormat(f)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                    activeFormat === f
                      ? 'bg-indigo-600 text-white border-indigo-500' 
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {FORMATS[f].label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Controls */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" /> Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Brand Name</label>
                <input 
                  type="text" 
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Caption / Status</label>
                <input 
                  type="text" 
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setShowBadge(!showBadge)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    showBadge 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  Verified Badge
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-wait"
          >
            {isDownloading ? (
               <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'Generating PNG...' : 'Download Asset'}
          </button>

        </div>

        {/* Live Preview Canvas */}
        <div className="w-full lg:w-2/3 bg-slate-900/20 rounded-3xl border border-slate-800 p-8 flex items-center justify-center relative overflow-hidden">
             
            {/* Background of the preview container - acts as a neutral backdrop */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />

            {/* The Actual Social Media Card Area to be Captured */}
            <div 
              ref={captureRef}
              className={`relative overflow-hidden shadow-2xl transition-all duration-500 ease-in-out ${format.w} ${format.aspect} ${theme.bg}`}
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
                {/* Dynamic Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                {theme.grid && <div className="absolute inset-0 bg-grid-white opacity-10" />}
                
                {/* Ambient Orbs */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${theme.blob} rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob`} />
                <div className={`absolute bottom-0 left-0 w-64 h-64 ${theme.blob} rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob animation-delay-2000`} />

                {/* Content Container */}
                <div className="relative h-full w-full flex flex-col items-center justify-center p-8">
                    
                    {/* The 3D Element */}
                    <HolographicCard className="w-2/3 max-w-[280px] aspect-square mb-6" intensity={25}>
                        <div className={`w-full h-full rounded-2xl ${theme.cardBg} backdrop-blur-xl border ${theme.border} flex items-center justify-center relative overflow-hidden shadow-2xl`}>
                            {/* Inner Card Details */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                            
                            {/* Floating Elements */}
                            <div className="relative z-10 w-[70%] h-[70%] animate-float drop-shadow-2xl flex items-center justify-center">
                                <img 
                                    src={logoSrc} 
                                    className="max-w-full max-h-full object-contain" 
                                    style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))' }}
                                    alt="Brand Logo" 
                                />
                            </div>

                            {/* Scan Lines Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                        </div>
                    </HolographicCard>

                    {/* Text Overlay */}
                    <div className="text-center space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2">
                             <h1 className="text-3xl font-black text-white tracking-tight uppercase" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                {customTitle}
                             </h1>
                             {showBadge && (
                                 <div className={`p-1 rounded-full ${theme.blob} text-white shadow-lg shadow-${theme.blob}/50`}>
                                     <ShieldCheck className="w-3 h-3" />
                                 </div>
                             )}
                        </div>
                        <p className={`text-sm font-medium ${theme.accent} tracking-widest uppercase opacity-90`}>
                            {customTagline}
                        </p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default MarketingAssetGenerator;
