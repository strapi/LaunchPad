import React, { useRef, useState, forwardRef } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const HolographicCard = forwardRef<HTMLDivElement, HolographicCardProps>(({ children, className = "", intensity = 20 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = containerRef.current || (ref as React.RefObject<HTMLDivElement>)?.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation: center is 0,0
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * intensity;
    const rotateX = -((y - centerY) / centerY) * intensity; // Invert Y for correct tilt

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
    <div 
      ref={ref}
      className={`relative perspective-1000 group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="w-full h-full relative transition-transform duration-100 ease-out transform-style-3d will-change-transform"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {children}

        {/* Shine/Glare Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
            opacity: glare.active ? 1 : 0,
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Dynamic Border Highlight */}
        <div 
            className="absolute inset-0 rounded-[inherit] border border-white/0 transition-colors duration-300 pointer-events-none z-50"
            style={{
                borderColor: glare.active ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
        />
      </div>
    </div>
  );
});

HolographicCard.displayName = "HolographicCard";
export default HolographicCard;
