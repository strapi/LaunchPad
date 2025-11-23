"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleHero from "./ParticleHero";

export default function LandingIntro({ children }: { children: React.ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    // Allow a small delay for the dispersion animation to start clearing the screen
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* The 3D Intro Layer */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            <ParticleHero onIntroComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layer */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
