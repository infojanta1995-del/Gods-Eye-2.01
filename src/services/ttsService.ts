import { TTSConfig, TTSAudioData, SceneItem, SceneTiming } from '../types';

export interface TTSProvider {
  name: string;
  isAvailable: boolean;
  generateSpeech: (
    script: string,
    config: TTSConfig,
    scenes: SceneItem[],
    contentType: string,
    mood: string
  ) => Promise<TTSAudioData>;
}

export class GeminiTTSProvider implements TTSProvider {
  name = 'Google Gemini TTS';
  isAvailable = true;

  async generateSpeech(
    script: string,
    config: TTSConfig,
    scenes: SceneItem[],
    contentType: string,
    mood: string
  ): Promise<TTSAudioData> {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script,
        language: config.language,
        voice: config.voice,
        speed: config.speed,
        speakingStyle: config.speakingStyle,
        pitch: config.pitch,
        energy: config.energy,
        customDirection: config.customDirection,
        scenes,
        contentType,
        mood,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate speech with Google Gemini TTS');
    }

    // Create a local blob URL from base64 wav
    const byteCharacters = atob(data.audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: data.mimeType || 'audio/wav' });
    const audioUrl = URL.createObjectURL(blob);

    return {
      audioUrl,
      base64Data: data.audioBase64,
      mimeType: data.mimeType || 'audio/wav',
      durationSeconds: data.durationSeconds || 0,
      status: 'READY',
      voiceUsed: data.voiceUsed || config.voice,
      languageUsed: data.languageUsed || config.language,
      sceneTimings: data.sceneTimings || [],
      generatedAt: data.generatedAt || new Date().toISOString(),
    };
  }
}

export class OtherTTSProvider implements TTSProvider {
  name = 'External Cloud TTS Provider';
  isAvailable = false;

  async generateSpeech(): Promise<TTSAudioData> {
    throw new Error('External Cloud TTS Provider is not configured yet. Using Google Gemini TTS.');
  }
}

// Master TTS Engine Router
export const defaultTTSProvider = new GeminiTTSProvider();

/**
 * Format seconds into mm:ss format
 */
export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds into SRT timestamp (00:00:00,000)
 */
export function formatSecondsToSrtTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const millis = Math.floor((totalSeconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
}

/**
 * Generates an SRT subtitle file from scene timings or script sentences
 */
export function generateSrtContent(
  sceneTimings: SceneTiming[],
  fallbackScript: string,
  totalDurationSeconds = 60
): string {
  if (sceneTimings && sceneTimings.length > 0) {
    return sceneTimings
      .map((timing, index) => {
        const startParts = timing.startTime.split(':').map(Number);
        const endParts = timing.endTime.split(':').map(Number);
        const startSec = (startParts[0] || 0) * 60 + (startParts[1] || 0);
        const endSec = (endParts[0] || 0) * 60 + (endParts[1] || 0);

        return `${index + 1}
${formatSecondsToSrtTime(startSec)} --> ${formatSecondsToSrtTime(endSec)}
${timing.voiceOver || `Scene ${timing.sceneNumber}`}
`;
      })
      .join('\n');
  }

  // Fallback if no specific scene timings exist yet
  const sentences = fallbackScript
    .split(/[.\n!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  const durationPerSentence = totalDurationSeconds / Math.max(1, sentences.length);

  return sentences
    .map((sentence, index) => {
      const startSec = index * durationPerSentence;
      const endSec = Math.min(totalDurationSeconds, (index + 1) * durationPerSentence);

      return `${index + 1}
${formatSecondsToSrtTime(startSec)} --> ${formatSecondsToSrtTime(endSec)}
${sentence}
`;
    })
    .join('\n');
}

/**
 * Download a file in browser
 */
export function triggerBrowserDownload(content: Blob | string, filename: string, mimeType = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
