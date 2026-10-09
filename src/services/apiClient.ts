import { StudioConfig, GodseyeAiResult } from '../types';
import { getStoredAuthToken } from './authService';

export interface GenerateContentRequest {
  config: StudioConfig;
}

/**
 * Returns common request headers including authorization bearer token if logged in
 */
function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface GenerateContentResponse {
  success: boolean;
  data?: GodseyeAiResult;
  error?: string;
}

/**
 * Safely parses fetch HTTP response, preventing "Unexpected token '<', '<!doctype'..." errors
 * when a request hits an HTML page or invalid endpoint instead of JSON.
 */
async function safeJsonResponse<T = any>(
  res: Response,
  endpointDescription: string
): Promise<{ ok: boolean; status: number; data?: T; error?: string; isHtml?: boolean }> {
  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  // 1. Check Content-Type for HTML
  if (contentType.includes('text/html')) {
    return {
      ok: false,
      status: res.status,
      isHtml: true,
      error: `Thumbnail API returned HTML instead of an image-generation API response (HTTP ${res.status}). Check thumbnail endpoint/configuration.`,
    };
  }

  // 2. Binary / Image response pass-through
  if (contentType.startsWith('image/')) {
    const blob = await res.blob();
    return {
      ok: res.ok,
      status: res.status,
      data: { blob, contentType } as any,
    };
  }

  // 3. Read body text safely
  const text = await res.text();
  if (!text || !text.trim()) {
    return {
      ok: false,
      status: res.status,
      error: `Empty response received from ${endpointDescription} (HTTP ${res.status}).`,
    };
  }

  const trimmed = text.trim();

  // 4. Do not call JSON.parse if content is HTML
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.includes('<!DOCTYPE html>')) {
    return {
      ok: false,
      status: res.status,
      isHtml: true,
      error: `Thumbnail API returned HTML instead of an image-generation API response (HTTP ${res.status}). Check thumbnail endpoint/configuration.`,
    };
  }

  // 5. Parse JSON payload
  try {
    const parsed = JSON.parse(trimmed);
    return {
      ok: res.ok,
      status: res.status,
      data: parsed,
      error: parsed.error || (!res.ok ? (parsed.message || `Server error ${res.status}`) : undefined),
    };
  } catch {
    return {
      ok: false,
      status: res.status,
      error: `Malformed JSON response from ${endpointDescription}. Please try again.`,
    };
  }
}

export const GODSEYE_API = {
  /**
   * Health check for server-side AI services
   */
  async checkServerHealth(): Promise<{ ok: boolean; hasApiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return { ok: false, hasApiKey: false };
      const json = await res.json();
      return { ok: json.status === 'ok', hasApiKey: Boolean(json.hasApiKey) };
    } catch {
      return { ok: false, hasApiKey: false };
    }
  },

  /**
   * Core AI Story Engine Endpoint
   * Sends user story & settings to server-side Gemini 3.8 Flash model.
   */
  async generateStudioContent(config: StudioConfig): Promise<GenerateContentResponse> {
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ config }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }

      return {
        success: true,
        data: json.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to connect to GODSEYE AI Engine',
      };
    }
  },

  /**
   * Granular Component Regeneration (Requirement 11)
   * Regenerate individual components (hook, script, scene, thumbnail, seo, storyAngle, etc.)
   * without restarting the entire pipeline.
   */
  async regenerateComponent(
    component: string,
    config: StudioConfig,
    currentResult?: GodseyeAiResult,
    options?: { sceneNumber?: number; customPrompt?: string }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/regenerate-component', {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ component, config, currentResult, options }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }

      return {
        success: true,
        data: json.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || `Failed to regenerate ${component}`,
      };
    }
  },

  /**
   * Script Doctor: Auto-Improve Script via AI
   */
  async autoImproveScript(params: {
    script: any;
    storyContent: string;
    config: StudioConfig;
    angle?: string;
    hook?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/auto-improve-script', {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(params),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }

      return {
        success: true,
        data: json.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to auto-improve script',
      };
    }
  },

  /**
   * Batch 2: Research Intelligence Analysis
   */
  async analyzeResearch(params: {
    query: string;
    mode?: 'topic' | 'url' | 'question' | 'article';
    content?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/research/analyze', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to analyze research' };
    }
  },

  /**
   * Batch 2: Context-Aware AI Assistant
   */
  async sendAssistantCommand(params: {
    message: string;
    project: any;
    activeTab?: string;
  }): Promise<{ success: boolean; reply?: string; updatedComponent?: any; error?: string }> {
    try {
      const res = await fetch('/api/assistant/command', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }
      return { success: true, reply: json.reply, updatedComponent: json.updatedComponent };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to execute assistant command' };
    }
  },

  /**
   * Dedicated Story-Aware Thumbnail Studio Engine
   */
  async generateCustomThumbnail(params: {
    topic: string;
    story?: string;
    storyContent?: string;
    storyAnalysis?: string;
    storyAngle?: string;
    viralHook?: string;
    scriptText?: string;
    keyEntities?: string[];
    platform?: string;
    language?: string;
    videoFormat?: string;
    style?: string;
    includeBranding?: boolean;
    isVariant?: boolean;
    variantType?: 'composition' | 'camera' | 'lighting' | 'background' | 'focal';
    previousConcept?: any;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/thumbnail/generate-custom', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          topic: params.topic,
          storyContent: params.storyContent || params.story || '',
          storyAnalysis: params.storyAnalysis,
          storyAngle: params.storyAngle,
          viralHook: params.viralHook,
          scriptText: params.scriptText,
          keyEntities: params.keyEntities,
          platform: params.platform,
          language: params.language,
          videoFormat: params.videoFormat,
          style: params.style,
          includeBranding: params.includeBranding,
          isVariant: params.isVariant,
          variantType: params.variantType,
          previousConcept: params.previousConcept,
        }),
      });

      const parsed = await safeJsonResponse<any>(res, 'Thumbnail Blueprint API');
      if (!parsed.ok || !parsed.data?.success) {
        return {
          success: false,
          error: parsed.error || parsed.data?.error || `Server responded with status ${res.status}`,
        };
      }
      return { success: true, data: parsed.data.data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to generate thumbnail concept' };
    }
  },

  /**
   * Real Gemini AI Thumbnail Image Generation
   */
  async generateThumbnailImage(params: {
    prompt: string;
    aspectRatio?: string;
    isVertical?: boolean;
    format?: string;
    conceptName?: string;
    variant?: string;
  }): Promise<{
    success: boolean;
    imageUrl?: string;
    model?: string;
    aspectRatio?: string;
    format?: string;
    prompt?: string;
    conceptName?: string;
    error?: string;
    details?: string;
    requiresConfiguration?: string;
  }> {
    try {
      const res = await fetch('/api/thumbnail/generate-image', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(params),
      });

      const parsed = await safeJsonResponse<any>(res, 'Thumbnail Image Generation API');

      if (parsed.data && typeof parsed.data === 'object') {
        return {
          success: Boolean(parsed.data.success),
          imageUrl: parsed.data.imageUrl,
          model: parsed.data.model || parsed.data.modelUsed,
          aspectRatio: parsed.data.aspectRatio,
          format: parsed.data.format,
          prompt: parsed.data.prompt,
          conceptName: parsed.data.conceptName,
          error: parsed.data.error || parsed.error || (!parsed.ok ? `Failed to generate image (HTTP ${res.status})` : undefined),
          details: parsed.data.details,
          requiresConfiguration: parsed.data.requiresConfiguration,
        };
      }

      return {
        success: false,
        error: parsed.error || `Failed to generate image (HTTP ${res.status})`,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to thumbnail image generation service' };
    }
  },

  /**
   * Batch 2: Dedicated SEO & Metadata Studio Engine
   */
  async generateCustomSeo(params: {
    title?: string;
    topic?: string;
    storyContent?: string;
    script?: string;
    platform?: string;
    platforms?: string[];
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch('/api/seo/generate-custom', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          title: params.title || params.topic || 'High Stakes Investigation',
          storyContent: params.storyContent || params.script || '',
          platforms: params.platforms || (params.platform ? [params.platform] : undefined),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to generate SEO metadata' };
    }
  },

  /**
   * Batch 2: Multi-Platform Publishing Dispatch
   */
  async publishToPlatform(params: {
    platform: 'youtube' | 'facebook' | 'instagram';
    projectId: string;
    channelId?: string;
    pageId?: string;
    targetAccount?: string;
    title?: string;
    description?: string;
    tags?: string[];
    thumbnail?: string;
    privacy?: string;
    scheduledAt?: string;
    scheduleTime?: string;
    packageData?: any;
  }): Promise<{ success: boolean; jobId?: string; status?: string; publishedUrl?: string; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/publishing/prepare-and-publish', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          platform: params.platform,
          projectId: params.projectId,
          channelId: params.channelId || params.targetAccount,
          pageId: params.pageId || params.targetAccount,
          targetAccount: params.targetAccount,
          scheduleTime: params.scheduleTime || params.scheduledAt,
          packageData: params.packageData || {
            title: params.title,
            description: params.description,
            tags: params.tags,
            thumbnail: params.thumbnail,
            privacy: params.privacy,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server responded with status ${res.status}`);
      }
      return json;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to dispatch publication' };
    }
  },
};
