import React from 'react';
import { ChevronDown, ChevronRight, Heart, Share2, Download, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Surah, Track } from '@/types';
import { QuranPlayerCard } from './QuranPlayerCard';

interface SurahCardProps {
  surah: Surah;
  tracks: Track[];
  expandedSurah: number | null;
  favorites: Set<string>;
  completed: Set<string>;
  onToggleExpand: (id: number) => void;
  onToggleFavorite: (trackId: string) => void;
  onShare: (surah: Surah) => void;
  onDownload: (surah: Surah) => void;
  onPlayTrack: (track: Track) => void;
}

export const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  tracks,
  expandedSurah,
  favorites,
  completed,
  onToggleExpand,
  onToggleFavorite,
  onShare,
  onDownload,
  onPlayTrack
}) => {
  const surahTracks = tracks.filter(track => 
    track.surahName.toLowerCase().includes(surah.name.toLowerCase())
  );
  
  const isExpanded = expandedSurah === surah.id;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => onToggleExpand(surah.id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {surah.id}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{surah.name}</h3>
              <p className="text-sm text-muted-foreground">{surah.nameArabic}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {surah.verses} verses
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {surah.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {surah.length}
                </Badge>
                {surah.sajdah && (
                  <Badge variant="outline" className="text-xs bg-accent/20">
                    Sajdah
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare(surah);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(surah);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                <strong>Themes:</strong> {surah.themes.join(', ')}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Usage:</strong> {surah.usage.join(', ')}
            </div>
            
            {surahTracks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Audio Tracks</h4>
                {surahTracks.map((track) => (
                  <QuranPlayerCard
                    key={track.id}
                    track={track}
                    onPlay={() => onPlayTrack(track)}
                    onToggleFavorite={() => onToggleFavorite(track.id)}
                    isFavorited={favorites.has(track.id)}
                    isCompleted={completed.has(track.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};