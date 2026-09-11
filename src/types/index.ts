export type AIProvider = 'built-in' | 'gemini';

export type FilmFormat = 
  | 'series_kdrama'      // Web Series / K-Drama Episodic
  | 'feature_film'       // Film Layar Lebar Bioskop (Cinema)
  | 'short_film'         // Film Pendek Festival (Cannes / Sundance)
  | 'vertical_drama'     // Drama Vertikal (TikTok / ReelShort / SnackVideo)
  | 'commercial_tvc';    // Iklan Komersial Sinematik (TVC / Fashion)

export interface ProductionConfig {
  format: FilmFormat;
  episodeCount: number;
  currentEpisode: number;
  targetDurationMinutes: number; // e.g. 15 mins for short, 2 mins for vertical, 45 mins for series
  scenesCount: number;
  shotsPerScene: number;
  cameraRig: 'ARRI Alexa Mini LF' | 'RED V-Raptor 8K' | 'Sony FX9' | 'IMAX 70mm Film' | '35mm Film Grain (Kodak Vision3)';
  colorGradingStyle: 'Teal & Orange Hollywood' | 'Dark Bleach Bypass Noir' | 'Pastel Melancholic K-Drama' | 'Vibrant Cyberpunk Neon' | 'Vintage 70s Warm Film';
  aspectRatio: '16:9' | '9:16' | '2.39:1' | '1:1';
}

export interface StoryboardShot {
  shotNumber: number;
  sceneNumber: number;
  segmentName: string; // e.g. 'Segment 1: Inciting Incident', 'Segment 2: Climax Standoff'
  shotType: 'Extreme Wide Shot' | 'Wide Shot' | 'Full Shot' | 'Medium Shot' | 'Medium Close-Up' | 'Close-Up' | 'Extreme Close-Up' | 'Low Angle' | 'High Angle' | 'Dutch Angle' | 'Over-the-Shoulder' | 'Point of View';
  cameraMovement: 'Static' | 'Pan' | 'Tilt' | 'Slow Push-in' | 'Dolly Zoom' | 'Tracking Shot' | 'Handheld Raw' | 'Drone Aerial Orbit';
  cameraRigDetails: string; // e.g. 'Cooke Anamorphic 40mm T2.3, f/2.0, 180° shutter angle'
  lightingAndGrade: string; // e.g. 'Chiaroscuro 4:1 key-to-fill, practical tungsten lantern, Kodak 5219 LUT'
  durationSeconds: number; // e.g. 4.5s
  sceneDescription: string;
  charactersInShot: string;
  actionAndEmotion: string;
  dialogueSnippet?: string;
  foleyAndSound?: string;
  // Professional Prompts
  midjourneyPrompt: string;
  runwayVideoPrompt: string;
  fluxPrompt: string;
  negativePrompt?: string;
}

export interface SceneBreakdown {
  sceneNumber: number;
  heading: string; // e.g. 'INT. RESTORAN BINTANG LIMA - MALAM'
  segmentType: 'Exposition' | 'Rising Action' | 'Climax / Turning Point' | 'Falling Action' | 'Cliffhanger';
  estimatedDurationSeconds: number;
  location: string;
  timeOfDay: string;
  sceneSummary: string;
  shots: StoryboardShot[];
}

export interface EpisodeBreakdown {
  episodeNumber: number;
  title: string;
  logline: string;
  totalDurationMinutes: number;
  scenes: SceneBreakdown[];
}

export interface FilmCharacter {
  name: string;
  archetype: string;
  ageAndLook: string;
  wardrobeVisualPrompt: string;
  psychologicalProfile: string;
  voiceStyle: string;
}

export interface DramaProject {
  id: string;
  title: string;
  genre: string;
  format: FilmFormat;
  productionConfig: ProductionConfig;
  logline: string;
  synopsis: string;
  totalDurationFormatted: string; // e.g. '1 Episode • 3 Scene • 12 Shots • Total 3m 45s'
  episodes: EpisodeBreakdown[];
  characters: FilmCharacter[];
  screenplaySnippet: string;
  audioPromptSuno: string;
  voiceoverPromptElevenLabs: string;
  directorNotes: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  projectData?: DramaProject;
}

export interface PresetTemplate {
  id: string;
  title: string;
  genre: string;
  badge: string;
  format: FilmFormat;
  defaultDuration: number;
  description: string;
  samplePrompt: string;
  iconName: string;
}

export interface AppSettings {
  provider: AIProvider;
  geminiApiKey: string;
  model: string;
  temperature: number;
  aspectRatio: '16:9' | '9:16' | '2.39:1' | '1:1';
  productionConfig: ProductionConfig;
}
