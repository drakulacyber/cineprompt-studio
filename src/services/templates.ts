import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'kdrama-melodrama',
    title: 'K-Drama Melodrama Series',
    genre: 'Romance / Drama Series',
    badge: 'Series 16 Eps',
    format: 'series_kdrama',
    defaultDuration: 45,
    description: 'Drama percintaan tragis penuh rahasia masa lalu, sinematografi rintik hujan di Seoul & cherry blossom.',
    samplePrompt: 'Dua mantan kekasih yang berpisah karena skandal keluarga chaebol bertemu kembali 7 tahun kemudian sebagai pengacara lawan di persidangan penting di Seoul.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'vertical-drama-action',
    title: 'Short Vertical Drama (TikTok/ReelShort)',
    genre: 'Action / Revenge Fast-Paced',
    badge: '9:16 Vertikal',
    format: 'vertical_drama',
    defaultDuration: 2,
    description: 'Drama vertikal super cepat (fast-hook, cliffhanger setiap 60-90 detik), optimal untuk TikTok, Reels, dan SnackVideo.',
    samplePrompt: 'Menantu yang dihina oleh keluarga konglomerat ternyata adalah pewaris takhta raja bisnis minyak dunia yang menyamar.',
    iconName: 'Smartphone'
  },
  {
    id: 'feature-film-noir',
    title: 'Layar Lebar Bioskop: Jakarta Noir',
    genre: 'Crime Thriller Feature Film',
    badge: 'Cinema 2.39:1',
    format: 'feature_film',
    defaultDuration: 110,
    description: 'Film layar lebar bioskop (CinemaScope 2.39:1), ketegangan mafia pelabuhan Tanjung Priok, detektif korup, hujan malam neon.',
    samplePrompt: 'Seorang mantan pembunuh bayaran mafia Jakarta yang kini menjadi montir bengkel tua terpaksa mengangkat senjata kembali saat putri tetangganya diculik kartel elit.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'festival-short-film',
    title: 'Film Pendek Festival (Cannes / A24)',
    genre: 'Arthouse Psychological Drama',
    badge: 'Festival Winner',
    format: 'short_film',
    defaultDuration: 15,
    description: 'Gaya film festival internasional, sinematografi 35mm claustrophobic, simbolisme mendalam, tensi lambat tapi menghantui.',
    samplePrompt: 'Seorang penjaga mercusuar di pulau terpencil Jawa Selatan mulai mendengar bisikan dari rekaman radio laut tua yang memprediksi kematiannya sendiri.',
    iconName: 'Sparkles'
  },
  {
    id: 'cyberpunk-scifi-epic',
    title: 'Cyberpunk Sci-Fi Mini-Series',
    genre: 'Sci-Fi / Cyberpunk',
    badge: 'Visual Heavy',
    format: 'series_kdrama',
    defaultDuration: 30,
    description: 'Dunia futuristik neon hologram, android, mobil terbang di antara gedung pencakar langit megacity dalam hujan asam.',
    samplePrompt: 'Di megacity Nusantara 2088, seorang peretas memori android menemukan fragmen kesadaran manusia asli milik presiden korporasi terbesar yang dinyatakan wafat.',
    iconName: 'Cpu'
  },
  {
    id: 'commercial-luxury-tvc',
    title: 'Cinematic Luxury TVC / Iklan 60s',
    genre: 'Commercial / Fashion Film',
    badge: 'TVC 60 Detik',
    format: 'commercial_tvc',
    defaultDuration: 1,
    description: 'Storyboarding iklan produk komersial kelas dunia, lighting high-fashion, slow motion 120fps, dan estetika luxury.',
    samplePrompt: 'Iklan komersial parfum mewah internasional 60 detik: adegan malam di balkon Venesia, gaun sutra hitam terbang pelan ditiup angin, botol kristal memantulkan cahaya kembang api.',
    iconName: 'Film'
  }
];
