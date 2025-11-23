import React from 'react';
import { IconMicrophone, IconNote, IconClock, IconArrowRight } from '@tabler/icons-react';
import LemonAgentWidget from '@/components/dashboard/LemonAgentWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back, Dr. Sung</h2>
        <p className="text-gray-400 mt-2">Here is what is happening with your clients today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction 
          icon={<IconMicrophone className="text-cyan-400" size={24} />} 
          title="Upload Audio" 
          desc="Process a new session recording" 
        />
        <QuickAction 
          icon={<IconNote className="text-purple-400" size={24} />} 
          title="New Note" 
          desc="Draft a quick thought or observation" 
        />
        <QuickAction 
          icon={<IconClock className="text-emerald-400" size={24} />} 
          title="Schedule" 
          desc="View upcoming appointments" 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <IconArrowRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <ActivityItem 
            user="Mark P." 
            action="completed an assessment" 
            time="2 hours ago" 
          />
          <ActivityItem 
            user="Suzannah C." 
            action="sent a message" 
            time="4 hours ago" 
          />
          <ActivityItem 
            user="System" 
            action="ingested 3 new SecureBase articles" 
            time="Yesterday" 
          />
        </div>
      </div>
      <LemonAgentWidget />
    </div>
  );
}

function QuickAction({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button className="flex flex-col items-start p-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all text-left group">
      <div className="mb-4 p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-lg font-semibold text-white">{title}</span>
      <span className="text-sm text-gray-400 mt-1">{desc}</span>
    </button>
  );
}

function ActivityItem({ user, action, time }: { user: string; action: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
          {user.charAt(0)}
        </div>
        <div>
          <span className="font-medium text-white">{user}</span>
          <span className="text-gray-400 ml-1">{action}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
