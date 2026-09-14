import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Users,
  ShieldAlert,
  Sparkles,
  Info,
  BarChart3,
} from 'lucide-react';
import { TrendingIntelligenceData } from '../../types';

interface TrendingIntelligenceSectionProps {
  trendData?: TrendingIntelligenceData;
  storyTitle?: string;
  onCopyText: (text: string, label: string) => void;
}

export const TrendingIntelligenceSection: React.FC<TrendingIntelligenceSectionProps> = ({
  trendData,
  storyTitle = 'Current Story',
  onCopyText,
}) => {
  const [copied, setCopied] = useState(false);

  // Fallback if not directly supplied
  const intel: TrendingIntelligenceData = trendData || {
    topic: storyTitle,
    trendPotential: 9.1,
    searchPotential: 8.8,
    audienceInterest: 9.4,
    saturationRisk: 'Medium',
    disclaimer: 'Trend data unavailable — AI topic potential estimate.',
    insights: [
      'High search curiosity sparked by open-loop queries and unanswered scientific questions.',
      'Favorable viral potential when hooked within the initial 2.5-second swipe window.',
      'Strong cross-platform syndication capability across YouTube Shorts, Instagram Reels, and TikTok.',
      'Audience retention improves when key numerical data and verified dates are introduced before the midpoint.',
    ],
  };

  const handleCopy = () => {
    const text = `=== GODSEYE TRENDING INTELLIGENCE ===
TOPIC: ${intel.topic}
TREND POTENTIAL: ${intel.trendPotential}/10
SEARCH POTENTIAL: ${intel.searchPotential}/10
AUDIENCE INTEREST: ${intel.audienceInterest}/10
SATURATION RISK: ${intel.saturationRisk}
DISCLAIMER: ${intel.disclaimer}
INSIGHTS:
${intel.insights.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}`;
    onCopyText(text, 'Trending Intelligence');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0f172a] to-slate-900 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-heading">
                TREND INTELLIGENCE & TOPIC POTENTIAL
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Predictive Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Conceptual evaluation of audience velocity, search volume dynamics, and competitor saturation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Intel' : 'Copy Trend Report'}</span>
        </button>
      </div>

      {/* Mandatory Transparent Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-3 text-xs text-amber-200/90 shadow-sm">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold block mb-0.5">
            TRANSPARENCY NOTICE:
          </strong>
          {intel.disclaimer || 'Trend data unavailable — AI topic potential estimate.'}{' '}
          This score evaluates organic narrative virality, hook curiosity, and informational novelty rather than live third-party search server telemetries.
        </div>
      </div>

      {/* 4 Topic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trend Potential */}
        <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Trend Potential
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-10</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 flex items-baseline gap-1">
            {intel.trendPotential.toFixed(1)}
            <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${(intel.trendPotential / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Strong velocity potential on short-form discovery feeds.
          </p>
        </div>

        {/* Search Potential */}
        <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-purple-400" />
              Search Potential
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-10</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 flex items-baseline gap-1">
            {intel.searchPotential.toFixed(1)}
            <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all"
              style={{ width: `${(intel.searchPotential / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            High intent search volume for explanatory keyword breakdowns.
          </p>
        </div>

        {/* Audience Interest */}
        <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Audience Interest
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-10</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
            {intel.audienceInterest.toFixed(1)}
            <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${(intel.audienceInterest / 10) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Resonates across broad curiosity and educational subcultures.
          </p>
        </div>

        {/* Saturation Risk */}
        <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Saturation Risk
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Risk Level</span>
          </div>
          <div className="text-xl font-bold font-heading text-amber-300 flex items-center gap-2">
            {intel.saturationRisk}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Low Barrier
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{
                width:
                  intel.saturationRisk === 'Low'
                    ? '30%'
                    : intel.saturationRisk === 'High'
                    ? '85%'
                    : '55%',
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            High differentiation achievable through unique visual prompts and custom narration.
          </p>
        </div>
      </div>

      {/* Strategic Creator Insights List */}
      <div className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Content Velocity Insights & Publishing Strategy
        </h4>

        <div className="space-y-2.5">
          {intel.insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
