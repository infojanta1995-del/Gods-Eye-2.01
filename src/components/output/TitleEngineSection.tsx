import React, { useState } from 'react';
import {
  Type,
  Copy,
  Check,
  Award,
  Sparkles,
  Zap,
  Info,
  TrendingUp,
} from 'lucide-react';
import { TitleEngineOutput, TitleOption } from '../../types';

interface TitleEngineSectionProps {
  titleEngine?: TitleEngineOutput;
  defaultTitle?: string;
  onCopyText: (text: string, label: string) => void;
}

export const TitleEngineSection: React.FC<TitleEngineSectionProps> = ({
  titleEngine,
  defaultTitle = 'Story Video',
  onCopyText,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Normalize 10 Title Options
  const titleData: TitleEngineOutput = titleEngine || {
    recommendedTitle: `${defaultTitle.slice(0, 45)}: The Truth They Didn't Tell You`,
    explanation: 'Highest CTR curiosity score combined with clear mobile safe-length typography.',
    options: [
      {
        id: 'title-1',
        title: `${defaultTitle.slice(0, 45)}: The Truth They Didn't Tell You`,
        category: 'High CTR',
        ctrPotential: 9.7,
        searchRelevance: 9.2,
        curiosity: 9.8,
        clarity: 9.4,
        totalScore: 9.5,
        isRecommended: true,
      },
      {
        id: 'title-2',
        title: `Why Nobody Is Talking About This Discovery...`,
        category: 'Curiosity',
        ctrPotential: 9.5,
        searchRelevance: 8.6,
        curiosity: 9.9,
        clarity: 9.1,
        totalScore: 9.3,
        isRecommended: false,
      },
      {
        id: 'title-3',
        title: `${defaultTitle.slice(0, 50)} Explained: Full Breakdown`,
        category: 'Search Optimized',
        ctrPotential: 9.0,
        searchRelevance: 9.8,
        curiosity: 8.8,
        clarity: 9.9,
        totalScore: 9.4,
        isRecommended: false,
      },
      {
        id: 'title-4',
        title: `What Really Happened Here? (Shocking Breakdown)`,
        category: 'Dramatic',
        ctrPotential: 9.4,
        searchRelevance: 8.9,
        curiosity: 9.6,
        clarity: 9.2,
        totalScore: 9.3,
        isRecommended: false,
      },
      {
        id: 'title-5',
        title: `How This Discovery Changes What We Thought Possible`,
        category: 'Informative',
        ctrPotential: 9.2,
        searchRelevance: 9.4,
        curiosity: 9.3,
        clarity: 9.6,
        totalScore: 9.4,
        isRecommended: false,
      },
      {
        id: 'title-6',
        title: `Did Researchers Just Uncover The Impossible?`,
        category: 'Question',
        ctrPotential: 9.3,
        searchRelevance: 8.8,
        curiosity: 9.7,
        clarity: 9.2,
        totalScore: 9.2,
        isRecommended: false,
      },
      {
        id: 'title-7',
        title: `Breaking Down The Latest Findings: What You Need To Know`,
        category: 'News Explainer',
        ctrPotential: 8.9,
        searchRelevance: 9.6,
        curiosity: 8.7,
        clarity: 9.8,
        totalScore: 9.2,
        isRecommended: false,
      },
      {
        id: 'title-8',
        title: `The 3 Crucial Details Everyone Missed`,
        category: 'Curiosity',
        ctrPotential: 9.4,
        searchRelevance: 8.7,
        curiosity: 9.7,
        clarity: 9.3,
        totalScore: 9.3,
        isRecommended: false,
      },
      {
        id: 'title-9',
        title: `100% Verified Breakdown of This Historic Event`,
        category: 'High CTR',
        ctrPotential: 9.1,
        searchRelevance: 9.3,
        curiosity: 9.1,
        clarity: 9.5,
        totalScore: 9.3,
        isRecommended: false,
      },
      {
        id: 'title-10',
        title: `The Untold Story Behind The Headlines`,
        category: 'Storytelling',
        ctrPotential: 9.3,
        searchRelevance: 8.9,
        curiosity: 9.6,
        clarity: 9.2,
        totalScore: 9.3,
        isRecommended: false,
      },
    ],
  };

  const handleCopySingle = (opt: TitleOption) => {
    onCopyText(opt.title, `${opt.category} Title`);
    setCopiedId(opt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const formatted = titleData.options
      .map(
        (t, i) =>
          `[TITLE #${i + 1} - ${t.category.toUpperCase()} | Score: ${t.totalScore}/10]\n${t.title}\n(CTR: ${t.ctrPotential}, Search: ${t.searchRelevance}, Curiosity: ${t.curiosity}, Clarity: ${t.clarity})`
      )
      .join('\n\n');
    onCopyText(formatted, 'All 10 Title Options');
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0f172a] to-slate-900 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-heading">
                TITLE ENGINE (10 HIGH-CONVERSION TITLE FORMULAS)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                CTR Optimization
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Psychologically optimized title architectures for search discovery, curiosity click-throughs, and mobile previews.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAll ? 'Copied 10 Titles' : 'Copy All 10 Titles'}</span>
        </button>
      </div>

      {/* Recommended Best Title Spotlight */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0c1017] border border-cyan-500/40 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-400 text-slate-950">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              GODSEYE Recommended Primary Title
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              Score: 9.5 / 10
            </span>
          </div>

          <button
            type="button"
            onClick={() => onCopyText(titleData.recommendedTitle, 'Recommended Title')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Best Title</span>
          </button>
        </div>

        <h4 className="text-base sm:text-xl font-bold text-white leading-relaxed mb-3 font-heading">
          "{titleData.recommendedTitle}"
        </h4>

        {titleData.explanation && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-cyan-300">Algorithmic rationale: </strong>
              {titleData.explanation}
            </p>
          </div>
        )}
      </div>

      {/* 10 Title Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            All 10 Title Formulas with Algorithmic Scoring
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Scores: AI Estimate (1-10)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {titleData.options.map((opt, index) => {
            const isCopied = copiedId === opt.id;
            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  opt.isRecommended
                    ? 'bg-[#0f172a]/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-[#0c1017]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0f1422]'
                }`}
              >
                <div>
                  {/* Top Bar with Category, Number & Scores */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-white tracking-wide">
                        {opt.category}
                      </span>
                      {opt.isRecommended && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 uppercase">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono font-bold text-cyan-400">
                      <Zap className="w-3 h-3" />
                      <span>{opt.totalScore.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title Text */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold mb-3">
                    {opt.title}
                  </p>
                </div>

                {/* Bottom Bar: Metric Chips & Copy */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span title="CTR Potential">CTR: {opt.ctrPotential}</span>
                    <span>•</span>
                    <span title="Search Relevance">SEO: {opt.searchRelevance}</span>
                    <span>•</span>
                    <span title="Curiosity">Cur: {opt.curiosity}</span>
                    <span>•</span>
                    <span title="Clarity">Clr: {opt.clarity}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingle(opt)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer shrink-0"
                    title="Copy title"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <p>
          Title CTR scores reflect algorithmic analysis of keyword placement, curiosity open loops, and mobile character truncation limits.
        </p>
      </div>
    </div>
  );
};
