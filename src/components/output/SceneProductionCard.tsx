import React, { useState } from 'react';
import {
  Video,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Save,
  X,
  Volume2,
  Camera,
  Sun,
  Activity,
  Type,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Film,
} from 'lucide-react';
import { SceneItem, VideoFormat, Mood, MasterVideoStyle } from '../../types';
import {
  getFormatSpec,
  buildStandalonePrompt,
  formatSingleScenePackage,
} from '../../utils/formatSpecs';

interface SceneProductionCardProps {
  scene: SceneItem;
  videoFormat: VideoFormat;
  mood?: Mood;
  masterVideoStyle?: MasterVideoStyle;
  onCopyText: (text: string, label: string) => void;
  onRegenerateScene?: (sceneNumber: number) => void;
  onUpdateScene?: (updatedScene: SceneItem) => void;
  isLoading?: boolean;
}

export const SceneProductionCard: React.FC<SceneProductionCardProps> = ({
  scene,
  videoFormat,
  mood = 'Dramatic',
  masterVideoStyle,
  onCopyText,
  onRegenerateScene,
  onUpdateScene,
  isLoading = false,
}) => {
  const [copiedScene, setCopiedScene] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [editPrompt, setEditPrompt] = useState('');
  const [editVoiceOver, setEditVoiceOver] = useState('');
  const [editOnScreenText, setEditOnScreenText] = useState('');

  const formatSpec = getFormatSpec(videoFormat);
  const standalonePrompt = buildStandalonePrompt(scene, videoFormat, mood, masterVideoStyle);
  const scenePackageText = formatSingleScenePackage(scene, videoFormat, mood, masterVideoStyle);
  const sceneNumDisplay = scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : `${scene.sceneNumber}`;

  // REQUIREMENT 3: Copy Scene copies ONLY this scene's complete standalone production package
  const handleCopyScene = () => {
    onCopyText(scenePackageText, `Scene ${scene.sceneNumber} Package`);
    setCopiedScene(true);
    setTimeout(() => setCopiedScene(false), 2200);
  };

  // Copy standalone Google Flow / Veo Prompt
  const handleCopyPrompt = () => {
    onCopyText(standalonePrompt, `Scene ${scene.sceneNumber} Google Flow/Veo Prompt`);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleStartEdit = () => {
    setEditPrompt(scene.finalVideoPrompt || scene.videoPrompt || standalonePrompt);
    setEditVoiceOver(scene.voiceOver || '');
    setEditOnScreenText(scene.onScreenText || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onUpdateScene) {
      onUpdateScene({
        ...scene,
        videoPrompt: editPrompt,
        finalVideoPrompt: editPrompt,
        voiceOver: editVoiceOver,
        onScreenText: editOnScreenText,
      });
    }
    setIsEditing(false);
  };

  return (
    <div
      id={`scene-card-${scene.sceneNumber}`}
      className="w-full rounded-2xl bg-[#090d16] border border-slate-800/90 shadow-xl shadow-black/40 overflow-hidden transition-all hover:border-slate-700 space-y-0"
    >
      {/* 1. SCENE HEADER (Requirement 4 layout) */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900/95 via-[#0d1322] to-slate-900/95 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Scene Number Badge */}
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono font-black text-sm flex items-center justify-center shadow-inner">
            {sceneNumDisplay}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-white font-heading tracking-wide">
                Scene {scene.sceneNumber}
                {scene.title ? `: ${scene.title}` : ''}
              </h4>

              {/* Format Badge explicitly showing selected format and aspect ratio */}
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                {formatSpec.aspectRatio} • {formatSpec.frameSize}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5 flex-wrap">
              <span className="text-amber-300 font-semibold">{scene.duration || '5s'}</span>
              <span>•</span>
              <span>Timecode: {scene.startTime || '00:00'} - {scene.endTime || '00:05'}</span>
              <span>•</span>
              <span className="text-slate-300">{formatSpec.videoFormat}</span>
            </div>
          </div>
        </div>

        {/* Action Controls in Header: Regenerate | Edit | Copy Prompt | Copy Scene */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* Inline Edit Toggle */}
          <button
            type="button"
            onClick={isEditing ? () => setIsEditing(false) : handleStartEdit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            title="Edit scene narration or prompt"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>

          {/* Regenerate Button */}
          {onRegenerateScene && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onRegenerateScene(scene.sceneNumber)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 transition-all cursor-pointer disabled:opacity-50"
              title={`Regenerate Scene ${scene.sceneNumber}`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regen</span>
            </button>
          )}

          {/* Copy Prompt Text Only */}
          <button
            type="button"
            id={`btn-copy-prompt-scene-${scene.sceneNumber}`}
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-pink-300 bg-pink-950/60 hover:bg-pink-900/80 border border-pink-700/60 transition-all cursor-pointer active:scale-95"
            title="Copy standalone Google Flow / Veo Prompt"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">PROMPT COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-400" />
                <span>COPY PROMPT</span>
              </>
            )}
          </button>

          {/* REQUIREMENT 3: COPY SCENE BUTTON (copies ONLY this single scene) */}
          <button
            type="button"
            id={`btn-copy-scene-${scene.sceneNumber}`}
            onClick={handleCopyScene}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-purple-400/50 shadow-md shadow-purple-950/50 transition-all cursor-pointer active:scale-95"
            title={`Copy only Scene ${scene.sceneNumber} complete production package`}
          >
            {copiedScene ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-200">COPIED SCENE {scene.sceneNumber}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY SCENE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Edit Panel (Conditional) */}
      {isEditing && (
        <div className="p-4 bg-slate-950 border-b border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>Editing Scene {scene.sceneNumber}</span>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Voice-Over Line:</label>
            <textarea
              value={editVoiceOver}
              onChange={(e) => setEditVoiceOver(e.target.value)}
              rows={2}
              className="w-full text-xs text-white bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Google Flow / Veo Prompt:</label>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              rows={4}
              className="w-full text-xs font-mono text-cyan-100 bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">On-Screen Text:</label>
            <input
              type="text"
              value={editOnScreenText}
              onChange={(e) => setEditOnScreenText(e.target.value)}
              className="w-full text-xs text-white bg-slate-900 border border-slate-700 rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Sections — Structured Vertically for Maximum Width & Readability */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* 2. VOICE OVER (Requirement 4 layout) */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-cyan-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              VOICE OVER / NARRATION
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Spoken cadence: {scene.duration || '5s'}
            </span>
          </div>
          <p className="text-sm text-slate-100 font-sans leading-relaxed pl-3 border-l-2 border-cyan-500 font-medium">
            "{scene.voiceOver || scene.narration || 'Voice-over line for this scene.'}"
          </p>
        </div>

        {/* 3. GOOGLE FLOW / VEO PROMPT (Requirement 4 layout: Large readable prompt area) */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-pink-900/40 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider font-heading">
                GOOGLE FLOW / VEO PRODUCTION PROMPT
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800/40">
                {formatSpec.aspectRatio}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyPrompt}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY PROMPT</span>
                </>
              )}
            </button>
          </div>

          {/* High-visibility, wide, spacious prompt box with dedicated scrollable container */}
          <div className="w-full min-h-[120px] max-h-56 sm:max-h-64 overflow-y-auto scrollbar-thin p-3.5 rounded-lg bg-[#060911] border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed select-all whitespace-pre-wrap shadow-inner">
            {standalonePrompt}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2 pt-1">
            <span className="text-purple-300">
              ✓ Includes aspect ratio ({formatSpec.aspectRatio}), frame size ({formatSpec.frameSize}), camera trajectory, lighting, and negative rules.
            </span>
            <span className="text-slate-500 font-mono">Ready for direct paste into Google Flow / Veo</span>
          </div>
        </div>

        {/* 4. CAMERA & SHOT DIRECTION (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            CAMERA
          </span>
          <div className="text-xs text-slate-200 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            <div>
              <strong className="text-slate-400 block text-[11px]">Shot & Lens:</strong>
              <span className="font-mono text-cyan-200">{scene.camera || '35mm cinematic lens'}</span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Movement / Trajectory:</strong>
              <span className="text-slate-200">{scene.movement || 'Cinematic tracking shot'}</span>
            </div>
          </div>
        </div>

        {/* 5. LIGHTING (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            LIGHTING
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {scene.lighting || 'Cinematic directional lighting with natural highlight roll-off and realistic shadow contrast.'}
          </p>
        </div>

        {/* 6. MOTION (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            MOTION
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {scene.motion || 'Natural fluid subject movement, subtle atmospheric elements, steady camera glide.'}
          </p>
        </div>

        {/* 7. ON-SCREEN TEXT (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            ON-SCREEN TEXT
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 font-bold border border-amber-800/50 font-heading text-xs">
                {scene.onScreenText || 'KEY REVELATION'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-3">
              <span>
                <strong className="text-slate-400">Placement:</strong>{' '}
                {scene.textPlacement || (formatSpec.aspectRatio === '9:16' ? 'Safe central area (middle-third)' : 'Lower-third center')}
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-400">Animation:</strong>{' '}
                {scene.textAnimation || 'Kinetic pop-in with smooth opacity fade'}
              </span>
            </div>
          </div>
        </div>

        {/* 8. SOUND / SFX (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            SOUND / SFX
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <strong className="text-slate-400 block text-[11px]">Atmosphere:</strong>
              <span className="text-slate-200">{scene.audio?.atmosphere || 'Balanced ambient acoustics'}</span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Foley / Sound FX:</strong>
              <span className="text-slate-200">{scene.audio?.sfx || scene.sound || 'Subtle whoosh'}</span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Music Mood:</strong>
              <span className="text-slate-200">{scene.audio?.musicMood || `${mood} score`}</span>
            </div>
          </div>
        </div>

        {/* 9. TRANSITION (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            TRANSITION
          </span>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            {scene.transition || 'Rapid whip pan on beat'}
          </span>
        </div>

        {/* 10. CONTINUITY (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            CONTINUITY
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {scene.continuity || scene.continuityNote || 'Maintain consistent subject appearance, clothing, and color grading palette across scenes.'}
          </p>
        </div>

        {/* 11. NEGATIVE INSTRUCTIONS (Requirement 4 layout) */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            NEGATIVE INSTRUCTIONS
          </span>
          <p className="text-xs font-mono text-rose-200/90 leading-relaxed">
            {scene.negativePrompt ||
              'No watermark. No unwanted logo. No random text rendered inside frame. No distorted anatomy, extra fingers, or deformed faces. No unrelated objects. No inconsistent subject appearance. No cartoonish 3D render artifacts.'}
          </p>
        </div>
      </div>

      {/* Card Footer Bar with bottom Copy Scene button */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-slate-400 font-mono">
          <span>Scene {scene.sceneNumber}</span> •{' '}
          <span className="text-purple-300">{formatSpec.videoFormat}</span> •{' '}
          <span className="text-cyan-300">{formatSpec.frameSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id={`btn-bottom-copy-prompt-${scene.sceneNumber}`}
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-800/40 transition-all cursor-pointer active:scale-95"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Prompt Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-400" />
                <span>Copy Prompt Only</span>
              </>
            )}
          </button>

          {/* REQUIREMENT 3: Single Scene Copy only */}
          <button
            type="button"
            id={`btn-bottom-copy-scene-${scene.sceneNumber}`}
            onClick={handleCopyScene}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/50 shadow-md shadow-purple-950/50 transition-all cursor-pointer active:scale-95"
          >
            {copiedScene ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-200">COPIED SCENE {scene.sceneNumber}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY SCENE {scene.sceneNumber}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
