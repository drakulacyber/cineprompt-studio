import React, { useState } from 'react';
import { 
  Film, 
  Tv, 
  Smartphone, 
  Sparkles, 
  Clock, 
  Layers, 
  Camera, 
  Palette, 
  ChevronDown, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { ProductionConfig, FilmFormat } from '../types';

interface ProductionControlBarProps {
  config: ProductionConfig;
  onChangeConfig: (newConfig: ProductionConfig) => void;
  onSelectCommand: (cmd: string) => void;
}

export const ProductionControlBar: React.FC<ProductionControlBarProps> = ({
  config,
  onChangeConfig,
  onSelectCommand
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatOptions: Array<{ id: FilmFormat; label: string; icon: any; ratio: '16:9' | '9:16' | '2.39:1' }> = [
    { id: 'series_kdrama', label: 'Series / K-Drama', icon: Tv, ratio: '16:9' },
    { id: 'vertical_drama', label: 'Drama Vertikal 9:16', icon: Smartphone, ratio: '9:16' },
    { id: 'feature_film', label: 'Layar Lebar Bioskop', icon: Film, ratio: '2.39:1' },
    { id: 'short_film', label: 'Film Pendek Festival', icon: Sparkles, ratio: '16:9' },
    { id: 'commercial_tvc', label: 'Iklan TVC 60 Detik', icon: Clock, ratio: '16:9' },
  ];

  const handleFormatChange = (fmt: FilmFormat, ratio: '16:9' | '9:16' | '2.39:1') => {
    let scenes = 3;
    let shots = 4;
    let eps = 1;
    let dur = 15;

    if (fmt === 'vertical_drama') {
      scenes = 2;
      shots = 4;
      eps = 3;
      dur = 2;
    } else if (fmt === 'commercial_tvc') {
      scenes = 2;
      shots = 5;
      eps = 1;
      dur = 1;
    } else if (fmt === 'series_kdrama') {
      scenes = 4;
      shots = 4;
      eps = 1;
      dur = 45;
    } else if (fmt === 'feature_film') {
      scenes = 4;
      shots = 5;
      eps = 1;
      dur = 110;
    }

    onChangeConfig({
      ...config,
      format: fmt,
      aspectRatio: ratio,
      scenesCount: scenes,
      shotsPerScene: shots,
      episodeCount: eps,
      targetDurationMinutes: dur
    });
  };

  return (
    <div className="bg-studio-900/90 border-b border-studio-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto space-y-2">
        {/* Main Format Pills & Expand Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Format Selector Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden md:inline">
              Alur & Format:
            </span>

            {formatOptions.map((f) => {
              const Icon = f.icon;
              const isSelected = config.format === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFormatChange(f.id, f.ratio)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md glow-indigo'
                      : 'bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-750'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Slash Commands Pills */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onSelectCommand('/gaya_output')}
              className="text-[11px] px-2 py-1 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/70 font-mono transition-all"
              title="Atur Gaya Output"
            >
              /gaya_output
            </button>
            <button
              onClick={() => onSelectCommand('/prompt_profesional-ahli')}
              className="text-[11px] px-2 py-1 rounded-md bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-800/70 font-mono transition-all"
              title="Aktifkan Prompt Profesional Ahli"
            >
              /prompt_profesional-ahli
            </button>
            <button
              onClick={() => onSelectCommand('/hasil_lengkap')}
              className="text-[11px] px-2 py-1 rounded-md bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800/70 font-mono transition-all"
              title="Format Hasil Lengkap Sutradara"
            >
              /hasil_lengkap
            </button>

            {/* Customizer Drawer Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                isExpanded ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-studio-850 text-slate-300 border-studio-750 hover:border-slate-500'
              }`}
              title="Buka Pengaturan Alur Episode, Scene & Durasi"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sesuaikan Alur</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Detailed Controls Drawer (Episode, Scene, Shot, Durasi, Camera Rig, LUT) */}
        {isExpanded && (
          <div className="pt-3 pb-2 border-t border-studio-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Episode Count */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Jumlah Episode
              </label>
              <select
                value={config.episodeCount}
                onChange={(e) => onChangeConfig({ ...config, episodeCount: Number(e.target.value) })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs"
              >
                <option value={1}>1 Episode (Pilot/Stand)</option>
                <option value={3}>3 Episode (Mini-Series)</option>
                <option value={6}>6 Episode (Season 1)</option>
                <option value={12}>12 Episode</option>
                <option value={16}>16 Episode (K-Drama Standard)</option>
              </select>
            </div>

            {/* Scene Count */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Scene per Episode
              </label>
              <select
                value={config.scenesCount}
                onChange={(e) => onChangeConfig({ ...config, scenesCount: Number(e.target.value) })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs"
              >
                <option value={2}>2 Scene (Intens Ringkas)</option>
                <option value={3}>3 Scene (3-Babak Standar)</option>
                <option value={4}>4 Scene (Eksplorasi Lengkap)</option>
                <option value={6}>6 Scene (Kompleks)</option>
              </select>
            </div>

            {/* Shots per Scene */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Shots per Scene
              </label>
              <select
                value={config.shotsPerScene}
                onChange={(e) => onChangeConfig({ ...config, shotsPerScene: Number(e.target.value) })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs"
              >
                <option value={3}>3 Shot Kunci</option>
                <option value={4}>4 Shot (Coverage Standar)</option>
                <option value={5}>5 Shot (Cinematic Deep)</option>
                <option value={6}>6 Shot (Komprehensif)</option>
              </select>
            </div>

            {/* Camera Rig */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" />
                Kamera Rig
              </label>
              <select
                value={config.cameraRig}
                onChange={(e) => onChangeConfig({ ...config, cameraRig: e.target.value as any })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs truncate"
              >
                <option value="ARRI Alexa Mini LF">ARRI Alexa Mini LF</option>
                <option value="RED V-Raptor 8K">RED V-Raptor 8K</option>
                <option value="Sony FX9">Sony FX9</option>
                <option value="IMAX 70mm Film">IMAX 70mm Film</option>
                <option value="35mm Film Grain (Kodak Vision3)">Kodak Vision3 35mm</option>
              </select>
            </div>

            {/* Color Grade LUT */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-400" />
                Color Grading
              </label>
              <select
                value={config.colorGradingStyle}
                onChange={(e) => onChangeConfig({ ...config, colorGradingStyle: e.target.value as any })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs truncate"
              >
                <option value="Teal & Orange Hollywood">Teal & Orange Hollywood</option>
                <option value="Dark Bleach Bypass Noir">Dark Bleach Bypass Noir</option>
                <option value="Pastel Melancholic K-Drama">Pastel K-Drama</option>
                <option value="Vibrant Cyberpunk Neon">Cyberpunk Neon</option>
                <option value="Vintage 70s Warm Film">Vintage 70s Warm Film</option>
              </select>
            </div>

            {/* Target Aspect Ratio */}
            <div className="bg-studio-950/70 p-2 rounded-xl border border-studio-800">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Rasio Aspek
              </label>
              <select
                value={config.aspectRatio}
                onChange={(e) => onChangeConfig({ ...config, aspectRatio: e.target.value as any })}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-1.5 text-slate-200 font-semibold text-xs"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="2.39:1">2.39:1 (CinemaScope)</option>
                <option value="9:16">9:16 (Vertikal)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
