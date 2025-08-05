import { useState, useMemo } from 'react';
import { Surah, FilterState } from '@/types';

export const useFilters = (surahs: Surah[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedType: '',
    selectedLength: '',
    selectedThemes: [],
    selectedUsage: [],
    showSajdah: false
  });

  const filteredSurahs = useMemo(() => {
    return surahs.filter(surah => {
      // Search filter
      if (filters.searchTerm && !surah.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !surah.nameArabic.includes(filters.searchTerm)) {
        return false;
      }

      // Type filter
      if (filters.selectedType && surah.type !== filters.selectedType) {
        return false;
      }

      // Length filter
      if (filters.selectedLength && surah.length !== filters.selectedLength) {
        return false;
      }

      // Themes filter
      if (filters.selectedThemes.length > 0 && 
          !filters.selectedThemes.some(theme => surah.themes.includes(theme))) {
        return false;
      }

      // Usage filter
      if (filters.selectedUsage.length > 0 && 
          !filters.selectedUsage.some(usage => surah.usage.includes(usage))) {
        return false;
      }

      // Sajdah filter
      if (filters.showSajdah && !surah.sajdah) {
        return false;
      }

      return true;
    });
  }, [surahs, filters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedType: '',
      selectedLength: '',
      selectedThemes: [],
      selectedUsage: [],
      showSajdah: false
    });
  };

  return {
    filters,
    filteredSurahs,
    updateFilter,
    clearFilters
  };
};