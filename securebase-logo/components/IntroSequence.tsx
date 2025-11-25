import React, { useEffect, useRef, useState } from 'react';

// The Securebase logo URL provided by the user
const INTRO_LOGO = "https://cdn.prod.website-files.com/66a4218441155593be85878f/67135b512f98d2b03a39dba2_logo-color-p-500.png";

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<'particles' | 'logo' | 'fading'>('particles');
  const [opacity, setOpacity] = useState(1);

  // Animation Sequence Logic
  useEffect(() => {
    // 1. Start Particles immediately (handled by Canvas effect below)
    
    // 2. Reveal Logo after 2 seconds
    const logoTimer = setTimeout(() => {
      setStage('logo');
    }, 2000);

    // 3. Start Fade Out after 6 seconds (Logo has time to shimmer at least once: 3.5s cycle)
    const exitTimer = setTimeout(() => {
      setStage('fading');
      setOpacity(0); // Trigger CSS transition
    }, 6000);

    // 4. Complete and unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 7000); // 1s after fade starts

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Particle System Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = Math.min(width / 10, 100); // Responsive count

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'; // Slate-500 equivalent

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 150})`; // Indigo tint
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{ opacity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div 
        className={`relative z-10 transition-all duration-1000 transform ${
          stage === 'particles' ? 'opacity-0 translate-y-10 scale-90' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <div className="relative group p-10">
           {/* Logo Image */}
           <img 
              src={INTRO_LOGO} 
              alt="Securebase" 
              className="w-64 md:w-80 object-contain drop-shadow-2xl"
            />
            
            {/* Shimmer Overlay */}
            {/* The shimmer runs every 3.5s due to animate-shimmer-fast defined in index.html */}
            <div className="absolute inset-0 -skew-x-12 z-20 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -translate-x-full animate-shimmer-fast" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSequence;
