import React from 'react';
import {
  Palette,
  X,
  RotateCcw,
  Sparkles,
  Check,
  Sliders,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { ThemePreset, ThemeSettings } from '../types';
import {
  THEME_PRESETS,
  ACCENT_PRESETS,
  DEFAULT_THEME_SETTINGS,
} from '../services/themeService';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onChange: (updated: ThemeSettings) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
}) => {
  if (!isOpen) return null;

  const handleSelectPreset = (preset: ThemePreset) => {
    onChange({
      ...settings,
      preset,
    });
  };

  const handleSelectAccent = (hex: string) => {
    onChange({
      ...settings,
      accentColor: hex,
    });
  };

  const handleSliderChange = (
    field: 'hue' | 'saturation' | 'brightness' | 'accentIntensity',
    val: number
  ) => {
    onChange({
      ...settings,
      [field]: val,
    });
  };

  const handleReset = () => {
    onChange({
      ...DEFAULT_THEME_SETTINGS,
      preset: settings.preset, // Keep current preset if user just wants color reset
      accentColor: '#06b6d4',
    });
  };

  const currentPresetData = THEME_PRESETS[settings.preset] || THEME_PRESETS['GODSEYE DARK'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e1420] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 40px var(--accent-glow)`,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e17]/80">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent)',
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
                THEME CUSTOMIZER
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Global Studio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personalize studio aesthetics, brand accents, and atmospheric hue.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* SECTION 1: THEME PRESETS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                1. Studio Theme Presets (7 Profiles)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Active: <strong className="text-white">{currentPresetData.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                const preset = THEME_PRESETS[key];
                const isSelected = settings.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`relative text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800/80 shadow-md ring-1 ring-cyan-400/50'
                        : 'border-slate-800 bg-[#121824]/60 hover:border-slate-700 hover:bg-[#121824]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Swatch dots */}
                        <div
                          className="w-4 h-4 rounded-full border border-slate-700 shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: preset.canvasBg }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: preset.borderBase }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white tracking-wide">
                          {preset.name}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-400 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        preset.isLight && (
                          <Sun className="w-3.5 h-3.5 text-amber-400 opacity-70" />
                        )
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: ACCENT COLOR */}
          <section className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                2. Studio Accent Color
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {settings.accentColor.toUpperCase()}
                </span>
                <div
                  className="w-4 h-4 rounded-md border border-slate-700 shadow-sm"
                  style={{ backgroundColor: settings.accentColor }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_PRESETS.map((p) => {
                const isSelected =
                  settings.accentColor.toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => handleSelectAccent(p.hex)}
                    className={`relative w-8 h-8 rounded-xl transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0e1420]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: p.hex }}
                    title={p.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}

              {/* Custom Color Picker */}
              <div className="relative flex items-center">
                <label
                  htmlFor="custom-accent-color-picker"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom</span>
                  <input
                    id="custom-accent-color-picker"
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleSelectAccent(e.target.value)}
                    className="w-4 h-4 opacity-0 absolute cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 3: HUE SHIFTER & ATMOSPHERE */}
          <section className="pt-2 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  3. Studio Atmosphere & Hue Shifter
                </label>
                <p className="text-[11px] text-slate-400">
                  Calibrate visual tone without compromising typography readability or WCAG contrast.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 transition-colors cursor-pointer"
                title="Reset Hue and Color Settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Colors</span>
              </button>
            </div>

            {/* Hue Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Hue Rotation</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {settings.hue > 0 ? `+${settings.hue}` : settings.hue}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={settings.hue}
                onChange={(e) => handleSliderChange('hue', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Cooler (-180°)</span>
                <span>Default (0°)</span>
                <span>Warmer (+180°)</span>
              </div>
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Saturation</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {settings.saturation}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={settings.saturation}
                onChange={(e) =>
                  handleSliderChange('saturation', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Muted (50%)</span>
                <span>Standard (100%)</span>
                <span>Vibrant (200%)</span>
              </div>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Display Brightness</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {settings.brightness}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="130"
                step="2"
                value={settings.brightness}
                onChange={(e) =>
                  handleSliderChange('brightness', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Dimmed (70%)</span>
                <span>Balanced (100%)</span>
                <span>High Key (130%)</span>
              </div>
            </div>

            {/* Accent Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Accent Glow & Intensity</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {settings.accentIntensity}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={settings.accentIntensity}
                onChange={(e) =>
                  handleSliderChange('accentIntensity', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Subtle (50%)</span>
                <span>Optimal (100%)</span>
                <span>Maximum (150%)</span>
              </div>
            </div>

            {/* Accessibility Info Note */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                Theme and hue settings persist automatically in your browser storage. Text contrast ratios remain compliant across all color calibrations.
              </p>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-[#0a0e17]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
