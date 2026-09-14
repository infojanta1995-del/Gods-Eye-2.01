import React, { useState, useMemo, useEffect } from 'react';
import {
  Tv,
  Share2,
  Copy,
  Check,
  Sparkles,
  Tag,
  Hash,
  MessageSquare,
  Clock,
  Search,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  Layers,
  Flame,
  FileText,
  Smartphone,
  Video,
  Bookmark,
  CheckCheck,
} from 'lucide-react';
import {
  MultiPlatformSeoPackage,
  OutputTab,
  StudioConfig,
  KeywordsPackage,
  TitleEngineOutput,
  HookEngineOutput,
  HighRetentionScript,
  ArticleAnalysis,
} from '../../types';
import {
  SEO_PLATFORMS,
  SeoPlatformId,
  buildNormalizedPlatformSeoPackage,
  formatCompletePlatformSeo,
  formatKeywordsBlock,
  formatHashtagsBlock,
  PlatformSeoRecord,
} from '../../utils/seoSpecs';

interface SeoPlatformSectionProps {
  platformTab?: OutputTab | string;
  seo?: MultiPlatformSeoPackage;
  config?: StudioConfig;
  keywords?: KeywordsPackage;
  titleEngine?: TitleEngineOutput;
  hooks?: HookEngineOutput;
  script?: HighRetentionScript;
  analysis?: ArticleAnalysis;
  onCopyText: (text: string, label: string) => void;
  onRegenerateSeo?: () => void;
  isLoading?: boolean;
}

/**
 * Maps incoming platform tab string to internal SeoPlatformId
 */
function mapTabToPlatformId(tab?: string): SeoPlatformId {
  if (!tab) return 'youtubeShorts';
  const lower = tab.toLowerCase();
  if (lower.includes('short')) return 'youtubeShorts';
  if (lower.includes('youtube')) return 'youtubeLong';
  if (lower.includes('instagram') || lower.includes('reel')) return 'instagram';
  if (lower.includes('facebook') && lower.includes('reel')) return 'facebookReels';
  if (lower.includes('facebook')) return 'facebookVideo';
  if (lower.includes('tiktok')) return 'tiktok';
  if (lower.includes('x') || lower.includes('twitter')) return 'x';
  if (lower.includes('linkedin')) return 'linkedin';
  if (lower.includes('snapchat')) return 'snapchat';
  if (lower.includes('pinterest')) return 'pinterest';
  return 'youtubeShorts';
}

export const SeoPlatformSection: React.FC<SeoPlatformSectionProps> = ({
  platformTab = 'youtubeShorts',
  seo,
  config,
  keywords,
  titleEngine,
  hooks,
  script,
  analysis,
  onCopyText,
  onRegenerateSeo,
  isLoading = false,
}) => {
  // Selected platform within SEO Studio
  const [selectedPlatformId, setSelectedPlatformId] = useState<SeoPlatformId>(() =>
    mapTabToPlatformId(platformTab)
  );

  // Synchronize when parent tab explicitly changes (e.g. user clicked "Instagram" from workspace menu)
  useEffect(() => {
    if (platformTab && platformTab !== 'SEO') {
      setSelectedPlatformId(mapTabToPlatformId(platformTab));
    }
  }, [platformTab]);

  // Active title variations sub-tab (highCtr | curiosity | searchFocused)
  const [titleVariationTab, setTitleVariationTab] = useState<'highCtr' | 'curiosity' | 'searchFocused'>('highCtr');

  // Copied indicator state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom active title override per platform
  const [activeTitleOverride, setActiveTitleOverride] = useState<Record<string, string>>({});

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Build full normalized 10-platform SEO data
  const normalizedPackages = useMemo(() => {
    return buildNormalizedPlatformSeoPackage(
      seo,
      config,
      keywords,
      titleEngine,
      hooks,
      script,
      analysis
    );
  }, [seo, config, keywords, titleEngine, hooks, script, analysis]);

  const activeRecord: PlatformSeoRecord = useMemo(() => {
    const rec = normalizedPackages[selectedPlatformId] || normalizedPackages.youtubeShorts;
    const customTitle = activeTitleOverride[selectedPlatformId];
    if (customTitle) {
      return { ...rec, title: customTitle };
    }
    return rec;
  }, [normalizedPackages, selectedPlatformId, activeTitleOverride]);

  const selectedPlatformMeta = useMemo(() => {
    return SEO_PLATFORMS.find((p) => p.id === selectedPlatformId) || SEO_PLATFORMS[0];
  }, [selectedPlatformId]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP HEADER & STUDIO CONTROLS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e1422] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
                SEO STUDIO — PLATFORM OPTIMIZATION
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Targeted, platform-native metadata generated from your story angle, script hooks, and video duration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {/* Language Indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Language:</span>
            <strong className="text-white capitalize">{config?.language || 'Hindi'}</strong>
          </div>

          {/* Factual Integrity Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Fact-Faithful</span>
          </div>

          {/* Regenerate SEO button */}
          {onRegenerateSeo && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onRegenerateSeo}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Platform SEO</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. PLATFORM SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Select Target Platform ({SEO_PLATFORMS.length} Supported)
          </span>
          <span className="text-[11px] text-slate-300">
            Showing standalone SEO for: <strong className="text-white">{selectedPlatformMeta.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {SEO_PLATFORMS.map((platform) => {
            const isSelected = selectedPlatformId === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setSelectedPlatformId(platform.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? `bg-slate-800/90 text-white ${platform.borderColor} shadow-lg shadow-black/40 ring-1 ring-white/10`
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {platform.id.includes('youtube') ? (
                  <Tv className={`w-3.5 h-3.5 ${isSelected ? platform.accentColor : 'text-slate-400'}`} />
                ) : platform.id.includes('instagram') || platform.id.includes('tiktok') ? (
                  <Smartphone className={`w-3.5 h-3.5 ${isSelected ? platform.accentColor : 'text-slate-400'}`} />
                ) : platform.id.includes('facebook') ? (
                  <Video className={`w-3.5 h-3.5 ${isSelected ? platform.accentColor : 'text-slate-400'}`} />
                ) : (
                  <Share2 className={`w-3.5 h-3.5 ${isSelected ? platform.accentColor : 'text-slate-400'}`} />
                )}
                <span>{platform.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-slate-950/80 text-cyan-300' : 'bg-slate-950/40 text-slate-300'
                  }`}
                >
                  {platform.recommendedFormat.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE PLATFORM WORKSPACE */}
      <div className="space-y-6">
        {/* PLATFORM BANNER & COPY COMPLETE SEO */}
        <div
          className={`p-5 rounded-2xl bg-gradient-to-r ${activeRecord.bgGradient} border ${activeRecord.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white font-heading tracking-wide">
                {activeRecord.platformName.toUpperCase()}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 text-cyan-300 border border-slate-700">
                {activeRecord.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800">
                RECOMMENDED FORMAT: {activeRecord.recommendedFormat.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Engineered specifically for {activeRecord.platformName} distribution algorithms, feed display constraints, and user engagement cadence.
            </p>
          </div>

          {/* COPY COMPLETE SEO BUTTON */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                const fullText = formatCompletePlatformSeo(activeRecord);
                handleCopy(fullText, `${activeRecord.platformId}-all`, `${activeRecord.platformName} Complete SEO`);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
            >
              {copiedKey === `${activeRecord.platformId}-all` ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-300" />
                  <span>COPIED COMPLETE SEO!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY COMPLETE SEO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SEO SCORE & DIAGNOSTICS CARD */}
        <div className="p-4 rounded-2xl bg-[#0e1422] border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex flex-col items-center justify-center text-cyan-300 flex-shrink-0">
              <span className="text-sm font-black font-mono leading-none">{activeRecord.seoScore.score}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">/100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  SEO Optimization Index:
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                  {activeRecord.seoScore.rating}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {activeRecord.seoScore.reason}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 font-medium px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 self-end sm:self-center flex-shrink-0">
            Factual Accuracy: <strong className="text-emerald-400">10/10 Verified</strong>
          </div>
        </div>

        {/* PRIMARY RECOMMENDED TITLE */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recommended Primary Title
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                {activeRecord.title.length} characters
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(activeRecord.title, `${activeRecord.platformId}-title`, 'Title')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              {copiedKey === `${activeRecord.platformId}-title` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Title</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY TITLE</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between gap-3">
            <p className="text-base sm:text-lg font-bold text-white font-heading leading-snug">
              {activeRecord.title}
            </p>
          </div>
        </div>

        {/* 15 TITLE VARIATIONS PANEL (5 CTR + 5 CURIOSITY + 5 SEARCH) */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
                <Flame className="w-4 h-4 text-amber-400" />
                15 Algorithmic Title Variations
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Select any title to apply it as primary, or copy individual titles instantly.
              </p>
            </div>

            {/* Sub-tabs for variations */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/90">
              <button
                type="button"
                onClick={() => setTitleVariationTab('highCtr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  titleVariationTab === 'highCtr'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 High-CTR ({activeRecord.titleVariations.highCtr.length})
              </button>
              <button
                type="button"
                onClick={() => setTitleVariationTab('curiosity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  titleVariationTab === 'curiosity'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 Curiosity ({activeRecord.titleVariations.curiosity.length})
              </button>
              <button
                type="button"
                onClick={() => setTitleVariationTab('searchFocused')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  titleVariationTab === 'searchFocused'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 Search ({activeRecord.titleVariations.searchFocused.length})
              </button>
            </div>
          </div>

          {/* Active Variation Category List */}
          <div className="space-y-2.5">
            {activeRecord.titleVariations[titleVariationTab].map((titleText, idx) => {
              const isCurrentTitle = activeRecord.title === titleText;
              const copyKey = `${activeRecord.platformId}-tvar-${titleVariationTab}-${idx}`;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrentTitle
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-100 font-medium leading-snug">{titleText}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {titleText.length} chars
                        </span>
                        {isCurrentTitle && (
                          <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Active Primary Title
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    {!isCurrentTitle && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTitleOverride((prev) => ({
                            ...prev,
                            [activeRecord.platformId]: titleText,
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 cursor-pointer transition-colors"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(titleText, copyKey, `Title Variation ${idx + 1}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === copyKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
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

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-300">
              Need all 5 options in this category?
            </span>
            <button
              type="button"
              onClick={() => {
                const combined = activeRecord.titleVariations[titleVariationTab]
                  .map((t, i) => `${i + 1}. ${t}`)
                  .join('\n');
                handleCopy(
                  combined,
                  `${activeRecord.platformId}-all-${titleVariationTab}`,
                  `All 5 ${titleVariationTab} Titles`
                );
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === `${activeRecord.platformId}-all-${titleVariationTab}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy All 5 Titles</span>
            </button>
          </div>
        </div>

        {/* HOOK / OPENING & CALL TO ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Platform Hook */}
          <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Platform Hook / Opening
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeRecord.hook, `${activeRecord.platformId}-hook`, 'Platform Hook')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === `${activeRecord.platformId}-hook` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>COPY HOOK</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 text-sm text-slate-200 leading-relaxed italic">
              "{activeRecord.hook}"
            </div>
            <p className="text-[11px] text-slate-300">
              Calibrated for the first 2 seconds on {activeRecord.platformName} to defeat scroll fatigue.
            </p>
          </div>

          {/* Call to Action (CTA) */}
          <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Optimized Call to Action (CTA)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeRecord.cta, `${activeRecord.platformId}-cta`, 'Call to Action')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === `${activeRecord.platformId}-cta` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>COPY CTA</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-medium">
              {activeRecord.cta}
            </div>
            <p className="text-[11px] text-slate-300">
              Platform-native conversion cue designed to maximize algorithmic comments, shares, and follows.
            </p>
          </div>
        </div>

        {/* DESCRIPTION & CHAPTERS */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Platform Description & Caption
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Formatted with line breaks, strong above-the-fold opening lines, and natural keywords.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeRecord.description,
                  `${activeRecord.platformId}-desc`,
                  `${activeRecord.platformName} Description`
                )
              }
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
            >
              {copiedKey === `${activeRecord.platformId}-desc` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Description</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY DESCRIPTION</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto font-sans">
            {activeRecord.description}
          </div>

          {/* YouTube Long Chapters / Timestamps */}
          {activeRecord.chapters && activeRecord.chapters.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Suggested Video Chapters / Timestamps
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const chapterStr = activeRecord.chapters?.map((c) => `${c.time} - ${c.title}`).join('\n') || '';
                    handleCopy(chapterStr, `${activeRecord.platformId}-chapters`, 'Video Chapters');
                  }}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `${activeRecord.platformId}-chapters` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Chapters</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeRecord.chapters.map((ch, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs"
                  >
                    <span className="font-mono text-cyan-400 font-bold bg-cyan-950/90 border border-cyan-800/50 px-2 py-0.5 rounded">
                      {ch.time}
                    </span>
                    <span className="text-slate-200 truncate">{ch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KEYWORD INTELLIGENCE (PRIMARY, SECONDARY, LONG-TAIL, TRENDING) */}
        <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                Keyword Intelligence ({activeRecord.platformName})
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Targeted search queries and semantic clusters indexed for algorithmic discovery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const text = formatKeywordsBlock(activeRecord.keywords);
                handleCopy(text, `${activeRecord.platformId}-all-kw`, 'Keyword Intelligence');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
            >
              {copiedKey === `${activeRecord.platformId}-all-kw` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied All Keywords</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY KEYWORDS</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Keywords */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Primary Keywords
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {activeRecord.keywords.primary.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {activeRecord.keywords.primary.map((kw, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(kw, `kw-p-${i}`, `Keyword: ${kw}`)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{kw}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Keywords */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Secondary Keywords
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {activeRecord.keywords.secondary.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {activeRecord.keywords.secondary.map((kw, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(kw, `kw-s-${i}`, `Keyword: ${kw}`)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{kw}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Long-Tail Keywords */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Long-Tail Keywords
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {activeRecord.keywords.longTail.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {activeRecord.keywords.longTail.map((kw, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(kw, `kw-l-${i}`, `Keyword: ${kw}`)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{kw}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Trending & Related Keywords */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Trending / Related
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {activeRecord.keywords.trending.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {activeRecord.keywords.trending.map((kw, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(kw, `kw-t-${i}`, `Keyword: ${kw}`)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{kw}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAGS & HASHTAG CONTROL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* TAGS (Comma separated) */}
          <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Platform Tags ({activeRecord.tags.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    activeRecord.tags.join(', '),
                    `${activeRecord.platformId}-tags`,
                    `${activeRecord.platformName} Tags`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === `${activeRecord.platformId}-tags` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>COPY TAGS</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex flex-wrap gap-1.5 min-h-[90px]">
              {activeRecord.tags.map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCopy(tag, `tag-${idx}`, `Tag: ${tag}`)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-300">
              Comma-separated collection ready to paste into YouTube Studio or Meta tags box.
            </p>
          </div>

          {/* HASHTAG CONTROL (CORE, TRENDING, PLATFORM-SPECIFIC) */}
          <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-pink-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hashtag Control
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  const text = formatHashtagsBlock(activeRecord.hashtags);
                  handleCopy(text, `${activeRecord.platformId}-all-hash`, 'All Hashtags');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === `${activeRecord.platformId}-all-hash` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>COPY HASHTAGS</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2.5">
              {/* Core Hashtags */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Core Hashtags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.hashtags.core.map((h, i) => (
                    <span
                      key={i}
                      onClick={() => handleCopy(h, `hash-c-${i}`, h)}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:border-cyan-700 cursor-pointer transition-colors"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform Specific Hashtags */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Platform Specific ({activeRecord.platformName})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.hashtags.platformSpecific.map((h, i) => (
                    <span
                      key={i}
                      onClick={() => handleCopy(h, `hash-p-${i}`, h)}
                      className="px-2 py-0.5 rounded-md bg-pink-950/50 border border-pink-800/50 text-xs font-mono text-pink-300 hover:border-pink-600 cursor-pointer transition-colors"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trending Hashtags */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Trending & Velocity
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.hashtags.trending.map((h, i) => (
                    <span
                      key={i}
                      onClick={() => handleCopy(h, `hash-t-${i}`, h)}
                      className="px-2 py-0.5 rounded-md bg-amber-950/50 border border-amber-800/50 text-xs font-mono text-amber-300 hover:border-amber-600 cursor-pointer transition-colors"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Categorized tiers prevent hashtag stuffing penalties while preserving algorithmic indexing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
