/**
 * Social Messages Page
 * Unified inbox for all social media messages
 */

'use client';

import { useState, useEffect } from 'react';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiSearch,
  FiFilter,
  FiSend,
  FiPaperclip,
  FiMoreVertical,
  FiCheck,
  FiCheckCheck,
  FiClock,
  FiStar,
  FiArchive,
  FiTrash2,
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

interface Message {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  senderName: string;
  senderUsername: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  status: 'pending' | 'replied' | 'assigned';
  assignedTo?: string;
  priority: 'low' | 'normal' | 'high';
  conversationId: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

const platformIcons: Record<string, any> = {
  facebook: FiFacebook,
  instagram: FiInstagram,
  twitter: FiTwitter,
  linkedin: FiLinkedin,
};

const platformColors: Record<string, string> = {
  facebook: 'bg-blue-600',
  instagram: 'bg-pink-600',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-700',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [replyText, setReplyText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Group messages into conversations
    const convos = groupMessagesIntoConversations(messages);
    setConversations(convos);
  }, [messages]);

  const fetchMessages = async () => {
    // Mock data for demonstration
    // In production, this would call the Strapi API
    const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'facebook',
        senderName: 'John Doe',
        senderUsername: '@johndoe',
        content: 'Hi! I love your latest product. When will it be available?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        status: 'pending',
        priority: 'high',
        conversationId: 'conv-1',
      },
      {
        id: '2',
        platform: 'instagram',
        senderName: 'Jane Smith',
        senderUsername: '@janesmith',
        content: 'Can you tell me more about your services?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: false,
        status: 'pending',
        priority: 'normal',
        conversationId: 'conv-2',
      },
      {
        id: '3',
        platform: 'twitter',
        senderName: 'Mike Johnson',
        senderUsername: '@mikej',
        content: 'Great post! Would love to collaborate.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        isRead: true,
        status: 'replied',
        priority: 'normal',
        conversationId: 'conv-3',
      },
      {
        id: '4',
        platform: 'linkedin',
        senderName: 'Sarah Williams',
        senderUsername: '@sarahw',
        content: 'Interested in discussing a partnership opportunity.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        status: 'assigned',
        assignedTo: 'Sales Team',
        priority: 'high',
        conversationId: 'conv-4',
      },
      {
        id: '5',
        platform: 'facebook',
        senderName: 'Robert Brown',
        senderUsername: '@robertb',
        content: 'I have a question about pricing...',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isRead: false,
        status: 'pending',
        priority: 'normal',
        conversationId: 'conv-5',
      },
    ];

    setMessages(mockMessages);
  };

  const groupMessagesIntoConversations = (msgs: Message[]): Conversation[] => {
    const grouped = msgs.reduce((acc, message) => {
      if (!acc[message.conversationId]) {
        acc[message.conversationId] = [];
      }
      acc[message.conversationId].push(message);
      return acc;
    }, {} as Record<string, Message[]>);

    return Object.entries(grouped).map(([id, messages]) => {
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return {
        id,
        messages: sortedMessages,
        lastMessage: sortedMessages[0],
        unreadCount: sortedMessages.filter((m) => !m.isRead).length,
      };
    });
  };

  const handleMarkAsRead = (conversationId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.conversationId === conversationId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    // In production, send message via Strapi API
    console.log('Sending reply:', replyText);
    
    // Update conversation status
    setMessages((prev) =>
      prev.map((msg) =>
        msg.conversationId === selectedConversation.id
          ? { ...msg, status: 'replied' }
          : msg
      )
    );

    setReplyText('');
    alert('Reply sent successfully!');
  };

  const handleArchive = (conversationId: string) => {
    // In production, archive via Strapi API
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const message = conv.lastMessage;
    const matchesSearch =
      searchQuery === '' ||
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform =
      filterPlatform === 'all' || message.platform === filterPlatform;
    
    const matchesStatus =
      filterStatus === 'all' || message.status === filterStatus;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const pendingCount = messages.filter((m) => m.status === 'pending').length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Unified inbox for all your social media messages</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{unreadCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{repliedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiCheckCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{messages.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiSend className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <FiSend className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const message = conversation.lastMessage;
                const Icon = platformIcons[message.platform];
                const isSelected = selectedConversation?.id === conversation.id;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      handleMarkAsRead(conversation.id);
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {message.senderName[0]}
                          </span>
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 ${platformColors[message.platform]} rounded-full flex items-center justify-center border-2 border-white`}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {message.senderName}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{format(parseISO(message.timestamp), 'MMM d, HH:mm')}</span>
                          <span>•</span>
                          <span className="capitalize">{message.status}</span>
                          {message.priority === 'high' && (
                            <>
                              <span>•</span>
                              <FiStar className="w-3 h-3 text-yellow-500" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {!selectedConversation ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <FiSend className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-500">
                  Select a message from the list to view and reply
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[600px]">
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-base font-medium text-gray-600">
                        {selectedConversation.lastMessage.senderName[0]}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${
                        platformColors[selectedConversation.lastMessage.platform]
                      } rounded-full flex items-center justify-center border-2 border-white`}
                    >
                      {(() => {
                        const Icon = platformIcons[selectedConversation.lastMessage.platform];
                        return <Icon className="w-2.5 h-2.5 text-white" />;
                      })()}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedConversation.lastMessage.senderName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.lastMessage.senderUsername}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleArchive(selectedConversation.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <FiArchive className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="More options"
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {message.senderName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(parseISO(message.timestamp), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-gray-800">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiPaperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
