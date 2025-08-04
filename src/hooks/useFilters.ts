import { useState, useMemo } from 'react';

interface Surah {
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

export const useFilters = (surahs: Surah[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedUsage, setSelectedUsage] = useState("all");
  const [showSajdah, setShowSajdah] = useState("all");

  const filteredSurahs = useMemo(() => {
    return surahs.filter(surah => {
      const matchesSearch = surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           surah.nameArabic.includes(searchTerm) ||
                           surah.id.toString().includes(searchTerm);
      
      const matchesType = selectedType === "all" || surah.type === selectedType;
      const matchesLength = selectedLength === "all" || surah.length === selectedLength;
      const matchesThemes = selectedThemes.length === 0 || 
                           selectedThemes.some(theme => surah.themes.includes(theme));
      const matchesUsage = selectedUsage === "all" || surah.usage.includes(selectedUsage);
      const matchesSajdah = showSajdah === "all" || 
                           (showSajdah === "yes" && surah.sajdah) ||
                           (showSajdah === "no" && !surah.sajdah);

      return matchesSearch && matchesType && matchesLength && 
             matchesThemes && matchesUsage && matchesSajdah;
    });
  }, [surahs, searchTerm, selectedType, selectedLength, selectedThemes, selectedUsage, showSajdah]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLength("all");
    setSelectedThemes([]);
    setSelectedUsage("all");
    setShowSajdah("all");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedLength,
    setSelectedLength,
    selectedThemes,
    setSelectedThemes,
    selectedUsage,
    setSelectedUsage,
    showSajdah,
    setShowSajdah,
    filteredSurahs,
    clearFilters,
  };
};