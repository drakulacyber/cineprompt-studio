import React from 'react';
import { 
  Film, 
  Sparkles, 
  History, 
  Trash2, 
  ChevronRight, 
  Clapperboard, 
  Layers,
  HeartHandshake,
  ShieldAlert,
  Cpu,
  Ghost,
  Smartphone,
  Tv,
  Clock
} from 'lucide-react';
import { PRESET_TEMPLATES } from '../services/templates';
import { ChatMessage, PresetTemplate } from '../types';

interface SidebarProps {
  messages: ChatMessage[];
  onSelectProject: (msg: ChatMessage) => void;
  onSelectPreset: (preset: PresetTemplate) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  messages,
  onSelectProject,
  onSelectPreset,
  onClearHistory,
  isOpen,
  onClose,
  activeId
}) => {
  const projectMessages = messages.filter((m) => m.projectData);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Ghost': return <Ghost className="w-4 h-4 text-emerald-400" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-rose-400" />;
      default: return <Film className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static top-16 bottom-0 left-0 z-40
        w-80 bg-studio-900/95 border-r border-studio-800/80
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Presets Header */}
        <div className="p-4 border-b border-studio-800/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Format & Gaya Film
            </span>
            <span className="text-[10px] text-slate-500 font-mono">6 PRESETS</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {PRESET_TEMPLATES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full text-left p-2 rounded-lg bg-studio-850/60 hover:bg-studio-800 border border-studio-800/60 hover:border-indigo-500/50 transition-all group flex items-start space-x-2.5"
              >
                <div className="p-1.5 rounded-md bg-studio-900 border border-studio-700/50 group-hover:scale-105 transition-transform mt-0.5">
                  {getIcon(preset.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                      {preset.title}
                    </h4>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {preset.genre} • {preset.defaultDuration}m
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* History Projects */}
        <div className="flex-1 flex flex-col min-h-0 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Proyek Naskah & Shot List ({projectMessages.length})
            </span>
            {projectMessages.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-slate-500 hover:text-rose-400 transition-colors"
                title="Hapus riwayat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {projectMessages.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-studio-800 rounded-xl">
                <Clapperboard className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400 font-medium">Belum ada proyek tersimpan</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ketik ide naskah atau gunakan kontrol di atas untuk menyusun alur episode dan durasi.
                </p>
              </div>
            ) : (
              projectMessages.map((msg) => {
                const proj = msg.projectData!;
                const isActive = activeId === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => {
                      onSelectProject(msg);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-sm'
                        : 'bg-studio-850/40 border-studio-800/60 hover:bg-studio-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`p-1.5 rounded-md ${isActive ? 'bg-indigo-600/30 text-indigo-300' : 'bg-studio-900 text-slate-400'}`}>
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-indigo-300">
                          {proj.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {proj.totalDurationFormatted || proj.genre}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-studio-800/80 bg-studio-950/50 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Engine: ARRI / Cooke Anamorphic</span>
          <span className="text-cyan-400 font-mono font-bold">Pro Edition</span>
        </div>
      </aside>
    </>
  );
};
