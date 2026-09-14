import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  Search,
  HelpCircle,
  Tag,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { KeywordsPackage } from '../../types';

interface KeywordsSectionProps {
  keywords?: KeywordsPackage;
  onCopyText: (text: string, label: string) => void;
}

export const KeywordsSection: React.FC<KeywordsSectionProps> = ({
  keywords,
  onCopyText,
}) => {
  const [copiedCluster, setCopiedCluster] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedCluster(key);
    setTimeout(() => setCopiedCluster(null), 2000);
  };

  if (!keywords) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        <KeyRound className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm">No keyword data generated yet. Generate content to view search clusters.</p>
      </div>
    );
  }

  const handleCopyAll = () => {
    const text = `GODSEYE AI - SEARCH-FOCUSED KEYWORDS

PRIMARY KEYWORDS:
${keywords.primary?.map((k) => `• ${k}`).join('\n')}

SECONDARY KEYWORDS:
${keywords.secondary?.map((k) => `• ${k}`).join('\n')}

LONG-TAIL KEYWORDS:
${keywords.longTail?.map((k) => `• ${k}`).join('\n')}

QUESTION KEYWORDS:
${keywords.questions?.map((k) => `• ${k}`).join('\n')}

RELATED SEARCH PHRASES:
${keywords.relatedSearches?.map((k) => `• ${k}`).join('\n')}

TOPIC KEYWORDS:
${keywords.topicKeywords?.map((k) => `• ${k}`).join('\n')}`;

    handleCopy(text, 'all-kw', 'All Keyword Clusters');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner with Ethics & Transparency Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-heading">
              KEYWORD ENGINE — SEARCH-FOCUSED KEYWORDS
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Semantic topic clusters, conversational query hooks, and high-intent long-tail phrases tailored to search algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Fabricated Volumes
          </span>
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCluster === 'all-kw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy All Keywords</span>
          </button>
        </div>
      </div>

      {/* Grid of Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. PRIMARY KEYWORDS */}
        <div className="rounded-2xl bg-[#0e1422] border border-cyan-500/30 p-5 space-y-3 relative group">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Primary Keywords
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.primary?.join(', ') || '', 'prim-kw', 'Primary Keywords')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'prim-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="space-y-1.5">
            {keywords.primary?.map((k, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs font-semibold text-cyan-200 flex items-center justify-between"
              >
                <span>{k}</span>
                <span className="text-[10px] text-cyan-400/80 font-mono">Core</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SECONDARY KEYWORDS */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              Secondary Keywords
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.secondary?.join(', ') || '', 'sec-kw', 'Secondary Keywords')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'sec-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.secondary?.map((k, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* 3. LONG-TAIL KEYWORDS */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-purple-400" />
              Long-Tail Keywords
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.longTail?.join('\n') || '', 'lt-kw', 'Long-tail Keywords')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'lt-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="space-y-1.5">
            {keywords.longTail?.map((k, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200"
              >
                "{k}"
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUESTION KEYWORDS */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Question Keywords (Search Intent)
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.questions?.join('\n') || '', 'q-kw', 'Question Keywords')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'q-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="space-y-1.5">
            {keywords.questions?.map((k, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200"
              >
                {k}
              </div>
            ))}
          </div>
        </div>

        {/* 5. RELATED SEARCH PHRASES */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Related Search Phrases
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.relatedSearches?.join(', ') || '', 'rel-kw', 'Related Search Phrases')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'rel-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.relatedSearches?.map((k, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* 6. TOPIC KEYWORDS */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Topic Keywords & Categories
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(keywords.topicKeywords?.join(', ') || '', 'top-kw', 'Topic Keywords')}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/60 px-2 py-0.5 rounded cursor-pointer"
            >
              {copiedCluster === 'top-kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.topicKeywords?.map((k, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs font-medium text-rose-200"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
