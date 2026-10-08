import React, { useEffect, useState } from 'react';
import { Terminal, Shield, Zap, Cpu } from 'lucide-react';

interface SystemBootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING GODSEYE SUPERCOMPUTER CORE v3.0...',
  'CONNECTING NEURAL PROCESSING SUBSYSTEMS...',
  'CALIBRATING 8-SECOND FLOW VIDEO ENGINE...',
  'LOADING HINDI NARRATION & PHONETIC ACOUSTIC MODELS...',
  'SYNCHRONIZING PERSISTENT PROJECT MEMORY & GRAPH VAULT...',
  'VERIFYING GEMINI 3.8 FLASH ENGINE INTERCONNECT...',
  'DIAGNOSTICS NOMINAL: 0 ANOMALIES DETECTED...',
  'SYSTEM ONLINE: JARVIS OPERATING MATRIX ACTIVE.',
];

export const SystemBootSequence: React.FC<SystemBootSequenceProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => {
        if (prev + 1 >= BOOT_LOGS.length) {
          clearInterval(interval);
          setTimeout(onComplete, 350);
          return prev;
        }
        return prev + 1;
      });
      setProgress((p) => Math.min(100, p + 14));
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#03060a] text-cyan-400 font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background radial matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,rgba(3,6,10,0.98)_70%)] pointer-events-none" />

      {/* Cybernetic Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-xl p-8 rounded-2xl border border-cyan-500/40 bg-[#070d17]/90 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-cyan-400/60 flex items-center justify-center bg-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Cpu className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                <span>GODSEYE</span>
                <span className="text-xs text-cyan-400 font-normal">OS // V3.0</span>
              </h1>
              <p className="text-[10px] text-cyan-500/70 tracking-wider">AUTONOMOUS CONTENT SUPERCOMPUTER</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="text-[11px] px-3 py-1 rounded border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 hover:text-white transition-all cursor-pointer font-bold tracking-wider"
          >
            BYPASS [ESC]
          </button>
        </div>

        {/* Central Terminal Output */}
        <div className="bg-[#03070e] border border-cyan-900/60 rounded-xl p-4 h-48 overflow-hidden font-mono text-xs space-y-1.5 shadow-inner">
          {BOOT_LOGS.slice(0, currentLineIndex + 1).map((log, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 leading-relaxed transition-opacity ${
                idx === currentLineIndex ? 'text-white font-semibold' : 'text-cyan-400/70'
              }`}
            >
              <span className="text-cyan-500 select-none">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          <div className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />
        </div>

        {/* Progress Bar & Telemetry */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM BOOT VELOCITY
            </span>
            <span className="font-bold">{progress}% READY</span>
          </div>
          <div className="h-1.5 w-full bg-cyan-950/80 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Status Marker */}
        <div className="flex items-center justify-between text-[10px] text-cyan-500/60 border-t border-cyan-500/10 pt-3">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" /> SECURE QUANTUM RUNTIME
          </span>
          <span className="font-mono">SYS_ID: #44A482C0</span>
        </div>
      </div>
    </div>
  );
};
