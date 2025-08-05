import React, { useState, useEffect } from 'react';
import { Settings, Image as ImageIcon, Filter, Search, X, BookOpen, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';

// Import our modular components and hooks
import { SurahCard } from '@/components/SurahCard';
import { QuranPlayerCard } from '@/components/QuranPlayerCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFilters } from '@/hooks/useFilters';
import { useCounter } from '@/hooks/useCounter';
import { useRSSFeed } from '@/hooks/useRSSFeed';

// Import data and types
import { surahs } from '@/data/surahs';
import { Track, BackgroundState } from '@/types';

const backgroundImages = [
  { url: '/lovable-uploads/007566fa-5c53-4160-8d81-59971d899649.png', name: 'Mosque 1' },
  { url: '/lovable-uploads/044670b3-5f8e-4be0-a4a4-dba6f69dbdc6.png', name: 'Mosque 2' },
  { url: '/lovable-uploads/3a5ddd31-2ae0-4452-90cd-ac556aad2bad.png', name: 'Islamic Art 1' },
  { url: '/lovable-uploads/45dc7a85-45be-402f-b230-9cf0edae2e9d.png', name: 'Islamic Art 2' },
  { url: '/lovable-uploads/6aff7365-23e1-4926-ad1b-c21e2ecbd69d.png', name: 'Calligraphy 1' },
  { url: '/lovable-uploads/7c4f4c34-d840-49ba-8b37-be7770f72a79.png', name: 'Calligraphy 2' },
  { url: '/lovable-uploads/7c6c8e8e-cd8f-4ec8-ad1b-7fb29338ec2a.png', name: 'Architecture' },
  { url: '/lovable-uploads/cef81c6f-a31f-4227-93ac-8a9b75817ad2.png', name: 'Pattern 1' },
  { url: '/lovable-uploads/de544066-404e-4f0a-b317-094a97053dd8.png', name: 'Pattern 2' }
];

const mockTracks: Track[] = [
  { id: '1', title: 'Surah Al-Fatihah - Complete Recitation', surahName: 'Al-Fatihah', duration: '2:30', date: '15 Dec 24', verseRange: '1-7', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
  { id: '2', title: 'Surah Al-Baqarah - Verse 255 (Ayat al-Kursi)', surahName: 'Al-Baqarah', duration: '3:45', date: '14 Dec 24', verseRange: '255', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
  { id: '3', title: 'Surah Al-Mulk - Complete Recitation', surahName: 'Al-Mulk', duration: '8:20', date: '13 Dec 24', verseRange: '1-30', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
  { id: '4', title: 'Surah Yasin - Complete Recitation', surahName: 'Ya-Sin', duration: '15:45', date: '12 Dec 24', verseRange: '1-83', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
  { id: '5', title: 'Surah Al-Kahf - Friday Special', surahName: 'Al-Kahf', duration: '25:30', date: '11 Dec 24', verseRange: '1-110', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
];

const Index = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('recent');
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Background state
  const [background, setBackground] = useState<BackgroundState>({
    selectedImage: backgroundImages[0].url,
    opacity: 30,
    blur: 2
  });

  // Initialize hooks
  const audioPlayer = useAudioPlayer();
  const { filters, filteredSurahs, updateFilter, clearFilters } = useFilters(surahs);
  const surahCounter = useCounter(114, 2000);
  const audioCounter = useCounter(450, 2500);
  const hoursCounter = useCounter(85, 3000);

  // RSS Feed
  const { data: recentTracks = [], isLoading: isLoadingRSS } = useRSSFeed(
    'https://podcasts.subsplash.com/9e8be1db-ab96-41c0-84a2-c29b71cdb27d/podcast.rss'
  );

  // Event handlers
  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
        toast({ title: "Removed from favorites" });
      } else {
        newFavorites.add(trackId);
        toast({ title: "Added to favorites" });
      }
      return newFavorites;
    });
  };

  const handleSurahClick = (id: number) => {
    setExpandedSurah(expandedSurah === id ? null : id);
  };

  const handleShare = (surah: any) => {
    if (navigator.share) {
      navigator.share({
        title: `Surah ${surah.name}`,
        text: `Read and listen to Surah ${surah.name} (${surah.nameArabic})`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Surah ${surah.name} - ${window.location.href}`);
      toast({ title: "Link copied to clipboard" });
    }
  };

  const handleDownload = (surah: any) => {
    toast({ title: `Downloading Surah ${surah.name}` });
  };

  // Get content for different tabs
  const getTabContent = () => {
    switch (activeTab) {
      case 'recent':
        return isLoadingRSS ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading recent episodes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTracks.slice(0, 10).map((track) => (
              <QuranPlayerCard
                key={track.id}
                track={track}
                onPlay={() => audioPlayer.playTrack(track)}
                onToggleFavorite={() => toggleFavorite(track.id)}
                isFavorited={favorites.has(track.id)}
                isCompleted={completed.has(track.id)}
              />
            ))}
          </div>
        );
      
      case 'surahs':
        return (
          <div className="space-y-4">
            {filteredSurahs.map((surah) => (
              <SurahCard
                key={surah.id}
                surah={surah}
                tracks={mockTracks}
                expandedSurah={expandedSurah}
                favorites={favorites}
                completed={completed}
                onToggleExpand={handleSurahClick}
                onToggleFavorite={toggleFavorite}
                onShare={handleShare}
                onDownload={handleDownload}
                onPlayTrack={audioPlayer.playTrack}
              />
            ))}
          </div>
        );
      
      case 'liked':
        const favoriteTracksData = [...mockTracks, ...recentTracks].filter(track => favorites.has(track.id));
        return favoriteTracksData.length > 0 ? (
          <div className="space-y-4">
            {favoriteTracksData.map((track) => (
              <QuranPlayerCard
                key={track.id}
                track={track}
                onPlay={() => audioPlayer.playTrack(track)}
                onToggleFavorite={() => toggleFavorite(track.id)}
                isFavorited={true}
                isCompleted={completed.has(track.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No favorite tracks yet.</p>
          </div>
        );
      
      case 'done':
        const completedTracksData = [...mockTracks, ...recentTracks].filter(track => completed.has(track.id));
        return completedTracksData.length > 0 ? (
          <div className="space-y-4">
            {completedTracksData.map((track) => (
              <QuranPlayerCard
                key={track.id}
                track={track}
                onPlay={() => audioPlayer.playTrack(track)}
                onToggleFavorite={() => toggleFavorite(track.id)}
                isFavorited={favorites.has(track.id)}
                isCompleted={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No completed tracks yet.</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${background.selectedImage})`,
          opacity: background.opacity / 100,
          filter: `blur(${background.blur}px)`
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quran Tafseer</h1>
              <p className="text-sm text-muted-foreground">Explore, Listen, Learn</p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Customize Background</DialogTitle>
                <DialogDescription>
                  Choose a background image and adjust its appearance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Background Image</label>
                  <div className="grid grid-cols-3 gap-3">
                    {backgroundImages.map((img) => (
                      <div
                        key={img.url}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          background.selectedImage === img.url ? 'border-primary' : 'border-border'
                        }`}
                        onClick={() => setBackground(prev => ({ ...prev, selectedImage: img.url }))}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Opacity: {background.opacity}%
                  </label>
                  <Slider
                    value={[background.opacity]}
                    onValueChange={(value) => setBackground(prev => ({ ...prev, opacity: value[0] }))}
                    max={100}
                    step={5}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Blur: {background.blur}px
                  </label>
                  <Slider
                    value={[background.blur]}
                    onValueChange={(value) => setBackground(prev => ({ ...prev, blur: value[0] }))}
                    max={10}
                    step={0.5}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Welcome Section */}
        <div className="px-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to Quran Tafseer
              </h2>
              <p className="text-muted-foreground">
                Explore the beautiful recitations and meanings of the Quran. Listen to recent episodes, browse Surahs, and track your learning progress.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        {activeTab === 'surahs' && (
          <div className="px-6 mb-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Filters</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                    {(filters.searchTerm || filters.selectedType || filters.selectedLength || 
                      filters.selectedThemes.length > 0 || filters.selectedUsage.length > 0 || 
                      filters.showSajdah) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search Surahs..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground"
                        value={filters.searchTerm}
                        onChange={(e) => updateFilter('searchTerm', e.target.value)}
                      />
                    </div>

                    {/* Type Filter */}
                    <Select value={filters.selectedType} onValueChange={(value) => updateFilter('selectedType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="Makkan">Makkan</SelectItem>
                        <SelectItem value="Medinan">Medinan</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Length Filter */}
                    <Select value={filters.selectedLength} onValueChange={(value) => updateFilter('selectedLength', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Lengths</SelectItem>
                        <SelectItem value="Short">Short</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing {filteredSurahs.length} of {surahs.length} Surahs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="surahs">Surahs</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {getTabContent()}
            </TabsContent>

            <TabsContent value="surahs" className="space-y-4">
              {getTabContent()}
            </TabsContent>

            <TabsContent value="liked" className="space-y-4">
              {getTabContent()}
            </TabsContent>

            <TabsContent value="done" className="space-y-4">
              {getTabContent()}
            </TabsContent>
          </Tabs>
        </div>

        {/* Statistics Section */}
        <div className="px-6 mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={surahCounter.elementRef}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{surahCounter.count}</div>
                <div className="text-sm text-muted-foreground">Surahs</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-6">
                <Headphones className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{audioCounter.count}+</div>
                <div className="text-sm text-muted-foreground">Audio Tracks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{hoursCounter.count}+</div>
                <div className="text-sm text-muted-foreground">Hours of Content</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 px-6 pb-24">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Continue Your Journey</h3>
              <p className="text-muted-foreground mb-4">
                Explore the depth and beauty of the Quran through guided recitations and insightful commentary.
              </p>
              <div className="text-xs text-muted-foreground">
                © 2024 Quran Tafseer. Built with love for the Ummah.
              </div>
            </CardContent>
          </Card>
        </footer>
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={audioPlayer.currentTrack}
        isPlaying={audioPlayer.isPlaying}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        isVisible={audioPlayer.isVisible}
        onTogglePlayPause={audioPlayer.togglePlayPause}
        onSeekTo={audioPlayer.seekTo}
        onVolumeChange={audioPlayer.setVolumeLevel}
        onClose={() => audioPlayer.setIsVisible(false)}
        formatTime={audioPlayer.formatTime}
      />
    </div>
  );
};

export default Index;