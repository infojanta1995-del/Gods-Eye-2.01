import React, { useState } from 'react';
import {
  Compass,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Eye,
  Heart,
  Target,
  Zap,
  Clock,
  Film,
  Smile,
} from 'lucide-react';
import { ContentDirectorAnalysis, StoryAngleData, StoryAnalysisData } from '../../types';

interface ContentDirectorSectionProps {
  contentDirector?: ContentDirectorAnalysis;
  storyAngle: StoryAngleData;
  analysis: StoryAnalysisData;
  onCopyText: (text: string, label: string) => void;
}

export const ContentDirectorSection: React.FC<ContentDirectorSectionProps> = ({
  contentDirector,
  storyAngle,
  analysis,
  onCopyText,
}) => {
  const [copied, setCopied] = useState(false);

  // Fallback / merged director analysis
  const director: ContentDirectorAnalysis = contentDirector || {
    mainStoryAngle: storyAngle.mainAngle,
    whyThisStoryMatters: analysis.whyItMatters || 'Reshapes contemporary perspective with undeniable observational evidence.',
    strongestInformation: analysis.importantFacts?.[0] || 'Key factual finding documented by researchers.',
    curiosityGap: storyAngle.curiosityElement || 'The unexplained anomaly nobody anticipated.',
    emotionalDriver: storyAngle.emotionalElement || 'Awe, intrigue, and curiosity for the broader future.',
    visualPotential: storyAngle.visualElement || 'Photorealistic high-contrast lighting with dynamic depth.',
    audienceInterest: 'Broad digital appeal across curious learners, science, and investigative audiences.',
    bestFormat: '9:16 Portrait',
    bestDuration: '60 sec',
    bestContentStyle: 'Documentary',
    bestMood: 'Dramatic',
  };

  const handleCopyAll = () => {
    const fullText = `=== GODSEYE CONTENT DIRECTOR ANALYSIS ===
MAIN STORY ANGLE: ${director.mainStoryAngle}
WHY THIS STORY MATTERS: ${director.whyThisStoryMatters}
STRONGEST INFORMATION: ${director.strongestInformation}
CURIOSITY GAP: ${director.curiosityGap}
EMOTIONAL DRIVER: ${director.emotionalDriver}
VISUAL POTENTIAL: ${director.visualPotential}
AUDIENCE INTEREST: ${director.audienceInterest}
OPTIMAL FORMAT: ${director.bestFormat}
OPTIMAL DURATION: ${director.bestDuration}
OPTIMAL STYLE: ${director.bestContentStyle}
OPTIMAL MOOD: ${director.bestMood}`;
    onCopyText(fullText, 'Content Director Angle');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0f172a] to-slate-900 border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-heading">
                CONTENT DIRECTOR & STORY ANGLE
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                AI Strategic Evaluation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated narrative framing, curiosity anchors, and format calibration before scripting begins.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Angle' : 'Copy All Angle Data'}</span>
        </button>
      </div>

      {/* Primary Angle Spotlight Card */}
      <div className="p-6 rounded-2xl bg-[#0f1420] border border-cyan-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Core Narrative Framing (The Hook Foundation)
        </div>
        <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed font-heading mb-3">
          "{director.mainStoryAngle}"
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">Why This Matters: </strong>
          {director.whyThisStoryMatters}
        </p>
      </div>

      {/* 3-Column Narrative Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Strongest Information & Curiosity Gap */}
        <div className="p-4 rounded-xl bg-[#0d121c] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Strongest Anchor</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Highest Impact Fact:</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              {director.strongestInformation}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-400" />
              Curiosity Gap:
            </div>
            <p className="text-xs text-amber-200/90 mt-1 leading-snug">
              {director.curiosityGap}
            </p>
          </div>
        </div>

        {/* Card 2: Emotional & Visual Potential */}
        <div className="p-4 rounded-xl bg-[#0d121c] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Psychological Driver</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Viewer Emotion:</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              {director.emotionalDriver}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              Visual Cinematography:
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              {director.visualPotential}
            </p>
          </div>
        </div>

        {/* Card 3: Audience Interest & Demographics */}
        <div className="p-4 rounded-xl bg-[#0d121c] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Audience Alignment</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Core Demographic Pull:</div>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              {director.audienceInterest}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Key Curiosity Questions:</div>
            <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc pl-3">
              {(analysis.curiosityPoints || []).slice(0, 2).map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Studio Recommendations Pill Row */}
      <div className="p-4 rounded-xl bg-[#0a0e17] border border-slate-800">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI Studio Calibration (Recommended Production Settings)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <Film className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Best Format</div>
              <div className="text-xs font-bold text-white">{director.bestFormat}</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Best Duration</div>
              <div className="text-xs font-bold text-white">{director.bestDuration}</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Content Style</div>
              <div className="text-xs font-bold text-white">{director.bestContentStyle}</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <Smile className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Best Mood</div>
              <div className="text-xs font-bold text-white">{director.bestMood}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
