import React, { useState, useEffect, useRef } from 'react';
import { Settings, Filter, Search, X, Palette, ChevronDown, Headphones, Clock, BookOpen, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';
import { useRSSFeed } from '@/hooks/useRSSFeed';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useCounter } from '@/hooks/useCounter';
import { useFilters } from '@/hooks/useFilters';
import { QuranPlayerCard } from '@/components/QuranPlayerCard';
import { SurahCard } from '@/components/SurahCard';
import { surahs } from '@/data/surahs';
import { Track, Surah, BackgroundImage } from '@/types';

// Background images data
const backgroundImages: BackgroundImage[] = [
  { id: 1, url: "/lovable-uploads/cef81c6f-a31f-4227-93ac-8a9b75817ad2.png", name: "Masjid al-Haram", category: "Makkah" },
  { id: 2, url: "/lovable-uploads/3a5ddd31-2ae0-4452-90cd-ac556aad2bad.png", name: "Masjid an-Nabawi", category: "Madinah" },
  { id: 3, url: "/lovable-uploads/de544066-404e-4f0a-b317-094a97053dd8.png", name: "Al-Aqsa Mosque", category: "Jerusalem" },
  { id: 4, url: "/lovable-uploads/7c6c8e8e-cd8f-4ec8-ad1b-7fb29338ec2a.png", name: "Islamic Architecture", category: "Architecture" },
  { id: 5, url: "/lovable-uploads/6aff7365-23e1-4926-ad1b-c21e2ecbd69d.png", name: "Islamic Patterns", category: "Patterns" },
  { id: 6, url: "/lovable-uploads/7c4f4c34-d840-49ba-8b37-be7770f72a79.png", name: "Quran", category: "Quran" },
  { id: 7, url: "/lovable-uploads/044670b3-5f8e-4be0-a4a4-dba6f69dbdc6.png", name: "Arabic Calligraphy", category: "Calligraphy" },
  { id: 8, url: "/lovable-uploads/45dc7a85-45be-402f-b230-9cf0edae2e9d.png", name: "Night Sky", category: "Nature" },
  { id: 9, url: "/lovable-uploads/007566fa-5c53-4160-8d81-59971d899649.png", name: "Desert", category: "Nature" }
];

const Index = () => {
  // State management
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [activeTab, setActiveTab] = useState("surahs");
  const [currentBg, setCurrentBg] = useState(backgroundImages[0].url);
  const [bgOpacity, setBgOpacity] = useState([100]);
  const [bgSharpness, setBgSharpness] = useState([0]);
  const [showControls, setShowControls] = useState(false);
  
  // Block Settings
  const [blockDarkness, setBlockDarkness] = useState([30]);
  const [borderThickness, setBorderThickness] = useState([2]);
  const [borderOpacity, setBorderOpacity] = useState([50]);
  const [numberBgColor, setNumberBgColor] = useState("#4C4B48");
  
  // Counter view state
  const [counterView, setCounterView] = useState("blocks");
  const [mainView, setMainView] = useState("recent");
  const [expandedSurahs, setExpandedSurahs] = useState(new Set<number>());
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  
  // Favorites and completed tracking
  const [favoriteTrackIds, setFavoriteTrackIds] = useState(new Set<string>());
  const [completedTrackIds, setCompletedTrackIds] = useState(new Set<string>());
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const { data: rssData, isLoading: rssLoading, error: rssError } = useRSSFeed('https://feeds.captivate.fm/arkolia-tafseer/');
  const audioPlayer = useAudioPlayer();
  const filters = useFilters(surahs);
  
  // Counters
  const surahCounter = useCounter({ target: 114, duration: 2000, delay: 500 });
  const audioCounter = useCounter({ target: 500, duration: 2500, delay: 1000 });
  const hoursCounter = useCounter({ target: 250, duration: 3000, delay: 1500 });

  // Utility functions
  const toggleFavorite = (trackId: string) => {
    setFavoriteTrackIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
        toast({ title: "Removed from favorites" });
      } else {
        newSet.add(trackId);
        toast({ title: "Added to favorites" });
      }
      return newSet;
    });
  };

  const handleDownload = (track: Track) => {
    if (track.audioUrl) {
      const a = document.createElement('a');
      a.href = track.audioUrl;
      a.download = `${track.title}.mp3`;
      a.click();
      toast({ title: "Download started" });
    } else {
      toast({ title: "Audio file not available", variant: "destructive" });
    }
  };

  const handleShare = (track: Track) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title} - ${track.surahName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard" });
    }
  };

  const handlePlay = (track: Track) => {
    audioPlayer.play(track);
    setIsPlayerVisible(true);
  };

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setActiveTab("surah-detail");
  };

  const toggleSurahExpansion = (surahId: number) => {
    setExpandedSurahs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(surahId)) {
        newSet.delete(surahId);
      } else {
        newSet.add(surahId);
      }
      return newSet;
    });
  };

  // Background style
  const backgroundStyle = {
    backgroundImage: `url(${currentBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: `opacity(${bgOpacity[0]}%) blur(${bgSharpness[0]}px)`,
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={backgroundStyle}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen" style={{
        backgroundColor: `rgba(0, 0, 0, ${blockDarkness[0] / 100})`,
        backdropFilter: 'blur(1px)'
      }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Quran Audio</h1>
              <p className="text-sm text-primary-foreground/80">Listen, Learn, Reflect</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Customize Experience</DialogTitle>
                  <DialogDescription>
                    Adjust the appearance and settings to your preference
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Background Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Background</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {backgroundImages.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setCurrentBg(bg.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            currentBg === bg.url ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Background Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Background Opacity</label>
                      <Slider
                        value={bgOpacity}
                        onValueChange={setBgOpacity}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Background Blur</label>
                      <Slider
                        value={bgSharpness}
                        onValueChange={setBgSharpness}
                        max={10}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Content Darkness</label>
                      <Slider
                        value={blockDarkness}
                        onValueChange={setBlockDarkness}
                        max={80}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 mb-6">
          <div ref={surahCounter.ref} className="grid grid-cols-3 gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {surahCounter.count}
                </div>
                <div className="text-sm text-muted-foreground">Surahs</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {audioCounter.count}+
                </div>
                <div className="text-sm text-muted-foreground">Audio Files</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {hoursCounter.count}+
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/60 backdrop-blur-sm">
              <TabsTrigger value="surahs">Surahs</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            {/* Filters */}
            {showFilters && activeTab === "surahs" && (
              <Card className="mt-4 bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search surahs..."
                      value={filters.searchTerm}
                      onChange={(e) => filters.setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-md text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  
                  {/* Filter Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={filters.selectedType} onValueChange={filters.setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Makkan">Makkan</SelectItem>
                        <SelectItem value="Medinan">Medinan</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.selectedLength} onValueChange={filters.setSelectedLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Lengths</SelectItem>
                        <SelectItem value="Short">Short</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {filters.filteredSurahs.length} of {surahs.length} surahs
                    </span>
                    <Button variant="ghost" size="sm" onClick={filters.clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Surahs Tab */}
            <TabsContent value="surahs" className="mt-4">
              <div className="grid gap-3">
                {filters.filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    onClick={handleSurahSelect}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Recent Tab */}
            <TabsContent value="recent" className="mt-4">
              {rssLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading recent audio...</p>
                </div>
              )}
              
              {rssError && (
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-destructive">Error loading recent audio</p>
                  </CardContent>
                </Card>
              )}
              
              {rssData && (
                <div className="grid gap-3">
                  {rssData.map((track) => (
                    <QuranPlayerCard
                      key={track.id}
                      track={track}
                      isPlaying={audioPlayer.isPlaying && audioPlayer.currentTrack?.id === track.id}
                      isFavorite={favoriteTrackIds.has(track.id)}
                      isCompleted={completedTrackIds.has(track.id)}
                      onPlay={handlePlay}
                      onFavorite={toggleFavorite}
                      onDownload={handleDownload}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-4">
              {favoriteTrackIds.size === 0 ? (
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No favorites yet</p>
                      <p className="text-sm mt-1">Tap the heart icon on any track to add it here</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {rssData?.filter(track => favoriteTrackIds.has(track.id)).map((track) => (
                    <QuranPlayerCard
                      key={track.id}
                      track={track}
                      isPlaying={audioPlayer.isPlaying && audioPlayer.currentTrack?.id === track.id}
                      isFavorite={true}
                      isCompleted={completedTrackIds.has(track.id)}
                      onPlay={handlePlay}
                      onFavorite={toggleFavorite}
                      onDownload={handleDownload}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Player */}
        {isPlayerVisible && audioPlayer.currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{audioPlayer.currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground">{audioPlayer.currentTrack.surahName}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => audioPlayer.isPlaying ? audioPlayer.pause() : audioPlayer.play(audioPlayer.currentTrack!)}
                >
                  {audioPlayer.isPlaying ? 
                    <Pause className="h-4 w-4" /> : 
                    <Play className="h-4 w-4" />
                  }
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlayerVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: audioPlayer.duration > 0 
                    ? `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.floor(audioPlayer.currentTime / 60)}:{Math.floor(audioPlayer.currentTime % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(audioPlayer.duration / 60)}:{Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;