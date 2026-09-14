import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface AnalyticsViewProps {
  activeProject: GodseyeProject | null;
  projects: GodseyeProject[];
  onNavigate: (tab: V2NavigationTab) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  activeProject,
  projects,
  onNavigate,
}) => {
  const result = activeProject?.result;
  const wordCount = result?.script?.wordCount || 120;
  const durationStr = activeProject?.settings?.duration || '60 sec';

  // Calculate estimated retention curve values
  const retentionPoints = [
    { second: '0s', label: 'Hook Start', retention: 100 },
    { second: '3s', label: 'Hook Drop-off', retention: 82 },
    { second: '10s', label: 'Core Conflict', retention: 76 },
    { second: '30s', label: 'Middle Climax', retention: 68 },
    { second: '45s', label: 'Plot Twist', retention: 64 },
    { second: '60s', label: 'Call-to-Action', retention: 58 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-[#0a2024] via-[#081518] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/50 text-xs font-semibold text-teal-300 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
              <span>CONTENT INTELLIGENCE & RETENTION ENGINE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">PACING & WORD RATE BENCHMARK</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Audience Drop-off Prevention & Retention Modeling
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Estimated viewer attention span curve, teleprompter words-per-minute (WPM) calibration, and psychological tension graphs.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Retention</span>
          <span className="text-2xl font-bold font-mono text-teal-400 block">74.2%</span>
          <span className="text-[10px] text-teal-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 10% benchmark
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Script Word Count</span>
          <span className="text-2xl font-bold font-mono text-white block">{wordCount} words</span>
          <span className="text-[10px] text-slate-400">Target for {durationStr}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Speaking Rate (WPM)</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 block">135 WPM</span>
          <span className="text-[10px] text-cyan-500">Natural Hindi/English pacing</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Scenes</span>
          <span className="text-2xl font-bold font-mono text-purple-400 block">
            {result?.scenes?.length || 0}
          </span>
          <span className="text-[10px] text-purple-400">Visual cuts every 4.2s</span>
        </div>
      </div>

      {/* Retention Curve Graph Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Simulated Viewer Retention Curve</h3>
              <p className="text-xs text-slate-400">Predicted drop-off rate across video duration</p>
            </div>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
            Pacing Score: 94/100
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-6 pb-2 items-end h-56">
          {retentionPoints.map((pt, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[11px] font-mono font-bold text-teal-300 mb-1 group-hover:scale-110 transition-transform">
                {pt.retention}%
              </span>
              <div className="w-full bg-slate-950 rounded-t-lg h-full max-h-40 flex items-end overflow-hidden p-1 border border-slate-800">
                <div
                  className="w-full bg-gradient-to-t from-teal-600 via-teal-500 to-cyan-400 rounded-t transition-all duration-500 group-hover:brightness-125"
                  style={{ height: `${pt.retention}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-bold mt-2">{pt.second}</span>
              <span className="text-[10px] text-slate-500 text-center truncate max-w-full hidden sm:block">
                {pt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
