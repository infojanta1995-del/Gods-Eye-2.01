import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Key,
  LogOut,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sliders,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { getCurrentUser, GodseyeUser } from '../../services/authService';
import { GodsEyeLogo } from '../GodsEyeLogo';
import { V2NavigationTab } from '../../types';
import { AuthorizedEmailsManager } from './AuthorizedEmailsManager';

interface AccountViewProps {
  currentUser?: GodseyeUser | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
  onNavigate: (tab: V2NavigationTab) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser: initialUser,
  onOpenLogin,
  onSignOut,
  onNavigate,
}) => {
  const user = initialUser || getCurrentUser();

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Operator Account & Quotas
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            God's Eye Studio credentials, API rate limits, and secure operator session
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogin}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <GodsEyeLogo size="xs" mode="idle" />
          <span>Switch Operator / Login Screen</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101a] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">{user?.name || 'Creator'}</h2>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-400 font-mono">{user?.email || 'No email'}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono text-[10px] font-bold">
                  {user?.role || 'CREATOR'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SESSION VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('Connected Accounts')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
            >
              Connected Accounts (3)
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota & Generation Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">AI Token Usage</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-white">48,200</span>
            <span className="text-xs text-slate-400 font-mono"> / 250,000 Tokens</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '19.2%' }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">80.8% quota available</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">TTS Voice Syntheses</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-white">18</span>
            <span className="text-xs text-slate-400 font-mono"> / 100 Audio Generates</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '18%' }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">5 Studio Voices active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Scene Blueprints</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-white">142</span>
            <span className="text-xs text-slate-400 font-mono"> Prompts</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: '65%' }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Google Flow / Veo calibrated</span>
        </div>
      </div>

      {/* Security & System Info */}
      <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Security & Environment Specs</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">AI ENGINE</span>
            <span className="text-cyan-300 font-bold">Google Gemini 3.8 Flash (Server-Side)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">STORAGE STRATEGY</span>
            <span className="text-emerald-300 font-bold">Encrypted Local Vault + Cloud State</span>
          </div>
        </div>
      </div>

      {/* GOD'S EYE V3.0 PRIVATE ALLOWLIST MANAGEMENT (ADMIN / OWNER SECTION) */}
      <AuthorizedEmailsManager currentUser={user} />
    </div>
  );
};
