import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Volume2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  Server,
  Lock,
} from 'lucide-react';
import { V2NavigationTab } from '../../types';
import { fetchServerAuthStatus, ServerAuthStatus, GodseyeUser } from '../../services/authService';
import { AuthorizedEmailsManager } from './AuthorizedEmailsManager';

interface SettingsViewProps {
  onOpenThemeModal: () => void;
  onNavigate: (tab: V2NavigationTab) => void;
  currentUser?: GodseyeUser | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenThemeModal,
  onNavigate,
  currentUser,
}) => {
  const [serverStatus, setServerStatus] = useState<ServerAuthStatus | null>(null);

  useEffect(() => {
    fetchServerAuthStatus().then(setServerStatus);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header banner */}
      <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-[#121824] via-[#0e121c] to-[#080b12] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 mb-2">
              <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>SYSTEM PREFERENCES & STUDIO CONFIGURATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
              Studio Environment & Developer Configuration
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Customize color themes, review server-side OAuth status, and manage studio settings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Theme & UI Customizer</h3>
              <p className="text-xs text-slate-400">Cyber Cyan, Radiant Gold, Solar Flare, Deep Space</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Personalize the studio interface color accents, glow intensity, and background contrast to match your creative environment.
          </p>

          <button
            type="button"
            id="btn-settings-open-theme"
            onClick={onOpenThemeModal}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Palette className="w-4 h-4" />
            <span>Open Theme Palette Customizer</span>
          </button>
        </div>

        {/* AI Voice Defaults Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d121c]/90 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gemini TTS Voiceover Engine</h3>
              <p className="text-xs text-slate-400">Puck, Charon, Kore, Fenrir, Aoede</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span>Sample Rate:</span>
              <span className="font-mono text-cyan-400">24kHz PCM / WAV</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span>Subtitle Generator:</span>
              <span className="font-mono text-emerald-400">Word-Level Sync SRT</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span>Supported Languages:</span>
              <span className="font-mono text-slate-300">Hindi, Hinglish, English, Gujarati</span>
            </div>
          </div>
        </div>

        {/* DEVELOPER & APPLICATION OWNER API CONFIGURATION (App Owner Only) */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0c101a] p-5 sm:p-6 shadow-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Developer & Owner API Configuration
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold">
                    APP OWNER ONLY
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Application-level server secrets. End users are never prompted for these credentials.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Server-Enforced</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The application owner configures these credentials once on the server. When creators use GOD'S EYE, they authenticate seamlessly via standard Google and social sign-in without seeing or managing developer secrets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Gemini API Key */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">GEMINI_API_KEY</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {serverStatus?.geminiConfigured ? 'Active' : 'Configured'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Server-side Google Gen AI SDK for story reasoning & video generation.
              </p>
            </div>

            {/* Google OAuth Client ID */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">GOOGLE_CLIENT_ID</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    serverStatus?.googleConfigured
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {serverStatus?.googleConfigured ? 'Active' : 'Optional (Server)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Google Identity Services for single-click creator login.
              </p>
            </div>

            {/* YouTube Data API */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">YOUTUBE_CLIENT</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    serverStatus?.youtubeConfigured
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {serverStatus?.youtubeConfigured ? 'Active' : 'Optional (Server)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct YouTube Data API v3 publishing & retention analytics.
              </p>
            </div>

            {/* Meta App ID & Secret */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">META_APP_ID</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    serverStatus?.metaConfigured
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {serverStatus?.metaConfigured ? 'Active' : 'Optional (Server)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Facebook Pages & Instagram Reels Graph API publishing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GOD'S EYE V3.0 PRIVATE ALLOWLIST ACCESS CONTROL */}
      <AuthorizedEmailsManager currentUser={currentUser || null} />
    </div>
  );
};
