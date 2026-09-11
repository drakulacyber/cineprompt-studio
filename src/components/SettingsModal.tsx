import React, { useState } from 'react';
import { X, Key, Cpu, Ratio, Save, ShieldCheck, HelpCircle } from 'lucide-react';
import { AppSettings, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-studio-900 border border-studio-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-studio-800 flex items-center justify-between bg-studio-950/60">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Pengaturan Studio & Model AI</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Pilihan Mesin AI (Engine)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'built-in' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.provider === 'built-in'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-studio-850/60 border-studio-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-indigo-300 mb-1">Built-in Cinema Engine</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  Instan, offline, gratis tanpa memerlukan API Key.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'gemini' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.provider === 'gemini'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-studio-850/60 border-studio-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-emerald-300 mb-1">Google Gemini Live API</div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  Koneksi langsung ke model Gemini untuk respon tak terbatas.
                </div>
              </button>
            </div>
          </div>

          {/* Gemini API Key Field (if Gemini selected) */}
          {formData.provider === 'gemini' && (
            <div className="space-y-2 p-3.5 rounded-xl bg-studio-950 border border-studio-800">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Google Gemini API Key
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Dapatkan API Key Gratis
                </a>
              </label>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-studio-900 border border-studio-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-2 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {showKey ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>API Key disimpan secara aman di browser lokal Anda (Local Storage).</span>
              </div>
            </div>
          )}

          {/* Target Aspect Ratio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Ratio className="w-3.5 h-3.5 text-cyan-400" />
              Rasio Aspek Sinematografi Target
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '16:9', label: '16:9', sub: 'Film Standar' },
                { id: '2.39:1', label: '2.39:1', sub: 'Anamorphic Scope' },
                { id: '9:16', label: '9:16', sub: 'Drama Vertikal/Reels' },
                { id: '1:1', label: '1:1', sub: 'Square' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, aspectRatio: r.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    formData.aspectRatio === r.id
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-studio-850/60 border-studio-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs">{r.label}</div>
                  <div className="text-[10px] text-slate-400 opacity-80">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Pilihan Model Gemini
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full bg-studio-950 border border-studio-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Super Cepat & Efisien - Rekomendasi)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Detail Sinematografi Ekstrem)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Reasoning)</option>
            </select>
          </div>

          {/* Footer Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg glow-indigo active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
