import React from 'react';
import { Play, Pause, Heart, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Track {
  id: string;
  title: string;
  surahName: string;
  duration: string;
  date: string;
  verseRange: string;
  audioUrl?: string;
}

interface QuranPlayerCardProps {
  track: Track;
  isPlaying: boolean;
  isFavorite: boolean;
  isCompleted: boolean;
  onPlay: (track: Track) => void;
  onFavorite: (trackId: string) => void;
  onDownload: (track: Track) => void;
  onShare: (track: Track) => void;
}

export const QuranPlayerCard: React.FC<QuranPlayerCardProps> = ({
  track,
  isPlaying,
  isFavorite,
  isCompleted,
  onPlay,
  onFavorite,
  onDownload,
  onShare,
}) => {
  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
              {track.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{track.surahName}</span>
              {track.verseRange && (
                <>
                  <span>•</span>
                  <span>Verses {track.verseRange}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onPlay(track)}
              className="h-8 w-8 p-0"
            >
              {isPlaying ? 
                <Pause className="h-4 w-4" /> : 
                <Play className="h-4 w-4" />
              }
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onFavorite(track.id)}
              className={`h-8 w-8 p-0 ${isFavorite ? 'text-primary' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDownload(track)}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(track)}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{track.date}</span>
          <div className="flex items-center gap-2">
            <span>{track.duration}</span>
            {isCompleted && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};