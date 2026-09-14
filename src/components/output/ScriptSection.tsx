import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Save,
  Clock,
  Type,
  Sparkles,
  ArrowRight,
  Flame,
  Compass,
  Volume2,
  CheckCircle2,
  Tv,
  ListOrdered,
  Layers,
} from 'lucide-react';
import { HighRetentionScript, StudioConfig, ScriptSection as ScriptSectionType } from '../../types';

interface ScriptSectionProps {
  script: HighRetentionScript;
  config: StudioConfig;
  onUpdateScript?: (updated: HighRetentionScript) => void;
  onRegenerateScript?: () => void;
  onCopyText: (text: string, label: string) => void;
  onContinue?: () => void;
  selectedAngle?: string;
  selectedHook?: string;
  isLoading?: boolean;
}

export const ScriptSection: React.FC<ScriptSectionProps> = ({
  script,
  config,
  onUpdateScript,
  onRegenerateScript,
  onCopyText,
  onContinue,
  selectedAngle,
  selectedHook,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(script.text || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'structured' | 'fullText' | 'teleprompter'>('structured');

  const words = (editText || script.text || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  // Standard speaking rate: ~140 words per minute for conversational short-form
  const calculatedSeconds = Math.round((wordCount / 140) * 60);
  const estDuration = calculatedSeconds > 0 ? `${calculatedSeconds}s` : script.duration || config.duration;

  const isShortFormat = config.duration !== '2 minutes' && config.duration !== '3 minutes' && config.videoFormat !== '16:9 Horizontal';

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    if (onUpdateScript) {
      onUpdateScript({
        ...script,
        text: editText,
        wordCount,
        estimatedDuration: estDuration,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(script.text || '');
    setIsEditing(false);
  };

  // Divide script into 4 retention phases if not pre-divided
  const sections = script.sections && script.sections.length > 0 ? script.sections : [];

  const getSectionName = (s: any) => String(s?.name || s?.phase || '').toUpperCase();

  const hookSection = sections.find((s) => getSectionName(s).includes('HOOK')) || {
    phase: '00:00 - 00:05',
    name: 'HOOK',
    narration: selectedHook || script.hook || script.sections?.[0]?.narration || '',
    cue: 'Immediate tension • 0.5s pause',
    categoryType: 'SOURCE INFORMATION' as const,
  };

  const bodySections = sections.filter(
    (s) =>
      !getSectionName(s).includes('HOOK') &&
      !getSectionName(s).includes('REVEAL') &&
      !getSectionName(s).includes('PAYOFF') &&
      !getSectionName(s).includes('ENDING') &&
      !getSectionName(s).includes('CTA')
  );

  const payoffSection = sections.find(
    (s) =>
      getSectionName(s).includes('REVEAL') ||
      getSectionName(s).includes('PAYOFF') ||
      getSectionName(s).includes('CLIMAX')
  ) || {
    phase: '00:15 - 00:24',
    name: 'PAYOFF / REVEAL',
    narration: script.payoff || sections[Math.floor(sections.length / 2)]?.narration || 'The unexpected discovery that changes the baseline premise.',
    cue: 'Dramatic climax reveal • Authoritative',
    categoryType: 'FACT' as const,
  };

  const endingSection = sections.find(
    (s) =>
      getSectionName(s).includes('ENDING') ||
      getSectionName(s).includes('CTA') ||
      getSectionName(s).includes('CONCLUSION')
  ) || {
    phase: '00:24 - 00:30',
    name: 'ENDING & CTA',
    narration: script.ending || sections[sections.length - 1]?.narration || 'What are your thoughts on this? Leave a comment and subscribe.',
    cue: 'Engagement retention loop',
    categoryType: 'AI INTERPRETATION' as const,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0a1220] to-[#070b12] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-bold">
                STEP 4 • RETENTION SCRIPT STUDIO
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {isShortFormat ? 'Short/Reel (9:16)' : 'Long Video (16:9)'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-heading mt-0.5">
              Retention-Engineered Script
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Structured into Hook, Body, Payoff, and CTA calibrated for maximum viewer watch-time.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onRegenerateScript && (
            <button
              type="button"
              onClick={onRegenerateScript}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span>{isLoading ? 'Generating...' : 'Regenerate'}</span>
            </button>
          )}

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditText(script.text || '');
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-200 bg-blue-950/80 hover:bg-blue-900/90 border border-blue-700/50 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Script</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleCopy(script.text || '', 'full-script', 'Full Script')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
          >
            {copiedKey === 'full-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'full-script' ? 'Copied' : 'Copy'}</span>
          </button>

          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Script Doctor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Script Metrics Bar & Context Drivers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0b101a] border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-950/70 text-blue-400 border border-blue-800/40">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Est. Duration</span>
            <span className="text-sm font-bold text-white font-mono">{estDuration}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101a] border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Word Count</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">{wordCount} words</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101a] border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950/70 text-purple-400 border border-purple-800/40">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Format</span>
            <span className="text-xs font-bold text-purple-300 truncate block">
              {config.videoFormat}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101a] border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Language / Tone</span>
            <span className="text-xs font-bold text-emerald-300 truncate block">
              {config.language} • {config.mood}
            </span>
          </div>
        </div>
      </div>

      {/* Upstream Driving Factors (Story Angle & Hook) */}
      <div className="p-3.5 rounded-2xl bg-[#090e18] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">DRIVEN BY:</span>
          {selectedAngle && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-[11px] font-medium">
              <Compass className="w-3 h-3" />
              Angle: {selectedAngle.slice(0, 45)}...
            </span>
          )}
          {selectedHook && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/50 text-rose-300 text-[11px] font-medium">
              <Flame className="w-3 h-3" />
              Hook: {selectedHook.slice(0, 45)}...
            </span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('structured')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === 'structured'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Retention Flow
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fullText')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === 'fullText'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Text
          </button>
          <button
            type="button"
            onClick={() => setViewMode('teleprompter')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === 'teleprompter'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Teleprompter
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isEditing ? (
        /* Edit Mode Textarea */
        <div className="p-4 rounded-2xl bg-[#0b101a] border border-blue-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-blue-400 font-bold">
              DIRECT SCRIPT EDITOR
            </span>
            <span className="text-xs font-mono text-slate-400">{wordCount} words</span>
          </div>
          <textarea
            id="script-editor-textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono leading-relaxed focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Write or edit script narration lines..."
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'teleprompter' ? (
        /* Teleprompter Mode */
        <div className="p-8 rounded-2xl bg-black border border-cyan-500/40 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest">
              TELEPROMPTER PROJECTION MODE
            </span>
            <span className="text-xs font-mono text-slate-400">Pacing: ~140 WPM</span>
          </div>
          <div className="text-xl sm:text-2xl text-slate-100 font-sans font-medium leading-loose space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {(script.text || '').split('\n\n').map((paragraph, i) => (
              <p key={i} className="hover:text-cyan-200 transition-colors">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : viewMode === 'fullText' ? (
        /* Full Text Mode */
        <div className="p-5 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Full Spoken Narration
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(script.text || '', 'full-raw', 'Script Text')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'full-raw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <div className="text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            {script.text || 'No script text generated yet.'}
          </div>
        </div>
      ) : (
        /* Retention Flow Structured View (Hook -> Body -> Payoff -> Ending) */
        <div className="space-y-4">
          {/* Phase 1: Hook */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-[#0d131f] to-[#0b101a] border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono font-bold border border-rose-800/60">
                  PHASE 1 • 00:00 - 00:05
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  VIRAL HOOK (SWIPE DEFENSE)
                </span>
              </div>
              <span className="text-[11px] font-mono text-rose-300/80">Immediate Tension</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed pl-1">
              "{hookSection.narration}"
            </p>
            {hookSection.cue && (
              <p className="text-[11px] text-slate-400 italic pl-1">
                Direction: {hookSection.cue}
              </p>
            )}
          </div>

          {/* Phase 2: Body (Context & Development) */}
          <div className="p-4 rounded-2xl bg-[#0b101a] border border-blue-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono font-bold border border-blue-800/60">
                  PHASE 2 • 00:05 - 00:18
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  BODY (CONTEXT & INVESTIGATIVE DEVELOPMENT)
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-300/80">Factual Build</span>
            </div>

            <div className="space-y-2">
              {(bodySections.length > 0 ? bodySections : sections.slice(1, -1)).map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400 font-bold">{sec.phase || `Segment ${idx + 1}`}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{sec.categoryType || 'FACT'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {sec.narration}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Payoff */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0d131f] to-[#0b101a] border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-800/60">
                  PHASE 3 • 00:18 - 00:25
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  PAYOFF (THE BIG REVEAL / CLIMAX)
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-300/80">Narrative Resolution</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed pl-1">
              "{payoffSection.narration}"
            </p>
            {payoffSection.cue && (
              <p className="text-[11px] text-slate-400 italic pl-1">
                Direction: {payoffSection.cue}
              </p>
            )}
          </div>

          {/* Phase 4: Ending / CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0d131f] to-[#0b101a] border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-800/60">
                  PHASE 4 • 00:25 - 00:30
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  ENDING / RETENTION LOOP & CTA
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300/80">Engagement Trigger</span>
            </div>
            <p className="text-sm font-semibold text-slate-200 leading-relaxed pl-1">
              "{endingSection.narration}"
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          Script formatted ({wordCount} words • {estDuration}) • Ready for AI quality audit
        </span>
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/20"
          >
            <span>Run Script Doctor Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
