import { VideoFormat, SceneItem, MasterVideoStyle } from '../types';

export interface FormatSpec {
  videoFormat: string;
  outputFormat: string;
  aspectRatio: string;
  frameSize: string;
  resolutionTarget: string;
  composition: string;
  safeArea: string;
  promptHeader: string;
}

/**
 * Returns strict format specifications for 9:16, 16:9, and 1:1 formats.
 */
export function getFormatSpec(format?: string | VideoFormat): FormatSpec {
  if (format && format.includes('9:16')) {
    return {
      videoFormat: '9:16 PORTRAIT',
      outputFormat: '9:16 VERTICAL PORTRAIT',
      aspectRatio: '9:16',
      frameSize: '1080x1920',
      resolutionTarget: '1080x1920',
      composition: 'VERTICAL MOBILE-FIRST FRAMING',
      safeArea: 'Keep focal subjects and on-screen text inside central 65% vertical safe area, clear of top 15% and bottom 20% mobile UI overlays.',
      promptHeader: `OUTPUT FORMAT: 9:16 VERTICAL PORTRAIT
ASPECT RATIO: 9:16
RESOLUTION: 1080x1920
COMPOSITION: VERTICAL MOBILE-FIRST FRAMING`
    };
  }
  
  if (format && (format.includes('1:1') || format.toLowerCase().includes('square'))) {
    return {
      videoFormat: '1:1 SQUARE',
      outputFormat: '1:1 SQUARE',
      aspectRatio: '1:1',
      frameSize: '1080x1080',
      resolutionTarget: '1080x1080',
      composition: 'SQUARE FRAMING',
      safeArea: 'Centered square composition with balanced 10% margins on all edges for feed scroll readability.',
      promptHeader: `OUTPUT FORMAT: 1:1 SQUARE
ASPECT RATIO: 1:1
RESOLUTION: 1080x1080
COMPOSITION: SQUARE FRAMING`
    };
  }

  // Default 16:9 Horizontal
  return {
    videoFormat: '16:9 HORIZONTAL',
    outputFormat: '16:9 HORIZONTAL',
    aspectRatio: '16:9',
    frameSize: '1920x1080',
    resolutionTarget: '1920x1080',
    composition: 'HORIZONTAL WIDESCREEN FRAMING',
    safeArea: 'Cinematic widescreen 16:9 composition, rule-of-thirds subject framing with 10% title-safe padding.',
    promptHeader: `OUTPUT FORMAT: 16:9 HORIZONTAL
ASPECT RATIO: 16:9
RESOLUTION: 1920x1080
COMPOSITION: HORIZONTAL WIDESCREEN FRAMING`
    };
}

/**
 * Generates a complete, standalone, production-ready Google Flow / Veo prompt
 * containing all required format lines and 24 granular scene specifications.
 */
export function buildStandalonePrompt(
  scene: SceneItem,
  format?: string | VideoFormat,
  mood: string = 'Dramatic',
  masterStyle?: MasterVideoStyle
): string {
  const spec = getFormatSpec(format);
  const sceneNum = scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : `${scene.sceneNumber}`;

  // If the prompt already has the full header, avoid repeating
  const rawPrompt = scene.finalVideoPrompt || scene.videoPrompt || '';
  
  // Clean raw prompt of any duplicate format lines if rebuilding
  const cleanedPrompt = rawPrompt
    .replace(/OUTPUT FORMAT: [^\n]+/gi, '')
    .replace(/VIDEO FORMAT: [^\n]+/gi, '')
    .replace(/ASPECT RATIO: [^\n]+/gi, '')
    .replace(/FRAME SIZE: [^\n]+/gi, '')
    .replace(/RESOLUTION(?: TARGET)?: [^\n]+/gi, '')
    .replace(/COMPOSITION: [^\n]+/gi, '')
    .replace(/VERTICAL MOBILE-FIRST (?:COMPOSITION|FRAMING)/gi, '')
    .replace(/HORIZONTAL WIDESCREEN (?:COMPOSITION|FRAMING)/gi, '')
    .replace(/SQUARE (?:SOCIAL-MEDIA COMPOSITION|FRAMING)/gi, '')
    .replace(/SAFE AREA: [^\n]+/gi, '')
    .replace(/\[9:16[^\]]+\]/gi, '')
    .replace(/\[16:9[^\]]+\]/gi, '')
    .replace(/\[1:1[^\]]+\]/gi, '')
    .trim();

  const cameraShot = scene.camera || '35mm cinematic anamorphic lens, shallow depth of field';
  const cameraMovement = scene.movement || 'Smooth slow push-in tracking movement';
  const lighting = scene.lighting || 'Volumetric natural side-lighting with realistic rim light and organic shadow falloff';
  const atmosphere = scene.audio?.atmosphere || `${mood} atmospheric ambience with realistic environmental depth`;
  const subject = scene.subject || (scene.visual ? scene.visual.slice(0, 120) : `Primary protagonist of Scene ${sceneNum}`);
  const action = scene.action || 'Subject engages in deliberate, dynamic motion advancing the narrative context';
  const environment = scene.environment || 'Authentic physical location with rich architectural and spatial textures';
  const timeEra = scene.timeEra || 'Contemporary documentary setting';
  const composition = scene.composition || `${spec.composition}, subject isolated in primary safe area`;
  const motion = scene.motion || 'Natural fluid subject movement, subtle atmospheric dust/wind, steady cinematic glide';
  const continuity = scene.continuity || scene.continuityNote || 'Consistent character appearance, wardrobe, and color temperature across all scenes';
  const soundSfx = scene.audio?.sfx || scene.sound || 'Subtle cinematic acoustic impact / whoosh';
  const musicMood = scene.audio?.musicMood || `${mood} background score (no lyrics)`;
  const onScreenText = scene.onScreenText ? `"${scene.onScreenText}"` : 'None — clean cinematic frame';
  const textPlacement = scene.textPlacement || (spec.aspectRatio === '9:16' ? 'Safe central area (middle-third)' : 'Lower-third center');
  const transition = scene.transition || 'Rapid whip pan transition on beat';
  const negative = scene.negativePrompt || 'No watermark, no logo, no random text rendered inside video, no distorted anatomy, no deformed faces, no cartoon CGI, no 3D render look.';

  const formatBlock = spec.promptHeader;

  return `${formatBlock}
SAFE AREA: ${spec.safeArea}

SCENE ${sceneNum} [Duration: ${scene.duration || '5s'} | Timecode: ${scene.startTime || '00:00'} - ${scene.endTime || '00:05'}]
SUBJECT: ${subject}
ENVIRONMENT & ERA: ${environment} (${timeEra})
ACTION: ${action}
CAMERA SHOT & LENS: ${cameraShot}
CAMERA MOVEMENT: ${cameraMovement}
LIGHTING & ATMOSPHERE: ${lighting} • ${atmosphere}
COMPOSITION: ${composition}
MOTION DETAILS: ${motion}
ON-SCREEN TEXT: ${onScreenText} [Placement: ${textPlacement}]
TRANSITION: ${transition}
SOUND & SFX: ${soundSfx} • Music: ${musicMood}
CONTINUITY INSTRUCTIONS: ${continuity}
NEGATIVE INSTRUCTIONS: ${negative}

DETAILED VISUAL DIRECTION:
${cleanedPrompt || scene.visual || 'Cinematic visual shot capturing key story beat with documentary realism.'}

${formatBlock}`;
}

/**
 * Builds the complete standalone package for ONE single scene as requested in Requirement 3.
 * Clicking COPY SCENE on Scene 1 will copy ONLY this output for Scene 1.
 */
export function formatSingleScenePackage(
  scene: SceneItem,
  format?: string | VideoFormat,
  mood: string = 'Dramatic',
  masterStyle?: MasterVideoStyle
): string {
  const spec = getFormatSpec(format);
  const sceneNum = scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : `${scene.sceneNumber}`;
  const standalonePrompt = buildStandalonePrompt(scene, format, mood, masterStyle);

  return `SCENE ${sceneNum}${scene.title ? ` — ${scene.title}` : ''}
DURATION: ${scene.duration || '5 seconds'} (${scene.startTime || '00:00'} - ${scene.endTime || '00:05'})

VOICE-OVER NARRATION:
"${scene.voiceOver || 'Narration line for this scene'}"

VISUAL OBJECTIVE / VISUAL DESCRIPTION:
${scene.visualObjective || scene.visual || 'Visually reinforce key narrative beat'}

GOOGLE FLOW / VEO VIDEO PROMPT:
${standalonePrompt}

NEGATIVE / AVOID PROMPT:
${scene.negativePrompt || 'No watermark. No unwanted logo. No random text rendered inside frame. No distorted anatomy, extra fingers, or deformed faces. No unrelated objects. No cartoonish 3D render artifacts.'}

ON-SCREEN TEXT:
${scene.onScreenText ? `"${scene.onScreenText}"` : 'None'}

TEXT PLACEMENT / SAFE AREA:
${scene.textPlacement || (spec.aspectRatio === '9:16' ? 'Safe central area (middle-third)' : 'Lower-third center safe margin')}

CAMERA:
Shot & Lens: ${scene.camera || '35mm anamorphic lens'}
Movement: ${scene.movement || 'Cinematic tracking shot'}

TRANSITION:
${scene.transition || 'Rapid whip pan on beat'}

SOUND FX:
Atmosphere: ${scene.audio?.atmosphere || 'Balanced room tone and environmental acoustics'}
SFX: ${scene.audio?.sfx || scene.sound || 'Subtle foley sound effect'}
Music: ${scene.audio?.musicMood || `${mood} score (no copyrighted lyrics)`}`;
}

/**
 * Formats all scenes into the complete multi-scene package.
 * Used exclusively for the top-level "COPY FULL SCENE PACKAGE" button.
 */
export function formatAllScenesPackage(
  scenes: SceneItem[],
  format?: string | VideoFormat,
  mood: string = 'Dramatic',
  duration: string = '60 sec',
  masterStyle?: MasterVideoStyle
): string {
  const spec = getFormatSpec(format);
  const divider = '='.repeat(50);
  const sceneDivider = '-'.repeat(50);

  const header = `${divider}
GOD'S EYE V2.0 — FULL PRODUCTION SCENE PACKAGE (ALL SCENES)
TOTAL SCENES: ${scenes.length}
OUTPUT FORMAT: ${spec.outputFormat}
ASPECT RATIO: ${spec.aspectRatio}
RESOLUTION: ${spec.frameSize}
COMPOSITION: ${spec.composition}
TARGET DURATION: ${duration}
${divider}

`;

  const body = scenes
    .map((s) => formatSingleScenePackage(s, format, mood, masterStyle))
    .join(`\n\n${sceneDivider}\n\n`);

  return `${header}${body}\n\n${divider}\nEND OF FULL PRODUCTION PACKAGE`;
}
