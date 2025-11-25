import React, { useRef, useState } from 'react';

interface HolographicLogoProps {
  src: string;
}

const HolographicLogo: React.FC<HolographicLogoProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation: center is 0,0
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation deg
    const maxDeg = 20;
    
    const rotateY = ((x - centerX) / centerX) * maxDeg;
    const rotateX = -((y - centerY) / centerY) * maxDeg; // Invert Y for correct tilt

    // Calculate glare position in %
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, active: true });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, active: false }));
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div 
        className="relative w-full max-w-[320px] aspect-square"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full relative transition-transform duration-200 ease-out transform-style-3d cursor-pointer animate-float"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Back Glow Layer (The "Spline" colored ambient light) */}
          <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-[80px] animate-pulse-slow pointer-events-none" 
               style={{ transform: 'translateZ(-50px) translate(-50%, -50%)' }} 
          />

          {/* Main Card */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center group transform-style-3d">
            
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            {/* The Logo itself - Popping out in 3D */}
            <div 
                className="relative z-10 w-4/5 h-4/5 flex items-center justify-center transition-transform duration-200"
                style={{ transform: 'translateZ(50px)' }}
            >
                <img 
                  src={src} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
                />
            </div>

            {/* Shine/Glare Effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                opacity: glare.active ? 1 : 0,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Ripple/Shimmer Effect on Hover */}
            <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/20 transition-colors duration-500 z-30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 w-[200%] h-full -left-full group-hover:animate-shimmer z-20 pointer-events-none" />

          </div>
        </div>
        
        {/* Helper text */}
        <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
             <span className="text-xs text-indigo-300 font-medium tracking-widest uppercase">Interactive 3D Preview</span>
        </div>
      </div>
    </div>
  );
};

export default HolographicLogo;
