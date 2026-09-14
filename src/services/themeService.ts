import { ThemePreset, ThemeSettings } from '../types';

export const THEME_PRESETS: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    canvasBg: string;
    surfaceBg: string;
    cardBg: string;
    headerBg: string;
    borderBase: string;
    borderSubtle: string;
    textMain: string;
    textMuted: string;
    isLight: boolean;
  }
> = {
  'GODSEYE DARK': {
    name: 'GODSEYE Dark',
    description: 'The signature high-contrast cybernetic studio aesthetic.',
    canvasBg: '#090b10',
    surfaceBg: '#0c1017',
    cardBg: '#121824',
    headerBg: 'rgba(12, 16, 23, 0.92)',
    borderBase: '#1e293b',
    borderSubtle: '#141d2c',
    textMain: '#f1f5f9',
    textMuted: '#94a3b8',
    isLight: false,
  },
  LIGHT: {
    name: 'Daylight Clean',
    description: 'Crisp, high-readability studio theme for bright environments.',
    canvasBg: '#f8fafc',
    surfaceBg: '#ffffff',
    cardBg: '#f1f5f9',
    headerBg: 'rgba(255, 255, 255, 0.92)',
    borderBase: '#cbd5e1',
    borderSubtle: '#e2e8f0',
    textMain: '#0f172a',
    textMuted: '#64748b',
    isLight: true,
  },
  AMOLED: {
    name: 'True AMOLED',
    description: 'Absolute pitch-black canvas engineered for OLED displays.',
    canvasBg: '#000000',
    surfaceBg: '#050505',
    cardBg: '#0c0c0c',
    headerBg: 'rgba(0, 0, 0, 0.95)',
    borderBase: '#222222',
    borderSubtle: '#161616',
    textMain: '#ffffff',
    textMuted: '#a1a1aa',
    isLight: false,
  },
  'MIDNIGHT BLUE': {
    name: 'Midnight Blue',
    description: 'Deep oceanic navy tones with refined corporate authority.',
    canvasBg: '#060d1b',
    surfaceBg: '#0a1426',
    cardBg: '#0f1c35',
    headerBg: 'rgba(10, 20, 38, 0.92)',
    borderBase: '#1d2f4f',
    borderSubtle: '#142239',
    textMain: '#e2e8f0',
    textMuted: '#94a3b8',
    isLight: false,
  },
  GRAPHITE: {
    name: 'Graphite Carbon',
    description: 'Neutral carbon and titanium dark grey for minimalist focus.',
    canvasBg: '#111214',
    surfaceBg: '#17181c',
    cardBg: '#1f2026',
    headerBg: 'rgba(23, 24, 28, 0.92)',
    borderBase: '#2e3038',
    borderSubtle: '#222329',
    textMain: '#e4e4e7',
    textMuted: '#a1a1aa',
    isLight: false,
  },
  CYBER: {
    name: 'Cyberpunk Neon',
    description: 'Electric cyber space with vibrant edge illumination.',
    canvasBg: '#050914',
    surfaceBg: '#081122',
    cardBg: '#0d1a33',
    headerBg: 'rgba(8, 17, 34, 0.92)',
    borderBase: '#112b50',
    borderSubtle: '#0c1e38',
    textMain: '#e0f2fe',
    textMuted: '#7dd3fc',
    isLight: false,
  },
  CINEMATIC: {
    name: 'Cinematic Amber',
    description: 'Warm, tungsten-lit film projection and golden ratio grading.',
    canvasBg: '#0f0c0a',
    surfaceBg: '#17130f',
    cardBg: '#211c16',
    headerBg: 'rgba(23, 19, 15, 0.92)',
    borderBase: '#382b20',
    borderSubtle: '#2a2017',
    textMain: '#f5ede6',
    textMuted: '#bfa895',
    isLight: false,
  },
};

export const ACCENT_PRESETS = [
  { name: 'Electric Cyan', hex: '#06b6d4', ring: 'ring-cyan-500' },
  { name: 'Emerald Green', hex: '#10b981', ring: 'ring-emerald-500' },
  { name: 'Neon Violet', hex: '#8b5cf6', ring: 'ring-violet-500' },
  { name: 'Royal Blue', hex: '#3b82f6', ring: 'ring-blue-500' },
  { name: 'Amber Gold', hex: '#f59e0b', ring: 'ring-amber-500' },
  { name: 'Crimson Red', hex: '#ef4444', ring: 'ring-red-500' },
  { name: 'Hot Rose', hex: '#f43f5e', ring: 'ring-rose-500' },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  preset: 'GODSEYE DARK',
  accentColor: '#06b6d4',
  hue: 0,
  saturation: 100,
  brightness: 100,
  accentIntensity: 100,
};

const THEME_STORAGE_KEY = 'godseye_theme_settings';

// Helper to convert hex to rgb triplet for css variables
export function hexToRgb(hex: string): string {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return '6, 182, 212';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

// Load saved theme settings from localStorage
export function loadSavedThemeSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        preset: parsed.preset || 'GODSEYE DARK',
        accentColor: parsed.accentColor || '#06b6d4',
        hue: typeof parsed.hue === 'number' ? parsed.hue : 0,
        saturation: typeof parsed.saturation === 'number' ? parsed.saturation : 100,
        brightness: typeof parsed.brightness === 'number' ? parsed.brightness : 100,
        accentIntensity: typeof parsed.accentIntensity === 'number' ? parsed.accentIntensity : 100,
      };
    }
  } catch (e) {
    console.warn('Failed to parse saved theme settings:', e);
  }
  return { ...DEFAULT_THEME_SETTINGS };
}

// Save theme settings to localStorage
export function persistThemeSettings(settings: ThemeSettings): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to persist theme settings:', e);
  }
}

// Apply theme settings directly to document.documentElement
export function applyThemeToDOM(settings: ThemeSettings): void {
  const root = document.documentElement;
  const presetData = THEME_PRESETS[settings.preset] || THEME_PRESETS['GODSEYE DARK'];

  // Set Light or Dark class on <html>
  if (presetData.isLight) {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }

  // Set theme data attribute for CSS targeting
  root.setAttribute('data-theme', settings.preset.toLowerCase().replace(/\s+/g, '-'));

  // Apply colors as CSS variables
  root.style.setProperty('--bg-canvas', presetData.canvasBg);
  root.style.setProperty('--bg-surface', presetData.surfaceBg);
  root.style.setProperty('--bg-card', presetData.cardBg);
  root.style.setProperty('--bg-header', presetData.headerBg);
  root.style.setProperty('--border-base', presetData.borderBase);
  root.style.setProperty('--border-subtle', presetData.borderSubtle);
  root.style.setProperty('--text-main', presetData.textMain);
  root.style.setProperty('--text-muted', presetData.textMuted);

  // Accent color variables
  root.style.setProperty('--accent', settings.accentColor);
  const rgb = hexToRgb(settings.accentColor);
  root.style.setProperty('--accent-rgb', rgb);
  root.style.setProperty('--accent-glow', `rgba(${rgb}, ${(settings.accentIntensity / 100) * 0.35})`);
  root.style.setProperty('--accent-soft', `rgba(${rgb}, ${(settings.accentIntensity / 100) * 0.12})`);
  root.style.setProperty('--accent-border', `rgba(${rgb}, ${(settings.accentIntensity / 100) * 0.4})`);

  // Hue shifter variables
  root.style.setProperty('--hue-shift', `${settings.hue}deg`);
  root.style.setProperty('--sat-shift', `${settings.saturation}%`);
  root.style.setProperty('--bright-shift', `${settings.brightness}%`);

  // Set body background color directly to prevent flickering
  document.body.style.backgroundColor = presetData.canvasBg;
  document.body.style.color = presetData.textMain;
}
