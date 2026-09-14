import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  RotateCw,
  Clock,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  Film,
  FileText,
  Copy,
  ChevronDown,
  Music,
  Share2
} from 'lucide-react';
import {
  TTSConfig,
  TTSAudioData,
  TTSVoice,
  TTSSpeakingStyle,
  TTSLanguage,
  SceneItem,
  SceneTiming
} from '../types';
import {
  defaultTTSProvider,
  formatSecondsToTime,
  generateSrtContent,
  triggerBrowserDownload
} from '../services/ttsService';

interface AiVoiceGeneratorProps {
  scriptText: string;
  scenes: SceneItem[];
  contentType?: string;
  mood?: string;
  existingAudioData?: TTSAudioData;
  onAudioGenerated?: (audioData: TTSAudioData) => void;
  onNavigateToAdobeExpress?: () => void;
}

const VOICES: { id: TTSVoice; name: string; description: string; badge: string }[] = [
  { id: 'Kore', name: 'Kore', description: 'Warm, natural, clear explainer', badge: 'Natural & Warm' },
  { id: 'Charon', name: 'Charon', description: 'Deep, serious, authoritative narrator', badge: 'Deep Documentary' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Intense, dramatic, cinematic depth', badge: 'Cinematic' },
  { id: 'Puck', name: 'Puck', description: 'Energetic, fast-paced, youth appeal', badge: 'High Energy' },
  { id: 'Zephyr', name: 'Zephyr', description: 'Calm, balanced, smooth delivery', badge: 'Calm & Balanced' },
  { id: 'Aoede', name: 'Aoede', description: 'Expressive, storytelling, evocative', badge: 'Storytelling' },
];

const SPEAKING_STYLES: TTSSpeakingStyle[] = [
  'Documentary',
  'News Presenter',
  'Cinematic',
  'Suspense',
  'Dramatic',
  'Informative',
  'Technical',
  'Emotional',
  'Storytelling',
];

const LANGUAGES: TTSLanguage[] = [
  'Hindi',
  'English',
  'Hinglish',
  'Gujarati',
  'Marathi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Punjabi',
];

const SPEEDS = [0.8, 0.9, 1.0, 1.1, 1.2];

export const AiVoiceGenerator: React.FC<AiVoiceGeneratorProps> = ({
  scriptText,
  scenes,
  contentType = 'Documentary',
  mood = 'Dramatic',
  existingAudioData,
  onAudioGenerated,
  onNavigateToAdobeExpress,
}) => {
  // Config state
  const [config, setConfig] = useState<TTSConfig>({
    language: 'Hindi',
    voice: 'Kore',
    speed: 1.0,
    speakingStyle: 'Documentary',
    pitch: 'Standard',
    energy: 'High',
    customDirection: '',
  });

  // Audio & Player state
  const [audioData, setAudioData] = useState<TTSAudioData | undefined>(existingAudioData);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // HTML5 audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [copiedSubtitle, setCopiedSubtitle] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [showSyncDetails, setShowSyncDetails] = useState(false);

  // Sync with prop when project switches
  useEffect(() => {
    if (existingAudioData) {
      setAudioData(existingAudioData);
      if (existingAudioData.durationSeconds) {
        setDuration(existingAudioData.durationSeconds);
      }
    }
  }, [existingAudioData]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Audio playback error:', err));
    }
  };

  // Audio event listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || audioData?.durationSeconds || 0);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Computed Performance Direction Preview
  const computedPerformanceDirection = `Perform this as a ${config.speakingStyle} narrator in ${config.language}. Mood: ${mood}. Speed: ${config.speed}x. ${
    config.customDirection
      ? config.customDirection
      : 'Start with controlled suspense, maintain clear Indian-natural pronunciation for Hinglish/Hindi terms, pause briefly at commas and full stops, and finish with a thought-provoking, high-retention cadence.'
  }`;

  // Handle Audio Generation
  const handleGenerateVoice = async () => {
    if (!scriptText || !scriptText.trim()) {
      setErrorMessage('No script text available. Please generate or enter a script first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Preparing narration...');

    try {
      // Stage 1
      await new Promise((r) => setTimeout(r, 400));
      setGenerationStep('Generating voice with Google Gemini TTS...');

      const result = await defaultTTSProvider.generateSpeech(
        scriptText,
        config,
        scenes,
        contentType,
        mood
      );

      // Stage 2
      setGenerationStep('Processing audio...');
      await new Promise((r) => setTimeout(r, 300));
      setGenerationStep('Audio ready.');

      setAudioData(result);
      setDuration(result.durationSeconds || 0);
      setCurrentTime(0);

      if (onAudioGenerated) {
        onAudioGenerated(result);
      }
    } catch (err: any) {
      console.error('TTS Generation error:', err);
      const msg =
        err?.message?.includes('GEMINI_API_KEY') || err?.message?.includes('not configured')
          ? 'Google TTS is not configured yet. Please configure your GEMINI_API_KEY to generate live audio.'
          : err?.message || 'Failed to generate voice narration. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Audio
  const handleDownloadAudio = () => {
    if (!audioData?.base64Data && !audioData?.audioUrl) return;

    if (audioData.base64Data) {
      const byteCharacters = atob(audioData.base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: audioData.mimeType || 'audio/wav' });
      triggerBrowserDownload(blob, `godseye-narration-${config.language.toLowerCase()}-${config.voice.toLowerCase()}.wav`, 'audio/wav');
    } else if (audioData.audioUrl) {
      const a = document.createElement('a');
      a.href = audioData.audioUrl;
      a.download = `godseye-narration-${config.language.toLowerCase()}.wav`;
      a.click();
    }
  };

  // Copy Subtitles
  const handleCopySubtitles = () => {
    const srt = generateSrtContent(audioData?.sceneTimings || [], scriptText, duration || 60);
    navigator.clipboard.writeText(srt);
    setCopiedSubtitle(true);
    setTimeout(() => setCopiedSubtitle(false), 2000);
  };

  // Download SRT
  const handleDownloadSrt = () => {
    const srt = generateSrtContent(audioData?.sceneTimings || [], scriptText, duration || 60);
    triggerBrowserDownload(srt, 'godseye-captions.srt', 'text/plain');
  };

  // Copy Adobe Express Plan with audio timing
  const handleCopyAdobePlan = () => {
    const planText = `GODSEYE AI - ADOBE EXPRESS PRODUCTION PLAN WITH AUDIO SYNC
--------------------------------------------------------------
Total Audio Duration: ${formatSecondsToTime(duration)} (${duration}s)
Language: ${config.language} | Voice: ${config.voice} | Style: ${config.speakingStyle}

SCENE TIMELINE:
${(audioData?.sceneTimings || scenes.map((s, idx) => ({
  sceneNumber: idx + 1,
  startTime: `0:${(idx * 5).toString().padStart(2, '0')}`,
  endTime: `0:${((idx + 1) * 5).toString().padStart(2, '0')}`,
  duration: '5s',
  voiceOver: s.voiceOver
}))).map(st => `• Scene ${st.sceneNumber} (${st.startTime} - ${st.endTime}): ${st.voiceOver}`).join('\n')}

ASSEMBLY INSTRUCTIONS:
1. Import the generated audio track 'godseye-narration.wav' into Adobe Express.
2. Align video clips matching each Scene duration.
3. Add animated captions using the synced SRT subtitle file.
4. Apply transitions and subtle background score at -18dB behind narration.`;

    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div id="godseye-ai-voice-generator" className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 shadow-inner">
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white font-mono">AI VOICE GENERATOR</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                Google Gemini TTS
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Turn your GODSEYE script into natural AI narration.
            </p>
          </div>
        </div>

        {/* Beginner Help Pill */}
        <div className="flex items-center gap-2 text-xs text-cyan-400/80 bg-cyan-950/30 border border-cyan-800/40 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Choose a voice and style, then click Generate Voice.</span>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Language */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Language
          </label>
          <div className="relative">
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value as TTSLanguage })}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Voice */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Voice Actor
          </label>
          <div className="relative">
            <select
              value={config.voice}
              onChange={(e) => setConfig({ ...config, voice: e.target.value as TTSVoice })}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.badge}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Speaking Style */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Speaking Style
          </label>
          <div className="relative">
            <select
              value={config.speakingStyle}
              onChange={(e) => setConfig({ ...config, speakingStyle: e.target.value as TTSSpeakingStyle })}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {SPEAKING_STYLES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Speed Selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pacing Speed
          </label>
          <div className="grid grid-cols-5 gap-1 rounded-xl border border-slate-700 bg-slate-800/80 p-1">
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => setConfig({ ...config, speed: sp })}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  config.speed === sp
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Description Pill */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
        <span className="text-cyan-400 font-semibold">{config.voice}:</span>
        <span>{VOICES.find((v) => v.id === config.voice)?.description}</span>
        <span className="mx-2 text-slate-600">|</span>
        <span>Pronunciation optimized for {config.language} audience engagement.</span>
      </div>

      {/* Custom Voice Direction */}
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Custom Voice Direction <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={config.customDirection}
          onChange={(e) => setConfig({ ...config, customDirection: e.target.value })}
          placeholder="e.g., Serious Indian male documentary narrator, medium-fast pace, strong emphasis on important words."
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Performance Direction Box */}
      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
        <span className="font-semibold text-cyan-400/90">Performance Instruction: </span>
        <span className="italic">{computedPerformanceDirection}</span>
      </div>

      {/* Action / Generate Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          id="godseye-btn-generate-voice"
          type="button"
          onClick={handleGenerateVoice}
          disabled={isGenerating}
          className={`flex items-center gap-2.5 rounded-xl px-6 py-3 font-semibold text-sm transition-all shadow-lg ${
            isGenerating
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 active:scale-[0.99] shadow-cyan-500/20'
          }`}
        >
          {isGenerating ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin text-cyan-400" />
              <span>{generationStep || 'Generating Voice...'}</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-cyan-300" />
              <span>{audioData?.status === 'READY' ? 'REGENERATE VOICE' : 'GENERATE VOICE'}</span>
            </>
          )}
        </button>

        {/* Audio status pill */}
        {audioData && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                audioData.status === 'READY'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {audioData.status === 'READY' ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {audioData.status}
            </span>
            {audioData.durationSeconds ? (
              <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-mono text-cyan-300 border border-slate-700">
                {formatSecondsToTime(audioData.durationSeconds)} ({audioData.durationSeconds}s)
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Error Message with Try Again */}
      {errorMessage && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300">Voice Generation Notice</p>
              <p className="mt-1 text-xs text-red-200/90">{errorMessage}</p>
              <button
                type="button"
                onClick={handleGenerateVoice}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600/30 border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-600/50"
              >
                <RotateCw className="h-3.5 w-3.5" />
                TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Player Card (Visible when audio is ready) */}
      {audioData?.status === 'READY' && (
        <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-950 to-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                AUDIO READY
              </span>
              <span className="text-xs text-slate-400">• {audioData.voiceUsed} ({audioData.languageUsed})</span>
            </div>
            <div className="text-xs font-mono text-cyan-300">
              {formatSecondsToTime(currentTime)} / {formatSecondsToTime(duration)}
            </div>
          </div>

          {/* Hidden HTML5 audio element */}
          {audioData.audioUrl && (
            <audio
              ref={audioRef}
              src={audioData.audioUrl}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={onEnded}
            />
          )}

          {/* Playback Controls & Progress */}
          <div className="space-y-4">
            {/* Timeline Progress bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0:00</span>
                <span>{formatSecondsToTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Play / Pause button */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg hover:bg-cyan-400 active:scale-95 transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                </button>

                {/* Volume slider */}
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Volume2 className="h-4 w-4 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Download Audio */}
                <button
                  id="godseye-btn-download-audio"
                  type="button"
                  onClick={handleDownloadAudio}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DOWNLOAD AUDIO</span>
                </button>

                {/* Copy Subtitles */}
                <button
                  type="button"
                  onClick={handleCopySubtitles}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
                >
                  {copiedSubtitle ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSubtitle ? 'COPIED' : 'COPY SUBTITLES'}</span>
                </button>

                {/* Download SRT */}
                <button
                  type="button"
                  onClick={handleDownloadSrt}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>DOWNLOAD SRT</span>
                </button>

                {/* Sync Scenes to Audio Toggle */}
                <button
                  type="button"
                  onClick={() => setShowSyncDetails(!showSyncDetails)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    showSyncDetails
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                      : 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                  }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  <span>SYNC SCENES TO AUDIO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sync Scenes to Audio Timing Plan Drawer/Panel */}
          {showSyncDetails && (
            <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                    AUDIO DURATION TIMELINE & SCENE SYNC PLAN
                  </h4>
                </div>
                <span className="text-xs text-indigo-300 font-mono">
                  Calculated Duration: {duration.toFixed(1)}s
                </span>
              </div>

              {/* Scene Timings Grid */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(audioData.sceneTimings && audioData.sceneTimings.length > 0
                  ? audioData.sceneTimings
                  : scenes.map((s, idx) => ({
                      sceneNumber: idx + 1,
                      startTime: `0:${(idx * 6).toString().padStart(2, '0')}`,
                      endTime: `0:${((idx + 1) * 6).toString().padStart(2, '0')}`,
                      duration: '6s',
                      voiceOver: s.voiceOver || s.visual,
                    }))
                ).map((timing, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 font-mono font-bold text-indigo-300">
                        Scene {timing.sceneNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        {timing.startTime} – {timing.endTime}
                      </span>
                      <span className="text-slate-500">({timing.duration})</span>
                    </div>
                    <p className="line-clamp-1 text-slate-300 text-xs flex-1 sm:text-right italic">
                      "{timing.voiceOver}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-500/20 pt-3">
                <p className="text-[11px] text-slate-400">
                  Ready to assemble in Adobe Express with synced voice-over clips and captions.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAdobePlan}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-400/40 bg-indigo-600/30 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/50"
                  >
                    {copiedPlan ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPlan ? 'PLAN COPIED' : 'SEND TO ADOBE EXPRESS WORKFLOW'}</span>
                  </button>

                  {onNavigateToAdobeExpress && (
                    <button
                      type="button"
                      onClick={onNavigateToAdobeExpress}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      <Share2 className="h-3 w-3" />
                      <span>OPEN ADOBE TAB</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
