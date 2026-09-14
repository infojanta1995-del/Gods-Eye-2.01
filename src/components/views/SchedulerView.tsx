import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Youtube,
  Instagram,
  Facebook,
  Share2,
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface SchedulerViewProps {
  activeProject: GodseyeProject;
  projects: GodseyeProject[];
  onNavigate: (tab: V2NavigationTab) => void;
}

interface ScheduleSlot {
  id: string;
  day: string;
  time: string;
  platform: 'YouTube' | 'Instagram' | 'Facebook';
  projectTitle: string;
  status: 'QUEUED' | 'READY' | 'SCHEDULED';
  optimalPeak: boolean;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({
  activeProject,
  projects,
  onNavigate,
}) => {
  const [slots, setSlots] = useState<ScheduleSlot[]>([
    {
      id: 'slot-1',
      day: 'Today (18:00)',
      time: '06:00 PM',
      platform: 'YouTube',
      projectTitle: activeProject.name,
      status: 'SCHEDULED',
      optimalPeak: true,
    },
    {
      id: 'slot-2',
      day: 'Tomorrow (13:00)',
      time: '01:00 PM',
      platform: 'Instagram',
      projectTitle: activeProject.name,
      status: 'QUEUED',
      optimalPeak: true,
    },
    {
      id: 'slot-3',
      day: 'Friday (15:00)',
      time: '03:00 PM',
      platform: 'Facebook',
      projectTitle: projects[1]?.name || activeProject.name,
      status: 'READY',
      optimalPeak: false,
    },
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Multi-Platform Post Scheduler
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold">
              CROSS-PLATFORM QUEUE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Synchronize YouTube Shorts, Instagram Reels, and Facebook feed uploads with peak algorithmic traffic windows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('Create')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Queue New Content</span>
        </button>
      </div>

      {/* Algorithmic Traffic Peak Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-white uppercase">YouTube Shorts Peak</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">18:00 - 21:00</span>
          </div>
          <p className="text-xs text-slate-400">
            Evening commute & leisure hours yield maximum initial 1-hour retention velocity for shorts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold text-white uppercase">Instagram Reels Peak</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">12:00 - 15:00</span>
          </div>
          <p className="text-xs text-slate-400">
            Midday lunch hours provide highest immediate explore-feed share ratios.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-white uppercase">Facebook Video Peak</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">13:00 - 16:00</span>
          </div>
          <p className="text-xs text-slate-400">
            Afternoon feed browsing drives highest comment thread volume and organic re-shares.
          </p>
        </div>
      </div>

      {/* Active Scheduled Queue */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c101a] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Upcoming Distribution Queue
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{slots.length} Scheduled</span>
        </div>

        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                  {slot.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-500" />}
                  {slot.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                  {slot.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-500" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-heading">{slot.platform}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-cyan-300">{slot.day}</span>
                    {slot.optimalPeak && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                        Peak Hour
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 truncate">{slot.projectTitle}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                  {slot.status}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(slot.platform as V2NavigationTab)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 text-xs font-semibold cursor-pointer transition-colors"
                >
                  View Hub →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
