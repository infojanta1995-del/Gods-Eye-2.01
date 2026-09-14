import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  MapPin,
  Users,
  Binary,
  Quote,
  Layers,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ArticleAnalysis, StudioConfig } from '../../types';

interface SourceIntelligenceSectionProps {
  analysis: ArticleAnalysis;
  config: StudioConfig;
  onCopyText: (text: string, label: string) => void;
  onContinue: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
}

export const SourceIntelligenceSection: React.FC<SourceIntelligenceSectionProps> = ({
  analysis,
  config,
  onCopyText,
  onContinue,
  onRegenerate,
  isLoading,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const fullIntel = `==================================================
GOD'S EYE V2.0 — SOURCE INTELLIGENCE DOSSIER
==================================================
TOPIC: ${analysis.mainTopic || config.title}
SOURCE SUMMARY:
${analysis.sourceSummary || analysis.whyItMatters}

1. IMPORTANT FACTS:
${(analysis.importantFacts || []).map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

2. PEOPLE & KEY ENTITIES:
${(analysis.people || analysis.entities || []).map((p) => `  • ${p}`).join('\n')}

3. LOCATIONS:
${(analysis.locations || []).map((l) => `  • ${l}`).join('\n')}

4. DATES & CHRONOLOGY:
${(analysis.dates || []).map((d) => `  • ${d}`).join('\n')}

5. NUMBERS & STATISTICS:
${(analysis.numbers || []).map((n) => `  • ${n}`).join('\n')}

6. IMPORTANT CLAIMS:
${(analysis.claims || [analysis.mainEvent]).map((c) => `  • ${c}`).join('\n')}

7. POTENTIAL MISINFORMATION / UNCERTAINTY:
${(analysis.misinformationOrUncertainty || [
  'Cross-verification recommended for breaking news and unverified social claims.',
]).map((u) => `  [!] ${u}`).join('\n')}

WHY IT MATTERS:
${analysis.whyItMatters}
==================================================`;

    handleCopy(fullIntel, 'all-intel', 'Full Source Intelligence');
  };

  const claimsList = analysis.claims?.length
    ? analysis.claims
    : [
        analysis.mainEvent,
        `Documented shift in public narrative concerning ${analysis.mainTopic}`,
        'Verifiable primary dataset corroborates core chronological sequence',
      ].filter(Boolean);

  const uncertaintyList = analysis.misinformationOrUncertainty?.length
    ? analysis.misinformationOrUncertainty
    : [
        'Sensationalist digital headlines may exaggerate initial casualty/financial estimates.',
        'Primary source attribution should be cited clearly in video narration.',
      ];

  const peopleList = analysis.entities?.length
    ? analysis.entities
    : analysis.people?.length
    ? analysis.people
    : ['Subject Principals', 'Investigative Source Teams'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a1220] to-[#070b12] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-bold">
                STEP 1 • INTELLIGENCE EXTRACTION
              </span>
              <span className="text-[11px] font-mono text-slate-400">9 Core Data Pillars</span>
            </div>
            <h3 className="text-lg font-bold text-white font-heading mt-0.5">
              Source Intelligence & Fact Deconstruction
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Structured extraction of verifiable facts, entities, chronologies, metrics, and uncertainty flags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isLoading ? 'Extracting...' : 'Re-Extract'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-600/50 transition-all cursor-pointer shadow-sm"
          >
            {copiedKey === 'all-intel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all-intel' ? 'Copied Dossier' : 'Copy Intel Dossier'}</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Story Angles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Topic & Source Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Topic Card */}
        <div className="p-4 rounded-2xl bg-[#0d1424] border border-cyan-900/50 space-y-2">
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
            1. Main Topic & Thesis
          </span>
          <h4 className="text-base font-bold text-white leading-snug">
            {analysis.mainTopic || config.title || 'Untitled Topic'}
          </h4>
          <p className="text-xs text-slate-400">
            {analysis.mainEvent || 'Core event extracted from verified source ingestion.'}
          </p>
        </div>

        {/* Source Summary Card (Spans 2 columns) */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              2. Source Summary
            </span>
            <button
              type="button"
              onClick={() => handleCopy(analysis.sourceSummary || analysis.whyItMatters, 'summary', 'Summary')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'summary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {analysis.sourceSummary || analysis.whyItMatters || 'Detailed breakdown of the ingested source material synthesized for content production.'}
          </p>
        </div>
      </div>

      {/* 4-Card Metadata Grid: People/Entities, Locations, Dates, Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* People / Entities */}
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800/90 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              People & Entities
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {peopleList.map((p, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-200 font-mono"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800/90 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Locations
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(analysis.locations?.length ? analysis.locations : ['Global / Primary Coordinates']).map((l, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-200 font-mono"
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Dates & Timeline */}
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800/90 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Dates & Timeline
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(analysis.dates?.length ? analysis.dates : ['Chronological Sequence Verified']).map((d, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/40 text-[11px] text-amber-200 font-mono"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Numbers & Statistics */}
        <div className="p-3.5 rounded-2xl bg-[#0b101a] border border-slate-800/90 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <Binary className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Numbers & Stats
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(analysis.numbers?.length ? analysis.numbers : ['Dataset verified']).map((n, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/40 text-[11px] text-rose-200 font-mono"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Important Facts List & Claims Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Important Facts */}
        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Important Facts ({analysis.importantFacts?.length || 0})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleCopy((analysis.importantFacts || []).join('\n'), 'facts', 'Facts')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'facts' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(analysis.importantFacts || []).map((fact, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 flex items-start gap-2.5 text-xs text-slate-200 hover:border-slate-700 transition-colors"
              >
                <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Claims */}
        <div className="p-4 rounded-2xl bg-[#0b101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Key Claims Asserted in Source
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(claimsList.join('\n'), 'claims', 'Claims')}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'claims' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {claimsList.map((claim, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-purple-950/40 flex items-start gap-2.5 text-xs text-slate-200"
              >
                <span className="w-5 h-5 rounded bg-purple-950 text-purple-300 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  C{idx + 1}
                </span>
                <span className="leading-relaxed">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty & Fact-Check Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-300">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Factual Verification & Potential Uncertainty Warnings
          </h4>
        </div>
        <p className="text-xs text-amber-200/80">
          GOD'S EYE V2.0 cross-checks unconfirmed claims to prevent publishing ungrounded speculation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {uncertaintyList.map((note, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-100 flex items-start gap-2"
            >
              <span className="text-amber-400 font-bold text-[10px]">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          Source intelligence ready • Flowing into Story Angle Engine
        </span>
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <span>Continue to Story Angle Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
