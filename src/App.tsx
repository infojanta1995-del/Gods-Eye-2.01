import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ArticleInputSection } from './components/ArticleInputSection';
import { StudioControls } from './components/StudioControls';
import { GenerateAction } from './components/GenerateAction';
import { OutputWorkspace } from './components/OutputWorkspace';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { DashboardSummary } from './components/DashboardSummary';
import { ActiveProjectBar } from './components/ActiveProjectBar';
import { ProjectHistoryDrawer } from './components/ProjectHistoryDrawer';
import { SampleStory, SAMPLE_STORIES } from './data/sampleStories';
import { GODSEYE_API } from './services/apiClient';
import {
  loadSavedThemeSettings,
  persistThemeSettings,
  applyThemeToDOM,
} from './services/themeService';
import {
  createNewProject,
  getAllProjects,
  getProjectById,
  saveProject,
  deleteProject,
  duplicateProject,
  getActiveProjectId,
  setActiveProjectId,
  generateProjectName,
} from './services/projectStorage';
import {
  StudioConfig,
  ContentType,
  Duration,
  VideoFormat,
  Language,
  ContentStyle,
  Mood,
  Platform,
  GodseyeAiResult,
  RegenerateComponentType,
  GodseyeProject,
  ThemeSettings,
  V2NavigationTab,
} from './types';
import { GodsEyeLoginScreen } from './components/GodsEyeLoginScreen';
import {
  getCurrentUser,
  saveUserSession,
  clearUserSession,
  validateServerSession,
  GodseyeUser,
} from './services/authService';
import { DashboardView } from './components/views/DashboardView';
import { ResearchView } from './components/views/ResearchView';
import { ScriptView } from './components/views/ScriptView';
import { SceneStudioView } from './components/views/SceneStudioView';
import { VoiceStudioView } from './components/views/VoiceStudioView';
import { StoryIntelligenceView } from './components/views/StoryIntelligenceView';
import { ThumbnailStudioView } from './components/views/ThumbnailStudioView';
import { SeoStudioView } from './components/views/SeoStudioView';
import { YouTubeView } from './components/views/YouTubeView';
import { FacebookView } from './components/views/FacebookView';
import { InstagramView } from './components/views/InstagramView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ContentLibraryView } from './components/views/ContentLibraryView';
import { ProjectsView } from './components/views/ProjectsView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsView } from './components/views/SettingsView';
import { PublishingQueueView } from './components/views/PublishingQueueView';
import { ConnectedAccountsView } from './components/views/ConnectedAccountsView';
import { TrendIntelligenceView } from './components/views/TrendIntelligenceView';
import { ContentAnalyticsView } from './components/views/ContentAnalyticsView';
import { AccountView } from './components/views/AccountView';
import { AiSettingsView } from './components/views/AiSettingsView';
import { ShortCreatorView } from './components/views/ShortCreatorView';
import { ContextualRightPanel } from './components/ContextualRightPanel';
import { Sparkles } from 'lucide-react';
import { SystemBootSequence } from './components/supercomputer/SystemBootSequence';
import { JarvisAiCore, CoreProcessingState } from './components/supercomputer/JarvisAiCore';
import { SupercomputerTopBar } from './components/supercomputer/SupercomputerTopBar';
import { SupercomputerNav } from './components/supercomputer/SupercomputerNav';
import { CommandCoreDashboard } from './components/supercomputer/CommandCoreDashboard';
import { NewContentModal } from './components/supercomputer/NewContentModal';
import { JarvisCopilotLayer } from './components/supercomputer/JarvisCopilotLayer';
import { CommandPaletteModal } from './components/CommandPaletteModal';

const INITIAL_CONFIG: StudioConfig = {
  title: '',
  sourceUrl: '',
  storyContent: '',
  contentType: 'YouTube Short',
  duration: '24 sec',
  customDurationSeconds: 24,
  videoFormat: '9:16 Portrait',
  language: 'Hindi', // Default Hindi as mandated
  contentStyle: 'Informative',
  mood: 'Neutral',
  selectedPlatforms: ['YouTube Shorts', 'Instagram'],
};

export default function App() {
  const [config, setConfig] = useState<StudioConfig>(INITIAL_CONFIG);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isProjectsDrawerOpen, setIsProjectsDrawerOpen] = useState(false);
  const [isOutputInitialized, setIsOutputInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Analyzing your story...');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [aiResult, setAiResult] = useState<GodseyeAiResult | null>(null);
  const [activeTab, setActiveTab] = useState<V2NavigationTab>('Dashboard');
  const [currentUser, setCurrentUser] = useState<GodseyeUser | null>(() => getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Futuristic Supercomputer OS States
  const [hasBooted, setHasBooted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('godseye_booted_session') === 'true';
    } catch {
      return false;
    }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);
  const [coreProcessingState, setCoreProcessingState] = useState<CoreProcessingState>('idle');
  const [activeCreationStep, setActiveCreationStep] = useState<string>('');

  // Theme & Visual Customizer State (Parts A-C)
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() =>
    loadSavedThemeSettings()
  );

  useEffect(() => {
    applyThemeToDOM(themeSettings);
  }, [themeSettings]);

  // Validate server session & allowlist access on startup
  useEffect(() => {
    validateServerSession().then((verifiedUser) => {
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      } else if (currentUser) {
        // If server session invalid, reset user so login screen forces re-verification
        setCurrentUser(null);
      }
    });
  }, []);

  const handleThemeChange = (updated: ThemeSettings) => {
    setThemeSettings(updated);
    persistThemeSettings(updated);
    applyThemeToDOM(updated);
  };

  // STEP 6: Project History State
  const [projects, setProjects] = useState<GodseyeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<GodseyeProject>(() =>
    createNewProject(INITIAL_CONFIG)
  );
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef<any>(null);
  const [creatorMode, setCreatorMode] = useState<'short' | 'classic'>('short');

  // Initialize projects on mount
  useEffect(() => {
    try {
      let savedProjects = getAllProjects();

      // If storage is empty, initialize with a sample project
      if (savedProjects.length === 0) {
        const sample = SAMPLE_STORIES[0];
        const starterProject = createNewProject({
          title: sample.title,
          sourceUrl: sample.url,
          storyContent: sample.fullStory,
          contentStyle: sample.suggestedStyle as ContentStyle,
          mood: sample.suggestedMood as Mood,
        });
        starterProject.name = 'James Webb Space Telescope Exoplanet Discovery';
        starterProject.status = 'DRAFT';
        saveProject(starterProject);
        savedProjects = [starterProject];
      }

      setProjects(savedProjects);

      // Check for last active project
      const activeId = getActiveProjectId();
      const targetProject = activeId
        ? savedProjects.find((p) => p.id === activeId) || savedProjects[0]
        : savedProjects[0];

      if (targetProject) {
        loadProjectIntoWorkspace(targetProject);
      }
    } catch (err) {
      console.error('Failed to initialize projects:', err);
      setErrorMessage('Could not load project storage.');
    }
  }, []);

  // Helper to load a project into active workspace
  const loadProjectIntoWorkspace = (project: GodseyeProject) => {
    setCurrentProject(project);
    setActiveProjectId(project.id);
    setConfig({
      title: project.article?.title || '',
      sourceUrl: project.article?.url || '',
      storyContent: project.article?.content || '',
      contentType: project.settings?.contentType || 'YouTube Short',
      duration: project.settings?.duration || '60 sec',
      customDurationSeconds: project.settings?.customDurationSeconds || 60,
      videoFormat: project.settings?.videoFormat || '9:16 Portrait',
      language: project.settings?.language || 'Hindi',
      contentStyle: project.settings?.contentStyle || 'Informative',
      mood: project.settings?.mood || 'Neutral',
      selectedPlatforms: project.settings?.platforms || ['YouTube Shorts', 'Instagram', 'YouTube'],
    });
    setAiResult(project.content);
    setIsOutputInitialized(Boolean(project.content));
  };

  // Debounced auto-save for draft changes (metadata / settings / article)
  const triggerAutoSaveDraft = (
    updatedConfig: StudioConfig,
    updatedName?: string
  ) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setIsAutoSaving(true);

    autoSaveTimerRef.current = setTimeout(() => {
      setCurrentProject((prev) => {
        const nameToUse =
          updatedName !== undefined
            ? updatedName
            : prev.name && prev.name !== 'New Godseye Project'
            ? prev.name
            : generateProjectName(updatedConfig.title, updatedConfig.storyContent);

        const updated: GodseyeProject = {
          ...prev,
          name: nameToUse,
          updatedAt: new Date().toISOString(),
          article: {
            title: updatedConfig.title,
            content: updatedConfig.storyContent,
            url: updatedConfig.sourceUrl,
          },
          settings: {
            contentType: updatedConfig.contentType,
            duration: updatedConfig.duration,
            customDurationSeconds: updatedConfig.customDurationSeconds,
            videoFormat: updatedConfig.videoFormat,
            language: updatedConfig.language,
            contentStyle: updatedConfig.contentStyle,
            mood: updatedConfig.mood,
            platforms: updatedConfig.selectedPlatforms,
          },
        };

        const success = saveProject(updated);
        if (!success) {
          setErrorMessage('Could not save project.');
        } else {
          setProjects(getAllProjects());
        }
        setIsAutoSaving(false);
        return updated;
      });
    }, 800);
  };

  // Handlers for Section 1 (Article / Story)
  const handleTitleChange = (title: string) => {
    const updated = { ...config, title };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleUrlChange = (sourceUrl: string) => {
    const updated = { ...config, sourceUrl };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleStoryChange = (storyContent: string) => {
    const updated = { ...config, storyContent };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleApplySample = (sample: SampleStory) => {
    const updated: StudioConfig = {
      ...config,
      title: sample.title,
      sourceUrl: sample.url,
      storyContent: sample.fullStory,
      contentStyle: (sample.suggestedStyle as ContentStyle) || config.contentStyle,
      mood: (sample.suggestedMood as Mood) || config.mood,
    };
    setConfig(updated);
    setStatusMessage(`Loaded sample: "${sample.title}"`);
    triggerAutoSaveDraft(updated, sample.title);
    setTimeout(() => setStatusMessage(undefined), 3000);
  };

  const handleClearStory = () => {
    const updated: StudioConfig = {
      ...config,
      title: '',
      sourceUrl: '',
      storyContent: '',
    };
    setConfig(updated);
    setAiResult(null);
    triggerAutoSaveDraft(updated);
  };

  // Handlers for Sections 2-8 (Studio Controls)
  const handleContentTypeChange = (contentType: ContentType) => {
    let videoFormat = config.videoFormat;
    if (
      contentType === 'YouTube Short' ||
      contentType === 'Instagram Reel' ||
      contentType === 'Facebook Reel' ||
      contentType === 'Short / Reel'
    ) {
      videoFormat = '9:16 Portrait';
    } else if (
      contentType === 'YouTube Long Video' ||
      contentType === 'Facebook Video' ||
      contentType === 'Documentary'
    ) {
      videoFormat = '16:9 Horizontal';
    }
    const updated: StudioConfig = { ...config, contentType, videoFormat };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleDurationChange = (duration: Duration) => {
    const updated = { ...config, duration };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleCustomDurationSecondsChange = (customDurationSeconds: number) => {
    const updated = { ...config, customDurationSeconds };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleVideoFormatChange = (videoFormat: VideoFormat) => {
    const updated = { ...config, videoFormat };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleLanguageChange = (language: Language) => {
    const updated = { ...config, language };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleContentStyleChange = (contentStyle: ContentStyle) => {
    const updated = { ...config, contentStyle };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleMoodChange = (mood: Mood) => {
    const updated = { ...config, mood };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  const handleTogglePlatform = (platform: Platform) => {
    const currentPlatforms = config.selectedPlatforms || ['YouTube Shorts', 'Instagram', 'YouTube'];
    const exists = currentPlatforms.includes(platform);
    let selectedPlatforms = currentPlatforms;
    if (exists) {
      if (selectedPlatforms.length > 1) {
        selectedPlatforms = selectedPlatforms.filter((p) => p !== platform);
      }
    } else {
      selectedPlatforms = [...selectedPlatforms, platform];
    }
    const updated = { ...config, selectedPlatforms };
    setConfig(updated);
    triggerAutoSaveDraft(updated);
  };

  // ==========================================
  // PROJECT HISTORY ACTIONS (STEP 6)
  // ==========================================
  const handleNewProject = () => {
    const newProj = createNewProject(INITIAL_CONFIG);
    saveProject(newProj);
    setActiveProjectId(newProj.id);
    setCurrentProject(newProj);
    setConfig(INITIAL_CONFIG);
    setAiResult(null);
    setIsOutputInitialized(false);
    setProjects(getAllProjects());
    setStatusMessage('Started a new project workspace.');
    setTimeout(() => setStatusMessage(undefined), 2500);
  };

  const handleOpenProject = (project: GodseyeProject) => {
    try {
      loadProjectIntoWorkspace(project);
      setStatusMessage(`Loaded project: "${project.name}"`);
      setTimeout(() => setStatusMessage(undefined), 3000);

      // If project has content, scroll to output area
      if (project.content) {
        setTimeout(() => {
          const outputElem = document.getElementById('output-area');
          if (outputElem) {
            outputElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    } catch (err) {
      setErrorMessage('Could not load project.');
    }
  };

  const handleDuplicateProject = (id?: string) => {
    const targetId = id || currentProject.id;
    const duplicated = duplicateProject(targetId);
    if (duplicated) {
      const updatedList = getAllProjects();
      setProjects(updatedList);
      setStatusMessage(`Duplicated as "${duplicated.name}"`);
      setTimeout(() => setStatusMessage(undefined), 3000);
    } else {
      setErrorMessage('Could not duplicate project.');
    }
  };

  const handleDeleteProject = (id: string) => {
    const success = deleteProject(id);
    if (success) {
      const remaining = getAllProjects();
      setProjects(remaining);

      // If current active was deleted, open another or create new
      if (currentProject.id === id) {
        if (remaining.length > 0) {
          loadProjectIntoWorkspace(remaining[0]);
        } else {
          handleNewProject();
        }
      }
      setStatusMessage('Project deleted.');
      setTimeout(() => setStatusMessage(undefined), 2500);
    } else {
      setErrorMessage('Failed to delete project.');
    }
  };

  const handleRenameProject = (id: string, newName: string) => {
    const target = getProjectById(id);
    if (target) {
      const updated: GodseyeProject = {
        ...target,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      saveProject(updated);
      setProjects(getAllProjects());
      if (currentProject.id === id) {
        setCurrentProject(updated);
      }
      setStatusMessage(`Project renamed to "${newName}".`);
      setTimeout(() => setStatusMessage(undefined), 2500);
    }
  };

  const handleUpdateAiResult = (updated: GodseyeAiResult) => {
    setAiResult(updated);
    if (currentProject) {
      const updatedProject: GodseyeProject = {
        ...currentProject,
        updatedAt: new Date().toISOString(),
        content: {
          ...currentProject.content,
          ...updated,
        },
      };
      saveProject(updatedProject);
      setProjects(getAllProjects());
      setCurrentProject(updatedProject);
    }
  };

  // Section 9: Main Button click handler with Real AI Generation Workflow & Auto-Save
  const handleGenerate = async () => {
    let currentConfig = config;

    // If story is empty, auto-load starter sample for beginner convenience
    if (!currentConfig.storyContent.trim()) {
      const sample = SAMPLE_STORIES[0];
      currentConfig = {
        ...currentConfig,
        title: currentConfig.title || sample.title,
        sourceUrl: currentConfig.sourceUrl || sample.url,
        storyContent: sample.fullStory,
      };
      setConfig(currentConfig);
    }

    setIsLoading(true);
    setErrorMessage(undefined);
    setStatusMessage(undefined);
    setLoadingStage('Analyzing your story...');

    // Progress through specified loading states
    const timer1 = setTimeout(() => {
      setLoadingStage('Building your GODSEYE content...');
    }, 1800);

    const timer2 = setTimeout(() => {
      setLoadingStage('Preparing scenes and prompts...');
    }, 3800);

    try {
      const response = await GODSEYE_API.generateStudioContent(currentConfig);

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (response.success && response.data) {
        setLoadingStage('GODSEYE CONTENT READY');
        setAiResult(response.data);
        setIsOutputInitialized(true);
        setStatusMessage('GODSEYE CONTENT READY');

        // STEP 6: AUTO-SAVE TO PROJECT HISTORY
        const nameToUse =
          currentProject.name && currentProject.name !== 'New Godseye Project'
            ? currentProject.name
            : generateProjectName(currentConfig.title, currentConfig.storyContent);

        const updatedProject: GodseyeProject = {
          ...currentProject,
          name: nameToUse,
          status: 'READY',
          updatedAt: new Date().toISOString(),
          article: {
            title: currentConfig.title,
            content: currentConfig.storyContent,
            url: currentConfig.sourceUrl,
          },
          settings: {
            contentType: currentConfig.contentType,
            duration: currentConfig.duration,
            customDurationSeconds: currentConfig.customDurationSeconds,
            videoFormat: currentConfig.videoFormat,
            language: currentConfig.language,
            contentStyle: currentConfig.contentStyle,
            mood: currentConfig.mood,
            platforms: currentConfig.selectedPlatforms,
          },
          content: response.data,
        };

        const saved = saveProject(updatedProject);
        if (saved) {
          setCurrentProject(updatedProject);
          setProjects(getAllProjects());
          setActiveProjectId(updatedProject.id);
        } else {
          setErrorMessage('Could not save project.');
        }

        // Scroll smoothly to output workspace
        setTimeout(() => {
          const outputElem = document.getElementById('output-area');
          if (outputElem) {
            outputElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      } else {
        setErrorMessage(
          response.error || 'Failed to generate content. Please verify your story and try again.'
        );
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setErrorMessage(err?.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Granular component regeneration handler (Step 5 Upgrade + Step 6 Auto-Save)
  const handleRegenerateComponent = async (
    component: RegenerateComponentType,
    options?: { sceneNumber?: number; customPrompt?: string }
  ) => {
    if (!aiResult) return;
    setIsLoading(true);
    const label = options?.sceneNumber
      ? `Scene ${options.sceneNumber}`
      : component === 'storyAngle'
      ? 'Story Angles'
      : component === 'scriptDoctor'
      ? 'Script Doctor Audit'
      : component;
    setLoadingStage(`Regenerating ${label}...`);
    try {
      const response = await GODSEYE_API.regenerateComponent(component, config, aiResult, options);
      if (response.success && response.data) {
        const updated: GodseyeAiResult = { ...aiResult };
        if (component === 'hook') {
          updated.hooks = response.data;
        } else if (component === 'storyAngle') {
          if (response.data.storyAngle) {
            updated.storyAngle = response.data.storyAngle;
          } else {
            updated.storyAngle = response.data;
          }
        } else if (component === 'script') {
          if (response.data.script) updated.script = response.data.script;
          if (response.data.voiceOverDirection)
            updated.voiceOverDirection = response.data.voiceOverDirection;
          if (response.data.polishedScript)
            updated.polishedScript = response.data.polishedScript;
          if (response.data.qualityCheck)
            updated.qualityCheck = response.data.qualityCheck;
        } else if (component === 'scriptDoctor') {
          if (response.data.qualityCheck)
            updated.qualityCheck = response.data.qualityCheck;
          if (response.data.improvedScript)
            updated.script = { ...updated.script, text: response.data.improvedScript };
          if (response.data.improvedPolishedScript)
            updated.polishedScript = response.data.improvedPolishedScript;
        } else if (component === 'scene') {
          if (response.data.scene && options?.sceneNumber) {
            const newScene = response.data.scene;
            updated.scenes = updated.scenes.map((s) =>
              s.sceneNumber === options.sceneNumber ? { ...s, ...newScene } : s
            );
          }
        } else if (component === 'scenes') {
          if (Array.isArray(response.data.scenes)) updated.scenes = response.data.scenes;
        } else if (component === 'videoPrompts') {
          if (Array.isArray(response.data.scenes)) updated.scenes = response.data.scenes;
        } else if (component === 'thumbnail') {
          updated.thumbnails = response.data;
        } else if (component === 'seo') {
          if (response.data.seo) updated.seo = response.data.seo;
          if (response.data.keywords) updated.keywords = response.data.keywords;
        }

        setAiResult(updated);

        // Persist updated component into project history
        const updatedProject: GodseyeProject = {
          ...currentProject,
          content: updated,
          updatedAt: new Date().toISOString(),
        };
        saveProject(updatedProject);
        setCurrentProject(updatedProject);
        setProjects(getAllProjects());

        setStatusMessage(`Regenerated ${label} successfully!`);
        setTimeout(() => setStatusMessage(undefined), 3000);
      } else {
        setErrorMessage(response.error || `Failed to regenerate ${label}.`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to regenerate ${component}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    handleNewProject();
  };

  // Futuristic Supercomputer Action: Initialize New Content Workflow (24s / 32s / 40s)
  const handleInitializeNewContent = async (params: {
    topic: string;
    contentType: ContentType;
    duration: Duration;
  }) => {
    try {
      setCoreProcessingState('thinking');
      setActiveCreationStep('ANALYZING TOPIC & QUANTUM STORY ANGLE...');

      const starterProject = createNewProject({
        title: params.topic,
        sourceUrl: '',
        storyContent: params.topic,
        contentType: params.contentType,
        duration: params.duration,
        language: 'Hindi',
      });
      starterProject.name = params.topic.slice(0, 48);
      saveProject(starterProject);
      setProjects(getAllProjects());
      setCurrentProject(starterProject);
      setActiveProjectId(starterProject.id);

      const updatedConfig: StudioConfig = {
        ...config,
        title: params.topic,
        storyContent: params.topic,
        contentType: params.contentType,
        duration: params.duration,
        language: 'Hindi',
      };
      setConfig(updatedConfig);

      setActiveCreationStep('CONNECTING NEURAL ENGINE & SCRIPT TIMING...');
      setCoreProcessingState('scripting');

      // Call generate-content API
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            ...updatedConfig,
            language: 'Hindi',
            videoFormat: config.videoFormat || '9:16 Portrait',
          },
        }),
      });

      setActiveCreationStep('SYNTHESIZING 8-SECOND FLOW CLIPS...');
      setCoreProcessingState('flow');

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setAiResult(resJson.data);
        const finalProj: GodseyeProject = {
          ...starterProject,
          status: 'READY',
          content: resJson.data,
          result: resJson.data,
        };
        saveProject(finalProj);
        setCurrentProject(finalProj);
        setProjects(getAllProjects());

        setCoreProcessingState('complete');
        setTimeout(() => setCoreProcessingState('idle'), 2500);
      } else {
        setCoreProcessingState('error');
        setTimeout(() => setCoreProcessingState('idle'), 3000);
      }
    } catch (err) {
      console.error('Supercomputer creation failure:', err);
      setCoreProcessingState('error');
      setTimeout(() => setCoreProcessingState('idle'), 3000);
    } finally {
      setIsNewContentModalOpen(false);
      setActiveTab('Create');
      setCreatorMode('short');
    }
  };

  // Handler for Quick Command Palette Triggers
  const handleSupercomputerQuickAction = async (actionKey: string) => {
    if (actionKey === 'new-content') {
      setIsNewContentModalOpen(true);
    } else if (actionKey === 'timing' || actionKey === 'fix-timing') {
      setCoreProcessingState('thinking');
      try {
        const scenes = aiResult?.scenes || [];
        const res = await fetch('/api/short-engine/fix-all-timing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenes }),
        });
        const json = await res.json();
        if (json.success && json.data?.scenes) {
          const updated = { ...aiResult!, scenes: json.data.scenes };
          setAiResult(updated);
          const updatedProject: GodseyeProject = {
            ...currentProject,
            content: updated,
            result: updated,
          };
          saveProject(updatedProject);
          setCurrentProject(updatedProject);
          setProjects(getAllProjects());
          setCoreProcessingState('complete');
          setTimeout(() => setCoreProcessingState('idle'), 2000);
        }
      } catch (err) {
        setCoreProcessingState('error');
        setTimeout(() => setCoreProcessingState('idle'), 2000);
      }
    } else if (actionKey.startsWith('duration-')) {
      const dur = actionKey.replace('duration-', '') + ' sec';
      setConfig((prev) => ({ ...prev, duration: dur as Duration }));
      setActiveTab('Create');
    }
  };

  // If operator is not authenticated, show full-screen God's Eye Login
  if (!currentUser) {
    return (
      <GodsEyeLoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        isModal={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#02050c] text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 0. CINEMATIC BOOT EXPERIENCE */}
      {!hasBooted && (
        <SystemBootSequence
          onComplete={() => {
            setHasBooted(true);
            try {
              localStorage.setItem('godseye_booted_session', 'true');
            } catch {}
          }}
        />
      )}

      {/* 1. FUTURISTIC SUPERCOMPUTER TOP BAR */}
      <SupercomputerTopBar
        currentProjectName={currentProject.name}
        coreState={coreProcessingState}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenNewContentModal={() => setIsNewContentModalOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onSignOut={() => {
          clearUserSession();
          setCurrentUser(null);
        }}
        onNavigateHome={() => setActiveTab('Dashboard')}
        activeTabLabel={activeTab}
        onOpenTheme={() => setIsThemeModalOpen(true)}
      />

      {/* Main Studio Body: Supercomputer Navigation + Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Futuristic Supercomputer Navigation (Unified 23 Subsystems & Categories) */}
        <SupercomputerNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          projectsCount={projects.length}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          currentProjectName={currentProject?.name}
        />

        {/* Center Content Workspace Stage (Clean, spacious, professional workflow) */}
        <div id="godseye-hue-stage" className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 flex min-w-0">
            <main className="flex-1 min-w-0 w-full max-w-none 2xl:max-w-[1750px] mx-auto px-3 sm:px-6 lg:px-8 xl:pr-12 pt-4 pb-16 space-y-6 transition-all">
              {/* Active Tab View Routing */}
            {activeTab === 'Dashboard' && (
              <CommandCoreDashboard
                currentProject={currentProject}
                projects={projects}
                coreState={coreProcessingState}
                onNavigate={setActiveTab}
                onNewContent={() => setIsNewContentModalOpen(true)}
                onOpenProject={(project) => {
                  handleOpenProject(project);
                  setActiveTab('Create');
                }}
              />
            )}

            {activeTab === 'Research' && (
              <ResearchView
                onSendToCreate={(storyText) => {
                  handleStoryChange(storyText);
                  setActiveTab('Create');
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Create' && (
              <>
                {/* STEP 6: Active Project Bar (Rename inline, Status, Auto-save, Quick Actions) */}
                <ActiveProjectBar
                  currentProject={currentProject}
                  onRenameProject={(newName) => handleRenameProject(currentProject.id, newName)}
                  onDuplicateProject={() => handleDuplicateProject(currentProject.id)}
                  onNewProject={handleNewProject}
                  onOpenDrawer={() => setIsProjectsDrawerOpen(true)}
                  isAutoSaving={isAutoSaving}
                />

                {/* Workspace Mode Switcher (Short Creator vs Full Studio Controls) */}
                <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      id="btn-switch-mode-short"
                      onClick={() => setCreatorMode('short')}
                      className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 font-bold ${
                        creatorMode === 'short'
                          ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-amber-500/20 text-cyan-200 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>SHORT CREATOR (8s FLOW ENGINE)</span>
                    </button>
                    <button
                      type="button"
                      id="btn-switch-mode-classic"
                      onClick={() => setCreatorMode('classic')}
                      className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                        creatorMode === 'classic'
                          ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <span>ADVANCED STUDIO CONTROLS</span>
                    </button>
                  </div>
                  <span className="hidden sm:inline text-[11px] text-slate-500 pr-2">
                    {creatorMode === 'short' ? 'Precision 24s/32s/40s 8-Second Hindi Flow' : 'Multi-format full studio'}
                  </span>
                </div>

                {creatorMode === 'short' ? (
                  <ShortCreatorView
                    currentProject={currentProject}
                    projects={projects}
                    aiResult={aiResult}
                    config={config}
                    onUpdateConfig={(partial) => {
                      setConfig((prev) => ({ ...prev, ...partial }));
                      triggerAutoSaveDraft({ ...config, ...partial });
                    }}
                    onUpdateAiResult={handleUpdateAiResult}
                    onSaveProject={(p) => {
                      saveProject(p);
                      setProjects(getAllProjects());
                    }}
                    onNavigate={setActiveTab}
                  />
                ) : (
                  <>
                    {/* 1. ARTICLE / STORY SECTION */}
                    <ArticleInputSection
                      title={config.title}
                      sourceUrl={config.sourceUrl}
                      storyContent={config.storyContent}
                      onChangeTitle={handleTitleChange}
                      onChangeUrl={handleUrlChange}
                      onChangeStory={handleStoryChange}
                      onApplySample={handleApplySample}
                      onClear={handleClearStory}
                    />

                    {/* 2-8. STUDIO CONTROLS SECTIONS */}
                    <StudioControls
                      contentType={config.contentType}
                      onChangeContentType={handleContentTypeChange}
                      duration={config.duration}
                      customDurationSeconds={config.customDurationSeconds || 60}
                      onChangeDuration={handleDurationChange}
                      onChangeCustomDurationSeconds={handleCustomDurationSecondsChange}
                      videoFormat={config.videoFormat}
                      onChangeVideoFormat={handleVideoFormatChange}
                      language={config.language}
                      onChangeLanguage={handleLanguageChange}
                      contentStyle={config.contentStyle}
                      onChangeContentStyle={handleContentStyleChange}
                      mood={config.mood}
                      onChangeMood={handleMoodChange}
                      selectedPlatforms={config.selectedPlatforms}
                      onTogglePlatform={handleTogglePlatform}
                    />

                    {/* 9. MAIN BUTTON SECTION */}
                    <GenerateAction
                      config={config}
                      hasStoryContent={Boolean(config.storyContent.trim())}
                      isLoading={isLoading}
                      loadingStage={loadingStage}
                      onGenerate={handleGenerate}
                      statusMessage={statusMessage}
                      errorMessage={errorMessage}
                    />

                    {/* 10. OUTPUT WORKSPACE SECTION */}
                    <OutputWorkspace
                      config={config}
                      hasStoryContent={Boolean(config.storyContent.trim())}
                      isInitialized={isOutputInitialized}
                      aiResult={aiResult}
                      isLoading={isLoading}
                      projectName={currentProject.name}
                      onRegenerate={handleGenerate}
                      onRegenerateComponent={handleRegenerateComponent}
                      onUpdateVideoFormat={handleVideoFormatChange}
                      onUpdateAiResult={handleUpdateAiResult}
                      onNavigateTab={setActiveTab}
                    />
                  </>
                )}
              </>
            )}

            {activeTab === 'Short Production' && (
              <ShortCreatorView
                currentProject={currentProject}
                projects={projects}
                aiResult={aiResult}
                config={config}
                onUpdateConfig={(partial) => {
                  setConfig((prev) => ({ ...prev, ...partial }));
                  triggerAutoSaveDraft({ ...config, ...partial });
                }}
                onUpdateAiResult={handleUpdateAiResult}
                onSaveProject={(p) => {
                  saveProject(p);
                  setProjects(getAllProjects());
                }}
                onNavigate={setActiveTab}
              />
            )}

            {(activeTab === 'Script Studio' || activeTab === 'Script') && (
              <ScriptView
                activeProject={{
                  ...currentProject,
                  content: aiResult || currentProject.content,
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Voice Studio' && (
              <VoiceStudioView
                activeProject={{
                  ...currentProject,
                  result: aiResult || currentProject.content,
                  content: aiResult || currentProject.content,
                }}
                onNavigate={setActiveTab}
                onUpdateAiResult={handleUpdateAiResult}
              />
            )}

            {activeTab === 'Story Intelligence' && (
              <StoryIntelligenceView
                activeProject={{
                  ...currentProject,
                  content: aiResult || currentProject.content,
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Scene Studio' && (
              <SceneStudioView
                activeProject={{
                  ...currentProject,
                  config: currentProject.config || config,
                  result: aiResult || currentProject.content,
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Thumbnail Studio' && (
              <ThumbnailStudioView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                onNavigate={setActiveTab}
                onUpdateAiResult={handleUpdateAiResult}
              />
            )}

            {activeTab === 'SEO Studio' && (
              <SeoStudioView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                onNavigate={setActiveTab}
                onUpdateAiResult={handleUpdateAiResult}
              />
            )}

            {(activeTab === 'Publishing Queue' || activeTab === 'Scheduler') && (
              <PublishingQueueView
                projects={projects}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Connected Accounts' && (
              <ConnectedAccountsView
                currentUser={currentUser}
              />
            )}

            {activeTab === 'Trend Intelligence' && (
              <TrendIntelligenceView
                onNavigate={setActiveTab}
                onSelectTopicForGeneration={(topic) => handleTitleChange(topic)}
              />
            )}

            {(activeTab === 'Content Analytics' || activeTab === 'AI Recommendations') && (
              <ContentAnalyticsView
                projects={projects}
                activeProjectId={currentProject.id}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'YouTube' && (
              <YouTubeView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Facebook' && (
              <FacebookView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Instagram' && (
              <InstagramView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                onNavigate={setActiveTab}
              />
            )}

            {(activeTab === 'Analytics' || activeTab === 'Channel Analytics') && (
              <AnalyticsView
                activeProject={{ ...currentProject, result: aiResult || currentProject.content }}
                projects={projects}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Content Library' && (
              <ContentLibraryView
                projects={projects}
                onOpenProject={(p) => {
                  handleOpenProject(p);
                  setActiveTab('Create');
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Projects' && (
              <ProjectsView
                projects={projects}
                activeProjectId={currentProject.id}
                onOpenProject={(p) => {
                  handleOpenProject(p);
                  setActiveTab('Create');
                }}
                onNewProject={() => {
                  handleNewProject();
                  setActiveTab('Create');
                }}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'History' && (
              <HistoryView
                projects={projects}
                activeProjectId={currentProject.id}
                onOpenProject={(p) => {
                  handleOpenProject(p);
                  setActiveTab('Create');
                }}
                onNewProject={() => {
                  handleNewProject();
                  setActiveTab('Create');
                }}
                onNavigate={setActiveTab}
              />
            )}

            {(activeTab === 'AI Settings' || activeTab === 'AI Models') && (
              <AiSettingsView />
            )}

            {activeTab === 'Account' && (
              <AccountView
                currentUser={currentUser}
                onOpenLogin={() => setShowLoginModal(true)}
                onSignOut={() => {
                  clearUserSession();
                  setCurrentUser(null);
                }}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'Settings' && (
              <SettingsView
                onOpenThemeModal={() => setIsThemeModalOpen(true)}
                onNavigate={setActiveTab}
                currentUser={currentUser}
              />
            )}
            </main>

            {/* Right Contextual Intelligence Panel */}
            {isRightPanelOpen && (
              <>
                {/* Desktop: Docked right sidebar with slim width */}
                <div className="hidden xl:block">
                  <ContextualRightPanel
                    isOpen={isRightPanelOpen}
                    onClose={() => setIsRightPanelOpen(false)}
                    project={currentProject}
                    config={config}
                    activeTab={activeTab}
                    onNavigate={setActiveTab}
                    onOpenTheme={() => setIsThemeModalOpen(true)}
                    onImportUrl={() => setActiveTab('Create')}
                    onUpdateAiResult={handleUpdateAiResult}
                  />
                </div>

                {/* Mobile / Tablet: Slide-over drawer with backdrop so workspace is never squeezed */}
                <div
                  className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm xl:hidden animate-fadeIn"
                  onClick={() => setIsRightPanelOpen(false)}
                >
                  <div
                    className="w-full max-w-xs sm:max-w-sm h-full bg-[#070a12] shadow-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ContextualRightPanel
                      isOpen={isRightPanelOpen}
                      onClose={() => setIsRightPanelOpen(false)}
                      project={currentProject}
                      config={config}
                      activeTab={activeTab}
                      onNavigate={setActiveTab}
                      onOpenTheme={() => setIsThemeModalOpen(true)}
                      onImportUrl={() => setActiveTab('Create')}
                      onUpdateAiResult={handleUpdateAiResult}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Discreet edge opener on desktop when panel is closed */}
            {!isRightPanelOpen && (
              <button
                type="button"
                id="btn-open-ai-panel-edge"
                onClick={() => setIsRightPanelOpen(true)}
                className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 items-center gap-1.5 px-2 py-3 rounded-l-xl bg-slate-900/90 hover:bg-cyan-950 border-y border-l border-slate-700/80 hover:border-cyan-500/60 text-slate-400 hover:text-cyan-300 shadow-xl backdrop-blur-md transition-all cursor-pointer group"
                title="Open AI Intelligence Panel"
              >
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:text-cyan-300 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold [writing-mode:vertical-lr] tracking-widest uppercase">
                    AI COPILOT
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-[#07090e] py-6 mt-12 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 font-medium text-slate-400">
                <span>GOD'S EYE V3.0</span>
                <span>•</span>
                <span className="text-slate-500">AI Content Command Center & Supercomputer</span>
              </p>
              <p className="text-slate-600 text-[11px]">
                Server-Side Gemini 3.8 Flash Engine • Teleprompter Hindi Narration & Veo Prompts
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Switch Operator Modal */}
      {showLoginModal && (
        <GodsEyeLoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowLoginModal(false);
          }}
          onClose={() => setShowLoginModal(false)}
          isModal={true}
        />
      )}

      {/* Theme Customizer Modal (Parts A-C) */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        settings={themeSettings}
        onChange={handleThemeChange}
      />

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* STEP 6: Project History Drawer (Slide-Over) */}
      <ProjectHistoryDrawer
        isOpen={isProjectsDrawerOpen}
        onClose={() => setIsProjectsDrawerOpen(false)}
        projects={projects}
        activeProjectId={currentProject.id}
        onOpenProject={handleOpenProject}
        onNewProject={handleNewProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
      />

      {/* FUTURISTIC SUPERCOMPUTER MODALS & INTELLIGENCE COPILOT */}
      <NewContentModal
        isOpen={isNewContentModalOpen}
        onClose={() => setIsNewContentModalOpen(false)}
        onInitialize={handleInitializeNewContent}
        isProcessing={coreProcessingState !== 'idle' && coreProcessingState !== 'complete'}
        processingStep={activeCreationStep}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        projects={projects}
        onOpenProject={handleOpenProject}
        onTriggerQuickAction={handleSupercomputerQuickAction}
      />

      <JarvisCopilotLayer
        aiResult={aiResult}
        onNavigate={setActiveTab}
        onQuickFix={handleSupercomputerQuickAction}
      />
    </div>
  );
}

