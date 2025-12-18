/**
 * Social Comments Page
 * Monitor and manage comments across all social media platforms
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
  FiThumbsUp,
  FiMessageCircle,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiSmile,
  FiMeh,
  FiFrown,
  FiEye,
  FiEyeOff,
  FiHeart,
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

interface Comment {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  postTitle: string;
  postId: string;
  authorName: string;
  authorUsername: string;
  content: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isRead: boolean;
  isHidden: boolean;
  isSpam: boolean;
  likes: number;
  replies: number;
  needsModeration: boolean;
}

const platformIcons: Record<string, any> = {
  facebook: FiFacebook,
  instagram: FiInstagram,
  twitter: FiTwitter,
  linkedin: FiLinkedin,
};

const platformColors: Record<string, string> = {
  facebook: 'text-blue-600 bg-blue-50',
  instagram: 'text-pink-600 bg-pink-50',
  twitter: 'text-sky-500 bg-sky-50',
  linkedin: 'text-blue-700 bg-blue-50',
};

const sentimentIcons: Record<string, any> = {
  positive: FiSmile,
  neutral: FiMeh,
  negative: FiFrown,
};

const sentimentColors: Record<string, string> = {
  positive: 'text-green-600 bg-green-50',
  neutral: 'text-gray-600 bg-gray-50',
  negative: 'text-red-600 bg-red-50',
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [filterModeration, setFilterModeration] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    // Mock data for demonstration
    // In production, this would call the Strapi API
    const mockComments: Comment[] = [
      {
        id: '1',
        platform: 'facebook',
        postTitle: 'Product Launch Announcement',
        postId: 'post-1',
        authorName: 'Alice Johnson',
        authorUsername: '@alice_j',
        content: 'This looks amazing! Can\'t wait to try it out. When will it be available in stores?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
        isRead: false,
        isHidden: false,
        isSpam: false,
        likes: 15,
        replies: 2,
        needsModeration: false,
      },
      {
        id: '2',
        platform: 'instagram',
        postTitle: 'Behind the Scenes',
        postId: 'post-2',
        authorName: 'Bob Smith',
        authorUsername: '@bobsmith',
        content: 'Love the transparency! Your team seems awesome.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'positive',
        isRead: true,
        isHidden: false,
        isSpam: false,
        likes: 42,
        replies: 5,
        needsModeration: false,
      },
      {
        id: '3',
        platform: 'twitter',
        postTitle: 'Weekly Tips',
        postId: 'post-3',
        authorName: 'Charlie Davis',
        authorUsername: '@charlied',
        content: 'These tips are okay but nothing groundbreaking.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        sentiment: 'neutral',
        isRead: true,
        isHidden: false,
        isSpam: false,
        likes: 8,
        replies: 1,
        needsModeration: false,
      },
      {
        id: '4',
        platform: 'linkedin',
        postTitle: 'Company Milestone',
        postId: 'post-4',
        authorName: 'Diana Wilson',
        authorUsername: '@dianaw',
        content: 'Congratulations on this achievement! Well deserved success.',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        sentiment: 'positive',
        isRead: true,
        isHidden: false,
        isSpam: false,
        likes: 67,
        replies: 12,
        needsModeration: false,
      },
      {
        id: '5',
        platform: 'facebook',
        postTitle: 'Customer Support Update',
        postId: 'post-5',
        authorName: 'Eve Brown',
        authorUsername: '@evebrown',
        content: 'Disappointed with the recent service. Expected better.',
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        sentiment: 'negative',
        isRead: false,
        isHidden: false,
        isSpam: false,
        likes: 3,
        replies: 0,
        needsModeration: true,
      },
      {
        id: '6',
        platform: 'instagram',
        postTitle: 'New Collection',
        postId: 'post-6',
        authorName: 'Spam Account',
        authorUsername: '@spam_bot',
        content: 'Buy followers cheap! Visit my profile now!!!',
        timestamp: new Date(Date.now() - 36000000).toISOString(),
        sentiment: 'neutral',
        isRead: false,
        isHidden: false,
        isSpam: true,
        likes: 0,
        replies: 0,
        needsModeration: true,
      },
    ];

    setComments(mockComments);
  };

  const handleMarkAsRead = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, isRead: true } : comment
      )
    );
  };

  const handleHideComment = (commentId: string) => {
    if (confirm('Are you sure you want to hide this comment?')) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, isHidden: true } : comment
        )
      );
      // In production, call Strapi API to hide comment
      alert('Comment hidden successfully');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      // In production, call Strapi API to delete comment
      alert('Comment deleted successfully');
      setSelectedComment(null);
    }
  };

  const handleMarkAsSpam = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, isSpam: true, needsModeration: false }
          : comment
      )
    );
    // In production, call Strapi API to mark as spam
    alert('Comment marked as spam');
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedComment) return;

    // In production, send reply via Strapi API
    console.log('Replying to comment:', selectedComment.id, replyText);
    
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === selectedComment.id
          ? { ...comment, replies: comment.replies + 1, needsModeration: false }
          : comment
      )
    );

    setReplyText('');
    alert('Reply posted successfully!');
  };

  const filteredComments = comments.filter((comment) => {
    if (comment.isHidden) return false;

    const matchesSearch =
      searchQuery === '' ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      filterPlatform === 'all' || comment.platform === filterPlatform;

    const matchesSentiment =
      filterSentiment === 'all' || comment.sentiment === filterSentiment;

    const matchesModeration = !filterModeration || comment.needsModeration;

    return matchesSearch && matchesPlatform && matchesSentiment && matchesModeration;
  });

  const unreadCount = comments.filter((c) => !c.isRead).length;
  const moderationCount = comments.filter((c) => c.needsModeration).length;
  const positiveCount = comments.filter((c) => c.sentiment === 'positive').length;
  const negativeCount = comments.filter((c) => c.sentiment === 'negative').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
          <p className="text-gray-600 mt-1">Monitor and manage comments from all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterModeration(!filterModeration)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filterModeration
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiAlertCircle className="w-4 h-4" />
            Needs Moderation {moderationCount > 0 && `(${moderationCount})`}
          </button>
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
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{comments.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiMessageCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{unreadCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <FiEye className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{positiveCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiSmile className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negative</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{negativeCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FiFrown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments, authors, or posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
                Sentiment
              </label>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Comments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
              <FiMessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No comments found</p>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const PlatformIcon = platformIcons[comment.platform];
              const SentimentIcon = sentimentIcons[comment.sentiment];
              const isSelected = selectedComment?.id === comment.id;

              return (
                <div
                  key={comment.id}
                  onClick={() => {
                    setSelectedComment(comment);
                    handleMarkAsRead(comment.id);
                  }}
                  className={`bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500'
                      : comment.needsModeration
                      ? 'border-red-200'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!comment.isRead ? 'bg-blue-50' : ''}`}
                >
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {comment.authorName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {comment.authorName}
                          </h3>
                          {!comment.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{comment.authorUsername}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${platformColors[comment.platform]}`}
                        title={comment.platform}
                      >
                        <PlatformIcon className="w-3.5 h-3.5" />
                      </div>
                      <div
                        className={`p-1.5 rounded-lg ${sentimentColors[comment.sentiment]}`}
                        title={comment.sentiment}
                      >
                        <SentimentIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Post Reference */}
                  <p className="text-xs text-gray-500 mb-2">
                    On: <span className="font-medium">{comment.postTitle}</span>
                  </p>

                  {/* Comment Content */}
                  <p className="text-sm text-gray-800 mb-3">{comment.content}</p>

                  {/* Comment Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiHeart className="w-3.5 h-3.5" />
                        <span>{comment.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMessageCircle className="w-3.5 h-3.5" />
                        <span>{comment.replies}</span>
                      </div>
                    </div>
                    <span>{format(parseISO(comment.timestamp), 'MMM d, HH:mm')}</span>
                  </div>

                  {/* Warning Badges */}
                  {(comment.needsModeration || comment.isSpam) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                      {comment.needsModeration && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3" />
                          Needs Moderation
                        </span>
                      )}
                      {comment.isSpam && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          Spam
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Comment Detail View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-6 h-fit">
          {!selectedComment ? (
            <div className="p-12 text-center">
              <FiMessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No comment selected
              </h3>
              <p className="text-gray-500">
                Select a comment from the list to view details and reply
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Detail Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-base font-medium text-gray-600">
                        {selectedComment.authorName[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {selectedComment.authorName}
                      </h2>
                      <p className="text-sm text-gray-500">{selectedComment.authorUsername}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(() => {
                      const PlatformIcon = platformIcons[selectedComment.platform];
                      const SentimentIcon = sentimentIcons[selectedComment.sentiment];
                      return (
                        <>
                          <div
                            className={`p-2 rounded-lg ${
                              platformColors[selectedComment.platform]
                            }`}
                          >
                            <PlatformIcon className="w-4 h-4" />
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              sentimentColors[selectedComment.sentiment]
                            }`}
                          >
                            <SentimentIcon className="w-4 h-4" />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Posted on:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedComment.postTitle}
                  </p>
                </div>

                <p className="text-gray-800">{selectedComment.content}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiHeart className="w-4 h-4" />
                    <span>{selectedComment.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiMessageCircle className="w-4 h-4" />
                    <span>{selectedComment.replies} replies</span>
                  </div>
                  <span>
                    {format(parseISO(selectedComment.timestamp), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleHideComment(selectedComment.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiEyeOff className="w-4 h-4" />
                    Hide
                  </button>
                  <button
                    onClick={() => handleMarkAsSpam(selectedComment.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <FiAlertCircle className="w-4 h-4" />
                    Mark Spam
                  </button>
                  <button
                    onClick={() => handleMarkAsRead(selectedComment.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleDeleteComment(selectedComment.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Reply */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Reply</h3>
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Send Reply
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
