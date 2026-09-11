import React, { useState } from 'react';
import { 
  DramaProject, 
  StoryboardShot, 
  FilmCharacter, 
  SceneBreakdown 
} from '../types';
import { PromptCard } from './PromptCard';
import { 
  Camera, 
  Video, 
  Sparkles, 
  FileText, 
  Users, 
  Music, 
  Sliders, 
  Copy, 
  Check, 
  Film, 
  Zap, 
  Clock, 
  Layers, 
  Table, 
  ShieldAlert,
  ChevronRight,
  Tv
} from 'lucide-react';

interface StoryboardViewProps {
  project: DramaProject;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'characters' | 'screenplay' | 'table' | 'audio'>('storyboard');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState(false);

  // Extract all scenes across episodes (or fallback)
  const currentEpisode = project.episodes?.[0];
  const scenes: SceneBreakdown[] = currentEpisode?.scenes || [];
  const activeScene = scenes[selectedSceneIndex] || scenes[0];

  // All shots for master copy
  const allShots: StoryboardShot[] = scenes.flatMap((s) => s.shots) || [];

  const handleCopyMasterMidjourney = () => {
    const allMj = allShots.map((s) => `[SCENE ${s.sceneNumber} - SHOT ${s.shotNumber} | ${s.shotType} | Durasi: ${s.durationSeconds}s]:\n${s.midjourneyPrompt}`).join('\n\n');
    navigator.clipboard.writeText(allMj);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getFormatLabel = (fmt: string) => {
    switch (fmt) {
      case 'vertical_drama': return '📱 Drama Vertikal (9:16)';
      case 'series_kdrama': return '📺 Series / K-Drama Episodic';
      case 'feature_film': return '🎬 Layar Lebar Cinema (2.39:1)';
      case 'commercial_tvc': return '💎 Iklan Komersil TVC';
      default: return '🏆 Film Pendek Sinematik';
    }
  };

  const getSegmentBadge = (type: string) => {
    switch (type) {
      case 'Exposition': return 'bg-blue-950/70 border-blue-700/60 text-blue-300';
      case 'Rising Action': return 'bg-amber-950/70 border-amber-700/60 text-amber-300';
      case 'Climax / Turning Point': return 'bg-rose-950/70 border-rose-700/60 text-rose-300';
      case 'Cliffhanger': return 'bg-purple-950/70 border-purple-700/60 text-purple-300';
      default: return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Production Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-studio-900 via-studio-850 to-indigo-950/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Film className="w-52 h-52 text-indigo-400" />
        </div>

        <div className="relative z-10 space-y-3">
          {/* Badges & Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
              {getFormatLabel(project.format)}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-studio-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {project.totalDurationFormatted}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              Rig: {project.productionConfig?.cameraRig || 'ARRI Alexa LF'}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
              🎨 {project.productionConfig?.colorGradingStyle || 'Teal & Orange'}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {project.title}
          </h2>

          <p className="text-sm text-indigo-200/90 font-medium italic max-w-3xl leading-relaxed">
            "{project.logline}"
          </p>

          <p className="text-xs text-slate-300 max-w-4xl leading-relaxed bg-studio-950/60 p-3.5 rounded-xl border border-studio-800/80">
            <strong className="text-slate-100">Sinopsis Produksi: </strong>{project.synopsis}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-studio-800 pb-3">
        <div className="flex items-center space-x-1 sm:space-x-2 bg-studio-900 p-1 rounded-xl border border-studio-800">
          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'storyboard'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Storyboard ({allShots.length} Shots)</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabel Shot List Kamera</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'characters'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Karakter & Wardrobe</span>
          </button>

          <button
            onClick={() => setActiveTab('screenplay')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'screenplay'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Naskah Skenario</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'audio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio & VO</span>
          </button>
        </div>

        {/* Master Copy Prompt Button */}
        <button
          onClick={handleCopyMasterMidjourney}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            copiedAll
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-studio-850 hover:bg-studio-800 text-indigo-300 border-indigo-500/40 hover:border-indigo-400'
          }`}
          title="Salin seluruh prompt shot storyboard sekaligus"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{copiedAll ? 'Semua Prompt Tersalin!' : 'Copy Semua Prompt Ahli'}</span>
        </button>
      </div>

      {/* TAB 1: VISUAL STORYBOARD BY SCENE */}
      {activeTab === 'storyboard' && (
        <div className="space-y-6">
          {/* Scene Selector Sub-Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1 flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Pilih Scene:
            </span>
            {scenes.map((sc, idx) => (
              <button
                key={sc.sceneNumber}
                onClick={() => setSelectedSceneIndex(idx)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSceneIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md glow-indigo'
                    : 'bg-studio-900 border-studio-700/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>Scene {sc.sceneNumber}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300 font-mono">
                  ⏱️ {sc.estimatedDurationSeconds}s
                </span>
              </button>
            ))}
          </div>

          {/* Active Scene Heading Card */}
          {activeScene && (
            <div className="p-4 rounded-xl bg-studio-900/90 border border-studio-700/80 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSegmentBadge(activeScene.segmentType)}`}>
                    {activeScene.segmentType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Lokasi: {activeScene.location} • Waktu: {activeScene.timeOfDay}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-black text-white font-mono tracking-tight">
                  🎬 {activeScene.heading}
                </h3>
                <p className="text-xs text-slate-300 italic">{activeScene.sceneSummary}</p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-cyan-400">
                  Total Durasi Scene: {activeScene.estimatedDurationSeconds} Detik
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeScene.shots.length} Kamera Shots Terdaftar
                </div>
              </div>
            </div>
          )}

          {/* Shots in Current Scene */}
          <div className="space-y-6">
            {activeScene?.shots.map((shot) => (
              <div 
                key={shot.shotNumber}
                className="rounded-2xl border border-studio-700/80 bg-studio-900/90 overflow-hidden shadow-lg hover:border-indigo-500/50 transition-all"
              >
                {/* Shot Header Bar */}
                <div className="bg-studio-950 px-5 py-3 border-b border-studio-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 font-extrabold text-white text-xs flex items-center justify-center shadow-sm">
                      #{shot.shotNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-100">
                      {shot.shotType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                      {shot.cameraMovement}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Durasi: {shot.durationSeconds}s
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-indigo-400" />
                    <span>{shot.cameraRigDetails}</span>
                  </div>
                </div>

                {/* Shot Narrative & Technical Breakdown */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-studio-850/60 p-3 rounded-xl border border-studio-800">
                      <strong className="text-slate-300 block mb-1">Deskripsi Adegan Visual:</strong>
                      <p className="text-slate-300 leading-relaxed">{shot.sceneDescription}</p>
                    </div>

                    <div className="bg-studio-850/60 p-3 rounded-xl border border-studio-800">
                      <strong className="text-slate-300 block mb-1">Aksi & Bahasa Tubuh (Blocking):</strong>
                      <p className="text-slate-300 leading-relaxed">{shot.actionAndEmotion}</p>
                      {shot.charactersInShot && (
                        <p className="text-[11px] text-indigo-300 mt-2">
                          <strong>Karakter dalam Shot:</strong> {shot.charactersInShot}
                        </p>
                      )}
                    </div>
                  </div>

                  {shot.dialogueSnippet && (
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200 font-mono">
                      💬 {shot.dialogueSnippet}
                    </div>
                  )}

                  {shot.foleyAndSound && (
                    <div className="text-[11px] text-amber-300/80 flex items-center gap-1.5">
                      <Music className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>Foley / Efek Audio: {shot.foleyAndSound}</span>
                    </div>
                  )}

                  {/* PROMPT PROFESIONAL AHLI GRID */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Prompt Profesional Ahli (Siap Copy-Paste)</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                      <PromptCard
                        title="Midjourney v6.1 Master Cinematography"
                        type="image"
                        prompt={shot.midjourneyPrompt}
                        parameterNote="Optical Grade 8K"
                        tags={['ARRI Alexa', shot.shotType.replace(/\s+/g, ''), '35mm Anamorphic', 'Photorealistic']}
                      />

                      <PromptCard
                        title="Runway Gen-3 / Sora / Kling Video Prompt"
                        type="video"
                        prompt={shot.runwayVideoPrompt}
                        parameterNote="Fluid Motion 24fps"
                        tags={['RunwayGen3', shot.cameraMovement.replace(/\s+/g, ''), 'CinematicPhysics']}
                      />
                    </div>

                    {shot.fluxPrompt && (
                      <PromptCard
                        title="Flux.1 Pro Master Prompt"
                        type="image"
                        prompt={shot.fluxPrompt}
                        parameterNote="Skin Texture & Photorealism"
                        tags={['Flux1Pro', 'UltraDetail']}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL CAMERA LOG TABLE */}
      {activeTab === 'table' && (
        <div className="rounded-2xl border border-studio-700/80 bg-studio-900/90 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-studio-800 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              Tabel Shot List Teknis Sinematografi (Director's Camera Log)
            </h3>
            <span className="text-xs text-slate-400">Total {allShots.length} Shots Terjadwal</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-950 text-slate-400 font-mono uppercase text-[10px] border-b border-studio-800">
                <tr>
                  <th className="p-3">Shot #</th>
                  <th className="p-3">Scene / Segmen</th>
                  <th className="p-3">Shot Type</th>
                  <th className="p-3">Movement</th>
                  <th className="p-3">Durasi</th>
                  <th className="p-3">Kamera & Lensa</th>
                  <th className="p-3">Aksi Pokok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-800 text-slate-300">
                {allShots.map((sh) => (
                  <tr key={sh.shotNumber} className="hover:bg-studio-850/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-400">#{sh.shotNumber}</td>
                    <td className="p-3">Scene {sh.sceneNumber} ({sh.segmentName})</td>
                    <td className="p-3 font-semibold text-slate-100">{sh.shotType}</td>
                    <td className="p-3 text-cyan-300">{sh.cameraMovement}</td>
                    <td className="p-3 font-mono text-amber-300">{sh.durationSeconds}s</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{sh.cameraRigDetails}</td>
                    <td className="p-3 max-w-xs truncate">{sh.sceneDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHARACTERS */}
      {activeTab === 'characters' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Character Dossier & Wardrobe Visual Consistency Prompts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.characters.map((char, idx) => (
              <div key={idx} className="rounded-2xl border border-studio-700/80 bg-studio-900/90 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{char.name}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">{char.archetype}</span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-studio-800 border border-studio-700 text-xs font-mono font-bold text-slate-300 flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-300">
                  <p><strong>Ciri Fisik & Usia:</strong> {char.ageAndLook}</p>
                  <p><strong>Profil Psikologis & Motivasi:</strong> {char.psychologicalProfile}</p>
                  <p><strong>Karakter Suara:</strong> {char.voiceStyle}</p>
                </div>

                <div className="pt-2">
                  <PromptCard
                    title="Character Consistency Wardrobe Prompt"
                    type="image"
                    prompt={char.wardrobeVisualPrompt}
                    parameterNote="Visual Anchor"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCREENPLAY SCRIPT */}
      {activeTab === 'screenplay' && (
        <div className="rounded-2xl border border-studio-700/80 bg-studio-950 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-studio-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Format Naskah Skenario Standar Industri (Industry Screenplay)
              </h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(project.screenplaySnippet);
                alert('Naskah dialog berhasil disalin!');
              }}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-700"
            >
              Salin Naskah
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-studio-900/90 p-5 rounded-xl border border-studio-800/80 overflow-x-auto selection:bg-indigo-600">
            {project.screenplaySnippet}
          </pre>

          {project.directorNotes && (
            <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
              <strong className="text-amber-300 block mb-1">🎬 Catatan Sutradara (Director's Technical Note):</strong>
              <p>{project.directorNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIO & VO */}
      {activeTab === 'audio' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            Audio, Soundtrack (Suno/Udio) & Voiceover (ElevenLabs)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PromptCard
              title="Suno / Udio AI Soundtrack Score"
              type="audio"
              prompt={project.audioPromptSuno}
              tags={['Orchestral', 'HansZimmer', 'FilmScore', 'MinorKey']}
            />

            <PromptCard
              title="ElevenLabs Voiceover Profile Prompt"
              type="voice"
              prompt={project.voiceoverPromptElevenLabs}
              tags={['VoiceActing', 'Baritone', 'CinematicTrailer']}
            />
          </div>
        </div>
      )}
    </div>
  );
};
