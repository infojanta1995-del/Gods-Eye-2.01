import React, { useState } from 'react';
import {
  Youtube,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ListOrdered,
  Tag,
  Clock,
  ExternalLink,
  Send,
  Calendar,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface YouTubeViewProps {
  activeProject: GodseyeProject | null;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const YouTubeView: React.FC<YouTubeViewProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [targetChannel, setTargetChannel] = useState('Primary Creator Channel (@godseye)');
  const [privacySetting, setPrivacySetting] = useState<'public' | 'unlisted' | 'scheduled'>('public');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);

  const result = activeProject?.result;
  const titles = result?.titles || [];
  const chapters = result?.chapters || [];
  const hashtags = result?.seo?.hashtags || [];
  const description = result?.seo?.description || '';
  const selectedTitle = titles[0] || activeProject?.name || 'Untitled Video';

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
        platform: 'youtube',
        targetAccount: targetChannel,
        scheduleTime: privacySetting === 'scheduled' ? scheduleDate || new Date(Date.now() + 86400000).toISOString() : undefined,
        packageData: {
          title: selectedTitle,
          description: description,
          tags: result?.seo?.tags || [],
          privacy: privacySetting,
          thumbnailPrompt: result?.thumbnail?.prompt,
        },
      });

      setPublishResult(res);
    } catch (err: any) {
      setPublishResult({
        success: false,
        error: err.message || 'Publishing request failed',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-[#260a0a] via-[#170707] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/50 text-xs font-semibold text-red-300 mb-2">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YOUTUBE PUBLISHING SUITE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">SHORTS & LONG-FORM DISPATCH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              YouTube Algorithm Calibration & Direct Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review calibrated metadata, video chapters, title formulas, and dispatch directly to your connected YouTube channel.
            </p>
          </div>

          {!result && (
            <button
              type="button"
              onClick={() => onNavigate('Create')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-red-600/30"
            >
              <span>Go to Content Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <Youtube className="w-12 h-12 text-red-500/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active YouTube package loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Synthesize content in the Creator Studio or load an existing project to inspect YouTube titles, tags, and chapter markers.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Creator Studio</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Publishing Dispatch Console */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">YouTube Release Preparation & Dispatch</h3>
                  <p className="text-xs text-slate-400">Configure privacy, channel, and release schedule</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  API Authenticated
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Destination Channel</label>
                <select
                  value={targetChannel}
                  onChange={(e) => setTargetChannel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option>Primary Creator Channel (@godseye)</option>
                  <option>Second Shorts Channel (@godseye_shorts)</option>
                  <option>Test Staging Channel</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Visibility / Privacy</label>
                <select
                  value={privacySetting}
                  onChange={(e) => setPrivacySetting(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="public">Public (Immediate Launch)</option>
                  <option value="unlisted">Unlisted (Review & Share Link)</option>
                  <option value="scheduled">Scheduled (Timed Premiere)</option>
                </select>
              </div>

              {privacySetting === 'scheduled' ? (
                <div>
                  <label className="text-slate-400 font-medium block mb-1.5">Premiere Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleDispatchPublish}
                    disabled={isPublishing}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Dispatching to YouTube...</span>
                      </>
                    ) : (
                      <>
                        <Youtube className="w-4 h-4" />
                        <span>Publish Package to YouTube</span>
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
                  className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Schedule YouTube Premiere</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Live Publish Result Alert */}
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
                    <span>{publishResult.message || 'Dispatch completed successfully.'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    Job ID: {publishResult.jobId?.slice(0, 10) || 'YT-DISPATCH-OK'}
                  </span>
                </div>

                {publishResult.publishedUrl && (
                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="text-slate-400">Live URL:</span>
                    <a
                      href={publishResult.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:text-red-300 underline flex items-center gap-1"
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
            {/* Left Col: Titles & Chapters */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Selected YouTube Titles</span>
                </h3>
                <div className="space-y-2">
                  {titles.slice(0, 4).map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-red-500/40 transition-colors"
                    >
                      <span className="text-xs text-white font-medium">{t}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(t, `yt-title-${idx}`)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer flex-shrink-0"
                      >
                        {copiedKey === `yt-title-${idx}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapters */}
              {chapters.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-red-400" />
                      <span>Video Chapters & Timestamps</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          chapters.map((c) => `${c.timestamp} - ${c.title}`).join('\n'),
                          'yt-chapters'
                        )
                      }
                      className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      {copiedKey === 'yt-chapters' ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {chapters.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3 text-slate-300"
                      >
                        <span className="text-red-400 font-bold">{c.timestamp}</span>
                        <span>{c.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Description & Tags */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">YouTube Description & Hashtags</h3>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${description}\n\n${hashtags.join(' ')}`, 'yt-desc')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'yt-desc' ? 'Copied All!' : 'Copy Description'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-3">
                  <p className="leading-relaxed whitespace-pre-wrap">{description}</p>
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 font-mono text-[11px] text-red-400">
                    {hashtags.map((tag, idx) => (
                      <span key={idx}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
