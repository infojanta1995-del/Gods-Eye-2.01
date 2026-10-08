import React from 'react';
import {
  Brain,
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';

interface StoryIntelligenceViewProps {
  activeProject: GodseyeProject;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const StoryIntelligenceView: React.FC<StoryIntelligenceViewProps> = ({
  activeProject,
  onNavigate,
}) => {
  const cd = activeProject.content?.contentDirector;
  const storyAngle = activeProject.content?.storyAngle;
  const analysis = activeProject.content?.analysis;

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#091122] via-[#0b162e] to-[#070b16] border border-blue-500/30 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-semibold text-blue-300 mb-2 font-mono">
              <Brain className="w-3.5 h-3.5 text-blue-400" />
              <span>CONTENT DIRECTING ENGINE & ANGLE MATRIX</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Story Intelligence & Narrative Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Curiosity gap analysis, factual integrity verification, emotional driver calibration, and multi-angle narrative synthesis for high-watchtime social formats.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30 self-start sm:self-auto"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Story & Core Thesis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              CORE STORY THESIS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
              {cd?.storyType || 'Documentary Feature'}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            {cd?.mainStory || analysis?.mainTopic || activeProject.name}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              WHY THIS STORY MATTERS:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {cd?.whyThisStoryMatters || analysis?.whyItMatters || 'Fundamentally challenges prevailing understanding with newly revealed evidence.'}
            </p>
          </div>
        </div>

        {/* Narrative Drivers */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-xl">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4" />
            PSYCHOLOGICAL DRIVERS
          </span>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">CURIOSITY GAP:</span>
              <p className="text-slate-200 mt-0.5">{cd?.curiosityOpportunity || storyAngle?.curiosityElement || 'High-stakes unanswered question'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">EMOTIONAL DRIVER:</span>
              <p className="text-slate-200 mt-0.5">{cd?.emotionalDriver || storyAngle?.emotionalElement || 'Awe, discovery and intrigue'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">STRONGEST REVEAL:</span>
              <p className="text-slate-200 mt-0.5">{cd?.strongestReveal || 'Climax evidentiary turning point'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Distinct Story Angles */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>5 SYNTHESIZED STORY ANGLES</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Heuristic Ranking</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(storyAngle?.angles || []).map((ang, i) => (
            <div
              key={ang.id || i}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                ang.isRecommended
                  ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-900/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 font-mono">
                  {ang.type}
                </span>
                {ang.isRecommended && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
                    BEST ANGLE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 font-medium leading-snug">{ang.angle}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ang.shortExplanation}</p>
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
                <span>Curiosity: {ang.curiosityPotential}/10</span>
                <span>Visuals: {ang.visualPotential}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
