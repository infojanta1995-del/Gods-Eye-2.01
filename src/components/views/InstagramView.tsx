import React, { useState } from 'react';
import {
  Instagram,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Send,
  Calendar,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Bookmark,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface InstagramViewProps {
  activeProject: GodseyeProject | null;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const InstagramView: React.FC<InstagramViewProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [targetAccount, setTargetAccount] = useState('Creator Account (@godseye.official)');
  const [mediaFormat, setMediaFormat] = useState<'reel' | 'carousel'>('reel');
  const [privacySetting, setPrivacySetting] = useState<'public' | 'scheduled'>('public');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);

  const result = activeProject?.result;
  const script = result?.script;
  const hooks = result?.hooks || [];
  const hashtags = result?.seo?.hashtags || [];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDispatchPublish = async () => {
    if (!activeProject) return;

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const res = await GODSEYE_API.publishToPlatform({
        projectId: activeProject.id,
        platform: 'instagram',
        targetAccount: targetAccount,
        scheduleTime: privacySetting === 'scheduled' ? scheduleDate || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: activeProject.name,
          caption: `${hooks[0]?.hookText || ''}\n\n${script?.coreMessage || ''}\n\nSave this post for later 📌\n\n${hashtags.slice(0, 10).join(' ')}`,
          format: mediaFormat,
        },
      });

      setPublishResult(res);
    } catch (err: any) {
      setPublishResult({
        success: false,
        error: err.message || 'Instagram dispatch failed',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#28091e] via-[#1a0614] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-700/50 text-xs font-semibold text-pink-300 mb-2">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>INSTAGRAM VIRAL STUDIO</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">REELS & CAROUSEL DISPATCH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Instagram Save-Rate & Visual Carousel Framing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Engineered for high bookmark/save ratios, 3-second Reel retention, and multi-slide carousel storytelling.
            </p>
          </div>

          {!result && (
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-pink-600/30"
            >
              <span>Go to Content Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <Instagram className="w-12 h-12 text-pink-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active Instagram package loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Synthesize content in the Creator Studio or load an existing project to inspect Instagram caption formulas and carousel blueprints.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Creator Studio</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dispatch Bar */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Instagram Release Dispatch</h3>
                  <p className="text-xs text-slate-400">Publish Reel or Carousel directly to connected Instagram Creator account</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instagram Graph API Connected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Destination Account</label>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option>Creator Account (@godseye.official)</option>
                  <option>Backup / Experimental Reel Channel</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Media Format</label>
                <select
                  value={mediaFormat}
                  onChange={(e) => setMediaFormat(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="reel">Instagram 9:16 Reel</option>
                  <option value="carousel">10-Slide Educational Carousel</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Timing</label>
                <select
                  value={privacySetting}
                  onChange={(e) => setPrivacySetting(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="public">Publish Immediately</option>
                  <option value="scheduled">Schedule Post</option>
                </select>
              </div>

              {privacySetting === 'scheduled' ? (
                <div>
                  <label className="text-slate-400 font-medium block mb-1.5">Schedule Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleDispatchPublish}
                    disabled={isPublishing}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-pink-600/30"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing to Instagram...</span>
                      </>
                    ) : (
                      <>
                        <Instagram className="w-4 h-4" />
                        <span>Publish to Instagram</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {privacySetting === 'scheduled' && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDispatchPublish}
                  disabled={isPublishing}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-pink-600/30"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Instagram Post</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status Feedback */}
            {publishResult && (
              <div
                className={`p-4 rounded-xl border animate-fadeIn text-xs space-y-2 ${
                  publishResult.success
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/30 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    {publishResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span>{publishResult.message || 'Instagram dispatch completed.'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {publishResult.jobId?.slice(0, 10) || 'IG-OK'}
                  </span>
                </div>

                {publishResult.publishedUrl && (
                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="text-slate-400">Instagram Link:</span>
                    <a
                      href={publishResult.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-400 hover:text-pink-300 underline flex items-center gap-1"
                    >
                      <span>{publishResult.publishedUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Caption Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Instagram Caption & Save Triggers</h3>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${hooks[0]?.hookText || ''}\n\n${script?.coreMessage || ''}\n\nSave this post for later 📌\n\n${hashtags.slice(0, 8).join(' ')}`,
                      'ig-caption'
                    )
                  }
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                >
                  {copiedKey === 'ig-caption' ? 'Copied!' : 'Copy Caption'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
                <p className="font-bold text-white">
                  {hooks[0]?.hookText || 'Did you know this shocking truth?'}
                </p>
                <p className="text-slate-300">
                  {script?.coreMessage || script?.scriptText?.slice(0, 280) || ''}...
                </p>
                <p className="text-pink-400 font-medium flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save this post to revisit when this unfolds in 2026.</span>
                </p>
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 font-mono text-[11px] text-pink-400">
                  {hashtags.slice(0, 8).map((tag, idx) => (
                    <span key={idx}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Carousel Blueprint */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                <span>Carousel Slide Blueprint</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { slide: 1, text: 'Cover Slide: The Unanswered Question + Curiosity Graphic' },
                  { slide: 2, text: 'Slide 2: The Catalyst & Earliest Known Incident' },
                  { slide: 3, text: 'Slide 3: High-Impact Data Metric & Surprising Comparison' },
                  { slide: 4, text: 'Slide 4: The 2026 Shift — What Happens Next?' },
                  { slide: 5, text: 'Call-To-Action: Save 📌 and Share with someone who needs this.' },
                ].map((s) => (
                  <div
                    key={s.slide}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-slate-300"
                  >
                    <span className="w-6 h-6 rounded-full bg-pink-950/80 text-pink-300 border border-pink-800/50 flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0">
                      {s.slide}
                    </span>
                    <span className="font-medium">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
