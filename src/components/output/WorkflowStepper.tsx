import React from 'react';
import {
  FileSearch,
  Compass,
  Flame,
  FileText,
  ShieldCheck,
  Clapperboard,
  Image as ImageIcon,
  Tag,
  Send,
  CheckCircle2,
  CircleDot,
  Circle,
  ArrowRight,
  ChevronRight,
  Database,
} from 'lucide-react';
import { WorkflowStage, GodseyeAiResult } from '../../types';

interface WorkflowStepperProps {
  currentStage: WorkflowStage;
  onSelectStage: (stage: WorkflowStage) => void;
  aiResult: GodseyeAiResult | null;
  hasSource: boolean;
}

interface StageDefinition {
  id: WorkflowStage;
  label: string;
  shortLabel: string;
  stepNumber: number;
  icon: React.ReactNode;
  isComplete: (result: GodseyeAiResult | null, hasSource: boolean) => boolean;
}

export const WORKFLOW_STAGES: StageDefinition[] = [
  {
    id: 'source',
    label: 'Source Ingestion',
    shortLabel: 'Source',
    stepNumber: 1,
    icon: <Database className="w-3.5 h-3.5" />,
    isComplete: (_, hasSource) => hasSource,
  },
  {
    id: 'sourceIntel',
    label: 'Source Intelligence',
    shortLabel: 'Intel',
    stepNumber: 2,
    icon: <FileSearch className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.analysis?.importantFacts?.length),
  },
  {
    id: 'storyAngle',
    label: 'Story Angle Engine',
    shortLabel: 'Angle',
    stepNumber: 3,
    icon: <Compass className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.storyAngle?.mainAngle || res?.storyAngle?.selectedAngle),
  },
  {
    id: 'hooks',
    label: 'Viral Hook Engine',
    shortLabel: 'Hooks',
    stepNumber: 4,
    icon: <Flame className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.hooks?.bestHook || res?.hooks?.hookList?.length),
  },
  {
    id: 'script',
    label: 'Script Studio',
    shortLabel: 'Script',
    stepNumber: 5,
    icon: <FileText className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.script?.text),
  },
  {
    id: 'scriptDoctor',
    label: 'Script Doctor',
    shortLabel: 'Doctor',
    stepNumber: 6,
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.qualityCheck?.overallScore),
  },
  {
    id: 'scenes',
    label: 'Scene Blueprint',
    shortLabel: 'Scenes',
    stepNumber: 7,
    icon: <Clapperboard className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.scenes?.length),
  },
  {
    id: 'thumbnails',
    label: 'Thumbnail Engine',
    shortLabel: 'Thumbnail',
    stepNumber: 8,
    icon: <ImageIcon className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.thumbnails?.concepts?.length || res?.thumbnails?.bestThumbnail),
  },
  {
    id: 'seo',
    label: 'Multi-Platform SEO',
    shortLabel: 'SEO',
    stepNumber: 9,
    icon: <Tag className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res?.seo?.youtubeShorts?.titles || res?.seo?.youtubeLong?.titles?.length),
  },
  {
    id: 'publishReady',
    label: 'Ready To Publish',
    shortLabel: 'Publish',
    stepNumber: 10,
    icon: <Send className="w-3.5 h-3.5" />,
    isComplete: (res) => Boolean(res && res.script && res.scenes?.length && res.seo),
  },
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStage,
  onSelectStage,
  aiResult,
  hasSource,
}) => {
  const currentIdx = WORKFLOW_STAGES.findIndex((s) => s.id === currentStage);
  const currentStep = WORKFLOW_STAGES[currentIdx] || WORKFLOW_STAGES[0];

  const completedCount = WORKFLOW_STAGES.filter((s) => s.isComplete(aiResult, hasSource)).length;
  const progressPercent = Math.round((completedCount / WORKFLOW_STAGES.length) * 100);

  return (
    <div className="w-full bg-[#080d16] border border-cyan-900/40 rounded-2xl p-3 sm:p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-md">
      {/* Top Header: Progress Status & Flow Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono uppercase font-bold tracking-wider text-cyan-400 text-[11px]">
            AI CONTENT INTELLIGENCE WORKFLOW
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-semibold hidden md:inline">
            Stage {currentIdx + 1} of 10: <span className="text-white font-bold">{currentStep.label}</span>
          </span>
        </div>

        {/* Legend / Status badges: ✓ completed, ● current, ○ upcoming */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">✓</span>
            <span className="text-slate-300">completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-cyan-400 font-bold">●</span>
            <span className="text-cyan-300 font-semibold">current</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-600 font-bold">○</span>
            <span className="text-slate-500">upcoming</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 font-mono font-bold text-[10px]">
            {progressPercent}% COMPLETE
          </div>
        </div>
      </div>

      {/* Interactive 10-Stage Horizontal Stepper */}
      <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex items-center gap-1.5 min-w-max">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = stage.isComplete(aiResult, hasSource);
            const isCurrent = stage.id === currentStage;
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  id={`workflow-stage-${stage.id}`}
                  onClick={() => onSelectStage(stage.id)}
                  title={`${stage.stepNumber}. ${stage.label} (${isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Upcoming'})`}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none ${
                    isCurrent
                      ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/40 font-bold scale-[1.02]'
                      : isCompleted
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:bg-emerald-950/70 hover:border-emerald-600'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500 hover:text-slate-300 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator Icon (✓, ●, ○) */}
                  <span className="flex-shrink-0">
                    {isCompleted ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/40">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-[10px] font-bold border border-cyan-400 animate-pulse">
                        ●
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                        ○
                      </span>
                    )}
                  </span>

                  {/* Stage Label */}
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className={`text-[10px] font-mono ${isCurrent ? 'text-cyan-300 font-bold' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {stage.stepNumber}.
                    </span>
                    <span className={isCurrent ? 'text-white' : ''}>
                      {stage.shortLabel}
                    </span>
                  </span>
                </button>

                {idx < WORKFLOW_STAGES.length - 1 && (
                  <ChevronRight
                    className={`w-3 h-3 flex-shrink-0 ${
                      idx < currentIdx ? 'text-cyan-600' : 'text-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
