export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  verses: number;
  type: string;
  length: string;
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

export interface BackgroundImage {
  id: number;
  url: string;
  name: string;
  category: string;
}

export interface RSSItem {
  title: string;
  pubDate: string;
  enclosure?: {
    url: string;
    type: string;
  };
  description?: string;
  guid?: string;
  link?: string;
}

export interface RSSFeed {
  items: RSSItem[];
}