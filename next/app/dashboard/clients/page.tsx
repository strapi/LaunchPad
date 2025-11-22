'use client';

import { IconUsers, IconSearch, IconPlus, IconDotsVertical } from '@tabler/icons-react';

// Mock client data
const clients = [
  { id: 1, name: 'Sarah Chen', role: 'CEO', company: 'TechCorp', status: 'Active', sessions: 12, lastSession: '2 days ago' },
  { id: 2, name: 'Michael Roberts', role: 'VP Engineering', company: 'StartupXYZ', status: 'Active', sessions: 8, lastSession: '1 week ago' },
  { id: 3, name: 'Jennifer Walsh', role: 'Director', company: 'Enterprise Co', status: 'Paused', sessions: 15, lastSession: '3 weeks ago' },
  { id: 4, name: 'David Kim', role: 'Founder', company: 'NewVenture', status: 'Active', sessions: 4, lastSession: 'Yesterday' },
];

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400 mt-1">Manage your coaching clients and track progress.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors">
          <IconPlus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <select className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Clients list */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Company</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Sessions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Last Session</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{client.company}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{client.sessions}</td>
                  <td className="px-6 py-4 text-gray-400">{client.lastSession}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <IconDotsVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state for when there are no clients */}
      {clients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <IconUsers className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No clients yet</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first coaching client.</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors">
            <IconPlus className="w-5 h-5" />
            Add Your First Client
          </button>
        </div>
      )}
    </div>
  );
}
