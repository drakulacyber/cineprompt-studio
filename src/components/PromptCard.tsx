import React, { useState } from 'react';
import { Copy, Check, Sparkles, Video, Image as ImageIcon, Music, Mic } from 'lucide-react';

interface PromptCardProps {
  title: string;
  type: 'image' | 'video' | 'audio' | 'voice';
  prompt: string;
  tags?: string[];
  parameterNote?: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  title,
  type,
  prompt,
  tags,
  parameterNote
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'image':
        return 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300';
      case 'video':
        return 'bg-purple-950/70 border-purple-700/60 text-purple-300';
      case 'audio':
        return 'bg-amber-950/70 border-amber-700/60 text-amber-300';
      case 'voice':
        return 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'video': return <Video className="w-3.5 h-3.5" />;
      case 'audio': return <Music className="w-3.5 h-3.5" />;
      case 'voice': return <Mic className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="rounded-xl border border-studio-700/70 bg-studio-900/80 p-3.5 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${getBadgeColor()}`}>
              {getIcon()}
              <span>{title}</span>
            </span>
            {parameterNote && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {parameterNote}
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md transition-all ${
              copied
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-studio-800 text-slate-300 hover:bg-indigo-600 hover:text-white border border-studio-700'
            }`}
            title="Salin Prompt ke Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Tersalin!' : 'Copy'}</span>
          </button>
        </div>

        {/* Prompt content with high readability */}
        <div className="p-3 bg-studio-950/90 rounded-lg border border-studio-800/80 font-mono text-xs text-slate-200 leading-relaxed break-words selection:bg-indigo-600">
          {prompt}
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-studio-800 text-slate-400 border border-studio-700/50 font-mono">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
