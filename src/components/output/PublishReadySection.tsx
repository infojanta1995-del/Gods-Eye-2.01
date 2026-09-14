import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  ExternalLink,
  Youtube,
  Instagram,
  Facebook,
  ShieldCheck,
  Loader2,
  Layers,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { GodseyeAiResult, StudioConfig, V2NavigationTab } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface PublishReadySectionProps {
  aiResult: GodseyeAiResult;
  config: StudioConfig;
  projectName?: string;
  onCopyText: (text: string, label: string) => void;
  onNavigateTab?: (tab: V2NavigationTab) => void;
}

export const PublishReadySection: React.FC<PublishReadySectionProps> = ({
  aiResult,
  config,
  projectName,
  onCopyText,
  onNavigateTab,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // YouTube Dispatch State
  const [ytAccount, setYtAccount] = useState('@godseye_channel');
  const [ytFormat, setYtFormat] = useState<'shorts' | 'long_form'>('shorts');
  const [ytVisibility, setYtVisibility] = useState<'public' | 'unlisted' | 'scheduled'>('public');
  const [ytScheduleTime, setYtScheduleTime] = useState('');
  const [ytSelectedTitleIndex, setYtSelectedTitleIndex] = useState(0);
  const [isPublishingYt, setIsPublishingYt] = useState(false);
  const [ytResult, setYtResult] = useState<any>(null);

  // Instagram Dispatch State
  const [igAccount, setIgAccount] = useState('@godseye.official');
  const [igFormat, setIgFormat] = useState<'reel' | 'carousel'>('reel');
  const [igVisibility, setIgVisibility] = useState<'public' | 'scheduled'>('public');
  const [igScheduleTime, setIgScheduleTime] = useState('');
  const [isPublishingIg, setIsPublishingIg] = useState(false);
  const [igResult, setIgResult] = useState<any>(null);

  // Facebook Dispatch State
  const [fbPage, setFbPage] = useState('Official Page (@godseye_media)');
  const [fbFormat, setFbFormat] = useState<'reel' | 'feed_video'>('reel');
  const [fbVisibility, setFbVisibility] = useState<'public' | 'scheduled'>('public');
  const [fbScheduleTime, setFbScheduleTime] = useState('');
  const [isPublishingFb, setIsPublishingFb] = useState(false);
  const [fbResult, setFbResult] = useState<any>(null);

  const [queueAdded, setQueueAdded] = useState(false);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Derive title list from SEO
  const ytShortsSeo = aiResult?.seo?.youtubeShorts;
  const ytTitles = [
    ytShortsSeo?.titles?.highCtr || config.title,
    ytShortsSeo?.titles?.curiosity,
    ytShortsSeo?.titles?.dramatic,
    ytShortsSeo?.titles?.searchOptimized,
    ytShortsSeo?.titles?.informative,
  ].filter(Boolean) as string[];

  const currentYtTitle = ytTitles[ytSelectedTitleIndex] || config.title || 'Untitled Video';

  // 10-Point Readiness Verification
  const checklist = [
    { label: 'Source Ingestion', pass: Boolean(config.title || aiResult?.analysis?.mainTopic) },
    { label: 'Source Intelligence', pass: Boolean(aiResult?.analysis?.importantFacts?.length) },
    { label: 'Story Angle Engine', pass: Boolean(aiResult?.storyAngle?.mainAngle) },
    { label: 'Viral Hook Matrix', pass: Boolean(aiResult?.hooks?.bestHook || aiResult?.hooks?.hookList?.length) },
    { label: 'High-Retention Script', pass: Boolean(aiResult?.script?.text) },
    { label: 'Script Doctor Validation', pass: Boolean(aiResult?.qualityCheck?.overallScore) },
    { label: 'Scene Blueprint & Pacing', pass: Boolean(aiResult?.scenes?.length) },
    { label: 'Camera & Video Prompts', pass: Boolean(aiResult?.scenes?.[0]?.videoPrompt?.prompt) },
    { label: '3 Thumbnail Formulations', pass: Boolean(aiResult?.thumbnails?.concepts?.length) },
    { label: 'Multi-Platform SEO Packages', pass: Boolean(aiResult?.seo?.youtubeShorts?.titles) },
  ];

  const passCount = checklist.filter((c) => c.pass).length;
  const readinessPercent = Math.round((passCount / checklist.length) * 100);

  const handleCopyManifest = () => {
    const manifest = `==================================================
GOD'S EYE V2.0 — READY TO PUBLISH DISTRIBUTION MANIFEST
==================================================
PROJECT: ${projectName || config.title || 'GODSEYE Project'}
READINESS SCORE: ${readinessPercent}% (${passCount}/10 Validated)
TARGET DURATION: ${aiResult?.script?.duration || config.duration}
ASPECT RATIO: ${config.videoFormat}

1. PRIMARY WINNING HOOK:
"${aiResult?.hooks?.bestHook || ''}"

2. SPOKEN SCRIPT (POLISHED):
${aiResult?.polishedScript || aiResult?.script?.text || ''}

3. YOUTUBE SHORTS SEO:
Title: ${currentYtTitle}
Description:
${ytShortsSeo?.description || ''}
Hashtags: ${ytShortsSeo?.hashtags?.join(' ') || ''}

4. INSTAGRAM REELS CAPTION:
${aiResult?.hooks?.bestHook || ''}

${aiResult?.script?.coreMessage || ''}

Save this post for later 📌
${aiResult?.seo?.instagram?.hashtags?.join(' ') || ytShortsSeo?.hashtags?.join(' ') || ''}

5. FACEBOOK VIRAL POST:
${currentYtTitle}

${aiResult?.script?.coreMessage || ''}

What are your thoughts on this? Leave your opinion below 👇
${aiResult?.seo?.facebook?.tags?.join(' ') || ''}

6. THUMBNAIL HEADLINE CONCEPTS:
${(aiResult?.thumbnails?.concepts || []).map((c, i) => `Option ${i + 1} (${c.type}): "${c.headlineText}"\nVisual: ${c.visualDescription}`).join('\n\n')}

7. SCENE VISUAL PROMPTS (${aiResult?.scenes?.length || 0} Scenes):
${(aiResult?.scenes || []).map((s) => `[Scene ${s.sceneNumber}] (${s.startTime}-${s.endTime}): ${s.videoPrompt?.prompt || s.visual}`).join('\n')}
==================================================`;

    handleCopy(manifest, 'manifest-full', 'Full Distribution Manifest');
  };

  // YouTube Dispatch
  const handleDispatchYouTube = async () => {
    setIsPublishingYt(true);
    setYtResult(null);

    try {
      const res = await GODSEYE_API.publishToPlatform({
        projectId: 'current',
        platform: 'youtube',
        targetAccount: ytAccount,
        scheduleTime: ytVisibility === 'scheduled' ? ytScheduleTime || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: currentYtTitle,
          description: `${ytShortsSeo?.description || ''}\n\n${ytShortsSeo?.hashtags?.join(' ') || ''}`,
          tags: ytShortsSeo?.hashtags || [],
          visibility: ytVisibility,
          format: ytFormat,
        },
      });
      setYtResult(res);
    } catch (err: any) {
      setYtResult({ success: false, error: err.message || 'YouTube dispatch failed' });
    } finally {
      setIsPublishingYt(false);
    }
  };

  // Instagram Dispatch
  const handleDispatchInstagram = async () => {
    setIsPublishingIg(true);
    setIgResult(null);

    try {
      const res = await GODSEYE_API.publishToPlatform({
        projectId: 'current',
        platform: 'instagram',
        targetAccount: igAccount,
        scheduleTime: igVisibility === 'scheduled' ? igScheduleTime || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: currentYtTitle,
          caption: `${aiResult?.hooks?.bestHook || ''}\n\n${aiResult?.script?.coreMessage || ''}\n\nSave this post for later 📌\n\n${aiResult?.seo?.instagram?.hashtags?.join(' ') || ''}`,
          format: igFormat,
        },
      });
      setIgResult(res);
    } catch (err: any) {
      setIgResult({ success: false, error: err.message || 'Instagram dispatch failed' });
    } finally {
      setIsPublishingIg(false);
    }
  };

  // Facebook Dispatch
  const handleDispatchFacebook = async () => {
    setIsPublishingFb(true);
    setFbResult(null);

    try {
      const res = await GODSEYE_API.publishToPlatform({
        projectId: 'current',
        platform: 'facebook',
        targetAccount: fbPage,
        scheduleTime: fbVisibility === 'scheduled' ? fbScheduleTime || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: currentYtTitle,
          description: `${currentYtTitle}\n\n${aiResult?.script?.coreMessage || ''}\n\n${aiResult?.seo?.facebook?.tags?.join(' ') || ''}`,
          tags: aiResult?.seo?.facebook?.tags || [],
          format: fbFormat,
        },
      });
      setFbResult(res);
    } catch (err: any) {
      setFbResult({ success: false, error: err.message || 'Facebook dispatch failed' });
    } finally {
      setIsPublishingFb(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-xs font-semibold text-emerald-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>STAGE 10: VIRAL PUBLISHING DISPATCH</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-mono font-bold">{readinessPercent}% READY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Ready To Publish Command Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Final pre-flight verification, one-click platform dispatches, and multi-network release orchestration.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="btn-copy-manifest"
              onClick={handleCopyManifest}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-600/70 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              {copiedKey === 'manifest-full' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>Copy Release Manifest</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                id="btn-open-publishing-queue-nav"
                onClick={() => onNavigateTab('Publishing Queue')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Open Queue View</span>
              </button>
            )}
          </div>
        </div>

        {/* 10-Point Readiness Matrix */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold">10-Point Pre-Flight Pipeline Audit:</span>
            <span className="font-mono text-emerald-400 font-bold">{passCount}/10 Completed</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                  item.pass
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${item.pass ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Dedicated Platform Dispatch Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. YOUTUBE DISPATCH CARD */}
        <div className="rounded-2xl border border-red-500/30 bg-[#0d111d] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-950/80 border border-red-700/50 text-red-400">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">YouTube Dispatch</h3>
                  <span className="text-[10px] text-slate-400 font-mono">SHORTS & LONG-FORM</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target Account:</label>
                <input
                  type="text"
                  value={ytAccount}
                  onChange={(e) => setYtAccount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Title Option ({ytTitles.length} variations):</label>
                <select
                  value={ytSelectedTitleIndex}
                  onChange={(e) => setYtSelectedTitleIndex(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-red-500"
                >
                  {ytTitles.map((t, i) => (
                    <option key={i} value={i}>
                      Option {i + 1}: {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Format:</label>
                  <select
                    value={ytFormat}
                    onChange={(e) => setYtFormat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="shorts">Shorts (9:16)</option>
                    <option value="long_form">Full Video (16:9)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Visibility:</label>
                  <select
                    value={ytVisibility}
                    onChange={(e) => setYtVisibility(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="public">Public Instant</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {ytVisibility === 'scheduled' && (
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Release Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={ytScheduleTime}
                    onChange={(e) => setYtScheduleTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>
              )}
            </div>

            {ytResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  ytResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'
                }`}
              >
                {ytResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <span className="truncate">{ytResult.message || ytResult.error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              id="btn-dispatch-youtube"
              onClick={handleDispatchYouTube}
              disabled={isPublishingYt}
              className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishingYt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{ytVisibility === 'scheduled' ? 'Schedule on YouTube' : 'Publish to YouTube'}</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('YouTube Studio')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                title="Open YouTube Studio Suite"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. INSTAGRAM DISPATCH CARD */}
        <div className="rounded-2xl border border-pink-500/30 bg-[#120c15] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-950/80 border border-pink-700/50 text-pink-400">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Instagram Dispatch</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REELS & CAROUSELS</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target Account:</label>
                <input
                  type="text"
                  value={igAccount}
                  onChange={(e) => setIgAccount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Format:</label>
                  <select
                    value={igFormat}
                    onChange={(e) => setIgFormat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="reel">Instagram Reel (9:16)</option>
                    <option value="carousel">Visual Carousel</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Visibility:</label>
                  <select
                    value={igVisibility}
                    onChange={(e) => setIgVisibility(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="public">Publish Now</option>
                    <option value="scheduled">Schedule Post</option>
                  </select>
                </div>
              </div>

              {igVisibility === 'scheduled' && (
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Release Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={igScheduleTime}
                    onChange={(e) => setIgScheduleTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-pink-400 block mb-1">Caption Hook Preview:</span>
                <p className="text-slate-300 text-[11px] line-clamp-2">
                  {aiResult?.hooks?.bestHook || config.title}
                </p>
              </div>
            </div>

            {igResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  igResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-pink-950/60 border-pink-800 text-pink-300'
                }`}
              >
                {igResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />}
                <span className="truncate">{igResult.message || igResult.error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              id="btn-dispatch-instagram"
              onClick={handleDispatchInstagram}
              disabled={isPublishingIg}
              className="flex-1 py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishingIg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{igVisibility === 'scheduled' ? 'Schedule on Instagram' : 'Publish to Instagram'}</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('Instagram Studio')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                title="Open Instagram Studio Suite"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. FACEBOOK DISPATCH CARD */}
        <div className="rounded-2xl border border-blue-500/30 bg-[#09101d] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-400">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Facebook Dispatch</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REELS & VIRAL FEEDS</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target Page:</label>
                <input
                  type="text"
                  value={fbPage}
                  onChange={(e) => setFbPage(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Format:</label>
                  <select
                    value={fbFormat}
                    onChange={(e) => setFbFormat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="reel">Facebook Reel (9:16)</option>
                    <option value="feed_video">Feed Video</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Visibility:</label>
                  <select
                    value={fbVisibility}
                    onChange={(e) => setFbVisibility(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="public">Publish Now</option>
                    <option value="scheduled">Schedule Post</option>
                  </select>
                </div>
              </div>

              {fbVisibility === 'scheduled' && (
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Release Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={fbScheduleTime}
                    onChange={(e) => setFbScheduleTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Discussion Trigger:</span>
                <p className="text-slate-300 text-[11px] line-clamp-2">
                  "What are your thoughts on this? Leave your opinion below 👇"
                </p>
              </div>
            </div>

            {fbResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  fbResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-blue-950/60 border-blue-800 text-blue-300'
                }`}
              >
                {fbResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                <span className="truncate">{fbResult.message || fbResult.error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              id="btn-dispatch-facebook"
              onClick={handleDispatchFacebook}
              disabled={isPublishingFb}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishingFb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{fbVisibility === 'scheduled' ? 'Schedule on Facebook' : 'Publish to Facebook'}</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('Facebook Studio')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                title="Open Facebook Studio Suite"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
