import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Zap,
  Layout,
  Smartphone,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Maximize2,
  Download,
  AlertCircle,
  RotateCcw,
  Eye,
  Camera,
  Layers,
  Palette,
  Film,
  X,
  Radio,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  GodseyeProject,
  GodseyeAiResult,
  ThumbnailConcept,
  ThumbnailTextOptions,
  ThumbnailStudioRecord,
  ThumbnailStudioVariant,
} from '../../types';
import { GODSEYE_API } from '../../services/apiClient';
import { saveProject, getAllProjects } from '../../services/projectStorage';

interface ThumbnailStudioViewProps {
  activeProject?: GodseyeProject;
  onNavigate?: (tab: string) => void;
  onUpdateAiResult?: (updated: GodseyeAiResult) => void;
}

export const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({
  activeProject,
  onNavigate,
  onUpdateAiResult,
}) => {
  // 1. Story Ingestion from Active Project State
  const storyTitle = activeProject?.article?.title || activeProject?.name || '';
  const storyContent = activeProject?.article?.content || '';
  const storyAnalysis = activeProject?.result?.analysis?.summary || activeProject?.result?.analysis?.keyTakeaway || '';
  const storyAngle = activeProject?.result?.storyAngle?.angle || activeProject?.result?.storyAngle?.title || '';
  const viralHook = activeProject?.result?.hooks?.bestHook || activeProject?.result?.hooks?.hooks?.[0]?.text || '';
  const scriptText = activeProject?.result?.polishedScript || activeProject?.result?.script?.text || '';
  const entities = activeProject?.result?.analysis?.entities || [];
  const projectPlatform = activeProject?.settings?.platforms?.[0] || 'YouTube';
  const projectLanguage = activeProject?.settings?.language || 'English';
  const defaultFormat = activeProject?.settings?.videoFormat || '16:9 Horizontal';

  // 2. Format Handling State (9:16 Portrait, 16:9 Horizontal, 1:1 Square)
  const [selectedFormat, setSelectedFormat] = useState<string>(defaultFormat);
  const [stylePreset, setStylePreset] = useState<string>('cinematic');
  const [includeBranding, setIncludeBranding] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>('');

  // 3. Concept & Visual Blueprint State
  const [activeConcept, setActiveConcept] = useState<ThumbnailConcept | null>(null);
  const [textOptions, setTextOptions] = useState<ThumbnailTextOptions>({
    option1: 'THE HIDDEN TRUTH',
    option2: 'WHAT THEY CONCEALED',
    option3: 'DISCOVERY OF THE CENTURY',
  });
  const [selectedTextOption, setSelectedTextOption] = useState<'option1' | 'option2' | 'option3' | 'custom'>('option1');
  const [customText, setCustomText] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');

  // 4. Image Generation & Display State
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingConcept, setIsGeneratingConcept] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [imageGenerationError, setImageGenerationError] = useState<{
    message: string;
    details?: string;
    requiresConfiguration?: string;
  } | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [generatedAt, setGeneratedAt] = useState<string>('');
  const [showOverlayPreview, setShowOverlayPreview] = useState<boolean>(true);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);

  // 5. Variants & History State
  const [variants, setVariants] = useState<ThumbnailStudioVariant[]>([]);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedVariantType, setSelectedVariantType] = useState<'composition' | 'camera' | 'lighting' | 'background' | 'focal'>('composition');

  // UI status states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Initialize from project storage on load
  useEffect(() => {
    // Check if project has an existing thumbnailStudioRecord
    const existingRecord: ThumbnailStudioRecord | undefined =
      activeProject?.result?.thumbnailStudioRecord ||
      activeProject?.result?.thumbnails?.studioRecord;

    if (existingRecord && existingRecord.activeConcept) {
      setActiveConcept(existingRecord.activeConcept);
      setTextOptions(existingRecord.textOptions || {
        option1: existingRecord.activeConcept.headline || 'UNSOLVED MYSTERY',
        option2: 'THE SECRET EXPOSED',
        option3: 'NO ONE EXPECTED THIS',
      });
      setSelectedTextOption('option1');
      setImagePrompt(existingRecord.imagePrompt || existingRecord.activeConcept.imagePrompt || '');
      setSelectedFormat(existingRecord.videoFormat || defaultFormat);
      if (existingRecord.generatedImageUrl) {
        setGeneratedImageUrl(existingRecord.generatedImageUrl);
        setModelUsed(existingRecord.modelUsed || 'Gemini');
        setGeneratedAt(existingRecord.generatedAt || '');
      }
      if (existingRecord.variants && existingRecord.variants.length > 0) {
        setVariants(existingRecord.variants);
      }
      return;
    }

    // Otherwise fallback to existing result.thumbnails.concepts or bestThumbnail
    const existingThumbs = activeProject?.result?.thumbnails;
    if (existingThumbs?.bestThumbnail) {
      const best = existingThumbs.bestThumbnail;
      const initialConcept: ThumbnailConcept = {
        concept: best.conceptName || 'High-Impact Curiosity Blueprint',
        subject: best.focalSubject || 'Focal human subject with intense emotion',
        background: 'Atmospheric cinematic environment with high contrast',
        visualStory: 'A crucial moment in the story captured in dramatic freeze-frame',
        emotion: 'Awe & Revelation',
        curiosityElement: best.selectionRationale || 'Unexplained visual riddle',
        composition: 'Subject positioned for maximum mobile retention',
        headline: best.headlineText || 'THE SECRET EXPOSED',
        imagePrompt: best.imagePrompt || '',
      };
      setActiveConcept(initialConcept);
      setImagePrompt(best.imagePrompt || '');
      setTextOptions({
        option1: best.headlineText || 'THE SECRET EXPOSED',
        option2: 'WHAT THEY HID',
        option3: 'REAL EVIDENCE FOUND',
      });
    } else if (existingThumbs?.concepts && existingThumbs.concepts.length > 0) {
      const first = existingThumbs.concepts[0];
      setActiveConcept(first);
      setImagePrompt(first.imagePrompt || '');
      setTextOptions({
        option1: first.headline || 'NOT WHAT IT SEEMS',
        option2: 'THE REAL STORY',
        option3: 'WATCH BEFORE REMOVED',
      });
    }
  }, [activeProject?.id]);

  // Compute active overlay text
  const activeHeadline =
    selectedTextOption === 'custom'
      ? customText || 'HIGH IMPACT THUMBNAIL'
      : textOptions[selectedTextOption] || activeConcept?.headline || 'HIGH IMPACT THUMBNAIL';

  // Format Helper: format prompt header and aspect ratio
  const getFormatSpecs = (fmt: string) => {
    if (fmt.includes('9:16') || fmt.toLowerCase().includes('portrait') || fmt.toLowerCase().includes('vertical')) {
      return {
        aspectRatio: '9:16' as const,
        resolution: '1080 x 1920',
        composition: 'VERTICAL MOBILE-FIRST COMPOSITION',
        header: 'FORMAT: 9:16 PORTRAIT\nASPECT RATIO: 9:16\nRESOLUTION: 1080 x 1920\nVERTICAL MOBILE-FIRST COMPOSITION',
      };
    }
    if (fmt.includes('1:1') || fmt.toLowerCase().includes('square')) {
      return {
        aspectRatio: '1:1' as const,
        resolution: '1080 x 1080',
        composition: 'SQUARE COMPOSITION',
        header: 'FORMAT: 1:1 SQUARE\nASPECT RATIO: 1:1\nRESOLUTION: 1080 x 1080\nSQUARE COMPOSITION',
      };
    }
    return {
      aspectRatio: '16:9' as const,
      resolution: '1920 x 1080',
      composition: 'HORIZONTAL WIDESCREEN COMPOSITION',
      header: 'FORMAT: 16:9 HORIZONTAL\nASPECT RATIO: 16:9\nRESOLUTION: 1920 x 1080\nHORIZONTAL WIDESCREEN COMPOSITION',
    };
  };

  // Format switch handler
  const handleFormatChange = (newFormat: string) => {
    setSelectedFormat(newFormat);
    const specs = getFormatSpecs(newFormat);

    // If prompt exists, update prompt header to enforce hard format constraint
    if (imagePrompt) {
      const promptBody = imagePrompt
        .replace(/FORMAT:[^\n]*\n?/gi, '')
        .replace(/ASPECT RATIO:[^\n]*\n?/gi, '')
        .replace(/RESOLUTION:[^\n]*\n?/gi, '')
        .replace(/VERTICAL MOBILE-FIRST COMPOSITION\n?/gi, '')
        .replace(/HORIZONTAL WIDESCREEN COMPOSITION\n?/gi, '')
        .replace(/SQUARE COMPOSITION\n?/gi, '')
        .replace(/--ar\s+[0-9:]+/gi, '')
        .trim();

      const updatedPrompt = `${specs.header}\n${promptBody}`;
      setImagePrompt(updatedPrompt);
      if (activeConcept) {
        setActiveConcept({
          ...activeConcept,
          format: newFormat,
          aspectRatio: specs.aspectRatio,
          resolution: specs.resolution,
          imagePrompt: updatedPrompt,
        });
      }
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. GENERATE THUMBNAIL CONCEPT & PROMPT ENGINE
  const handleGenerateThumbnail = async () => {
    setIsGeneratingConcept(true);
    setGenerationStep('Ingesting story angles and analyzing focal subject...');
    setImageGenerationError(null);

    const topic = customTopic.trim() || storyTitle || activeProject?.name || 'High Stakes Discovery';

    try {
      const res = await GODSEYE_API.generateCustomThumbnail({
        topic,
        storyContent,
        storyAnalysis,
        storyAngle,
        viralHook,
        scriptText,
        keyEntities: entities,
        platform: projectPlatform,
        language: projectLanguage,
        videoFormat: selectedFormat,
        style: stylePreset,
        includeBranding,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to generate visual blueprint');
      }

      const data = res.data;
      const specs = getFormatSpecs(selectedFormat);

      // Extract 3 text options
      const opt1 = data.textOptions?.option1 || data.mainText || data.headline || 'NOT WHAT IT SEEMS';
      const opt2 = data.textOptions?.option2 || 'THE SECRET EXPOSED';
      const opt3 = data.textOptions?.option3 || 'PROOF DISCOVERED';

      const newTextOptions: ThumbnailTextOptions = {
        option1: opt1,
        option2: opt2,
        option3: opt3,
      };

      const conceptObj: ThumbnailConcept = {
        concept: data.concept || 'High-CTR Visual Narrative',
        subject: data.subject || 'Focal protagonist in intense revelation',
        background: data.background || 'Deep atmospheric cinematic environment',
        visualStory: data.visualStory || 'A single pivotal frame revealing the truth',
        emotion: data.emotionalImpact || 'Urgent curiosity and shock',
        curiosityElement: data.curiosityTrigger || 'An unexplained focal clue',
        curiosityTrigger: data.curiosityTrigger,
        emotionalImpact: data.emotionalImpact,
        composition: data.composition || specs.composition,
        lighting: data.lighting || 'Cinematic chiaroscuro with amber rim light',
        camera: data.camera || '35mm anamorphic lens, shallow depth of field',
        headline: opt1,
        textOptions: newTextOptions,
        selectedText: opt1,
        textPlacement: data.textPlacement || 'Upper third negative space reserved for title overlay',
        negativeInstructions: data.negativeInstructions || 'no generic AI look, no watermarks, no distorted faces',
        format: selectedFormat,
        aspectRatio: specs.aspectRatio,
        resolution: specs.resolution,
        imagePrompt: data.imagePrompt,
      };

      setActiveConcept(conceptObj);
      setTextOptions(newTextOptions);
      setSelectedTextOption('option1');
      setImagePrompt(data.imagePrompt);

      // Auto-save blueprint to project
      persistToProject(conceptObj, newTextOptions, opt1, data.imagePrompt, generatedImageUrl);
    } catch (err: any) {
      console.error('Thumbnail concept error:', err);
      setImageGenerationError({
        message: 'Could not generate thumbnail concept.',
        details: err?.message || 'Server error',
      });
    } finally {
      setIsGeneratingConcept(false);
      setGenerationStep('');
    }
  };

  // 2. CREATE CREATIVE VARIANT
  const handleCreateVariant = async () => {
    if (!activeConcept) {
      await handleGenerateThumbnail();
      return;
    }

    setIsGeneratingConcept(true);
    setGenerationStep(`Synthesizing creative ${selectedVariantType} variant...`);
    setImageGenerationError(null);

    const topic = customTopic.trim() || storyTitle || activeProject?.name || 'High Stakes Discovery';

    try {
      const res = await GODSEYE_API.generateCustomThumbnail({
        topic,
        storyContent,
        storyAnalysis,
        storyAngle,
        viralHook,
        scriptText,
        keyEntities: entities,
        platform: projectPlatform,
        language: projectLanguage,
        videoFormat: selectedFormat,
        style: stylePreset,
        includeBranding,
        isVariant: true,
        variantType: selectedVariantType,
        previousConcept: activeConcept,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to create variant');
      }

      const data = res.data;
      const specs = getFormatSpecs(selectedFormat);

      const variantConcept: ThumbnailConcept = {
        concept: data.concept || `${selectedVariantType.toUpperCase()} Visual Variant`,
        subject: data.subject || activeConcept.subject,
        background: data.background || activeConcept.background,
        visualStory: data.visualStory || activeConcept.visualStory,
        emotion: data.emotionalImpact || activeConcept.emotion,
        curiosityElement: data.curiosityTrigger || activeConcept.curiosityElement,
        composition: data.composition || specs.composition,
        lighting: data.lighting || activeConcept.lighting,
        camera: data.camera || activeConcept.camera,
        headline: data.textOptions?.option1 || activeConcept.headline,
        textOptions: data.textOptions || textOptions,
        selectedText: data.textOptions?.option1 || activeConcept.headline,
        negativeInstructions: data.negativeInstructions || activeConcept.negativeInstructions,
        format: selectedFormat,
        aspectRatio: specs.aspectRatio,
        resolution: specs.resolution,
        imagePrompt: data.imagePrompt,
      };

      const newVariant: ThumbnailStudioVariant = {
        id: `var-${Date.now()}`,
        name: `Variant (${selectedVariantType.toUpperCase()})`,
        type: selectedVariantType,
        concept: variantConcept,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedVariants = [newVariant, ...variants];
      setVariants(updatedVariants);
      setActiveVariantId(newVariant.id);
      setActiveConcept(variantConcept);
      setImagePrompt(data.imagePrompt);
      if (data.textOptions) {
        setTextOptions(data.textOptions);
        setSelectedTextOption('option1');
      }

      // Automatically reset generated image for the new variant
      setGeneratedImageUrl(null);

      // Persist to project
      persistToProject(
        variantConcept,
        data.textOptions || textOptions,
        data.textOptions?.option1 || activeConcept.headline,
        data.imagePrompt,
        null,
        updatedVariants
      );
    } catch (err: any) {
      console.error('Variant generation error:', err);
      setImageGenerationError({
        message: 'Could not create visual variant.',
        details: err?.message || 'Server error',
      });
    } finally {
      setIsGeneratingConcept(false);
      setGenerationStep('');
    }
  };

  // 3. REAL GEMINI IMAGE GENERATION WORKFLOW
  const handleGenerateAiImage = async () => {
    if (!imagePrompt) {
      await handleGenerateThumbnail();
      return;
    }

    setIsGeneratingImage(true);
    setImageGenerationError(null);
    setGenerationStep('Sending prompt to Gemini image generation model with format constraints...');

    const specs = getFormatSpecs(selectedFormat);

    try {
      const res = await GODSEYE_API.generateThumbnailImage({
        prompt: imagePrompt,
        aspectRatio: specs.aspectRatio,
        format: selectedFormat,
        isVertical: specs.aspectRatio === '9:16',
        conceptName: activeConcept?.concept || storyTitle,
      });

      if (!res.success || !res.imageUrl) {
        // Honest error reporting
        setImageGenerationError({
          message: res.error || 'Gemini Image Generation currently unavailable.',
          details: res.details,
          requiresConfiguration: res.requiresConfiguration,
        });
        return;
      }

      const timeStr = new Date().toLocaleTimeString();
      setGeneratedImageUrl(res.imageUrl);
      setModelUsed(res.model || 'gemini-3.1-flash-lite-image');
      setGeneratedAt(timeStr);

      // If active variant, attach image to variant
      let updatedVariants = variants;
      if (activeVariantId) {
        updatedVariants = variants.map((v) =>
          v.id === activeVariantId ? { ...v, imageUrl: res.imageUrl, model: res.model } : v
        );
        setVariants(updatedVariants);
      }

      // Persist to project
      persistToProject(
        activeConcept!,
        textOptions,
        activeHeadline,
        imagePrompt,
        res.imageUrl,
        updatedVariants,
        res.model,
        timeStr
      );
    } catch (err: any) {
      console.error('AI Image Generation exception:', err);
      setImageGenerationError({
        message: 'Connection to Gemini image generation failed.',
        details: err?.message || 'Network or server error',
      });
    } finally {
      setIsGeneratingImage(false);
      setGenerationStep('');
    }
  };

  // 4. PERSISTENCE HELPER (Project Storage)
  const persistToProject = (
    concept: ThumbnailConcept,
    opts: ThumbnailTextOptions,
    selectedTxt: string,
    prompt: string,
    imgUrl?: string | null,
    currentVariants: ThumbnailStudioVariant[] = variants,
    model?: string,
    time?: string
  ) => {
    const specs = getFormatSpecs(selectedFormat);

    const record: ThumbnailStudioRecord = {
      activeConcept: concept,
      textOptions: opts,
      selectedText: selectedTxt,
      imagePrompt: prompt,
      generatedImageUrl: imgUrl || generatedImageUrl || undefined,
      generatedAt: time || generatedAt || new Date().toISOString(),
      modelUsed: model || modelUsed || undefined,
      videoFormat: selectedFormat,
      aspectRatio: specs.aspectRatio,
      resolution: specs.resolution,
      variants: currentVariants,
    };

    if (activeProject && onUpdateAiResult) {
      const currentResult = activeProject.result || activeProject.content || {};
      const updatedAiResult: GodseyeAiResult = {
        ...currentResult,
        thumbnailStudioRecord: record,
        thumbnails: {
          ...currentResult.thumbnails,
          studioRecord: record,
          generatedImage: imgUrl
            ? {
                imageUrl: imgUrl,
                model: model || modelUsed || 'gemini-3.1-flash-lite-image',
                timestamp: Date.now(),
                prompt: prompt,
                aspectRatio: specs.aspectRatio,
              }
            : currentResult.thumbnails?.generatedImage,
        },
      } as GodseyeAiResult;

      onUpdateAiResult(updatedAiResult);

      // Direct save to storage to guarantee immediate durability
      const updatedProject: GodseyeProject = {
        ...activeProject,
        updatedAt: new Date().toISOString(),
        content: {
          ...activeProject.content,
          ...updatedAiResult,
        },
      };
      saveProject(updatedProject);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Download generated image helper
  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const sanitizedTitle = (storyTitle || 'thumbnail').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `godseye_${sanitizedTitle}_${getFormatSpecs(selectedFormat).aspectRatio.replace(':', 'x')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const specs = getFormatSpecs(selectedFormat);
  const hasConcept = Boolean(activeConcept);

  return (
    <div className="space-y-6 animate-fadeIn pb-44 w-full max-w-none 2xl:max-w-[1750px] mx-auto">
      {/* HEADER BAR & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d121c]/95 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide font-heading flex items-center gap-2">
                THUMBNAIL STUDIO & REAL GEMINI IMAGE GENERATION
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end visual CTR blueprint: Story Ingestion → Concept → Format Prompt → Gemini Image → Safe-Zone Preview
              </p>
            </div>
          </div>

          {/* Automatic Story Ingestion Pills */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Ingested Story Sources:</span>
            {storyTitle && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <FileText className="w-3 h-3" />
                <span>{storyTitle.slice(0, 35)}...</span>
              </span>
            )}
            {viralHook && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Zap className="w-3 h-3" />
                <span>Hook Synced</span>
              </span>
            )}
            {scriptText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Film className="w-3 h-3" />
                <span>Script Grounded</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>{specs.aspectRatio} {specs.resolution}</span>
            </span>
          </div>
        </div>

        {/* Quick Navigation Back to Content */}
        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('Output Workspace')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CONTROL DASHBOARD: FORMAT SELECTOR & ACTION BUTTONS */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d121c]/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Format Switcher (9:16 Portrait, 16:9 Horizontal, 1:1 Square) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              1. Video Format Constraint (Hard Model Parameter)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: '9:16 Portrait', label: '9:16 Portrait', res: '1080 x 1920', icon: Smartphone },
                { id: '16:9 Horizontal', label: '16:9 Horizontal', res: '1920 x 1080', icon: Layout },
                { id: '1:1 Square', label: '1:1 Square', res: '1080 x 1080', icon: Layers },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat.toLowerCase().includes(fmt.id.split(' ')[0].toLowerCase());
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleFormatChange(fmt.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{fmt.label}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900/80' : 'text-slate-500'}`}>
                      {fmt.res}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Visual Aesthetics Style
            </label>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              {[
                { id: 'cinematic', label: 'Cinematic Chiaroscuro' },
                { id: 'hyperpop', label: 'High-Contrast Pop' },
                { id: 'mystery', label: 'Investigative Mystery' },
                { id: 'documentary', label: 'Gritty Documentary' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setStylePreset(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    stylePreset === p.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Subject Override & Studio Brand Watermark toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Custom Visual Scene or Focal Focus (Optional)</label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder={`Auto-synced: ${storyTitle || 'Exoplanet Discovery or Current Story Subject'}`}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeBranding}
                onChange={(e) => setIncludeBranding(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
              />
              <span className="text-[11px] font-medium leading-tight">
                Include subtle GOD'S EYE studio watermark in prompt (Default: Disabled)
              </span>
            </label>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS: [GENERATE], [REGENERATE], [CREATE VARIANT], [COPY PROMPT], [SAVE] */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Generate / Regenerate Concept */}
            <button
              type="button"
              onClick={handleGenerateThumbnail}
              disabled={isGeneratingConcept || isGeneratingImage}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isGeneratingConcept ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Blueprint...</span>
                </>
              ) : hasConcept ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate Blueprint</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Thumbnail Strategy</span>
                </>
              )}
            </button>

            {/* Create Variant Button */}
            {hasConcept && (
              <div className="flex items-center gap-1 bg-slate-950/90 rounded-xl p-1 border border-slate-700">
                <select
                  value={selectedVariantType}
                  onChange={(e) => setSelectedVariantType(e.target.value as any)}
                  className="bg-transparent text-slate-300 text-xs px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="composition">Composition Variant</option>
                  <option value="camera">Camera Angle Variant</option>
                  <option value="lighting">Dramatic Lighting Variant</option>
                  <option value="background">Atmospheric Background</option>
                  <option value="focal">Focal Arrangement</option>
                </select>
                <button
                  type="button"
                  onClick={handleCreateVariant}
                  disabled={isGeneratingConcept || isGeneratingImage}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Create Variant</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Prompt */}
            {imagePrompt && (
              <button
                type="button"
                onClick={() => handleCopy(imagePrompt, 'full-prompt')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === 'full-prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Full Prompt</span>
                  </>
                )}
              </button>
            )}

            {/* Save to Project */}
            {hasConcept && (
              <button
                type="button"
                onClick={() => persistToProject(activeConcept!, textOptions, activeHeadline, imagePrompt, generatedImageUrl)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved to Project!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Save to Project</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* IF NO CONCEPT YET: WELCOME BANNER */}
      {!hasConcept && !isGeneratingConcept && (
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-12 text-center shadow-xl space-y-4">
          <ImageIcon className="w-12 h-12 text-amber-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active thumbnail strategy loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Generate Thumbnail Strategy" to synthesize a high-contrast, curiosity-driven visual blueprint and AI image prompt directly from your ingested story.
          </p>
          <button
            type="button"
            onClick={handleGenerateThumbnail}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Thumbnail Strategy</span>
          </button>
        </div>
      )}

      {/* MAIN STUDIO WORKSPACE: 2-COLUMN DISPLAY (IMAGE PREVIEW & BLUEPRINT) */}
      {hasConcept && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 5 COLS: LARGE IMAGE PREVIEW & GEMINI GENERATION WORKFLOW */}
          <div className="lg:col-span-5 space-y-5">
            {/* LARGE IMAGE PREVIEW CONTAINER */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/95 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Large Image Preview</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {specs.aspectRatio} • {specs.resolution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Toggle Headline Overlay */}
                  <button
                    type="button"
                    onClick={() => setShowOverlayPreview(!showOverlayPreview)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                      showOverlayPreview
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Overlay Text {showOverlayPreview ? 'ON' : 'OFF'}
                  </button>

                  {/* Fullscreen Button */}
                  {generatedImageUrl && (
                    <button
                      type="button"
                      onClick={() => setIsFullscreenModalOpen(true)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                      title="Inspect Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* ASPECT RATIO PREVIEW CANVAS */}
              <div
                className={`w-full relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center transition-all ${
                  specs.aspectRatio === '9:16'
                    ? 'aspect-[9/16] max-h-[560px] mx-auto'
                    : specs.aspectRatio === '1:1'
                    ? 'aspect-square'
                    : 'aspect-video'
                }`}
              >
                {/* 1. If Image is Generated */}
                {generatedImageUrl ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={generatedImageUrl}
                      alt={activeConcept?.concept || 'Thumbnail Preview'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* LIVE TEXT OVERLAY (SAFE ZONE IN UPPER THIRD OR POSITIONED) */}
                    {showOverlayPreview && (
                      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col pointer-events-none justify-start">
                        <div className="bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent p-3 rounded-lg backdrop-blur-[2px]">
                          <span className="block text-center font-black uppercase tracking-wider text-amber-300 font-heading text-lg sm:text-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] stroke-black leading-tight">
                            {activeHeadline}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mobile Safe Zone timestamp mock badge in bottom right (140x50px rule) */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold pointer-events-none border border-white/20">
                      0:59
                    </div>

                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadImage}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:scale-105"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFullscreenModalOpen(true)}
                        className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : isGeneratingImage ? (
                  /* 2. Generating State */
                  <div className="p-8 text-center space-y-4 max-w-xs">
                    <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">Rendering with Gemini AI...</p>
                      <p className="text-[11px] text-amber-300/80 font-mono">
                        Applying {specs.aspectRatio} framing & photographic lighting
                      </p>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                ) : (
                  /* 3. Empty / Ready to Generate State */
                  <div className="p-6 text-center space-y-3 max-w-sm">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">AI Image Ready to Synthesize</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Click "Generate Image with Gemini" below to render this photorealistic visual concept with server-side AI.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* IMAGE GENERATION ACTION BAR */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleGenerateAiImage}
                  disabled={isGeneratingImage || isGeneratingConcept}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating with Gemini Image Model...</span>
                    </>
                  ) : generatedImageUrl ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Re-Generate Image with Gemini</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Image with Gemini ({specs.aspectRatio})</span>
                    </>
                  )}
                </button>

                {/* Metadata Badge or Honest Error State */}
                {generatedImageUrl && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rendered: {generatedAt || 'Just now'}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">
                      {modelUsed || 'Gemini'}
                    </span>
                  </div>
                )}

                {/* HONEST ERROR STATE (NO FAKE IMAGES) */}
                {imageGenerationError && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-left space-y-2 animate-fadeIn">
                    <div className="flex items-start gap-2 text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold leading-tight">{imageGenerationError.message}</p>
                        {imageGenerationError.requiresConfiguration && (
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {imageGenerationError.requiresConfiguration}
                          </p>
                        )}
                        {imageGenerationError.details && (
                          <div className="p-2 rounded bg-black/40 border border-amber-500/20 font-mono text-[10px] text-amber-200/80 break-words max-h-24 overflow-y-auto">
                            <span className="font-bold text-amber-300">Technical Details: </span>
                            {imageGenerationError.details}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 leading-tight pt-1">
                          You can copy the complete prompt below to generate directly in Midjourney, Flux, or Imagen 3.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(imagePrompt, 'error-copy-prompt')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedKey === 'error-copy-prompt' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Prompt Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt for External Use</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateAiImage}
                        disabled={isGeneratingImage}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Retry Generation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* VARIANT HISTORY CAROUSEL */}
            {variants.length > 0 && (
              <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d121c]/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Generated Variants ({variants.length})
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Click to switch</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setActiveVariantId(v.id);
                        setActiveConcept(v.concept);
                        setImagePrompt(v.concept.imagePrompt);
                        if (v.concept.textOptions) {
                          setTextOptions(v.concept.textOptions);
                        }
                        if (v.imageUrl) {
                          setGeneratedImageUrl(v.imageUrl);
                          setModelUsed(v.model || 'Gemini');
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-left border transition-all shrink-0 cursor-pointer ${
                        activeVariantId === v.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold truncate max-w-[130px]">{v.name}</p>
                      <p className="text-[10px] font-mono text-slate-500">{v.timestamp}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 7 COLS: BLUEPRINT DETAILS, 3 TEXT OPTIONS & PROMPT EXPORT */}
          <div className="lg:col-span-7 space-y-5">
            {/* 3 TEXT OPTIONS (STRICT RULES: 2-6 WORDS) */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/95 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">High-CTR Headline Text Options (2-6 Words)</h3>
                    <p className="text-xs text-slate-400">Strictly separates curiosity headline from the image prompt</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40">
                  Mobile Glance Tested
                </span>
              </div>

              {/* 3 Interactive Text Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'option1', label: 'Option 1: Shock & Intrigue', text: textOptions.option1 },
                  { key: 'option2', label: 'Option 2: Hidden Secret', text: textOptions.option2 },
                  { key: 'option3', label: 'Option 3: Urgency & Proof', text: textOptions.option3 },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => setSelectedTextOption(opt.key as any)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 flex flex-col justify-between ${
                      selectedTextOption === opt.key
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{opt.label}</span>
                      <Radio className={`w-3.5 h-3.5 ${selectedTextOption === opt.key ? 'text-amber-400' : 'text-slate-600'}`} />
                    </div>
                    <p className="text-sm font-black uppercase text-amber-300 tracking-wide font-heading leading-tight">
                      "{opt.text}"
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(opt.text, opt.key);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 pt-1 font-mono"
                    >
                      {copiedKey === opt.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Text Override Input */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTextOption('custom')}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                    selectedTextOption === 'custom'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Custom Text
                </button>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setSelectedTextOption('custom');
                  }}
                  placeholder="Or write custom punchy 2-6 words headline..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Text Placement Safe Zone:</span>
                <span className="font-mono text-amber-300 font-medium">
                  {activeConcept?.textPlacement || 'Upper third safe zone, subject unobstructed'}
                </span>
              </div>
            </div>

            {/* VISUAL BLUEPRINT CARD (SUBJECT, BACKGROUND, LIGHTING, CAMERA, CURIOSITY) */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/95 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Visual Blueprint & Subject Staging</h3>
                    <p className="text-xs text-slate-400">Story-grounded composition parameters</p>
                  </div>
                </div>
              </div>

              {/* Core Visual Concept */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                  Core Visual Concept
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeConcept?.concept}
                </p>
              </div>

              {/* Grid of Subject & Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                    Main Subject & Action
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.subject}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                    Background & Environment
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.background}
                  </p>
                </div>
              </div>

              {/* Grid of Lighting & Camera */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                    Cinematic Lighting
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.lighting}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                    Camera & Optical Style
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.camera}
                  </p>
                </div>
              </div>

              {/* Curiosity Trigger & Negative Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-bold">
                    Psychological Curiosity Trigger
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.curiosityElement || activeConcept?.curiosityTrigger}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block font-bold">
                    Strict Negative Constraints
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConcept?.negativeInstructions}
                  </p>
                </div>
              </div>
            </div>

            {/* FORMAT-AWARE PROMPT DISPLAY & ONE-CLICK EXPORT */}
            <div className="rounded-2xl border border-amber-900/40 bg-amber-950/15 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Midjourney v6.1 / Flux Pro / Imagen 3 / Gemini Prompt
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(imagePrompt, 'full-prompt-box')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedKey === 'full-prompt-box' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="font-mono text-xs text-amber-100 bg-slate-950/90 p-4 rounded-xl border border-amber-900/40 leading-relaxed select-all whitespace-pre-wrap max-h-48 overflow-y-auto">
                {imagePrompt}
              </pre>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                <span>Hard Constraints: {specs.header.replace(/\n/g, ' • ')}</span>
                <span className="text-amber-400">Grounded in active story</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN ZOOM MODAL */}
      {isFullscreenModalOpen && generatedImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsFullscreenModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={generatedImageUrl}
              alt="Fullscreen Thumbnail"
              className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Resolution</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
