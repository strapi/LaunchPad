"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

// --- Configuration ---
const PARTICLE_COUNT = 800;
const GATHER_SPEED = 0.015;
const HOLD_DURATION = 2500;
const MAX_ANIMATION_TIME = 8000;

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
}

export default function ParticleHero({ onIntroComplete }: { onIntroComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const progressRef = useRef(0);
  const modeRef = useRef<"gathering" | "holding" | "dispersing">("gathering");
  const completionCalled = useRef(false);
  const holdTriggered = useRef(false);
  
  const [showLogo, setShowLogo] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleComplete = useCallback(() => {
    if (!completionCalled.current) {
      completionCalled.current = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onIntroComplete?.();
    }
  }, [onIntroComplete]);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    const colors = [
      "#FFD700", // Gold
      "#C0C0C0", // Silver
      "#FFFFFF", // White
      "#555555", // Grey
      "#DEB887", // Tan
      "#8FBC8F", // Sage
    ];

    // Create shield formation target positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random starting position (far from center)
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(width, height);
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;
      
      // Target position in a shield/circle formation
      const t = i / PARTICLE_COUNT;
      const shieldRadius = Math.min(width, height) * 0.25;
      const targetAngle = t * Math.PI * 2;
      const targetRadius = shieldRadius * (0.5 + Math.random() * 0.5);
      const targetX = centerX + Math.cos(targetAngle) * targetRadius;
      const targetY = centerY + Math.sin(targetAngle) * targetRadius * 0.8; // Slight oval

      particles.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: GATHER_SPEED * (0.8 + Math.random() * 0.4),
      });
    }
    
    return particles;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);
    
    // Update progress based on mode
    if (modeRef.current === "gathering") {
      progressRef.current += GATHER_SPEED;
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        modeRef.current = "holding";
        
        if (!holdTriggered.current) {
          holdTriggered.current = true;
          setShowLogo(true);
          
          setTimeout(() => {
            modeRef.current = "dispersing";
            handleComplete();
          }, HOLD_DURATION);
        }
      }
    } else if (modeRef.current === "dispersing") {
      progressRef.current -= GATHER_SPEED * 0.5;
      if (progressRef.current < 0) progressRef.current = 0;
    }
    
    // Ease function
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = ease(progressRef.current);
    
    // Draw particles
    const particles = particlesRef.current;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Interpolate position
      const currentX = p.x + (p.targetX - p.x) * easedProgress;
      const currentY = p.y + (p.targetY - p.y) * easedProgress;
      
      // Add slight noise/movement
      const noiseX = Math.sin(time * 2 + i * 0.1) * 2;
      const noiseY = Math.cos(time * 3 + i * 0.1) * 2;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(currentX + noiseX, currentY + noiseY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    
    // Draw center text when gathered
    if (progressRef.current > 0.7) {
      ctx.save();
      ctx.globalAlpha = (progressRef.current - 0.7) / 0.3;
      ctx.font = 'bold 48px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SECUREBASE', width / 2, height / 2);
      ctx.restore();
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [handleComplete]);

  // Initialize on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Start animation
    setIsReady(true);
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  // Fallback timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!completionCalled.current) {
        console.log("ParticleHero: Fallback timeout - completing");
        handleComplete();
      }
    }, MAX_ANIMATION_TIME);
    
    return () => clearTimeout(timeout);
  }, [handleComplete]);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#050505' }}
      />
      
      {/* Logo Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 10 }}
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
            SECUREBASE
          </h1>
          <p className="text-white/70 mt-4 tracking-[0.3em] text-sm uppercase">
            Leadership Coaching
          </p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 z-50 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full text-white/70 text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:text-white group"
      >
        <span className="mr-2">Skip Intro</span>
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}
