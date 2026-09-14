import React, { useState } from 'react';
import {
  Facebook,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Share2,
  Flame,
  Send,
  Calendar,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface FacebookViewProps {
  activeProject: GodseyeProject | null;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const FacebookView: React.FC<FacebookViewProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [targetPage, setTargetPage] = useState('Official Page (@godseye_media)');
  const [formatType, setFormatType] = useState<'reel' | 'feed_video'>('reel');
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
        platform: 'facebook',
        targetAccount: targetPage,
        scheduleTime: privacySetting === 'scheduled' ? scheduleDate || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: activeProject.name,
          description: `${hooks[0]?.hookText || ''}\n\n${script?.coreMessage || ''}\n\n${hashtags.slice(0, 6).join(' ')}`,
          tags: hashtags,
          format: formatType,
        },
      });

      setPublishResult(res);
    } catch (err: any) {
      setPublishResult({
        success: false,
        error: err.message || 'Facebook dispatch failed',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-[#0c182d] via-[#091120] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-semibold text-blue-300 mb-2">
              <Facebook className="w-3.5 h-3.5 text-blue-500" />
              <span>FACEBOOK VIRAL DISTRIBUTION SUITE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">REELS & FEED DISPATCH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Facebook Feed Pacing & Discussion Triggers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Engineered for social shares, family group virality, high-comment polarity, and instant autoplay hook engagement.
            </p>
          </div>

          {!result && (
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-blue-600/30"
            >
              <span>Go to Content Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <Facebook className="w-12 h-12 text-blue-500/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active Facebook package loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Synthesize content in the Creator Studio or load an existing project to inspect Facebook feed copy and hooks.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
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
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Facebook Release Dispatch</h3>
                  <p className="text-xs text-slate-400">Publish Reel or Post directly to connected Meta Page</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Meta Graph API Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Destination Page</label>
                <select
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option>Official Page (@godseye_media)</option>
                  <option>Community Discussion Hub</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Release Mode</label>
                <select
                  value={privacySetting}
                  onChange={(e) => setPrivacySetting(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="public">Publish Immediately</option>
                  <option value="scheduled">Schedule Post</option>
                </select>
              </div>

              {privacySetting === 'scheduled' ? (
                <div>
                  <label className="text-slate-400 font-medium block mb-1.5">Release Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleDispatchPublish}
                    disabled={isPublishing}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing to Page...</span>
                      </>
                    ) : (
                      <>
                        <Facebook className="w-4 h-4" />
                        <span>Publish to Facebook</span>
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
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Facebook Release</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status notification */}
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
                    <span>{publishResult.message || 'Facebook dispatch completed.'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {publishResult.jobId?.slice(0, 10) || 'FB-OK'}
                  </span>
                </div>

                {publishResult.publishedUrl && (
                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="text-slate-400">Post Link:</span>
                    <a
                      href={publishResult.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
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
            {/* Feed Post Copy */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Facebook Feed Copy & Call-To-Action</h3>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${hooks[0]?.hookText || ''}\n\n${result.script?.coreMessage || ''}\n\nWhat do you think about this? Share your opinion below! 👇\n\n${hashtags.slice(0, 5).join(' ')}`,
                      'fb-copy'
                    )
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  {copiedKey === 'fb-copy' ? 'Copied!' : 'Copy Feed Post'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
                <p className="font-bold text-white">
                  {hooks[0]?.hookText || 'Watch till the end to understand the full truth!'}
                </p>
                <p className="text-slate-300">
                  {result.script?.coreMessage || result.script?.scriptText?.slice(0, 300) || ''}...
                </p>
                <p className="text-blue-400 font-semibold">
                  What do you think about this? Share your opinion below! 👇
                </p>
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400">
                  {hashtags.slice(0, 6).map((tag, idx) => (
                    <span key={idx}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Facebook Reel Hook Variations */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Facebook Reel Opening Hooks</h3>
              <div className="space-y-2.5">
                {hooks.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 font-bold block uppercase">
                        {h.type || `Angle #${idx + 1}`}
                      </span>
                      <p className="text-xs text-white font-medium mt-0.5">{h.hookText}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(h.hookText, `fb-hook-${idx}`)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex-shrink-0"
                    >
                      {copiedKey === `fb-hook-${idx}` ? 'Copied!' : 'Copy'}
                    </button>
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
