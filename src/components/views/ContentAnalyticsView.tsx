import React, { useState } from 'react';
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface ContentAnalyticsViewProps {
  projects: GodseyeProject[];
  activeProjectId: string | null;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const ContentAnalyticsView: React.FC<ContentAnalyticsViewProps> = ({
  projects,
  activeProjectId,
  onNavigate,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const retention = activeProject?.content?.retention || {
    hookStrength: 9.4,
    curiosity: 9.1,
    storyFlow: 8.8,
    emotionalImpact: 8.5,
    visualPotential: 9.0,
    shareabilityPotential: 8.9,
    improvements: [
      'Eliminate filler prepositional phrases in the first 1.5 seconds to spike immediate curiosity.',
      'Place a sound effect transition (whoosh/boom) at 00:04 to mark the visual scene transition.',
      'Insert a secondary question or revelation at 00:28 to prevent mid-script attention fatigue.',
    ],
  };

  const curveData = [
    { sec: '0s', pct: 100, label: 'Hook Start' },
    { sec: '3s', pct: 86, label: 'Hook Decision Point' },
    { sec: '7s', pct: 82, label: 'Premise Confirmation' },
    { sec: '12s', pct: 80, label: 'Information Gap' },
    { sec: '18s', pct: 78, label: 'Evidence Deep Dive' },
    { sec: '25s', pct: 76, label: 'Conflict Escalation' },
    { sec: '32s', pct: 75, label: 'Plot Twist / Insight' },
    { sec: '40s', pct: 74, label: 'Consequence Peak' },
    { sec: '50s', pct: 73, label: 'Resolution' },
    { sec: '58s', pct: 72, label: 'Loop Seamless Outro' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <LineChart className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Content Analytics & Retention Doctor
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Psychological retention modeling, second-by-second drop-off curve, and narrative pacing analysis
          </p>
        </div>

        {activeProject && (
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            Analyzing: <span className="text-cyan-400 font-bold">{activeProject.name}</span>
          </div>
        )}
      </div>

      {/* Main Retention Diagnostics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Hook Strength', val: `${retention.hookStrength}/10`, status: 'EXCELLENT', col: 'text-cyan-400' },
          { label: 'Curiosity Score', val: `${retention.curiosity}/10`, status: 'EXCELLENT', col: 'text-teal-400' },
          { label: 'Narrative Flow', val: `${retention.storyFlow}/10`, status: 'STRONG', col: 'text-blue-400' },
          { label: 'Emotional Climax', val: `${retention.emotionalImpact}/10`, status: 'OPTIMIZED', col: 'text-purple-400' },
          { label: 'Visual Potential', val: `${retention.visualPotential}/10`, status: 'HIGH', col: 'text-amber-400' },
          { label: 'Shareability', val: `${retention.shareabilityPotential}/10`, status: 'VIRAL', col: 'text-rose-400' },
        ].map((metric, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#0c101a] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase truncate block">
              {metric.label}
            </span>
            <span className={`text-xl font-bold font-mono ${metric.col} block`}>{metric.val}</span>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">
              {metric.status}
            </span>
          </div>
        ))}
      </div>

      {/* Retention Graph Visualization */}
      <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Second-by-Second Simulated Viewer Retention Curve
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            TARGET: &gt;70% AT 60s
          </span>
        </div>

        {/* Custom Visual Retention Chart */}
        <div className="pt-4 pb-2 space-y-3">
          <div className="h-44 w-full flex items-end gap-2 sm:gap-4 px-2">
            {curveData.map((pt, idx) => {
              const heightPct = (pt.pct - 60) * 2.5; // Scaled for visible variation
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-teal-400 to-cyan-400 group-hover:brightness-125 transition-all shadow-sm shadow-cyan-500/10"
                    style={{ height: `${Math.max(16, heightPct * 1.5)}px` }}
                  />
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-cyan-300 text-[10px] font-mono p-1 rounded border border-slate-700 pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-lg">
                    {pt.sec}: {pt.pct}% ({pt.label})
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{pt.sec}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400 font-mono">
            <div>• 0s-3s: Initial Hook Anchor (86%)</div>
            <div>• 12s: Information Gap Lock (80%)</div>
            <div>• 32s: Psychological Twist (75%)</div>
            <div>• 58s: Seamless Loop (72%)</div>
          </div>
        </div>
      </div>

      {/* Pacing Doctor Recommendations */}
      <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Retention Doctor — Actionable Script Tweaks
          </h3>
        </div>

        <div className="space-y-2.5">
          {retention.improvements.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/60 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('Script')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Apply Tweaks in Script Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
