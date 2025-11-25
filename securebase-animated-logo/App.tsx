import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageInputSection from './components/ImageInputSection';
import AnalysisResult from './components/AnalysisResult';
import { AnalysisState } from './types';
import { analyzeLogoImage } from './services/geminiService';
import { urlToBase64, blobToBase64 } from './utils/imageUtils';

// Default URL from the prompt
const DEFAULT_URL = "https://cdn.prod.website-files.com/66a4218441155593be85878f/67135b512f98d2b03a39dba2_logo-color-p-500.png";

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState(DEFAULT_URL);
  const [previewSrc, setPreviewSrc] = useState<string | null>(DEFAULT_URL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  // Effect to handle external URL changes for preview
  useEffect(() => {
    if (imageUrl && !imageFile) {
        setPreviewSrc(imageUrl);
    }
  }, [imageUrl, imageFile]);

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null); // Clear file selection if typing URL
    setAnalysisState({ status: 'idle', data: null, error: null });
  };

  const handleImageSelected = async (file: File) => {
    setImageFile(file);
    setImageUrl(''); // Clear URL if file selected
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
    setAnalysisState({ status: 'idle', data: null, error: null });
  };

  const handleAnalyze = async () => {
    setAnalysisState({ status: 'loading', data: null, error: null });

    try {
      let base64 = '';
      let mimeType = '';

      if (imageFile) {
        const result = await blobToBase64(imageFile);
        base64 = result.base64;
        mimeType = result.mimeType;
      } else if (imageUrl) {
        try {
            const result = await urlToBase64(imageUrl);
            base64 = result.base64;
            mimeType = result.mimeType;
        } catch (e: any) {
            if (e.message === 'CORS_ERROR') {
                throw new Error("This image URL is protected by browser security (CORS). Please save the image to your device and use the 'Upload' tab instead.");
            }
            throw e;
        }
      } else {
        throw new Error("Please provide an image URL or upload a file.");
      }

      const result = await analyzeLogoImage(base64, mimeType);
      setAnalysisState({ status: 'success', data: result, error: null });

    } catch (error: any) {
      setAnalysisState({ 
        status: 'error', 
        data: null, 
        error: error.message || "An unexpected error occurred." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      <Header />
      
      <main className="container mx-auto px-4 pt-8 md:pt-12">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            See What Your Logo Says
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload any logo to uncover its hidden design language, color psychology, and brand impact using Gemini Vision.
          </p>
        </div>

        <ImageInputSection 
          imageUrl={imageUrl}
          onUrlChange={handleUrlChange}
          onImageSelected={handleImageSelected}
          onAnalyze={handleAnalyze}
          isAnalyzing={analysisState.status === 'loading'}
          previewSrc={previewSrc}
        />

        {analysisState.status === 'error' && (
           <div className="max-w-xl mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
               <div className="p-1 bg-red-500 rounded-full flex-shrink-0 mt-0.5">
                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
               </div>
               <div>
                   <h3 className="text-red-400 font-semibold text-sm">Analysis Failed</h3>
                   <p className="text-red-300 text-sm mt-1">{analysisState.error}</p>
               </div>
           </div>
        )}

        {analysisState.status === 'success' && analysisState.data && (
           <div className="mt-16">
               <AnalysisResult analysis={analysisState.data} />
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
