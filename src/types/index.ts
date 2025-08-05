export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  verses: number;
  type: "Makkan" | "Medinan";
  length: "Short" | "Medium" | "Long";
  juz: number;
  themes: string[];
  usage: string[];
  openingStyle: string;
  sajdah: boolean;
}

export interface Track {
  id: string;
  title: string;
  surahName: string;
  duration: string;
  date: string;
  verseRange: string;
  audioUrl?: string;
}

export interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isVisible: boolean;
}

export interface FilterState {
  searchTerm: string;
  selectedType: string;
  selectedLength: string;
  selectedThemes: string[];
  selectedUsage: string[];
  showSajdah: boolean;
}

export interface BackgroundState {
  selectedImage: string;
  opacity: number;
  blur: number;
}