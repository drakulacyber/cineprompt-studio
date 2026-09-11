import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Film, 
  Loader2, 
  Tv,
  Clock,
  Zap,
  Sliders
} from 'lucide-react';
import { ChatMessage, AppSettings, ProductionConfig } from '../types';
import { StoryboardView } from './StoryboardView';
import { ProductionControlBar } from './ProductionControlBar';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, customConfig?: Partial<ProductionConfig>) => void;
  isLoading: boolean;
  settings: AppSettings;
  onUpdateProductionConfig: (config: ProductionConfig) => void;
  onOpenSettings: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  settings,
  onUpdateProductionConfig,
  onOpenSettings
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleSlashCommand = (cmd: string) => {
    if (cmd === '/gaya_output') {
      setInput((prev) => prev + (prev ? ' ' : '') + '[GAYA OUTPUT: Format Serial K-Drama 45 Menit dengan cliffhanger kuat]');
    } else if (cmd === '/prompt_profesional-ahli') {
      setInput((prev) => prev + (prev ? ' ' : '') + '[PROMPT AHLI: Gunakan ARRI Alexa Mini LF + 35mm Cooke Anamorphic, Chiaroscuro Lighting, Kodak LUT]');
    } else if (cmd === '/hasil_lengkap') {
      setInput((prev) => prev + (prev ? ' ' : '') + '[HASIL LENGKAP: Bedah Episode 1, 3 Scene, breakdown shot durasi detik, dan dialog]');
    }
    textareaRef.current?.focus();
  };

  const suggestionChips = [
    { 
      label: '📺 K-Drama Episode 1: Perseteruan Pewaris Chaebol', 
      prompt: 'Buat alur cerita drama K-Drama Episode 1 (durasi 45 menit). Scene 1: Pertemuan di ruang sidang Seoul. Scene 2: Konfrontasi di rooftop saat hujan. Scene 3: Rahasia keluarga terungkap.' 
    },
    { 
      label: '📱 Drama Vertikal 9:16: Menantu yang Diremehkan (Fast-Hook)', 
      prompt: 'Buat alur drama vertikal 9:16 durasi 2 menit penuh aksi & fast hook untuk TikTok/ReelShort. Menantu yang dihina di pesta keluarga ternyata adalah pemilik perusahaan terbesar.' 
    },
    { 
      label: '🎬 Layar Lebar: Thriller Mafia Tanjung Priok (2.39:1)', 
      prompt: 'Buat breakdown film layar lebar sinematik 2.39:1. Mantan pembunuh bayaran mafia Jakarta diserang musuh lama di gudang kontainer pelabuhan. Shot sinematik ultra gelap.' 
    },
    { 
      label: '💎 TVC Iklan 60 Detik: Parfum Mewah di Venesia', 
      prompt: 'Storyboarding iklan sinematik komersil 60 detik. Botol parfum emas di balkon Venesia malam hari, model gaun sutra hitam, kembang api di langit malam.' 
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-studio-950 overflow-hidden">
      {/* Top Interactive Production Control Bar */}
      <ProductionControlBar
        config={settings.productionConfig}
        onChangeConfig={onUpdateProductionConfig}
        onSelectCommand={handleSlashCommand}
      />

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.length === 0 ? (
          /* Hero Welcome State */
          <div className="max-w-4xl mx-auto my-auto py-6 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-2xl glow-indigo mb-4">
              <div className="w-full h-full bg-studio-950 rounded-[15px] flex items-center justify-center">
                <Film className="w-8 h-8 text-indigo-400 animate-pulse-subtle" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
              Studio Sutradara & Rekayasa Prompt Film Profesional
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mb-6 leading-relaxed">
              Atur alur <span className="text-indigo-400 font-bold">Episode, Scene, Segment, Shot List</span> dan <span className="text-cyan-400 font-bold">Durasi Realistis</span>. Hasilkan prompt kamera optik tingkat ahli untuk Midjourney v6.1, Runway Gen-3, dan Sora.
            </p>

            {/* Quick Suggestions */}
            <div className="w-full max-w-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                🎬 Pilih Contoh Alur & Format Siap Produksi:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(chip.prompt)}
                    className="text-left p-3 rounded-xl bg-studio-900/80 hover:bg-studio-850 border border-studio-800 hover:border-indigo-500/60 transition-all text-xs text-slate-300 hover:text-white group flex items-start space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform mt-0.5 flex-shrink-0" />
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}

                <div
                  className={`max-w-[92%] md:max-w-[90%] rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white p-4 shadow-md'
                      : 'bg-studio-900/90 border border-studio-800/80 p-5 text-slate-200 shadow-xl'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-4">
                      {msg.content && (
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {msg.content}
                        </div>
                      )}

                      {msg.projectData && (
                        <StoryboardView project={msg.projectData} />
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-studio-800 border border-studio-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
                <div className="bg-studio-900/90 border border-studio-800 p-4 rounded-2xl flex items-center space-x-3 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span>Sutradara AI sedang menyusun breakdown Episode, Scene, Segment, durasi shot & prompt sinematografi ahli...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box Area */}
      <div className="border-t border-studio-800/80 bg-studio-900/80 backdrop-blur-md p-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end bg-studio-950 rounded-2xl border border-studio-700/80 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputResize}
              onKeyDown={handleKeyDown}
              placeholder="Ketik ide cerita drama, film, atau gunakan /gaya_output, /prompt_profesional-ahli, /hasil_lengkap..."
              rows={1}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 px-3 py-2 outline-none resize-none max-h-40 font-sans"
              disabled={isLoading}
            />

            <div className="flex items-center space-x-1.5 flex-shrink-0 pb-1 pr-1">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg glow-indigo active:scale-95'
                    : 'bg-studio-800 text-slate-600 cursor-not-allowed'
                }`}
                title="Kirim (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* Bottom Metas */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <div className="flex items-center space-x-2">
              <span>Gunakan <strong className="text-cyan-400">/gaya_output</strong>, <strong className="text-purple-400">/prompt_profesional-ahli</strong>, <strong className="text-amber-400">/hasil_lengkap</strong></span>
            </div>
            <div className="flex items-center space-x-3 font-mono">
              <span>{settings.productionConfig.episodeCount} Eps • {settings.productionConfig.scenesCount} Scenes</span>
              <span className="text-indigo-400 font-bold">{settings.productionConfig.aspectRatio}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
