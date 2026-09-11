import React from 'react';
import { Clapperboard, Sparkles, Settings as SettingsIcon, Download, PlusCircle, Film } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onNewChat: () => void;
  onExport: () => void;
  activeProjectTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onNewChat,
  onExport,
  activeProjectTitle
}) => {
  return (
    <header className="h-16 border-b border-studio-800/80 bg-studio-950/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg glow-indigo">
          <div className="w-full h-full bg-studio-950 rounded-[11px] flex items-center justify-center">
            <Clapperboard className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              CinePrompt <span className="text-cyan-400 font-semibold text-xs px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 ml-1">STUDIO AI</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            {activeProjectTitle ? (
              <span className="text-indigo-300 font-medium truncate max-w-xs inline-block align-bottom">
                🎬 {activeProjectTitle}
              </span>
            ) : (
              'Prompt Engineering Khusus Drama, Storyboard, Film & Shot List'
            )}
          </p>
        </div>
      </div>

      {/* Engine Status & Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Engine Badge */}
        <button
          onClick={onOpenSettings}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border border-studio-700 bg-studio-900/90 text-slate-300 hover:border-indigo-500 transition-colors"
          title="Klik untuk mengganti engine atau memasukkan Gemini API Key"
        >
          <span className={`w-2 h-2 rounded-full ${settings.provider === 'gemini' ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></span>
          <span>
            {settings.provider === 'gemini' ? `Gemini Live (${settings.model.replace('gemini-', '')})` : 'Built-in Cinema Engine'}
          </span>
        </button>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Proyek Baru</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700/80 transition-all hover:border-slate-500"
          title="Ekspor Storyboard & Naskah ke Markdown / Dokumen"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Ekspor Naskah</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 hover:text-white border border-studio-700/80 transition-all"
          title="Pengaturan Model & API Key"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
