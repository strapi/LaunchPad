"use client";

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { IconSend, IconMicrophone, IconPhoto, IconPaperclip, IconUser, IconRobot } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Multimodal Chat</h2>
        <p className="text-gray-400">AI Coach & SecureBase Assistant</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 mb-4 overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 && (
             <div className="self-start bg-white/10 text-gray-200 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
              Hello! I am your AI assistant trained on Dr. Sung&apos;s SecureBase content. How can I help you with your leadership journey today?
            </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={cn(
            "flex gap-3 max-w-[80%]",
            m.role === 'user' ? "self-end flex-row-reverse" : "self-start"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"
            )}>
              {m.role === 'user' ? <IconUser size={18} /> : <IconRobot size={18} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm",
              m.role === 'user' 
                ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none" 
                : "bg-white/10 text-gray-200 rounded-tl-none"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
           <div className="self-start flex gap-3 max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center shrink-0">
                <IconRobot size={18} />
             </div>
             <div className="bg-white/10 text-gray-200 p-3 rounded-2xl rounded-tl-none">
               <span className="animate-pulse">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-3 top-3 flex gap-2 text-gray-400">
          <button type="button" className="hover:text-cyan-400 transition-colors"><IconMicrophone size={20} /></button>
          <button type="button" className="hover:text-cyan-400 transition-colors"><IconPhoto size={20} /></button>
          <button type="button" className="hover:text-cyan-400 transition-colors"><IconPaperclip size={20} /></button>
        </div>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-28 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
        />
        <button type="submit" disabled={isLoading} className="absolute right-3 top-3 text-cyan-500 hover:text-cyan-400 transition-colors disabled:opacity-50">
          <IconSend size={20} />
        </button>
      </form>
    </div>
  );
}
