import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  Clock,
  Sparkles,
  Check,
  Film,
  FileText,
  Copy,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { GodseyeProject, V2NavigationTab, TTSAudioData } from '../../types';
import { AiVoiceGenerator } from '../AiVoiceGenerator';

interface VoiceStudioViewProps {
  activeProject: GodseyeProject;
  onNavigate: (tab: V2NavigationTab) => void;
  onUpdateAiResult: (updated: any) => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  activeProject,
  onNavigate,
  onUpdateAiResult,
}) => {
  const result = activeProject.result || activeProject.content;
  const scriptText = result?.script?.text || '';
  const scenes = result?.scenes || [];
  const existingAudioData = result?.ttsAudio;

  const handleAudioGenerated = (audioData: TTSAudioData) => {
    if (!result) return;
    const updated = {
      ...result,
      ttsAudio: audioData,
    };
    onUpdateAiResult(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#170a1c] via-[#120817] to-[#070b16] border border-pink-500/30 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-700/50 text-xs font-semibold text-pink-300 mb-2 font-mono">
              <Volume2 className="w-3.5 h-3.5 text-pink-400" />
              <span>SYNCHRONIZED VOICE-OVER ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Voice Studio & Audio Synthesis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate natural Hindi teleprompter speech using Gemini neural TTS, calculate scene timecodes, and export SRT subtitle files calibrated to 8-second video cuts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('Create')}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-pink-600/30 self-start sm:self-auto"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main TTS Engine Component */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4 sm:p-6 shadow-2xl">
        <AiVoiceGenerator
          scriptText={scriptText}
          scenes={scenes}
          contentType={activeProject.settings?.contentType || 'YouTube Short'}
          mood={activeProject.settings?.mood || 'Dramatic'}
          existingAudioData={existingAudioData}
          onAudioGenerated={handleAudioGenerated}
          onNavigateToAdobeExpress={() => onNavigate('Create')}
        />
      </div>
    </div>
  );
};
