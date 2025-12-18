/**
 * Calendar View Page
 * Drag-and-drop calendar for scheduling social media posts
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlus, 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiLinkedin,
  FiClock,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';

interface SocialPost {
  id: string;
  title: string;
  content: string;
  scheduledTime: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
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

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [draggedPost, setDraggedPost] = useState<SocialPost | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  useEffect(() => {
    // Fetch scheduled posts from Strapi
    // In production, this would call the API
    fetchPosts();
  }, [currentMonth]);

  const fetchPosts = async () => {
    // Mock data for demonstration
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        title: 'Product Launch Announcement',
        content: 'Excited to announce our new product!',
        scheduledTime: format(addDays(new Date(), 2), "yyyy-MM-dd'T'10:00"),
        platforms: ['facebook', 'twitter'],
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Behind the Scenes',
        content: 'Take a look at our team in action',
        scheduledTime: format(addDays(new Date(), 5), "yyyy-MM-dd'T'14:00"),
        platforms: ['instagram'],
        status: 'scheduled',
      },
      {
        id: '3',
        title: 'Weekly Tips',
        content: 'Here are this week\'s productivity tips',
        scheduledTime: format(addDays(new Date(), 7), "yyyy-MM-dd'T'09:00"),
        platforms: ['linkedin', 'twitter'],
        status: 'scheduled',
      },
    ];
    setPosts(mockPosts);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = parseISO(post.scheduledTime);
      return isSameDay(postDate, day);
    });
  };

  const handleDragStart = (post: SocialPost) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (day: Date, time: string = '10:00') => {
    if (!draggedPost) return;

    const newScheduledTime = format(day, `yyyy-MM-dd'T'${time}`);
    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === draggedPost.id
          ? { ...post, scheduledTime: newScheduledTime }
          : post
      )
    );

    // In production, update the post in Strapi
    console.log('Updated post:', { ...draggedPost, scheduledTime: newScheduledTime });
    
    setDraggedPost(null);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this scheduled post?')) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      // In production, delete from Strapi
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your social media posts</p>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, dayIdx) => {
            const dayPosts = getPostsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <div
                key={dayIdx}
                onClick={() => setSelectedDate(day)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(day)}
                className={`bg-white p-2 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'opacity-40' : ''
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    isCurrentDay
                      ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                      : 'text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                </div>

                {/* Posts for this day */}
                <div className="space-y-1">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={() => handleDragStart(post)}
                      className="bg-blue-50 border border-blue-200 rounded p-2 text-xs cursor-move hover:bg-blue-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            <FiClock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600">
                              {format(parseISO(post.scheduledTime), 'HH:mm')}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {post.platforms.map((platform) => {
                              const Icon = platformIcons[platform];
                              return (
                                <div
                                  key={platform}
                                  className={`w-4 h-4 ${platformColors[platform]} rounded-sm flex items-center justify-center`}
                                  title={platform}
                                >
                                  <Icon className="w-2.5 h-2.5 text-white" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                        >
                          <FiTrash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded" />
            <span className="text-gray-600">Scheduled Post</span>
          </div>
          <div className="flex items-center gap-2">
            <FiEdit className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Drag to reschedule</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{posts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {posts.filter((post) => {
                  const postDate = parseISO(post.scheduledTime);
                  const weekFromNow = addDays(new Date(), 7);
                  return postDate >= new Date() && postDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {posts.filter((post) => {
                  const postDate = parseISO(post.scheduledTime);
                  return isSameMonth(postDate, currentMonth);
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              How to use the calendar
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on any date to select it</li>
              <li>• Drag and drop posts to reschedule them</li>
              <li>• Hover over posts to see delete option</li>
              <li>• Click "New Post" to create a new scheduled post</li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Post Modal Placeholder */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Post</h3>
            <p className="text-gray-600 mb-4">
              This will redirect to the post creation page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewPostModal(false);
                  window.location.href = '/dashboard/posts';
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to Post Creator
              </button>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
