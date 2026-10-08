import React from 'react';
import {
  Film,
  Clock,
  Smartphone,
  Monitor,
  Square,
  Languages,
  Palette,
  Flame,
  Share2,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  ContentType,
  Duration,
  VideoFormat,
  Language,
  ContentStyle,
  Mood,
  Platform,
} from '../types';

interface StudioControlsProps {
  contentType: ContentType;
  onChangeContentType: (type: ContentType) => void;

  duration: Duration;
  customDurationSeconds: number;
  onChangeDuration: (dur: Duration) => void;
  onChangeCustomDurationSeconds: (seconds: number) => void;

  videoFormat: VideoFormat;
  onChangeVideoFormat: (format: VideoFormat) => void;

  language: Language;
  onChangeLanguage: (lang: Language) => void;

  contentStyle: ContentStyle;
  onChangeContentStyle: (style: ContentStyle) => void;

  mood: Mood;
  onChangeMood: (mood: Mood) => void;

  selectedPlatforms: Platform[];
  onTogglePlatform: (platform: Platform) => void;
}

const CONTENT_TYPES: { name: ContentType; badge: string; desc: string }[] = [
  { name: 'YouTube Short', badge: 'Vertical', desc: 'Fast hook, retention curve' },
  { name: 'YouTube Video', badge: 'Widescreen', desc: 'Standard landscape video' },
  { name: 'Instagram Reel', badge: 'Vertical', desc: 'Aesthetic visuals & sound' },
  { name: 'Facebook Reel', badge: 'Vertical', desc: 'Broad social reach' },
  { name: 'Social Post', badge: 'Square / Feed', desc: 'Cross-platform feed video' },
  { name: 'Short / Reel', badge: 'Multi-use', desc: 'Universal short format' },
  { name: 'YouTube Long Video', badge: 'Horizontal', desc: 'In-depth storytelling' },
  { name: 'Facebook Video', badge: 'Horizontal', desc: 'High feed engagement' },
  { name: 'Documentary', badge: 'Cinematic', desc: 'Narrative investigation' },
];

const DURATIONS: Duration[] = [
  '24 sec',
  '32 sec',
  '40 sec',
  '15 sec',
  '30 sec',
  '45 sec',
  '60 sec',
  '90 sec',
  '2 min',
  '5 min',
  '10 min',
  'Custom',
];

const LANGUAGES: { name: Language; localName: string; note: string }[] = [
  { name: 'Hindi', localName: 'हिन्दी', note: 'Default national reach' },
  { name: 'Hinglish', localName: 'Hinglish', note: 'Urban youth conversational' },
  { name: 'English', localName: 'English', note: 'Global & international' },
  { name: 'Gujarati', localName: 'ગુજરાતી', note: 'Regional & entrepreneurial' },
];

const CONTENT_STYLES: { name: ContentStyle; tag: string }[] = [
  { name: 'Informative', tag: 'Clear & factual' },
  { name: 'Documentary', tag: 'Historical / deep dive' },
  { name: 'Cinematic', tag: 'Atmospheric visual flow' },
  { name: 'Technical', tag: 'Specs & mechanics' },
  { name: 'Viral/Curiosity', tag: 'High retention psychological hook' },
  { name: 'News Explainer', tag: 'Journalistic breakdown' },
  { name: 'Investigative', tag: 'Truth uncovering' },
  { name: 'Storytelling', tag: 'Hero journey narrative' },
  { name: 'Suspense', tag: 'Hook-driven mystery' },
  { name: 'Emotional', tag: 'Human empathy & impact' },
  { name: 'Breaking News', tag: 'Urgent broadcast vibe' },
  { name: 'Explainer', tag: 'Step-by-step clarity' },
];

const MOODS: { name: Mood; colorClass: string }[] = [
  { name: 'Serious', colorClass: 'border-blue-500/50 bg-blue-950/30 text-blue-300' },
  { name: 'Suspense', colorClass: 'border-purple-500/50 bg-purple-950/30 text-purple-300' },
  { name: 'Dramatic', colorClass: 'border-amber-500/50 bg-amber-950/30 text-amber-300' },
  { name: 'Curious', colorClass: 'border-teal-500/50 bg-teal-950/30 text-teal-300' },
  { name: 'Urgent', colorClass: 'border-red-500/50 bg-red-950/30 text-red-300' },
  { name: 'Emotional', colorClass: 'border-rose-500/50 bg-rose-950/30 text-rose-300' },
  { name: 'Neutral', colorClass: 'border-slate-700 bg-slate-800/40 text-slate-300' },
  { name: 'Cinematic', colorClass: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' },
  { name: 'Suspenseful', colorClass: 'border-purple-500/50 bg-purple-950/30 text-purple-300' },
  { name: 'Inspirational', colorClass: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' },
  { name: 'Mysterious', colorClass: 'border-indigo-500/50 bg-indigo-950/30 text-indigo-300' },
  { name: 'Shocking', colorClass: 'border-yellow-500/50 bg-yellow-950/30 text-yellow-300' },
];

const PLATFORMS: { name: Platform; iconText: string; color: string }[] = [
  { name: 'YouTube Shorts', iconText: 'YS', color: 'from-red-600 to-red-800' },
  { name: 'YouTube', iconText: 'YT', color: 'from-red-500 to-red-700' },
  { name: 'Instagram', iconText: 'IG', color: 'from-pink-600 to-purple-600' },
  { name: 'Facebook', iconText: 'FB', color: 'from-blue-600 to-blue-800' },
  { name: 'TikTok', iconText: 'TT', color: 'from-cyan-500 to-pink-500' },
  { name: 'Snapchat', iconText: 'SC', color: 'from-yellow-400 to-amber-500' },
  { name: 'X', iconText: 'X', color: 'from-slate-700 to-slate-900' },
  { name: 'Pinterest', iconText: 'PIN', color: 'from-red-700 to-rose-800' },
  { name: 'LinkedIn', iconText: 'IN', color: 'from-blue-700 to-cyan-800' },
];

export const StudioControls: React.FC<StudioControlsProps> = ({
  contentType,
  onChangeContentType,
  duration,
  customDurationSeconds,
  onChangeDuration,
  onChangeCustomDurationSeconds,
  videoFormat,
  onChangeVideoFormat,
  language,
  onChangeLanguage,
  contentStyle,
  onChangeContentStyle,
  mood,
  onChangeMood,
  selectedPlatforms,
  onTogglePlatform,
}) => {
  return (
    <div className="space-y-6">
      {/* 2. CONTENT TYPE */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                2. CONTENT TYPE
              </h2>
              <p className="text-xs text-slate-400">
                Choose the video style and distribution category
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
            Selected: {contentType}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {CONTENT_TYPES.map((item) => {
            const isSelected = contentType === item.name;
            return (
              <button
                key={item.name}
                type="button"
                id={`btn-content-type-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onChangeContentType(item.name)}
                className={`p-3 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500/80 bg-gradient-to-b from-cyan-950/40 to-slate-900 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 text-cyan-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                <div>
                  <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80">
                    {item.badge}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white leading-tight">
                    {item.name}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DURATION */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                3. DURATION & 8-SECOND FLOW SYSTEM
              </h2>
              <p className="text-xs text-slate-400">
                Google Flow 8-second clip architecture (3×8=24s, 4×8=32s, 5×8=40s) with synchronized Hindi voice-over.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40">
            {duration === 'Custom' ? `${customDurationSeconds}s (Custom)` : duration}
          </span>
        </div>

        {/* Highlighted Google Flow 8s Blocks */}
        <div className="mb-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
              GOOGLE FLOW 8S BLOCKS:
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(['24 sec', '32 sec', '40 sec'] as Duration[]).map((dur) => {
              const isSelected = duration === dur;
              const clips = dur === '24 sec' ? '3 Clips' : dur === '32 sec' ? '4 Clips' : '5 Clips';
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={() => onChangeDuration(dur)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 text-cyan-300 border border-cyan-800/60 hover:bg-slate-800'
                  }`}
                >
                  {dur} <span className="opacity-75 font-normal text-[10px]">({clips})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {DURATIONS.map((dur) => {
            const isSelected = duration === dur;
            return (
              <button
                key={dur}
                type="button"
                id={`btn-duration-${dur.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onChangeDuration(dur)}
                className={`py-2.5 px-3 rounded-xl text-center border font-medium text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'border-amber-500/80 bg-amber-950/40 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {dur}
              </button>
            );
          })}
        </div>

        {duration === 'Custom' && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs text-slate-300">Set Custom Duration:</span>
            <input
              type="range"
              min={10}
              max={900}
              step={5}
              value={customDurationSeconds}
              onChange={(e) => onChangeCustomDurationSeconds(Number(e.target.value))}
              className="w-full sm:w-64 accent-amber-400"
            />
            <span className="text-sm font-mono text-amber-300 font-semibold min-w-[70px]">
              {customDurationSeconds} sec ({Math.floor(customDurationSeconds / 60)}m {customDurationSeconds % 60}s)
            </span>
          </div>
        )}
      </section>

      {/* 4. VIDEO FORMAT */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                4. VIDEO FORMAT
              </h2>
              <p className="text-xs text-slate-400">
                Determines image generation ratios and video framing composition
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
            {videoFormat}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 9:16 Portrait Card */}
          <button
            type="button"
            id="btn-format-9-16"
            onClick={() => onChangeVideoFormat('9:16 Portrait')}
            className={`p-5 rounded-2xl text-left border transition-all flex items-center gap-4 relative overflow-hidden ${
              videoFormat === '9:16 Portrait'
                ? 'border-cyan-500/80 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-12 h-16 rounded-lg border-2 border-cyan-400/80 bg-cyan-950/30 flex flex-col items-center justify-center p-1 relative flex-shrink-0">
              <div className="w-3 h-0.5 bg-cyan-400/60 rounded mb-auto"></div>
              <Smartphone className="w-5 h-5 text-cyan-400 my-auto" />
              <div className="w-1.5 h-1.5 rounded-full border border-cyan-400/60 mt-auto"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-white">9:16 Portrait</p>
                {videoFormat === '9:16 Portrait' && (
                  <span className="text-xs font-medium text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Optimized for mobile feeds: Shorts, Reels, TikTok & Snapchat
              </p>
              <span className="mt-2 inline-block text-[11px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                1080 x 1920 px
              </span>
            </div>
          </button>

          {/* 16:9 Horizontal Card */}
          <button
            type="button"
            id="btn-format-16-9"
            onClick={() => onChangeVideoFormat('16:9 Horizontal')}
            className={`p-5 rounded-2xl text-left border transition-all flex items-center gap-4 relative overflow-hidden ${
              videoFormat === '16:9 Horizontal'
                ? 'border-cyan-500/80 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-16 h-12 rounded-lg border-2 border-cyan-400/80 bg-cyan-950/30 flex flex-col items-center justify-center p-1 relative flex-shrink-0">
              <Monitor className="w-6 h-6 text-cyan-400 my-auto" />
              <div className="w-4 h-0.5 bg-cyan-400/60 rounded mt-auto"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-white">16:9 Horizontal</p>
                {videoFormat === '16:9 Horizontal' && (
                  <span className="text-xs font-medium text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Standard widescreen for YouTube Long Video, Facebook, TV & Web
              </p>
              <span className="mt-2 inline-block text-[11px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                1920 x 1080 px
              </span>
            </div>
          </button>

          {/* 1:1 Square Card */}
          <button
            type="button"
            id="btn-format-1-1"
            onClick={() => onChangeVideoFormat('1:1 Square')}
            className={`p-5 rounded-2xl text-left border transition-all flex items-center gap-4 relative overflow-hidden ${
              videoFormat === '1:1 Square'
                ? 'border-cyan-500/80 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-13 h-13 rounded-lg border-2 border-cyan-400/80 bg-cyan-950/30 flex flex-col items-center justify-center p-1 relative flex-shrink-0">
              <Square className="w-6 h-6 text-cyan-400 my-auto" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-white">1:1 Square</p>
                {videoFormat === '1:1 Square' && (
                  <span className="text-xs font-medium text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Square format for Instagram Feed, Facebook Post, LinkedIn & Carousel
              </p>
              <span className="mt-2 inline-block text-[11px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                1080 x 1080 px
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 5. LANGUAGE */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                5. LANGUAGE
              </h2>
              <p className="text-xs text-slate-400">
                Default Hindi. GODSEYE AI adapts tone, colloquial idioms and voiceover phonetics
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/40">
            {language}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.name;
            return (
              <button
                key={lang.name}
                type="button"
                id={`btn-lang-${lang.name.toLowerCase()}`}
                onClick={() => onChangeLanguage(lang.name)}
                className={`p-3.5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-950/40 shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-bold text-white">{lang.name}</p>
                  <span className="text-xs text-slate-400">({lang.localName})</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{lang.note}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. CONTENT STYLE */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                6. CONTENT STYLE
              </h2>
              <p className="text-xs text-slate-400">
                Shapes storytelling structure, visual rhythm, and vocabulary depth
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-800/40">
            {contentStyle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CONTENT_STYLES.map((style) => {
            const isSelected = contentStyle === style.name;
            return (
              <button
                key={style.name}
                type="button"
                id={`btn-style-${style.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onChangeContentStyle(style.name)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-pink-500/80 bg-pink-950/40 shadow-md shadow-pink-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <p className="text-xs sm:text-sm font-semibold text-white">{style.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{style.tag}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. MOOD */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                7. MOOD
              </h2>
              <p className="text-xs text-slate-400">
                Controls emotional tension, background score cues, and sound effects
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-800/40">
            {mood}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {MOODS.map((m) => {
            const isSelected = mood === m.name;
            return (
              <button
                key={m.name}
                type="button"
                id={`btn-mood-${m.name.toLowerCase()}`}
                onClick={() => onChangeMood(m.name)}
                className={`py-2 px-2.5 rounded-xl text-center border text-xs font-medium transition-all ${
                  isSelected
                    ? `${m.colorClass} ring-1 ring-white/20 font-bold scale-[1.02]`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 8. PLATFORM */}
      <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                8. PLATFORM
              </h2>
              <p className="text-xs text-slate-400">
                Select target platforms for automated SEO tags, descriptions & hashtag bundles
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
            {(selectedPlatforms || []).length} Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {PLATFORMS.map((plat) => {
            const isSelected = Boolean(selectedPlatforms && selectedPlatforms.includes(plat.name));
            return (
              <button
                key={plat.name}
                type="button"
                id={`btn-platform-${plat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onTogglePlatform(plat.name)}
                className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-cyan-500/80 bg-slate-900/90 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plat.color} flex items-center justify-center text-[10px] font-bold text-white shadow`}
                  >
                    {plat.iconText}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">{plat.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {isSelected ? 'Optimizing tags' : 'Click to include'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
