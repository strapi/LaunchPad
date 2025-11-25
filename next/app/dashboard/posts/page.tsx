/**
 * Upload Posts Page
 * Multi-platform social media post composer
 */

'use client';

import { useState } from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiImage, FiCalendar, FiSend } from 'react-icons/fi';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: FiFacebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'bg-pink-600' },
  { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'bg-sky-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, color: 'bg-blue-700' },
];

export default function UploadPostsPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [postNow, setPostNow] = useState(true);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, call Strapi API to create post
    console.log({
      title,
      content,
      platforms: selectedPlatforms,
      hashtags: hashtags.split(' ').filter(Boolean),
      scheduledTime: postNow ? null : scheduledTime,
    });

    // Show success message
    alert(postNow ? 'Post published successfully!' : 'Post scheduled successfully!');
    
    // Reset form
    setTitle('');
    setContent('');
    setHashtags('');
    setScheduledTime('');
    setSelectedPlatforms([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
        <p className="text-gray-600 mt-1">Compose and publish content across multiple platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's on your mind?"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">{content.length} characters</p>
              </div>

              {/* Hashtags */}
              <div>
                <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#example #hashtags"
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors">
                  <FiImage className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images or videos</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 10MB</p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  onClick={() => setPostNow(true)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiSend className="w-5 h-5" />
                  Post Now
                </button>
                <button
                  type="button"
                  onClick={() => setPostNow(false)}
                  className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCalendar className="w-5 h-5" />
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Select Platforms */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Time */}
          {!postNow && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Time</h2>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[150px]">
              {content ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
              ) : (
                <p className="text-sm text-gray-400">Your post preview will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
