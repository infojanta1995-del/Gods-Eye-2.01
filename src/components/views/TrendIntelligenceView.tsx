import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { V2NavigationTab } from '../../types';

interface TrendItem {
  id: string;
  topic: string;
  category: 'Geopolitics' | 'AI & Tech' | 'Crime & Mystery' | 'Finance & Economy' | 'Science & Space';
  velocityScore: number;
  saturationRisk: 'Low' | 'Medium' | 'High';
  searchGrowth: string;
  suggestedAngle: string;
  recommendedDuration: string;
}

const TREND_DATABASE: TrendItem[] = [
  {
    id: 'tr-1',
    topic: 'The $400B Secret Semiconductor Corridor in Western India',
    category: 'AI & Tech',
    velocityScore: 98,
    saturationRisk: 'Low',
    searchGrowth: '+340% this week',
    suggestedAngle: 'The silent geopolitical chess match between Taiwan, US, and India to control microchip logistics.',
    recommendedDuration: '60s Shorts / 3m Reel',
  },
  {
    id: 'tr-2',
    topic: 'Why Commercial Airlines Avoid Flying Over the Tibetan Plateau',
    category: 'Science & Space',
    velocityScore: 95,
    saturationRisk: 'Medium',
    searchGrowth: '+180% this week',
    suggestedAngle: 'Decompression altitude mechanics, emergency oxygen time limits, and sudden mountain wave turbulence.',
    recommendedDuration: '45s Shorts',
  },
  {
    id: 'tr-3',
    topic: 'The Covert Diplomatic Corridor Bypassing the Red Sea Strait',
    category: 'Geopolitics',
    velocityScore: 92,
    saturationRisk: 'Low',
    searchGrowth: '+290% this week',
    suggestedAngle: 'Overland rail logistics and Saudi overland trucking routes secretly replacing container ships.',
    recommendedDuration: '60s Shorts',
  },
  {
    id: 'tr-4',
    topic: 'Why Sovereign Wealth Funds Are Quietly Buying Massive Uranium Mines',
    category: 'Finance & Economy',
    velocityScore: 89,
    saturationRisk: 'Low',
    searchGrowth: '+140% this week',
    suggestedAngle: 'Next-gen nuclear reactors, AI datacenter baseload energy contracts, and small modular reactors.',
    recommendedDuration: '90s Long Short',
  },
  {
    id: 'tr-5',
    topic: 'The Unsolved Disappearance of Flight MH370 New Radar Revelations',
    category: 'Crime & Mystery',
    velocityScore: 87,
    saturationRisk: 'High',
    searchGrowth: '+95% this week',
    suggestedAngle: 'Amateur radio WSPR wave perturbations pointing to a specific 7th arc underwater trench.',
    recommendedDuration: '60s Shorts',
  },
];

interface TrendIntelligenceViewProps {
  onNavigate: (tab: V2NavigationTab) => void;
  onSelectTopicForGeneration?: (topic: string) => void;
}

export const TrendIntelligenceView: React.FC<TrendIntelligenceViewProps> = ({
  onNavigate,
  onSelectTopicForGeneration,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrends = TREND_DATABASE.filter((tr) => {
    if (selectedCategory !== 'ALL' && tr.category !== selectedCategory) return false;
    if (searchQuery && !(tr.topic || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleLaunchTopic = (topic: string) => {
    if (onSelectTopicForGeneration) {
      onSelectTopicForGeneration(topic);
    }
    onNavigate('Create');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Trend Intelligence & Viral Detection
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time narrative velocity engine tracking unsaturated storytelling opportunities
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>LIVE RADAR ACTIVE</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'AI & Tech', 'Geopolitics', 'Finance & Economy', 'Science & Space', 'Crime & Mystery'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trend topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {trend.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {trend.searchGrowth}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-black text-cyan-400">
                    {trend.velocityScore}/100
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      trend.saturationRisk === 'Low'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : trend.saturationRisk === 'Medium'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {trend.saturationRisk} Saturation
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {trend.topic}
              </h3>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                <p className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  DIRECTOR'S ANGLE:
                </p>
                <p className="text-slate-300 leading-relaxed">{trend.suggestedAngle}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Pacing: {trend.recommendedDuration}
              </span>

              <button
                type="button"
                onClick={() => handleLaunchTopic(trend.topic)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer font-heading"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
