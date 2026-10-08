import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';

export type CoreProcessingState =
  | 'idle'
  | 'thinking'
  | 'researching'
  | 'scripting'
  | 'scenes'
  | 'flow'
  | 'complete'
  | 'error';

interface JarvisAiCoreProps {
  state?: CoreProcessingState;
  progressPercent?: number;
  currentTask?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const JarvisAiCore: React.FC<JarvisAiCoreProps> = ({
  state = 'idle',
  progressPercent = 0,
  currentTask,
  onClick,
  size = 'lg',
}) => {
  // Dimension mappings
  const dimensions =
    size === 'sm'
      ? 'w-48 h-48 sm:w-56 sm:h-56'
      : size === 'md'
      ? 'w-64 h-64 sm:w-72 sm:h-72'
      : 'w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96';

  const getStateDetails = () => {
    switch (state) {
      case 'thinking':
        return {
          color: 'from-amber-400 via-yellow-400 to-cyan-400',
          ringBorder: 'border-amber-400/50',
          glow: 'rgba(245,158,11,0.3)',
          label: 'NEURAL INFERENCE ACTIVE',
          speed: 'duration-[6s]',
        };
      case 'researching':
        return {
          color: 'from-emerald-400 via-teal-300 to-cyan-400',
          ringBorder: 'border-emerald-400/50',
          glow: 'rgba(16,185,129,0.3)',
          label: 'DEEP FACT & TREND HARVEST',
          speed: 'duration-[5s]',
        };
      case 'scripting':
        return {
          color: 'from-sky-400 via-blue-400 to-indigo-400',
          ringBorder: 'border-sky-400/50',
          glow: 'rgba(14,165,233,0.35)',
          label: 'HINDI TIMING & HOOK SYNTHESIS',
          speed: 'duration-[4s]',
        };
      case 'scenes':
        return {
          color: 'from-purple-400 via-pink-400 to-cyan-400',
          ringBorder: 'border-purple-400/50',
          glow: 'rgba(168,85,247,0.35)',
          label: '8-SECOND PRODUCTION SPLIT',
          speed: 'duration-[4s]',
        };
      case 'flow':
        return {
          color: 'from-pink-500 via-rose-400 to-amber-400',
          ringBorder: 'border-pink-500/50',
          glow: 'rgba(236,72,153,0.4)',
          label: 'GOOGLE FLOW CINEMATIC PROMPT MATRIX',
          speed: 'duration-[3s]',
        };
      case 'complete':
        return {
          color: 'from-emerald-300 via-teal-400 to-cyan-300',
          ringBorder: 'border-emerald-400/70',
          glow: 'rgba(52,211,153,0.5)',
          label: 'SYSTEM OPERATION VERIFIED & READY',
          speed: 'duration-[12s]',
        };
      case 'error':
        return {
          color: 'from-rose-500 via-red-500 to-amber-500',
          ringBorder: 'border-rose-500/70',
          glow: 'rgba(244,63,94,0.5)',
          label: 'ANOMALY DETECTED // REVIEW REQUIRED',
          speed: 'duration-[10s]',
        };
      default:
        return {
          color: 'from-cyan-400 via-sky-300 to-teal-400',
          ringBorder: 'border-cyan-500/40',
          glow: 'rgba(6,182,212,0.25)',
          label: 'SUPERCOMPUTER STANDBY // READY',
          speed: 'duration-[18s]',
        };
    }
  };

  const details = getStateDetails();

  return (
    <div
      onClick={onClick}
      className={`relative ${dimensions} flex items-center justify-center cursor-pointer select-none group transition-transform duration-500 hover:scale-[1.02]`}
    >
      {/* Background Volumetric Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${details.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Outer Technical Calibration Ring (Ring 1) */}
      <div
        className={`absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-spin ${details.speed}`}
      />

      {/* Ring 2: Segmented Arc Ring */}
      <div
        className="absolute inset-4 rounded-full border border-cyan-400/30 border-t-transparent border-b-transparent animate-spin"
        style={{ animationDuration: '14s', animationDirection: 'reverse' }}
      />

      {/* Ring 3: Precise Measurement Nodes */}
      <div className="absolute inset-8 rounded-full border border-cyan-500/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
      </div>

      {/* Ring 4: Fast Rotating Energy Arcs */}
      <div
        className={`absolute inset-12 rounded-full border-2 ${details.ringBorder} border-r-transparent border-l-transparent animate-spin`}
        style={{ animationDuration: state === 'idle' ? '10s' : '3.5s' }}
      />

      {/* Ring 5: Inner Concentric Orbit */}
      <div
        className="absolute inset-16 rounded-full border border-sky-400/40 border-dashed animate-spin"
        style={{ animationDuration: '7s', animationDirection: 'reverse' }}
      />

      {/* Central Heart: Jarvis Nucleus */}
      <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#040914] via-[#09152b] to-[#03060d] border border-cyan-400/60 shadow-[inset_0_0_25px_rgba(6,182,212,0.6),0_0_35px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center text-center p-3">
        {/* Core Icon / Pulse */}
        <div className="relative mb-1">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Cpu className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          {state !== 'idle' && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
          )}
        </div>

        {/* Core State Title */}
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase truncate max-w-[120px]">
          {state}
        </span>

        {/* Progress or Status */}
        {progressPercent > 0 ? (
          <span className="text-xs font-mono font-black text-white">{progressPercent}%</span>
        ) : (
          <span className="text-[9px] font-mono text-cyan-500/70">V3.0 ONLINE</span>
        )}
      </div>

      {/* Technical Orbital Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050b14]/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shadow-lg backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{currentTask || details.label}</span>
        </div>
      </div>
    </div>
  );
};
