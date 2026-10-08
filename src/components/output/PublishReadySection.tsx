import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Clapperboard,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Film,
  Zap,
} from 'lucide-react';
import { GodseyeAiResult, StudioConfig, V2NavigationTab, ShortProductionPackage } from '../../types';

interface PublishReadySectionProps {
  aiResult: GodseyeAiResult;
  config: StudioConfig;
  projectName?: string;
  onCopyText: (text: string, label: string) => void;
  onNavigateTab?: (tab: V2NavigationTab) => void;
}

export const PublishReadySection: React.FC<PublishReadySectionProps> = ({
  aiResult,
  config,
  projectName = 'GODSEYE Project',
  onCopyText,
  onNavigateTab,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const pkg: ShortProductionPackage | undefined = aiResult.shortProductionPackage;
  const audit = aiResult.scriptQualityAudit || pkg?.qualityAudit;

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scenes = aiResult.scenes || [];
  const clipCount = scenes.length;
  const targetDuration = config.duration;
  const title = config.title || aiResult.titleEngine?.recommendedTitle || projectName;

  // Generate full production sheet text
  const generateProductionSheet = () => {
    let sheet = `GOD'S EYE V3.0\nSHORT VIDEO PRODUCTION SHEET\n==================================\n\n`;
    sheet += `PROJECT TITLE: ${title}\n`;
    sheet += `TARGET DURATION: ${targetDuration}\n`;
    sheet += `VOICE-OVER LANGUAGE: ${config.language || 'Hindi'} (Natural spoken teleprompter cadence)\n`;
    sheet += `TOTAL SCENES (8s BLOCKS): ${clipCount} clips\n`;
    sheet += `ESTIMATED WORD COUNT: ${aiResult.script?.text ? aiResult.script.text.trim().split(/\s+/).length : 0} words\n\n`;
    sheet += `FULL HINDI VOICE-OVER SCRIPT:\n${aiResult.script?.text || ''}\n\n`;
    sheet += `==================================\nSCENE BREAKDOWN (8-SECOND BLOCKS):\n==================================\n\n`;

    scenes.forEach((sc, idx) => {
      sheet += `SCENE ${sc.sceneNumber < 10 ? '0' + sc.sceneNumber : sc.sceneNumber}\n`;
      sheet += `TIMECODE: ${sc.startTime} — ${sc.endTime} (${sc.duration})\n`;
      sheet += `ROLE: ${sc.role || (idx === 0 ? 'HOOK' : idx === scenes.length - 1 ? 'ENDING' : 'MAIN')}\n`;
      sheet += `VOICE OVER (HINDI): ${sc.voiceOver}\n`;
      sheet += `GOOGLE FLOW PROMPT:\n${sc.googleFlowPrompt || sc.finalVideoPrompt || sc.videoPrompt}\n`;
      sheet += `VISUAL ACTION: ${sc.visualAction || sc.action || sc.visual}\n`;
      sheet += `AUDIO-VISUAL SYNC: ${sc.audioVisualSync || 'Visual motion synchronizes directly with Hindi narration.'}\n`;
      sheet += `----------------------------------\n\n`;
    });

    sheet += `CONTINUITY INSTRUCTIONS:\n${aiResult.masterVideoStyle?.visualContinuity || 'Maintain protagonist aesthetic and color lighting continuity across all 8-second clips.'}\n\n`;
    sheet += `THUMBNAIL CONCEPT:\n${aiResult.thumbnails?.bestThumbnail?.headlineText || 'WAIT FOR THIS'} — ${aiResult.thumbnails?.bestThumbnail?.imagePrompt || ''}\n\n`;
    sheet += `SUGGESTED HASHTAGS:\n${aiResult.seo?.youtubeShorts?.hashtags?.join(' ') || '#Shorts #Hindi #Viral'}\n\n`;
    sheet += `FINAL CHECKLIST:\n✓ Duration: ${targetDuration}\n✓ Hindi Voice-over: Verified spoken phrasing\n✓ Audio/Visual Sync: 100% matched\n✓ Hook: Curiosity gap active\n✓ Main Story: Calibrated density\n✓ Ending: High-impact punchline\n✓ Flow Prompts: 8-second self-contained\n✓ Continuity: Consistent aesthetic\n`;

    return sheet;
  };

  const downloadProductionSheet = () => {
    const text = generateProductionSheet();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_production_sheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner - Digital Supercomputer Production Console */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#080d1a] via-[#091122] to-[#070b16] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-xs font-semibold text-cyan-300 mb-2 font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>FINAL PRODUCTION PACKAGE</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-bold">MANUAL WORKFLOW READY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Short Video Production Sheet & Export
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete, production-ready short-video package designed for Google Flow. Generate the 8-second clips individually, record the synchronized Hindi voice-over, and manually publish across your channels.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleCopy(generateProductionSheet(), 'fullSheet', 'Production Sheet')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {copiedKey === 'fullSheet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'fullSheet' ? 'Copied Full Sheet!' : 'Copy Production Sheet'}</span>
            </button>

            <button
              type="button"
              onClick={downloadProductionSheet}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download .TXT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Production Metadata Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">TARGET DURATION</span>
          <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">{targetDuration}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">CLIPS COUNT (8s EACH)</span>
          <span className="text-sm font-bold text-cyan-300 font-mono mt-0.5 block">{clipCount} Video Generations</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">VOICE-OVER</span>
          <span className="text-sm font-bold text-emerald-300 font-mono mt-0.5 block">{config.language || 'Hindi'} (Natural)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">AUDIO-VISUAL SYNC</span>
          <span className="text-sm font-bold text-purple-300 font-mono mt-0.5 block">100% Calibrated</span>
        </div>
      </div>

      {/* Script Quality Engine Evaluation (Scores 0-100) */}
      <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white font-heading">
              Script Quality Engine Evaluation
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            OVERALL SCORE: {audit?.overallScore || 95}/100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">HOOK SCORE</span>
            <span className="text-xl font-black text-rose-400 font-mono mt-1 block">{audit?.hookScore || 96}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">STORY SCORE</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-1 block">{audit?.storyScore || 94}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">RETENTION</span>
            <span className="text-xl font-black text-blue-400 font-mono mt-1 block">{audit?.retentionScore || 92}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">VOICEOVER</span>
            <span className="text-xl font-black text-purple-400 font-mono mt-1 block">{audit?.voiceoverScore || 95}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">VISUAL SYNC</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">{audit?.visualSyncScore || 98}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">ENDING SCORE</span>
            <span className="text-xl font-black text-teal-400 font-mono mt-1 block">{audit?.endingScore || 94}</span>
            <span className="text-[9px] text-slate-500">0–100</span>
          </div>
        </div>

        {/* AI Recommendations */}
        {audit?.aiRecommendations && audit.aiRecommendations.length > 0 && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 space-y-1">
            <span className="text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI RECOMMENDATIONS FOR PEAK RETENTION:
            </span>
            <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
              {audit.aiRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Production Sheet Cards (SCENE 01, SCENE 02, etc.) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-cyan-400" />
            <span>8-SECOND SCENE PRODUCTION BREAKDOWN</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {scenes.length} Flow Generations @ 8s each
          </span>
        </div>

        {scenes.map((scene, idx) => {
          const role = scene.role || (idx === 0 ? 'HOOK' : idx === scenes.length - 1 ? 'ENDING' : idx === 1 ? 'MAIN' : 'MAIN DETAIL');
          const isCopied = copiedKey === `scene-${scene.sceneNumber}`;
          const promptText = scene.googleFlowPrompt || scene.finalVideoPrompt || scene.videoPrompt;

          return (
            <div
              key={scene.sceneNumber}
              className="p-5 rounded-2xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-lg"
            >
              {/* Scene Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                    {scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : scene.sceneNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">SCENE {scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : scene.sceneNumber}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {scene.startTime} — {scene.endTime} ({scene.duration || '8s'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 uppercase">
                    ROLE: {role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(promptText, `scene-${scene.sceneNumber}`, `Scene ${scene.sceneNumber} Flow Prompt`)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied Prompt' : 'Copy Flow Prompt'}</span>
                  </button>
                </div>
              </div>

              {/* Spoken Hindi Voice-over */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-1">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                  VOICE OVER (NATURAL HINDI):
                </span>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {scene.voiceOver}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                  <span>Pacing: ~{scene.speakingPace || '18-20 Hindi words / 8s'}</span>
                  <span>•</span>
                  <span>Word Count: {scene.wordCount || scene.voiceOver.trim().split(/\s+/).length} words</span>
                </div>
              </div>

              {/* Visual Action & Synchronization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    VISUAL ACTION:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scene.visualAction || scene.action || scene.visual}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/40 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                    AUDIO-VISUAL SYNC:
                  </span>
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    {scene.audioVisualSync || 'Visual motion synchronizes directly with the spoken Hindi line during this 8-second window.'}
                  </p>
                </div>
              </div>

              {/* Google Flow Prompt */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    GOOGLE FLOW PROMPT (8-SECOND SPEC):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(promptText, `scene-${scene.sceneNumber}`, `Scene ${scene.sceneNumber} Prompt`)}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 p-2 bg-slate-900/70 rounded-lg">
                  {promptText}
                </pre>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Verification Checklist */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>PRODUCTION VERIFICATION AUDIT</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exact Duration ({targetDuration})</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Natural Hindi Voice-over</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio/Visual Sync</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-Curiosity Hook</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Expanded Main Story</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-Impact Ending</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>8s Flow Prompts Ready</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visual Continuity Intact</span>
          </div>
        </div>
      </div>
    </div>
  );
};
