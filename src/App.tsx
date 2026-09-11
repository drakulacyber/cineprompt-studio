import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { SettingsModal } from './components/SettingsModal';
import { ChatMessage, AppSettings, PresetTemplate, DramaProject, ProductionConfig } from './types';
import { generateLocalFilmProject, generateGeminiFilmProject } from './services/aiService';

const STORAGE_KEY_MESSAGES = 'cineprompt_messages_v2';
const STORAGE_KEY_SETTINGS = 'cineprompt_settings_v2';

const DEFAULT_SETTINGS: AppSettings = {
  provider: 'built-in',
  geminiApiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  aspectRatio: '16:9',
  productionConfig: {
    format: 'series_kdrama',
    episodeCount: 1,
    currentEpisode: 1,
    targetDurationMinutes: 45,
    scenesCount: 3,
    shotsPerScene: 4,
    cameraRig: 'ARRI Alexa Mini LF',
    colorGradingStyle: 'Teal & Orange Hollywood',
    aspectRatio: '16:9'
  }
};

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const handleUpdateProductionConfig = (newConfig: ProductionConfig) => {
    setSettings((prev) => ({
      ...prev,
      aspectRatio: newConfig.aspectRatio,
      productionConfig: newConfig
    }));
  };

  const handleSendMessage = async (text: string, customConfig?: Partial<ProductionConfig>) => {
    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let projectResult: DramaProject;

      if (settings.provider === 'gemini' && settings.geminiApiKey) {
        try {
          projectResult = await generateGeminiFilmProject(text, settings, customConfig);
        } catch (geminiError: any) {
          console.warn('Gemini API failed, falling back to local cinema engine:', geminiError);
          projectResult = generateLocalFilmProject(text, settings, customConfig);
          projectResult.directorNotes += `\n(Catatan: Fallback ke Built-in Engine karena: ${geminiError.message || 'API Issue'})`;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        projectResult = generateLocalFilmProject(text, settings, customConfig);
      }

      const botMessage: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: `🎬 Rancangan Produksi Film & Storyboard untuk "${projectResult.title}" berhasil disusun secara detail: (${projectResult.totalDurationFormatted})`,
        timestamp: Date.now(),
        projectData: projectResult
      };

      setMessages((prev) => [...prev, botMessage]);
      setActiveProjectId(botMessage.id);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Terjadi kendala saat merancang storyboard: ${error.message || 'Error tidak diketahui'}. Silakan coba kembali atau gunakan Built-in Engine di Pengaturan.`,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    const updatedConfig: ProductionConfig = {
      ...settings.productionConfig,
      format: preset.format,
      targetDurationMinutes: preset.defaultDuration
    };
    handleUpdateProductionConfig(updatedConfig);
    handleSendMessage(preset.samplePrompt, updatedConfig);
  };

  const handleSelectProject = (msg: ChatMessage) => {
    setActiveProjectId(msg.id);
  };

  const handleNewChat = () => {
    setActiveProjectId(undefined);
  };

  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh riwayat percakapan dan storyboard tersimpan?')) {
      setMessages([]);
      setActiveProjectId(undefined);
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    }
  };

  // Export full screenplay & storyboard to Markdown (.md)
  const handleExport = () => {
    const latestProject = [...messages].reverse().find((m) => m.projectData)?.projectData;

    if (!latestProject) {
      alert('Belum ada storyboard yang dibuat untuk diekspor!');
      return;
    }

    let md = `# ${latestProject.title}\n\n`;
    md += `**Format:** ${latestProject.format}\n`;
    md += `**Alur & Durasi:** ${latestProject.totalDurationFormatted}\n`;
    md += `**Kamera Rig:** ${latestProject.productionConfig?.cameraRig} | **Color Grade:** ${latestProject.productionConfig?.colorGradingStyle}\n`;
    md += `**Logline:** ${latestProject.logline}\n\n`;
    md += `## Sinopsis Lengkap\n${latestProject.synopsis}\n\n`;

    md += `## Karakter Utama & Wardrobe Consistency\n`;
    latestProject.characters.forEach((char) => {
      md += `### ${char.name} (${char.archetype})\n`;
      md += `- **Profil:** ${char.ageAndLook}\n`;
      md += `- **Psikologi:** ${char.psychologicalProfile}\n`;
      md += `- **Prompt Wardrobe Visual:** \`${char.wardrobeVisualPrompt}\`\n\n`;
    });

    md += `## Breakdown Episode, Scene & Shot Sinematografi\n`;
    latestProject.episodes?.forEach((ep) => {
      md += `### ${ep.title} (Durasi: ~${ep.totalDurationMinutes} Menit)\n`;
      md += `*${ep.logline}*\n\n`;

      ep.scenes.forEach((sc) => {
        md += `#### SCENE ${sc.sceneNumber}: ${sc.heading} [${sc.segmentType}]\n`;
        md += `*Estimasi Durasi Scene: ${sc.estimatedDurationSeconds} detik*\n`;
        md += `*Summary: ${sc.sceneSummary}*\n\n`;

        sc.shots.forEach((sh) => {
          md += `##### Shot #${sh.shotNumber}: ${sh.shotType} (${sh.cameraMovement})\n`;
          md += `- **Durasi:** ${sh.durationSeconds} Detik\n`;
          md += `- **Kamera & Lensa:** ${sh.cameraRigDetails}\n`;
          md += `- **Lighting & Color:** ${sh.lightingAndGrade}\n`;
          md += `- **Deskripsi Adegan:** ${sh.sceneDescription}\n`;
          md += `- **Aksi & Emosi:** ${sh.actionAndEmotion}\n`;
          if (sh.dialogueSnippet) md += `- **Dialog:** ${sh.dialogueSnippet}\n`;
          md += `\n**Prompt Midjourney v6.1:**\n\`\`\`\n${sh.midjourneyPrompt}\n\`\`\`\n`;
          md += `\n**Prompt Runway Gen-3 / Sora Video:**\n\`\`\`\n${sh.runwayVideoPrompt}\n\`\`\`\n\n`;
        });
      });
    });

    md += `## Naskah Skenario Industri\n\`\`\`\n${latestProject.screenplaySnippet}\n\`\`\`\n\n`;
    md += `## Audio & Soundtrack\n- **Suno Prompt:** \`${latestProject.audioPromptSuno}\`\n`;
    md += `- **ElevenLabs Voice:** \`${latestProject.voiceoverPromptElevenLabs}\`\n\n`;
    md += `## Catatan Teknis Sutradara\n${latestProject.directorNotes}\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${latestProject.title.replace(/[^a-zA-Z0-9]/g, '_')}_MasterProduction.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeProjectTitle = messages.find((m) => m.id === activeProjectId)?.projectData?.title;

  return (
    <div className="flex flex-col h-screen bg-studio-950 text-slate-100 overflow-hidden font-sans">
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewChat={handleNewChat}
        onExport={handleExport}
        activeProjectTitle={activeProjectTitle}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          messages={messages}
          onSelectProject={handleSelectProject}
          onSelectPreset={handleSelectPreset}
          onClearHistory={handleClearHistory}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeId={activeProjectId}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-studio-950">
          <ChatView
            messages={
              activeProjectId
                ? messages.filter((m) => m.id === activeProjectId || m.timestamp <= (messages.find(x => x.id === activeProjectId)?.timestamp || 0))
                : messages
            }
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            settings={settings}
            onUpdateProductionConfig={handleUpdateProductionConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
};
