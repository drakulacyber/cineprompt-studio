import { 
  DramaProject, 
  AppSettings, 
  FilmCharacter, 
  StoryboardShot, 
  SceneBreakdown, 
  EpisodeBreakdown, 
  ProductionConfig 
} from '../types';

export const SYSTEM_PROMPT_FILMMAKER_EXPERT = `Anda adalah "CinePrompt AI Director & Master Prompt Engineer", asisten sutradara dan produser eksekutif film berskala internasional.
Tugas Anda adalah membedah ide cerita pengguna menjadi rancangan produksi film & drama paling lengkap, sistematis, dan presisi dengan hierarki:
1. EPISODE BREAKDOWN (Nomor Episode, Judul Episode, Logline, Target Durasi Menit).
2. SCENE BREAKDOWN (Nomor Scene, Scene Heading standar industri e.g. INT/EXT. LOKASI - WAKTU, Segment Type: Exposition / Rising Action / Climax / Cliffhanger, Estimasi Durasi Detik).
3. SHOT LIST SINEMATOGRAFI (Shot Number, Shot Type, Camera Movement, Lensa & Kamera Rig e.g. ARRI Alexa Mini LF + Cooke Anamorphic 40mm T2.3, Lighting & Color Grade LUT, Durasi Detik per shot).
4. PROMPT PROFESIONAL AHLI:
   - Midjourney v6.1 Master Prompt (dengan parameter nyata: ARRI Alexa Mini LF, 35mm anamorphic, volumetric lighting, photorealistic 8k, aspect ratio --ar).
   - Runway Gen-3 Alpha / Sora Video Prompt (gerakan dinamis, fluid physics, camera direction).
   - Flux.1 Pro Prompt.
   - Negative Prompt.
5. DOSSIER KARAKTER (Arketipe, Wardrobe visual prompt yang konsisten, motivasi batin).
6. NASKAH SKENARIO STANDAR SCREENPLAY (Scene Heading, Action Lines, Dialog, Parenthetical).
7. AUDIO & SOUNDTRACK PROMPT (Suno/Udio & ElevenLabs voice tone).

Hasilkan selalu respon dalam struktur JSON yang valid dan detail tingkat tinggi.`;

export function generateLocalFilmProject(
  userQuery: string, 
  settings: AppSettings,
  customConfig?: Partial<ProductionConfig>
): DramaProject {
  const config: ProductionConfig = {
    ...settings.productionConfig,
    ...customConfig
  };

  const isHorror = /hantu|horor|pocong|kuntilanak|pesugihan|mistis|mencekam|teror|darah/i.test(userQuery);
  const isSciFi = /cyberpunk|robot|android|masa depan|scifi|sci-fi|teknologi|hologram|antariksa/i.test(userQuery);
  const isRomance = /cinta|romantis|kekasih|nikah|kdrama|k-drama|chaebol|patah hati|rindu/i.test(userQuery);
  const isAction = /mafia|pembunuh|polisi|detektif|senjata|balas dendam|kartel|tarung|action/i.test(userQuery);
  const isVertical = config.format === 'vertical_drama' || /vertikal|tiktok|reelshort|snackvideo/i.test(userQuery);
  const isCommercial = config.format === 'commercial_tvc' || /iklan|tvc|produk|komersial|brand|parfum|mobil/i.test(userQuery);

  let genre = 'Cinematic Drama';
  let title = 'Whispers of Ambition';
  let colorMood = 'Moody teal, muted amber, volumetric haze';
  let defaultRig = config.cameraRig || 'ARRI Alexa Mini LF';
  let defaultLUT = config.colorGradingStyle || 'Teal & Orange Hollywood';
  let ar = config.aspectRatio || (isVertical ? '9:16' : '16:9');

  if (isHorror) {
    genre = 'Folk Supernatural Horror';
    title = 'Kidung Malam Tanpa Bayang';
    colorMood = 'Sickly green tones, deep chiaroscuro shadows, flickering candlelight, heavy volumetric fog';
    defaultLUT = 'Dark Bleach Bypass Noir';
  } else if (isSciFi) {
    genre = 'Neo-Cyberpunk Sci-Fi Epic';
    title = 'Ghost Protocol: Neon 2088';
    colorMood = 'Neon cyan and magenta reflections on wet asphalt, anamorphic blue horizontal streaks';
    defaultLUT = 'Vibrant Cyberpunk Neon';
  } else if (isRomance) {
    genre = isVertical ? 'Vertical K-Drama: Takhta & Air Mata' : 'Intense Melodrama Romance';
    title = 'Hujan Terakhir di Menara Kaca';
    colorMood = 'Warm golden hour, soft lens diffusion, melancholic pastel blue, rainy bokeh';
    defaultLUT = 'Pastel Melancholic K-Drama';
  } else if (isAction) {
    genre = 'Urban Underworld Crime Thriller';
    title = 'Darah Pesisir Tanjung Priok';
    colorMood = 'High contrast industrial sodium vapor, harsh shadows, dirty rain puddles';
    defaultLUT = 'Dark Bleach Bypass Noir';
  } else if (isCommercial) {
    genre = 'Luxury High-Fashion Commercial (60s TVC)';
    title = 'Eternity: The Golden Scent';
    colorMood = 'Pure high-fashion lighting, crisp backlight rim, golden liquid highlights';
    defaultLUT = 'Vintage 70s Warm Film';
  }

  // Setup Characters
  const characters: FilmCharacter[] = [
    {
      name: isCommercial ? 'The Icon' : (isRomance ? 'Han Ji-Soo / Adrian' : 'Arga Pratama'),
      archetype: 'Protagonis Sentral',
      ageAndLook: '32 tahun, tatapan tajam berwibawa, fitur wajah tegas berkarakter, rahang kokoh.',
      wardrobeVisualPrompt: 'Long tailored charcoal coat, crisp dark collar shirt slightly open, subtle rain-dampened texture, high cinematic photorealism, ARRI Alexa style',
      psychologicalProfile: 'Digerakkan oleh rasa bersalah dan ambisi melindungi orang terkasih, dingin di luar namun penuh empati di dalam.',
      voiceStyle: 'Deep, calm baritone with measured pacing and poignant undertones.'
    },
    {
      name: isCommercial ? 'The Rival Visionary' : (isRomance ? 'Elena / Clara' : 'Bara Wicaksana'),
      archetype: 'Antagonis Karismatik',
      ageAndLook: '45 tahun, postur elegan dingin, rambut tersisir rapi ke belakang, ekspresi manipulatif yang tenang.',
      wardrobeVisualPrompt: 'Double-breasted navy bespoke wool suit, gold signet ring on right hand, immaculate posture, silhouette against backlit window',
      psychologicalProfile: 'Pragmatis tanpa belas kasih, percaya bahwa tujuan akhir membenarkan segala pengorbanan.',
      voiceStyle: 'Soft-spoken, articulate, chillingly steady with venomous precision.'
    }
  ];

  // Dynamic calculation of scenes and duration
  const sceneCount = Math.max(config.scenesCount || 3, 2);
  const shotsPerScene = Math.max(config.shotsPerScene || 4, 3);
  const totalEpisodeCount = config.episodeCount || 1;

  // Generate Scenes and Shots
  const scenes: SceneBreakdown[] = [];
  let globalShotCounter = 1;

  const segmentTypes: Array<'Exposition' | 'Rising Action' | 'Climax / Turning Point' | 'Falling Action' | 'Cliffhanger'> = [
    'Exposition',
    'Rising Action',
    'Climax / Turning Point',
    'Falling Action',
    'Cliffhanger'
  ];

  const shotTypesPool: Array<StoryboardShot['shotType']> = [
    'Extreme Wide Shot',
    'Wide Shot',
    'Medium Shot',
    'Medium Close-Up',
    'Close-Up',
    'Over-the-Shoulder',
    'Dutch Angle',
    'Extreme Close-Up'
  ];

  const cameraMovementsPool: Array<StoryboardShot['cameraMovement']> = [
    'Drone Aerial Orbit',
    'Slow Push-in',
    'Pan',
    'Tracking Shot',
    'Handheld Raw',
    'Dolly Zoom',
    'Static'
  ];

  for (let s = 1; s <= sceneCount; s++) {
    const segmentType = segmentTypes[(s - 1) % segmentTypes.length];
    let heading = `INT. RUANG PERTEMUAN KONGSIAN - MALAM`;
    let location = 'Markas Rahasia / Penthouse';
    let timeOfDay = 'MALAM';

    if (s === 1) {
      heading = isVertical ? `INT. RESTORAN MEWAH - SIANG` : `EXT. KOTA METROPOLIS PESISIR - MALAM (GERIMIS)`;
      location = 'Pesisir Dermaga / Restoran Megah';
      timeOfDay = 'MALAM (HUJAN)';
    } else if (s === 2) {
      heading = `INT. KANTOR REDAKSI / RUANG INTEROGASI - DINI HARI`;
      location = 'Ruang Redaksi Kaca Temaram';
      timeOfDay = 'DINI HARI';
    } else {
      heading = `EXT. ROOFTOP MENARA SENTRAL - SUBUH MENJELANG PAGI`;
      location = 'Helipad Rooftop';
      timeOfDay = 'SUBUH (TWILIGHT)';
    }

    const sceneShots: StoryboardShot[] = [];
    let sceneTotalSeconds = 0;

    for (let sh = 1; sh <= shotsPerScene; sh++) {
      const shotType = shotTypesPool[(globalShotCounter - 1) % shotTypesPool.length];
      const cameraMovement = cameraMovementsPool[(globalShotCounter - 1) % cameraMovementsPool.length];
      const durationSeconds = isVertical ? (sh === 1 ? 3 : 4.5) : (sh % 2 === 0 ? 5 : 7.5);
      sceneTotalSeconds += durationSeconds;

      let sceneDesc = `Kamera mengunci dinamika ketegangan antara tokoh utama dan lawan bicara saat kebenaran mulai terkuak.`;
      let actionEmotion = `Tatapan mata terkunci, gestur tubuh waspada menahan luapan emosi yang memuncak.`;
      let dialogueSnippet = `ARGA: "Kau pikir kekuasaan bisa menghapus jejak darah di tanganmu?"`;

      if (globalShotCounter === 1) {
        sceneDesc = `Establishing shot megah memperlihatkan atmosfer kota yang dingin dan sepi di bawah guyuran hujan.`;
        actionEmotion = `Membangun mood kesendirian karakter utama di hadapan skala konflik yang masif.`;
        dialogueSnippet = undefined;
      } else if (globalShotCounter === 2) {
        sceneDesc = `Kamera mendekat secara dramatis ke mata sang protagonis yang memegang dokumen rahasia.`;
        actionEmotion = `Napas tertahan, rahang mengetat saat membaca petunjuk konspirasi.`;
        dialogueSnippet = `ARGA: "Jadi selama ini... semuanya telah diatur sejak awal."`;
      } else if (globalShotCounter === 3) {
        sceneDesc = `Konfrontasi intens over-the-shoulder di balik meja kaca dengan pantulan lampu kota.`;
        actionEmotion = `Antagonis tersenyum dingin dengan ketenangan absolut yang mematikan.`;
        dialogueSnippet = `BARA: "Kebenaran adalah kemewahan yang tidak mampu kau beli, kawan."`;
      } else if (globalShotCounter === 4) {
        sceneDesc = `Titik balik adegan dengan sudut kamera miring (Dutch Angle) menandakan hilangnya stabilitas moral.`;
        actionEmotion = `Dokumen rahasia terlempar, kontak fisik atau gerakan cepat memicu kepanikan.`;
        dialogueSnippet = `ARGA: "Permainan berakhir malam ini!"`;
      } else {
        sceneDesc = `Karakter melangkah menuju bayangan dengan tekad bulat, siluet diterangi lampu sorot belakang.`;
        actionEmotion = `Klimaks visual emosional, perpisahan atau penentuan nasib tak terelakkan.`;
        dialogueSnippet = undefined;
      }

      // Professional Master Prompts
      const midjourneyPrompt = `Cinematic ${shotType.toLowerCase()} shot, ${userQuery}, ${sceneDesc}, captured on ${defaultRig}, 35mm Cooke Anamorphic lens T2.3, ${colorMood}, color graded in ${defaultLUT}, volumetric lighting, photorealistic 8k, award-winning cinematography, ultra-detailed textures, masterclass film still --ar ${ar} --style raw --v 6.1`;
      
      const runwayVideoPrompt = `Cinematic ${cameraMovement.toLowerCase()} camera shot, ${sceneDesc}, slow motion 24fps, dramatic lighting shift from key light to shadow, professional cinematography, photorealistic cinema render, seamless motion dynamics`;

      const fluxPrompt = `Hyper-realistic cinematic photograph, ${shotType}, ${userQuery}, natural skin pore details, ARRI Alexa LF cinema camera, anamorphic lens flare, masterwork composition, 8k resolution`;

      const negativePrompt = `low quality, cartoon, 3d render, blurry, distorted anatomy, deformed fingers, oversaturated, amateur photography, blown-out highlights`;

      sceneShots.push({
        shotNumber: globalShotCounter,
        sceneNumber: s,
        segmentName: `${segmentType} - Part ${sh}`,
        shotType,
        cameraMovement,
        cameraRigDetails: `${defaultRig} + Cooke Anamorphic 40mm T2.3, 180° shutter`,
        lightingAndGrade: `${colorMood}, ${defaultLUT}`,
        durationSeconds,
        sceneDescription: sceneDesc,
        charactersInShot: 'Arga Pratama & Bara Wicaksana',
        actionAndEmotion: actionEmotion,
        dialogueSnippet,
        foleyAndSound: sh % 2 === 0 ? 'Detak jam kuno pelan, desah napas dingin terisolasi' : 'Gemuruh guntur sayup-sayup, deru hujan menghantam kaca jendela',
        midjourneyPrompt,
        runwayVideoPrompt,
        fluxPrompt,
        negativePrompt
      });

      globalShotCounter++;
    }

    scenes.push({
      sceneNumber: s,
      heading,
      segmentType,
      estimatedDurationSeconds: sceneTotalSeconds,
      location,
      timeOfDay,
      sceneSummary: `Adegan kunci nomor ${s} dengan fokus pada ${segmentType.toLowerCase()} dan eskalasi ketegangan psikologis.`,
      shots: sceneShots
    });
  }

  // Calculate Total Durations
  const totalSecondsAllScenes = scenes.reduce((acc, sc) => acc + sc.estimatedDurationSeconds, 0);
  const totalMinutesFormatted = `${Math.floor(totalSecondsAllScenes / 60)}m ${Math.round(totalSecondsAllScenes % 60)}s`;

  const episode1: EpisodeBreakdown = {
    episodeNumber: 1,
    title: `Episode 1: Titik Balik Takdir`,
    logline: `Insiden pemicu mengguncang kestabilan hidup sang tokoh dan memaksanya melangkah ke medan laga.`,
    totalDurationMinutes: Number((totalSecondsAllScenes / 60).toFixed(1)),
    scenes
  };

  const screenplaySnippet = `EXT. DERMAGA TELUK UTARA - MALAM (HUJAN DERAS)

Rintik hujan menghantam beton dermaga yang dingin. Lampu merkuri kuning memantul di genangan air hitam pekat.

ARGA (32) berdiri mematung di bawah payung hitam kusam. Kerah mantel abu-abunya dinaikkan menghalau dingin. Di tangannya, sebuah dokumen rahasia tersegel lilin merah.

Dari arah belakang kontainer baja, suara derit sepatu kulit di aspal basah memecah sunyi.

BARA (45) melangkah keluar dari kegelapan. Mantel kasmir mahalnya kontras dengan kumuhnya pelabuhan.

                      BARA
             Kukira kau sudah cukup pintar 
             untuk tidak kembali ke kota ini, Arga.

Arga tidak menoleh. Rahangnya mengeras.

                      ARGA
             Kota ini belum membayar utang 
             darah pada mendiang adikku.

Bara terkekeh dingin—nada suara pria yang merasa tak tersentuh hukum.

                      BARA
             Utang itu sudah kedaluwarsa sepuluh tahun 
             lalu. Kau hanya sedang memburu hantu.

Kilat menyambar di horizon langit teluk, menerangi wajah keduanya dalam kilatan putih sepersekian detik.`;

  return {
    id: 'proj_' + Date.now(),
    title: `${title}`,
    genre,
    format: config.format,
    productionConfig: config,
    logline: `Di tengah intrik konspirasi yang mematikan, seorang mantan agen harus mempertaruhkan nyawa dan kode etiknya saat bayang-bayang masa lalu menuntut pembalasan.`,
    synopsis: `Mengangkat premis mendalam: "${userQuery}". Narasi dikembangkan dengan ketegangan berlapis, memadukan sinematografi kelas festival dengan kecepatan alur dramatis yang memukau. Setiap shot dirancang dengan presisi optik kamera nyata untuk mempermudah visualisasi storyboard ke generator AI.`,
    totalDurationFormatted: `${totalEpisodeCount} Episode • ${sceneCount} Scene • ${globalShotCounter - 1} Shots • Estimasi Durasi: ${totalMinutesFormatted}`,
    episodes: [episode1],
    characters,
    screenplaySnippet,
    audioPromptSuno: `Cinematic neo-classical orchestral score, melancholic cello solo, moody hybrid synth pulses, Hans Zimmer and Ludwig Göransson style, slow tempo build-up, emotional crescendo, dramatic minor key, 85 BPM.`,
    voiceoverPromptElevenLabs: `Voice profile: Gritty, weathered 35yo male baritone, cinematic movie trailer narrator voice, deep resonant delivery, slow dramatic cadence with subtle rasp and profound gravity.`,
    directorNotes: `Gunakan rasio kontras pencahayaan 4:1 (chiaroscuro). Pertahankan focal length lensa 35mm-50mm agar penonton merasakan kedekatan emosional sekaligus klaustrofobia suasana. Pada shot dialog penting, berikan jeda hening (beat) 2 detik sebelum replik diucapkan.`,
    createdAt: Date.now()
  };
}

export async function generateGeminiFilmProject(
  userQuery: string, 
  settings: AppSettings,
  customConfig?: Partial<ProductionConfig>
): Promise<DramaProject> {
  if (!settings.geminiApiKey) {
    throw new Error("Gemini API Key belum dimasukkan di menu Settings.");
  }

  const config: ProductionConfig = {
    ...settings.productionConfig,
    ...customConfig
  };

  const model = settings.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiApiKey}`;

  const promptText = `${SYSTEM_PROMPT_FILMMAKER_EXPERT}

Konfigurasi Produksi Sutradara:
- Format Target: ${config.format}
- Jumlah Episode: ${config.episodeCount}
- Jumlah Scene yang Dibedah: ${config.scenesCount}
- Target Shots per Scene: ${config.shotsPerScene}
- Kamera Rig Pilihan: ${config.cameraRig}
- Gaya Color Grading: ${config.colorGradingStyle}
- Rasio Aspek: ${config.aspectRatio}

Ide Cerita Pengguna: "${userQuery}"

PENTING: Hasilkan respon HANYA berupa JSON valid RFC 8259 tanpa markdown code block dengan skema:
{
  "title": "string judul film/drama",
  "genre": "string genre film",
  "logline": "string 1-2 kalimat logline",
  "synopsis": "string 2 paragraf sinopsis",
  "characters": [
    {
      "name": "nama karakter",
      "archetype": "peran",
      "ageAndLook": "usia dan rupa fisik",
      "wardrobeVisualPrompt": "prompt wardrobe untuk konsistensi visual",
      "psychologicalProfile": "profil psikologis",
      "voiceStyle": "tone suara"
    }
  ],
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "string judul episode",
      "logline": "string logline episode",
      "totalDurationMinutes": 15,
      "scenes": [
        {
          "sceneNumber": 1,
          "heading": "INT/EXT. LOKASI - WAKTU",
          "segmentType": "Exposition / Rising Action / Climax / Cliffhanger",
          "estimatedDurationSeconds": 45,
          "location": "lokasi",
          "timeOfDay": "SIANG/MALAM",
          "sceneSummary": "ringkasan adegan",
          "shots": [
            {
              "shotNumber": 1,
              "sceneNumber": 1,
              "segmentName": "string nama segmen",
              "shotType": "Extreme Wide Shot / Close-Up dll",
              "cameraMovement": "Static / Pan / Slow Push-in / Dolly Zoom dll",
              "cameraRigDetails": "Lensa & Shutter speed",
              "lightingAndGrade": "Pencahayaan & LUT",
              "durationSeconds": 5,
              "sceneDescription": "deskripsi visual detail",
              "charactersInShot": "siapa di dalam frame",
              "actionAndEmotion": "aksi dan emosi",
              "dialogueSnippet": "dialog singkat opsional",
              "foleyAndSound": "efek suara audio",
              "midjourneyPrompt": "Master prompt Midjourney v6.1 bahasa Inggris lengkap dengan --ar ${config.aspectRatio} --style raw --v 6.1",
              "runwayVideoPrompt": "Prompt video Runway Gen-3 / Sora bahasa Inggris",
              "fluxPrompt": "Prompt Flux.1 Pro bahasa Inggris",
              "negativePrompt": "Prompt negatif"
            }
          ]
        }
      ]
    }
  ],
  "screenplaySnippet": "string naskah skenario standar industri",
  "audioPromptSuno": "string prompt musik Suno",
  "voiceoverPromptElevenLabs": "string profil suara ElevenLabs",
  "directorNotes": "string catatan sutradara"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: settings.temperature || 0.7,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorBody}`);
  }

  const jsonResult = await response.json();
  const rawText = jsonResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  const cleaned = rawText.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(cleaned);

  const totalShots = parsed.episodes?.[0]?.scenes?.reduce((a: number, s: any) => a + (s.shots?.length || 0), 0) || 6;
  const totalSeconds = parsed.episodes?.[0]?.scenes?.reduce((a: number, s: any) => a + (s.estimatedDurationSeconds || 30), 0) || 120;
  const formattedDur = `${parsed.episodes?.length || 1} Episode • ${parsed.episodes?.[0]?.scenes?.length || 3} Scene • ${totalShots} Shots • Durasi: ${Math.floor(totalSeconds/60)}m ${totalSeconds%60}s`;

  return {
    ...parsed,
    id: 'gemini_' + Date.now(),
    format: config.format,
    productionConfig: config,
    totalDurationFormatted: formattedDur,
    createdAt: Date.now()
  };
}
