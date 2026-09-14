import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Flame,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Eye,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface AiRecommendationsViewProps {
  activeProject: GodseyeProject;
  onNavigate: (tab: V2NavigationTab) => void;
  onApplyRecommendation?: (recommendationText: string) => void;
}

export const AiRecommendationsView: React.FC<AiRecommendationsViewProps> = ({
  activeProject,
  onNavigate,
  onApplyRecommendation,
}) => {
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const handleApply = (title: string, desc: string) => {
    if (onApplyRecommendation) {
      onApplyRecommendation(`${title}: ${desc}`);
    }
    setAppliedToast(`Applied strategy: "${title}"`);
    setTimeout(() => setAppliedToast(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              AI Growth Recommendations
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold">
              ALGORITHMIC RADAR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Predictive creator recommendations based on current platform distribution patterns and psychological retention metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('Create')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply in Create Studio</span>
        </button>
      </div>

      {appliedToast && (
        <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-xs text-cyan-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* Strategic Directive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rec 1 */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              RETENTION VELOCITY
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">+28% Watch Time</span>
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            Deploy Information Gap in First 2.5s
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Leading with a revelation phrase like <em>"Astronomers thought this planet was dead until yesterday..."</em> creates an unresolved cognitive loop that locks viewers past the critical 15-second drop-off threshold.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">Target: YouTube Shorts & Reels</span>
            <button
              type="button"
              onClick={() => handleApply('Information Gap Opening', 'Open with unresolved mystery in first 2.5s')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Apply Strategy →
            </button>
          </div>
        </div>

        {/* Rec 2 */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-purple-500/40 transition-colors space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/50">
              PACING & EDITORIAL
            </span>
            <span className="text-xs font-mono text-purple-300 font-bold">145 - 155 WPM</span>
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            Maintain Sub-4 Second Scene Changes
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In 9:16 vertical video formats, viewers experience optical fatigue when visual frames remain static for more than 4.2 seconds. Cut between dynamic B-roll camera zooms and macro object focus.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">Target: Scene Studio Prompts</span>
            <button
              type="button"
              onClick={() => onNavigate('Scene Studio')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
            >
              Open Scene Studio →
            </button>
          </div>
        </div>

        {/* Rec 3 */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-amber-500/40 transition-colors space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
              CTR PSYCHOLOGY
            </span>
            <span className="text-xs font-mono text-amber-300 font-bold">3-Word Rule</span>
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            Limit Thumbnail Text Overlay to 3 Words
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mobile feed algorithms reward thumbnails where viewer glance comprehension takes under 400 milliseconds. Use high-contrast punchy keywords (e.g. <em>"IT FINALLY HAPPENED"</em> or <em>"NASA's SECRET SIGNAL"</em>).
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">Target: Thumbnail Studio</span>
            <button
              type="button"
              onClick={() => onNavigate('Thumbnail Studio')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Open Thumbnail Studio →
            </button>
          </div>
        </div>

        {/* Rec 4 */}
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              AUDIENCE RETENTION
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Ending Hook Loop</span>
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            Connect Final Sentence to Opening Hook
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Looping video scripts seamlessly from the conclusion back into the first word increases loop replays by up to 34%, triggering viral recommendations on TikTok and Instagram Reels.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">Target: Script Studio</span>
            <button
              type="button"
              onClick={() => onNavigate('Script')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Inspect Teleprompter Script →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
