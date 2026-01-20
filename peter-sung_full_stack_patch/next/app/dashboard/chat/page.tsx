"use client";

import React, { useState } from 'react';
import { IconSend, IconMicrophone, IconPhoto, IconPaperclip } from '@tabler/icons-react';

export default function ChatPage() {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Multimodal Chat</h2>
        <p className="text-gray-400">AI Coach & SecureBase Assistant</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 mb-4 overflow-y-auto flex flex-col gap-4">
        <div className="self-start bg-white/10 text-gray-200 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
          Hello! I am your AI assistant trained on Dr. Sung's SecureBase content. How can I help you with your leadership journey today?
        </div>
        {/* Placeholder for user message */}
        <div className="self-end bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
          I'm feeling a bit stuck with my team's communication.
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="absolute left-3 top-3 flex gap-2 text-gray-400">
          <button className="hover:text-cyan-400 transition-colors"><IconMicrophone size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><IconPhoto size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><IconPaperclip size={20} /></button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-28 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
        />
        <button className="absolute right-3 top-3 text-cyan-500 hover:text-cyan-400 transition-colors">
          <IconSend size={20} />
        </button>
      </div>
    </div>
  );
}
