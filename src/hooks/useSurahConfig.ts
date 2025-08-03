import { useQuery } from '@tanstack/react-query';

interface SurahConfig {
  id: number;
  name: string;
  nameArabic: string;
  collectionId: string;
  playlistUrl: string;
  feedUrl: string;
  description: string;
}

interface SurahsConfigData {
  surahs: SurahConfig[];
  lastUpdated: string;
  version: string;
}

export const useSurahConfig = () => {
  return useQuery({
    queryKey: ['surahConfig'],
    queryFn: async (): Promise<SurahsConfigData> => {
      const response = await fetch('/surahs-config.json');
      if (!response.ok) {
        throw new Error('Failed to fetch Surah configuration');
      }
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};