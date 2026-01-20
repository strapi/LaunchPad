'use client';

import { IconFiles, IconSearch, IconUpload, IconFileText, IconVideo, IconFileSpreadsheet, IconDownload, IconFolder } from '@tabler/icons-react';

// Mock resources data
const categories = [
  { name: 'All Resources', count: 12 },
  { name: 'Assessments', count: 4 },
  { name: 'Worksheets', count: 3 },
  { name: 'Videos', count: 2 },
  { name: 'Articles', count: 3 },
];

const resources = [
  { id: 1, name: 'Leadership Assessment Template', type: 'document', category: 'Assessments', size: '2.4 MB', updated: '2 days ago', icon: IconFileText },
  { id: 2, name: 'Goal Setting Worksheet', type: 'spreadsheet', category: 'Worksheets', size: '1.1 MB', updated: '1 week ago', icon: IconFileSpreadsheet },
  { id: 3, name: 'Introduction to SecureBase', type: 'video', category: 'Videos', size: '45 MB', updated: '2 weeks ago', icon: IconVideo },
  { id: 4, name: 'Self-Awareness Guide', type: 'document', category: 'Articles', size: '890 KB', updated: '3 weeks ago', icon: IconFileText },
  { id: 5, name: '360 Feedback Form', type: 'document', category: 'Assessments', size: '1.5 MB', updated: '1 month ago', icon: IconFileText },
  { id: 6, name: 'Weekly Reflection Journal', type: 'spreadsheet', category: 'Worksheets', size: '520 KB', updated: '1 month ago', icon: IconFileSpreadsheet },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Resources</h1>
          <p className="text-gray-400 mt-1">Access coaching materials, assessments, and worksheets.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors">
          <IconUpload className="w-5 h-5" />
          Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-4 px-2">Categories</h3>
            <nav className="space-y-1">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    index === 0
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IconFolder className="w-4 h-4" />
                    {category.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    index === 0 ? 'bg-cyan-500/20' : 'bg-white/10'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Resources grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="group bg-zinc-900/50 border border-white/5 rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <resource.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                      {resource.name}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {resource.category} · {resource.size}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated {resource.updated}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <IconDownload className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {resources.length === 0 && (
            <div className="text-center py-16 bg-zinc-900/50 border border-white/5 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <IconFiles className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No resources yet</h3>
              <p className="text-gray-400 mb-6">Upload your first resource to get started.</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors">
                <IconUpload className="w-5 h-5" />
                Upload Resource
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
