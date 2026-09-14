import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Hash,
  FileText,
  Search,
  ListOrdered,
  Layers,
  Youtube,
  Instagram,
  Facebook,
  Share2,
  CheckCircle2,
  Zap,
  Loader2,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface SeoStudioViewProps {
  activeProject: GodseyeProject | null;
  onNavigate: (tab: V2NavigationTab) => void;
  onUpdateAiResult?: (updated: any) => void;
}

type PlatformTab = 'youtube_long' | 'youtube_shorts' | 'instagram' | 'facebook' | 'tiktok';

export const SeoStudioView: React.FC<SeoStudioViewProps> = ({
  activeProject,
  onNavigate,
  onUpdateAiResult,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformTab>('youtube_long');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [customSeoData, setCustomSeoData] = useState<any>(null);

  const existingSeo = activeProject?.result?.seo;
  const existingTitles = activeProject?.result?.titles || [];

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateCustomSeo = async () => {
    const topic = activeProject?.name || 'High Stakes Investigation';
    const script = activeProject?.result?.script?.scriptText || activeProject?.result?.script?.coreMessage || '';

    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      const res = await GODSEYE_API.generateCustomSeo({
        topic,
        script,
        platform: activePlatform,
      });

      if (res.success && res.data) {
        setCustomSeoData(res.data);
      } else {
        // Fallback comprehensive SEO package
        setCustomSeoData({
          youtube_long: {
            title: `The Untold Truth of ${topic} (Full Documentary)`,
            hook: 'What mainstream reports never told you about what happened behind closed doors.',
            description: `In this comprehensive investigative breakdown, we uncover the hidden chronology, key players, and second-order consequences of ${topic}.\n\nTimestamps & Sources included in the pinned comment.\n\nSubscribe to @godseye for daily high-retention explainers.`,
            primaryKeywords: [topic, `${topic} documentary`, `${topic} explained`, 'Investigative breakdown'],
            secondaryKeywords: ['Truth behind', 'Chronology', 'Key actors', 'Global impact 2026'],
            longTailKeywords: [`Why did ${topic} happen so fast`, `Step by step timeline of ${topic}`, 'Hidden facts everyone missed'],
            searchPhrases: [`How ${topic} changed everything`, `What is the real truth about ${topic}`, `Is ${topic} real or exaggerated`],
            tags: [topic.toLowerCase().replace(/\s+/g, ''), 'documentary', 'investigation', 'godseyeai', 'explainer'],
            hashtags: [`#${topic.replace(/\s+/g, '')}`, '#Investigation', '#DeepDive', '#Documentary', '#Explained'],
            callToAction: 'Which revelation surprised you the most? Drop your perspective in the comments below!',
            pinnedComment: `📌 Sources & Key Timeline:\n1. 0:00 Introduction\n2. 2:15 The Secret Trigger\n3. 6:40 Financial Flow Breakdown\n4. 11:20 The 2026 Prediction\n\nWhich part surprised you the most?`,
          },
          youtube_shorts: {
            title: `The 1 Fact You Missed About ${topic} 🤯`,
            hook: 'Nobody is talking about the real reason this happened.',
            description: `The secret truth about ${topic} in under 60 seconds! Watch till the end. #Shorts #${topic.replace(/\s+/g, '')}`,
            primaryKeywords: [topic, 'Shorts', 'Viral fact', 'Shocking truth'],
            secondaryKeywords: ['Quick explainer', 'Hidden revelation'],
            longTailKeywords: [`Did you know this about ${topic}`],
            searchPhrases: [`${topic} shorts`, `${topic} fact`],
            tags: [topic.toLowerCase().replace(/\s+/g, ''), 'shorts', 'viral', 'fact'],
            hashtags: ['#Shorts', `#${topic.replace(/\s+/g, '')}`, '#Viral', '#Facts', '#Mindblown'],
            callToAction: 'Subscribe for daily 60-second deep dives!',
            pinnedComment: 'Did you catch the clue at 0:24? 👀 Subscribe for part 2!',
          },
          instagram: {
            title: `The real story behind ${topic}`,
            hook: 'Save this post before you forget these 4 critical facts 📌',
            description: `Here is the full breakdown of ${topic} that you won't hear anywhere else.\n\nKey takeaways:\n• Fact 1: The quiet trigger\n• Fact 2: The hidden beneficiaries\n• Fact 3: What comes in 2026\n\nFollow @godseye for daily investigative breakdowns.`,
            primaryKeywords: [topic, 'Instagram Reels', 'Investigative post'],
            secondaryKeywords: ['Carousel notes', 'Viral reel'],
            longTailKeywords: [`Instagram breakdown of ${topic}`],
            searchPhrases: [`What happened to ${topic}`],
            tags: [topic.toLowerCase().replace(/\s+/g, ''), 'reels', 'curiosity'],
            hashtags: ['#Reels', '#InstagramReels', `#${topic.replace(/\s+/g, '')}`, '#Curiosity', '#Education', '#Growth'],
            callToAction: 'Share this to your story to spread awareness!',
            pinnedComment: 'Save this reel for reference later! 📌',
          },
          facebook: {
            title: `URGENT: What everyone needs to know about ${topic}`,
            hook: 'If you or your family follow this news, watch this immediately.',
            description: `Full investigative report on ${topic}. What do you think about this outcome? Share with your friends and family to keep them informed!`,
            primaryKeywords: [topic, 'Facebook video', 'Discussion'],
            secondaryKeywords: ['Community news', 'Public interest'],
            longTailKeywords: [`Family safety regarding ${topic}`],
            searchPhrases: [`Is ${topic} safe`, `News report on ${topic}`],
            tags: [topic.toLowerCase().replace(/\s+/g, ''), 'news', 'update'],
            hashtags: [`#${topic.replace(/\s+/g, '')}`, '#NewsUpdate', '#PublicAwareness', '#TrendingNow'],
            callToAction: 'Share your honest opinion in the comments below!',
            pinnedComment: 'What is your opinion on this? Let us know in the comments!',
          },
          tiktok: {
            title: `You won't believe what happened with ${topic} 😳`,
            hook: 'Stop scrolling because this changes everything.',
            description: `Exposing the real truth of ${topic}. #fyp #${topic.replace(/\s+/g, '')} #storytime #investigation`,
            primaryKeywords: [topic, 'TikTok viral', 'Storytime'],
            secondaryKeywords: ['FYP', 'Trending audio'],
            longTailKeywords: [`TikTok conspiracy truth ${topic}`],
            searchPhrases: [`${topic} explained tiktok`],
            tags: [topic.toLowerCase().replace(/\s+/g, ''), 'fyp', 'storytime'],
            hashtags: ['#fyp', '#foryou', `#${topic.replace(/\s+/g, '')}`, '#storytime', '#viral', '#learnontiktok'],
            callToAction: 'Follow for part 2 releasing tomorrow!',
            pinnedComment: 'Part 2 is dropping tomorrow, follow so you don’t miss it! 🔔',
          },
        });
      }
    } catch (err) {
      console.error('SEO generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getActivePackage = () => {
    if (customSeoData && customSeoData[activePlatform]) {
      return customSeoData[activePlatform];
    }
    // Fallback to existing project seo data
    const topic = activeProject?.name || 'Active Investigation';
    return {
      title: existingTitles[0] || `The Untold Truth of ${topic}`,
      hook: activeProject?.result?.hooks?.[0]?.hookText || 'What mainstream media deliberately overlooked.',
      description: existingSeo?.description || `Detailed investigative report into ${topic} covering all primary chronology and key figures.`,
      primaryKeywords: existingSeo?.keywords?.slice(0, 4) || [topic, 'Documentary', 'Investigation', 'Deep dive'],
      secondaryKeywords: existingSeo?.keywords?.slice(4, 8) || ['Chronology', 'Explainer', 'Hidden facts'],
      longTailKeywords: [`What happened with ${topic}`, `The truth about ${topic} 2026`],
      searchPhrases: [`How does ${topic} work`, `Why is ${topic} trending`],
      tags: existingSeo?.tags || [topic.toLowerCase().replace(/\s+/g, ''), 'documentary', 'investigation'],
      hashtags: existingSeo?.hashtags || [`#${topic.replace(/\s+/g, '')}`, '#Investigation', '#Documentary', '#Explained'],
      callToAction: 'Subscribe to @godseye for daily high-retention explainers!',
      pinnedComment: 'Which part of this story shocked you the most? Drop your perspective below! 👇',
    };
  };

  const pkg = getActivePackage();

  const handleCopyCompletePackage = () => {
    const fullText = `PLATFORM: ${activePlatform.toUpperCase()}
TITLE: ${pkg.title}
HOOK / FIRST LINE: ${pkg.hook}

DESCRIPTION:
${pkg.description}

PRIMARY KEYWORDS: ${pkg.primaryKeywords?.join(', ')}
SEARCH PHRASES: ${pkg.searchPhrases?.join(' | ')}
HASHTAGS: ${pkg.hashtags?.join(' ')}

CALL TO ACTION: ${pkg.callToAction}
PINNED COMMENT: ${pkg.pinnedComment}`;

    handleCopy(fullText, 'full-package');
  };

  const handleSaveToProject = () => {
    if (!pkg || !activeProject || !onUpdateAiResult) return;
    const currentResult = activeProject.result || ({} as any);

    const updated = {
      ...currentResult,
      titles: [pkg.title, ...(currentResult.titles?.filter((t: string) => t !== pkg.title) || [])],
      seo: {
        ...(currentResult.seo || {}),
        description: pkg.description,
        hashtags: pkg.hashtags,
        tags: pkg.tags,
        keywords: [...(pkg.primaryKeywords || []), ...(pkg.secondaryKeywords || [])],
      },
    };

    onUpdateAiResult(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0a1e16] via-[#091510] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-xs font-semibold text-emerald-300 mb-2">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>MULTI-PLATFORM SEO & METADATA SUITE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">ALGORITHMIC SEARCH & BROWSE OPTIMIZATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Platform-Specific SEO & Discoverability Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Calibrated metadata for YouTube Long, YouTube Shorts, Instagram Reels, Facebook Video, and TikTok with high-volume search intent keywords and call-to-actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Tabs & Control Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-3">
          {/* Platform Tab Buttons */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 gap-1 text-xs flex-wrap">
            {[
              { id: 'youtube_long', label: 'YouTube Long', icon: Youtube, color: 'text-red-400' },
              { id: 'youtube_shorts', label: 'YouTube Shorts', icon: Youtube, color: 'text-red-500' },
              { id: 'instagram', label: 'Instagram Reels', icon: Instagram, color: 'text-pink-400' },
              { id: 'facebook', label: 'Facebook Video', icon: Facebook, color: 'text-blue-400' },
              { id: 'tiktok', label: 'TikTok', icon: Share2, color: 'text-cyan-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePlatform(tab.id as any)}
                  className={`px-3 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activePlatform === tab.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${activePlatform === tab.id ? 'text-slate-950' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCompletePackage}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedKey === 'full-package' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Full Package</span>
            </button>

            {onUpdateAiResult && (
              <button
                type="button"
                onClick={handleSaveToProject}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved to Project!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Apply to Project</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleGenerateCustomSeo}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Calibrating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Platform Package</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Platform Target Bar */}
        <div className="flex items-center justify-between text-xs">
          <p className="text-slate-400">
            Active Target: <span className="font-bold text-white uppercase">{activePlatform.replace('_', ' ')}</span> • Project: <span className="text-emerald-300 font-semibold">{activeProject?.name || 'Active Project'}</span>
          </p>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
            OPTIMIZED FOR FEED RETENTION
          </span>
        </div>
      </div>

      {/* Main SEO Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Title, Description, First Line Hook */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. TITLE & FIRST LINE HOOK */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Algorithmic Title & Opening Hook</h3>
                  <p className="text-xs text-slate-400">Optimized for search click-through rate and 125-character preview window</p>
                </div>
              </div>
            </div>

            {/* Title Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  Recommended Primary Title
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pkg.title, 'title')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Title</span>
                </button>
              </div>
              <p className="text-base font-bold text-white leading-snug">{pkg.title}</p>
            </div>

            {/* First-Line Truncation Hook */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  First-Line Truncation Hook (Before "...more")
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pkg.hook, 'hook')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'hook' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Hook</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 italic font-mono bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-900/40">
                "{pkg.hook}"
              </p>
            </div>
          </div>

          {/* 2. DESCRIPTION & CAPTION */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Full Video Description / Caption</h3>
                  <p className="text-xs text-slate-400">Pre-formatted with timestamps, call-to-actions, and hashtags</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(pkg.description, 'description')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === 'description' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Description</span>
              </button>
            </div>

            <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {pkg.description}
            </pre>
          </div>

          {/* 3. ENGAGEMENT PINNED COMMENT & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d121c]/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                  Recommended Pinned Comment
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pkg.pinnedComment, 'pinned')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  {copiedKey === 'pinned' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {pkg.pinnedComment}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d121c]/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Call-To-Action (CTA)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pkg.callToAction, 'cta')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  {copiedKey === 'cta' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {pkg.callToAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Keywords, Search Phrases, Hashtags */}
        <div className="space-y-6">
          {/* PRIMARY & SECONDARY KEYWORDS */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>Target Search Keywords</span>
              </h4>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    [...(pkg.primaryKeywords || []), ...(pkg.secondaryKeywords || [])].join(', '),
                    'keywords'
                  )
                }
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                {copiedKey === 'keywords' ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Primary High-Intent Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.primaryKeywords?.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1.5">
                  Secondary & Long-Tail Variations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...(pkg.secondaryKeywords || []), ...(pkg.longTailKeywords || [])].map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HIGH-VOLUME SEARCH PHRASES */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Algorithmic Search Queries</span>
            </h4>
            <div className="space-y-1.5">
              {pkg.searchPhrases?.map((sp: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between"
                >
                  <span className="truncate mr-2 font-medium">"{sp}"</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(sp, `sp-${idx}`)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-mono flex-shrink-0 cursor-pointer"
                  >
                    {copiedKey === `sp-${idx}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VIRAL HASHTAGS */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Hash className="w-4 h-4 text-pink-400" />
                <span>Viral Hashtags</span>
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(pkg.hashtags?.join(' '), 'all-hashtags')}
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
              >
                {copiedKey === 'all-hashtags' ? 'Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {pkg.hashtags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-pink-950/30 text-pink-300 border border-pink-800/40"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
