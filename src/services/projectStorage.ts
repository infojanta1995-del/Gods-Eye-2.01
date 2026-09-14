import { GodseyeProject, ProjectStatus, StudioConfig, GodseyeAiResult } from '../types';

const STORAGE_KEY = 'godseye_projects_v1';
const ACTIVE_PROJECT_KEY = 'godseye_active_project_id';

/**
 * Automatically derives a clean project name from article title or content.
 * Example: "India Forex Reserves Rise Again"
 */
export function generateProjectName(title?: string, content?: string): string {
  if (title && title.trim().length > 0) {
    const clean = title.trim();
    return clean.length > 55 ? `${clean.substring(0, 52)}...` : clean;
  }

  if (content && content.trim().length > 0) {
    // Extract first sentence or first 7 words
    const firstLine = content.trim().split('\n')[0].trim();
    const sentence = firstLine.split(/[.!?]/)[0].trim();
    if (sentence.length > 0) {
      const words = sentence.split(/\s+/).slice(0, 7).join(' ');
      return words.length > 50 ? `${words.substring(0, 47)}...` : words;
    }
  }

  return 'New Godseye Project';
}

/**
 * Creates a blank project instance
 */
export function createNewProject(initialConfig?: Partial<StudioConfig>, userId?: string): GodseyeProject {
  const timestamp = new Date().toISOString();
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const title = initialConfig?.title || '';
  const content = initialConfig?.storyContent || '';

  return {
    id,
    userId,
    name: generateProjectName(title, content),
    status: 'DRAFT',
    createdAt: timestamp,
    updatedAt: timestamp,
    article: {
      title,
      content,
      url: initialConfig?.sourceUrl || '',
    },
    settings: {
      contentType: initialConfig?.contentType || 'YouTube Short',
      duration: initialConfig?.duration || '60 sec',
      customDurationSeconds: initialConfig?.customDurationSeconds || 60,
      videoFormat: initialConfig?.videoFormat || '9:16 Portrait',
      language: initialConfig?.language || 'Hindi',
      contentStyle: initialConfig?.contentStyle || 'Informative',
      mood: initialConfig?.mood || 'Neutral',
      platforms: initialConfig?.selectedPlatforms || ['YouTube Shorts', 'Instagram', 'YouTube'],
    },
    content: null,
  };
}

/**
 * Retrieves all saved projects sorted by updatedAt descending.
 * If userId is provided, filters projects to that user (while preserving legacy demo projects without userId).
 */
export function getAllProjects(userId?: string): GodseyeProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const filtered = userId
        ? parsed.filter((p) => !p.userId || p.userId === userId)
        : parsed;
      return filtered.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return [];
  } catch (err) {
    console.error('Failed to load projects from storage:', err);
    return [];
  }
}

/**
 * Retrieves a single project by ID.
 */
export function getProjectById(id: string): GodseyeProject | null {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Saves or updates a project in localStorage.
 * Returns true if successful, false if storage failed.
 */
export function saveProject(project: GodseyeProject, userId?: string): boolean {
  try {
    const projects = getAllProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    const updatedProject: GodseyeProject = {
      ...project,
      userId: project.userId || userId,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = updatedProject;
    } else {
      projects.unshift(updatedProject);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error('Failed to save project to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a project by ID from localStorage.
 */
export function deleteProject(id: string): boolean {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    if (getActiveProjectId() === id) {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
    return true;
  } catch (err) {
    console.error('Failed to delete project:', err);
    return false;
  }
}

/**
 * Duplicates an existing project while keeping the original unchanged.
 */
export function duplicateProject(id: string, userId?: string): GodseyeProject | null {
  try {
    const original = getProjectById(id);
    if (!original) return null;

    const timestamp = new Date().toISOString();
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const copy: GodseyeProject = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      userId: userId || original.userId,
      name: `${original.name} (Copy)`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    saveProject(copy);
    return copy;
  } catch (err) {
    console.error('Failed to duplicate project:', err);
    return null;
  }
}

/**
 * Gets currently active project ID.
 */
export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

/**
 * Sets currently active project ID.
 */
export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

/**
 * Exports a project as a formatted JSON file.
 */
export function exportProjectAsJson(project: GodseyeProject): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeFilename = (project.name || 'godseye_project')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${safeFilename}_package.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Exports a project as a comprehensive formatted TXT production package.
 */
export function exportProjectAsTxt(project: GodseyeProject): void {
  const p = project;
  const c = p.content;

  let text = `===============================================================
GODSEYE AI — COMPLETE CONTENT PRODUCTION PACKAGE
===============================================================
PROJECT NAME: ${p.name}
PROJECT ID: ${p.id}
STATUS: ${p.status}
CREATED: ${new Date(p.createdAt).toLocaleString()}
LAST UPDATED: ${new Date(p.updatedAt).toLocaleString()}
CONTENT TYPE: ${p.settings.contentType}
TARGET DURATION: ${p.settings.duration}
VIDEO FORMAT: ${p.settings.videoFormat}
LANGUAGE: ${p.settings.language}
CONTENT STYLE: ${p.settings.contentStyle}
MOOD: ${p.settings.mood}
PLATFORMS: ${p.settings.platforms.join(', ')}

===============================================================
ORIGINAL ARTICLE / STORY SOURCE
===============================================================
TITLE: ${p.article.title || 'Untitled'}
SOURCE URL: ${p.article.url || 'None provided'}

CONTENT:
${p.article.content || 'No story text recorded.'}
`;

  if (c) {
    text += `
===============================================================
STORY ANALYSIS & ANGLE
===============================================================
TOPIC: ${c.analysis.mainTopic}
MAIN EVENT: ${c.analysis.mainEvent}
WHY IT MATTERS: ${c.analysis.whyItMatters}

IMPORTANT FACTS:
${c.analysis.importantFacts.map((f) => `• ${f}`).join('\n')}

CORE ANGLE: ${c.storyAngle.mainAngle}
WHY INTERESTING: ${c.storyAngle.whyInteresting}
CURIOSITY ELEMENT: ${c.storyAngle.curiosityElement}
EMOTIONAL ELEMENT: ${c.storyAngle.emotionalElement}
VISUAL ELEMENT: ${c.storyAngle.visualElement}

===============================================================
HOOK ENGINE (5 TESTED FORMULATIONS)
===============================================================
WINNING HOOK (BEST): "${c.hooks.bestHook}"
REASON: ${c.hooks.reason}

1. Curiosity Hook: "${c.hooks.curiosity}"
2. Shock / Surprise Hook: "${c.hooks.shock}"
3. Question Hook: "${c.hooks.question}"
4. Story Hook: "${c.hooks.story}"
5. Information Gap Hook: "${c.hooks.informationGap}"

===============================================================
FINAL POLISHED SCRIPT WITH PERFORMANCE MARKERS
===============================================================
TITLE: ${c.script.title}
DURATION: ${c.script.duration}

${c.polishedScript || c.script.text}

VOICE-OVER DIRECTION:
Style: ${c.voiceOverDirection?.voiceStyle || 'Authentic & Confident'}
Speed / Tempo: ${c.voiceOverDirection?.speed || 'Natural Conversational'}
Energy & Emotion: ${c.voiceOverDirection?.energy || 'Controlled'} • ${c.voiceOverDirection?.emotion || 'Engaged'}
Dramatic Pauses: ${c.voiceOverDirection?.pauses || 'Micro-pauses on key revelations'}
Key Words to Emphasize: ${c.voiceOverDirection?.emphasis?.join(', ') || 'Core facts'}

TIMED SECTIONS:
${c.script.sections.map((s) => `[${s.phase}] ${s.name}:
${s.narration} (Cue: ${s.cue || 'None'})`).join('\n\n')}

===============================================================
SCENE BREAKDOWN & STORYBOARD
===============================================================
${c.scenes
  .map(
    (s) => `---------------------------------------------------------------
SCENE ${s.sceneNumber} (${s.startTime} - ${s.endTime} | ${s.duration})
VOICE-OVER: ${s.voiceOver}
VISUAL DESCRIPTION: ${s.visual}
ON-SCREEN TEXT: ${s.onScreenText}
CAMERA: ${s.camera}
TRANSITION: ${s.transition}
SOUND FX: ${s.sound}
VIDEO PROMPT (Google Flow / Veo):
${s.videoPrompt}
NEGATIVE PROMPT:
${s.negativePrompt || 'blurry, cartoonish, low-res, distorted'}`
  )
  .join('\n\n')}

===============================================================
THUMBNAIL CONCEPTS
===============================================================
${c.thumbnails.concepts
  .map(
    (th, idx) => `CONCEPT ${idx + 1}: ${th.concept}
HEADLINE TEXT: "${th.headline}"
SUBJECT: ${th.subject}
BACKGROUND: ${th.background}
VISUAL STORY: ${th.visualStory}
IMAGE PROMPT: ${th.imagePrompt}`
  )
  .join('\n\n')}

===============================================================
MULTI-PLATFORM SEO PACKAGE
===============================================================
YOUTUBE SHORTS:
High-CTR Title: ${c.seo.youtubeShorts.titles.highCtr}
Curiosity Title: ${c.seo.youtubeShorts.titles.curiosity}
Primary Keyword: ${c.seo.youtubeShorts.primaryKeyword}
Hashtags: ${c.seo.youtubeShorts.hashtags.join(' ')}
Description:
${c.seo.youtubeShorts.description}

INSTAGRAM REELS:
First Line Hook: ${c.seo.instagram.firstLineHook}
Caption: ${c.seo.instagram.caption}
Hashtags: ${c.seo.instagram.hashtags.join(' ')}

TIKTOK:
Caption: ${c.seo.tiktok.caption}
Hashtags: ${c.seo.tiktok.hashtags.join(' ')}

===============================================================
ENGAGEMENT & RETENTION DEFENSE
===============================================================
Hook Strength: ${c.retention.hookStrength}/10
Curiosity: ${c.retention.curiosity}/10
Story Flow: ${c.retention.storyFlow}/10
Emotional Impact: ${c.retention.emotionalImpact}/10
Visual Potential: ${c.retention.visualPotential}/10
Shareability: ${c.retention.shareabilityPotential || 8.8}/10

TOP RETENTION IMPROVEMENTS:
${(c.retention.top3RetentionImprovements || c.retention.improvements)
  .map((imp, i) => `${i + 1}. ${imp}`)
  .join('\n')}

DISCLAIMER: ${c.retention.aiEstimateDisclaimer || c.disclaimer}
`;
  }

  text += `
===============================================================
GENERATED BY GODSEYE AI CONTENT COMMAND CENTER
===============================================================
`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const safeFilename = (p.name || 'godseye_project')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `${safeFilename}_package.txt`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
