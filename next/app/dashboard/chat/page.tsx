"use client";

import React, { useRef, useEffect, useState } from 'react';
import { IconSend, IconMicrophone, IconPhoto, IconPaperclip, IconUser, IconRobot, IconDownload, IconTrash, IconPlus, IconHistory } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
  getChatSessions,
  getChatSessionById,
  createChatSession,
  addMessageToChat,
  deleteChatSession,
  type ChatSession,
  type ChatMessage
} from '@/lib/local-store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions on mount
  useEffect(() => {
    const sessions = getChatSessions();
    setChatSessions(sessions);

    // Load the most recent session or create a new one
    if (sessions.length > 0) {
      setCurrentSessionId(sessions[0].id);
      setMessages(sessions[0].messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })));
    }
  }, []);

  const handleNewChat = () => {
    const newSession = createChatSession();
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setShowHistory(false);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = getChatSessionById(sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })));
    }
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatSession(sessionId);
    const updatedSessions = getChatSessions();
    setChatSessions(updatedSessions);

    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        handleSelectSession(updatedSessions[0].id);
      } else {
        setCurrentSessionId(null);
        setMessages([]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Create session if none exists
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = createChatSession();
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      sessionId = newSession.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Save user message to localStorage
    addMessageToChat(sessionId, { role: 'user', content: userMessage.content });

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? { ...m, content: assistantContent }
              : m
          )
        );
      }

      // Save assistant message to localStorage
      addMessageToChat(sessionId, { role: 'assistant', content: assistantContent });

      // Update sessions list
      setChatSessions(getChatSessions());
    } catch (error) {
      console.error('Chat error:', error);
      const errorContent = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
      }]);
      addMessageToChat(sessionId, { role: 'assistant', content: errorContent });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) return;

    // Create PDF content
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Chat Export - SecureBase AI Coach</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #06b6d4; margin: 0; }
    .header p { color: #666; margin-top: 5px; }
    .message { margin-bottom: 20px; padding: 15px; border-radius: 10px; }
    .user { background: #e0f7fa; text-align: right; }
    .assistant { background: #f5f5f5; }
    .role { font-weight: bold; color: #06b6d4; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; }
    .content { line-height: 1.6; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SecureBase AI Coach</h1>
    <p>Chat Export - ${new Date().toLocaleDateString()}</p>
  </div>
  ${messages.map(m => `
    <div class="message ${m.role}">
      <div class="role">${m.role === 'user' ? 'You' : 'AI Coach'}</div>
      <div class="content">${m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
  `).join('')}
  <div class="footer">
    Exported from SecureBase Coaching Platform<br>
    Dr. Peter Sung - Leadership & Executive Coaching
  </div>
</body>
</html>
`;

    // Open print dialog (browser will offer Save as PDF)
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Multimodal Chat</h2>
          <p className="text-gray-400">AI Coach & SecureBase Assistant</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showHistory ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            )}
            title="Chat History"
          >
            <IconHistory size={20} />
          </button>
          <button
            onClick={handleNewChat}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="New Chat"
          >
            <IconPlus size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={messages.length === 0}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export as PDF"
          >
            <IconDownload size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Chat History Sidebar */}
        {showHistory && (
          <div className="w-64 bg-white/5 border border-white/10 rounded-xl p-3 overflow-y-auto flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">Chat History</h3>
            {chatSessions.length === 0 ? (
              <p className="text-gray-500 text-sm px-2">No previous chats</p>
            ) : (
              <div className="space-y-1">
                {chatSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                      session.id === currentSessionId
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    <div className="truncate flex-1 text-sm">{session.title}</div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
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
                  "p-3 rounded-2xl text-sm whitespace-pre-wrap",
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
              <button type="button" className="hover:text-cyan-400 transition-colors" title="Voice input (coming soon)"><IconMicrophone size={20} /></button>
              <button type="button" className="hover:text-cyan-400 transition-colors" title="Image upload (coming soon)"><IconPhoto size={20} /></button>
              <button type="button" className="hover:text-cyan-400 transition-colors" title="Attach file (coming soon)"><IconPaperclip size={20} /></button>
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
      </div>
    </div>
  );
}
