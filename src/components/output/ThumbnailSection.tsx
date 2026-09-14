import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Copy,
  Check,
  Sparkles,
  Layers,
  Tv,
  Share2,
  ShieldCheck,
  Eye,
  Camera,
  Maximize2,
  Palette,
  Lightbulb,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { ThumbnailPackage, ThumbnailConcept, PlatformThumbnail, BestThumbnail } from '../../types';
import { GODSEYE_API } from '../../services/apiClient';

interface ThumbnailSectionProps {
  thumbnails?: ThumbnailPackage;
  storyTitle?: string;
  onCopyText: (text: string, label: string) => void;
  onRegenerateThumbnail?: () => void;
  isLoading?: boolean;
}

export const ThumbnailSection: React.FC<ThumbnailSectionProps> = ({
  thumbnails,
  storyTitle,
  onCopyText,
  onRegenerateThumbnail,
  isLoading,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, { imageUrl: string; model: string; timestamp: number }>>({});
  const [generationErrors, setGenerationErrors] = useState<Record<string, string>>({});
  const [targetAspect, setTargetAspect] = useState<'16:9' | '9:16'>('16:9');
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateAiImage = async (prompt: string, key: string, conceptName: string) => {
    setGeneratingKey(key);
    setGenerationErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    try {
      const data = await GODSEYE_API.generateThumbnailImage({
        prompt,
        aspectRatio: targetAspect,
        isVertical: targetAspect === '9:16',
        conceptName,
      });

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || data.details || 'Image generation failed');
      }

      setGeneratedImages((prev) => ({
        ...prev,
        [key]: {
          imageUrl: data.imageUrl,
          model: data.model || 'gemini-3.1-flash-image',
          timestamp: Date.now(),
        },
      }));
    } catch (err: any) {
      console.error('[GODSEYE] Thumbnail generation error:', err);
      setGenerationErrors((prev) => ({
        ...prev,
        [key]: err.message || 'Image generation currently unavailable with current project API quota.',
      }));
    } finally {
      setGeneratingKey(null);
    }
  };

  if (!thumbnails || !thumbnails.concepts || thumbnails.concepts.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm">No thumbnail concepts available. Generate content to view thumbnail strategies.</p>
      </div>
    );
  }

  const { concepts, bestThumbnail, youtube, facebook } = thumbnails;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner with Ethics & Styling Guidelines */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-wide font-heading">
              THUMBNAIL ENGINE — 3 VISUAL CONCEPTS & GEMINI IMAGE STUDIO
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Cinematic, high-contrast, curiosity-driven thumbnail compositions grounded strictly in the real story.
            Directly generate preview thumbnail images with Gemini AI or export prompts for production.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTargetAspect('16:9')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                targetAspect === '16:9' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9 Landscape
            </button>
            <button
              type="button"
              onClick={() => setTargetAspect('9:16')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                targetAspect === '9:16' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              9:16 Vertical
            </button>
          </div>

          {onRegenerateThumbnail && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onRegenerateThumbnail}
              className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regen Strategy</span>
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            Truthful Story Focus
          </span>
        </div>
      </div>

      {/* RECOMMENDED BEST THUMBNAIL (Step 5 Upgrade) */}
      {bestThumbnail && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border-2 border-amber-500/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                ★ RECOMMENDED BEST THUMBNAIL
              </span>
              <span className="text-xs font-bold text-white">{bestThumbnail.conceptName}</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/50 self-start sm:self-auto">
              Mobile Readability: {bestThumbnail.mobileReadability}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
                    High-CTR Overlay Text
                  </span>
                  <span className="text-base sm:text-lg font-black text-white tracking-wide">
                    "{bestThumbnail.headlineText}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(bestThumbnail.headlineText, 'best-headline', 'Best Thumbnail Text')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block">Focal Subject:</span>
                <p className="text-slate-200">{bestThumbnail.focalSubject}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block">Why It Wins (Rationale):</span>
                <p className="text-slate-200 leading-relaxed">{bestThumbnail.selectionRationale}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  AI Image Generator Prompt (Gemini / Midjourney / Flow)
                </span>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed line-clamp-4">
                  {bestThumbnail.imagePrompt}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(bestThumbnail.imagePrompt, 'best-prompt', 'Best Thumbnail Image Prompt')}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </button>

                  <button
                    type="button"
                    disabled={generatingKey === 'best'}
                    onClick={() => handleGenerateAiImage(bestThumbnail.imagePrompt, 'best', bestThumbnail.conceptName)}
                    className="py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {generatingKey === 'best' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate AI Image</span>
                      </>
                    )}
                  </button>
                </div>

                {generationErrors['best'] && (
                  <div className="p-2 rounded bg-rose-950/50 border border-rose-800/60 text-[11px] text-rose-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{generationErrors['best']}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated Best Thumbnail Image Display */}
          {generatedImages['best'] && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini Generated Thumbnail ({targetAspect}) • Model: {generatedImages['best'].model}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={generatedImages['best'].imageUrl}
                    download={`godseye-thumbnail-best-${Date.now()}.png`}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImg({ url: generatedImages['best'].imageUrl, title: bestThumbnail.conceptName })}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Fullscreen</span>
                  </button>
                </div>
              </div>
              <div className={`overflow-hidden rounded-xl border border-slate-800 bg-black flex items-center justify-center max-h-[380px]`}>
                <img
                  src={generatedImages['best'].imageUrl}
                  alt={bestThumbnail.conceptName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain cursor-pointer hover:scale-[1.01] transition-transform"
                  onClick={() => setPreviewModalImg({ url: generatedImages['best'].imageUrl, title: bestThumbnail.conceptName })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3 Main Thumbnail Concepts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            3 Core Thumbnail Concepts & Gemini Generators
          </h4>
          <span className="text-xs text-slate-400">Aspect: {targetAspect}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {concepts.map((item: ThumbnailConcept, idx: number) => {
            const copyKey = `concept-${idx}`;
            const isCopied = copiedIndex === copyKey;
            const imgKey = `concept-${idx}`;
            const generatedImg = generatedImages[imgKey];
            const isGenerating = generatingKey === imgKey;
            const genError = generationErrors[imgKey];

            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between relative group shadow-lg"
              >
                {/* Concept header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      Concept #{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
                      {item.emotion || 'Intense Curiosity'}
                    </span>
                  </div>

                  <h5 className="text-base font-bold text-white mb-2 leading-snug font-heading">
                    {item.concept}
                  </h5>

                  {/* Suggested Thumbnail Text / Headline Badge */}
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                        Suggested Thumbnail Text (2–4 Words)
                      </span>
                      <span className="text-sm font-black text-white tracking-wide">
                        "{item.headline}"
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.headline, `headline-${idx}`, `Concept ${idx + 1} Headline`)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy headline text"
                    >
                      {copiedIndex === `headline-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Narrative details */}
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-400 block">Main Subject:</span>
                      <p className="text-slate-200 mt-0.5">{item.subject}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 block">Atmospheric Background:</span>
                      <p className="text-slate-300 mt-0.5">{item.background}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 block">Visual Story / Narrative:</span>
                      <p className="text-slate-300 mt-0.5">{item.visualStory}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 block">Curiosity Trigger:</span>
                      <p className="text-amber-200/90 mt-0.5">{item.curiosityElement}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        Composition & Safe Area:
                      </span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{item.composition}</p>
                    </div>
                  </div>
                </div>

                {/* Generated Image Preview if Present */}
                {generatedImg && (
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-2">
                    <div className="overflow-hidden rounded-lg bg-black aspect-video flex items-center justify-center">
                      <img
                        src={generatedImg.imageUrl}
                        alt={item.concept}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setPreviewModalImg({ url: generatedImg.imageUrl, title: item.concept })}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Model: {generatedImg.model}</span>
                      <a
                        href={generatedImg.imageUrl}
                        download={`concept-${idx + 1}-${Date.now()}.png`}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* AI Image Generation Prompt Box & Action Bar */}
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Image Generator Prompt
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.imagePrompt, copyKey, `Concept ${idx + 1} Prompt`)}
                      className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
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
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto selection:bg-cyan-500/40">
                    {item.imagePrompt}
                  </div>

                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleGenerateAiImage(item.imagePrompt, imgKey, item.concept)}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Image...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate with Gemini</span>
                      </>
                    )}
                  </button>

                  {genError && (
                    <p className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-800/50">
                      {genError}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform-Specific Recommendations: YouTube & Facebook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* YouTube Primary Recommendation */}
        {youtube && (
          <div className="rounded-2xl bg-gradient-to-br from-[#121624] to-[#0a0e18] border border-rose-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center">
                  <Tv className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Primary YouTube Thumbnail Strategy
                  </h4>
                  <span className="text-[11px] text-rose-300 font-medium">
                    Optimized for high CTR in YouTube browse & suggested video feeds
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Best Concept
                </span>
                <p className="text-white font-medium mt-0.5">{youtube.concept}</p>
              </div>

              {/* YouTube Headline Banner */}
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-300 block">
                    Recommended YouTube Text Overlay
                  </span>
                  <span className="text-sm font-black text-white">"{youtube.headline}"</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(youtube.headline, 'yt-head', 'YouTube Headline')}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy YouTube headline"
                >
                  {copiedIndex === 'yt-head' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Composition & Safe Zone Instructions
                </span>
                <p className="text-slate-300 mt-1 leading-relaxed">{youtube.composition}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    YouTube Thumbnail AI Image Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(youtube.imagePrompt, 'yt-prompt', 'YouTube Image Prompt')}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedIndex === 'yt-prompt' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                  {youtube.imagePrompt}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Facebook Social Feed Recommendation */}
        {facebook && (
          <div className="rounded-2xl bg-gradient-to-br from-[#101726] to-[#0a0e18] border border-blue-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-600/50 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Facebook Feed Thumbnail Strategy
                  </h4>
                  <span className="text-[11px] text-blue-300 font-medium">
                    Optimized for rapid mobile feed scrolling & instant recognition
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Best Concept
                </span>
                <p className="text-white font-medium mt-0.5">{facebook.concept}</p>
              </div>

              {/* Facebook Headline Banner */}
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-300 block">
                    Recommended Facebook Text Overlay
                  </span>
                  <span className="text-sm font-black text-white">"{facebook.headline}"</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(facebook.headline, 'fb-head', 'Facebook Headline')}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Facebook headline"
                >
                  {copiedIndex === 'fb-head' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Feed Composition & Contrast Guidelines
                </span>
                <p className="text-slate-300 mt-1 leading-relaxed">{facebook.composition}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Facebook Thumbnail AI Image Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(facebook.imagePrompt, 'fb-prompt', 'Facebook Image Prompt')}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedIndex === 'fb-prompt' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                  {facebook.imagePrompt}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Preview Lightbox Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white font-heading">
                {previewModalImg.title} — Gemini Generated Thumbnail
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewModalImg.url}
                  download={`godseye-thumbnail-${Date.now()}.png`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalImg(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
