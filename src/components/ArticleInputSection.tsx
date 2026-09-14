import React from 'react';
import { FileText, Link, Type, Sparkles, Trash2, BookOpen } from 'lucide-react';
import { SAMPLE_STORIES, SampleStory } from '../data/sampleStories';

interface ArticleInputSectionProps {
  title: string;
  sourceUrl: string;
  storyContent: string;
  onChangeTitle: (value: string) => void;
  onChangeUrl: (value: string) => void;
  onChangeStory: (value: string) => void;
  onApplySample: (sample: SampleStory) => void;
  onClear: () => void;
}

export const ArticleInputSection: React.FC<ArticleInputSectionProps> = ({
  title,
  sourceUrl,
  storyContent,
  onChangeTitle,
  onChangeUrl,
  onChangeStory,
  onApplySample,
  onClear,
}) => {
  const wordCount = storyContent.trim() ? storyContent.trim().split(/\s+/).length : 0;
  const charCount = storyContent.length;
  // Estimated reading speed ~ 130 words per minute for video voiceover
  const estVoiceoverSeconds = Math.ceil((wordCount / 130) * 60);

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl shadow-black/40 relative overflow-hidden">
      {/* Subtle futuristic top line accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              1. ARTICLE / STORY
              <span className="text-xs font-normal text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Source Material
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Provide the raw story or report. GODSEYE AI will transform it into viral video assets.
            </p>
          </div>
        </div>

        {/* Quick sample pills for beginners */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Try sample:
          </span>
          {SAMPLE_STORIES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              id={`btn-sample-${sample.id}`}
              onClick={() => onApplySample(sample)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
              title={`Load "${sample.title}"`}
            >
              {sample.badge}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Title & URL inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="article-title-input"
              className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              Article Title
            </label>
            <input
              id="article-title-input"
              type="text"
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="e.g., Breakthrough Discovery in Deep Space or Headline"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="article-url-input"
              className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Link className="w-3.5 h-3.5 text-slate-400" />
              Optional Article URL
              <span className="text-[11px] text-slate-500 font-normal">(Optional reference)</span>
            </label>
            <input
              id="article-url-input"
              type="url"
              value={sourceUrl}
              onChange={(e) => onChangeUrl(e.target.value)}
              placeholder="https://example.com/news/breakthrough-story"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Main Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="story-textarea"
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Story / Report Content
            </label>
            {storyContent && (
              <button
                type="button"
                id="btn-clear-story"
                onClick={onClear}
                className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear text
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              id="story-textarea"
              rows={7}
              value={storyContent}
              onChange={(e) => onChangeStory(e.target.value)}
              placeholder="Paste your article, story, report or information here..."
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none resize-y leading-relaxed font-sans"
            />
          </div>

          {/* Stats Bar */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
            <div className="flex items-center gap-3">
              <span>
                <strong className="text-slate-200">{wordCount}</strong> words
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-slate-200">{charCount}</strong> characters
              </span>
              {wordCount > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400/90">
                    ~{estVoiceoverSeconds}s spoken read
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              Clean text, articles, scripts, or bullet points are supported
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
