"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IconMicrophone, IconSend, IconSparkles } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LemonAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string}[]>([
    { role: 'agent', content: "Good morning, Dr. Sung. I've analyzed the latest session with Mark. Would you like a summary?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput("");
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', content: "I'm processing that request. Accessing SecureBase knowledge graph..." }]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulate voice input
    if (!isListening) {
      setTimeout(() => {
        setInput("Show me the psychological safety trends for the executive team.");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
        whileHover={{ rotate: 15 }}
      >
        <IconSparkles className="text-white w-8 h-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-charcoal border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl bg-opacity-90"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-white">LemonAI Agent</span>
              </div>
              <span className="text-xs text-gray-400">Proactive Mode</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-400'}`}
                >
                  <IconMicrophone size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask LemonAI..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-sm"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 hover:bg-white/10 rounded-full text-cyan-400 transition-colors"
                >
                  <IconSend size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
