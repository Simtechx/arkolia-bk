import React from 'react';
import { Play, Heart, Share2, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Track } from '@/types';

interface QuranPlayerCardProps {
  track: Track;
  onPlay: () => void;
  onToggleFavorite: () => void;
  isFavorited: boolean;
  isCompleted: boolean;
}

export const QuranPlayerCard: React.FC<QuranPlayerCardProps> = ({
  track,
  onPlay,
  onToggleFavorite,
  isFavorited,
  isCompleted
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to ${track.title}`,
        url: window.location.href
      });
    }
  };

  const handleDownload = () => {
    if (track.audioUrl) {
      const link = document.createElement('a');
      link.href = track.audioUrl;
      link.download = `${track.title}.mp3`;
      link.click();
    }
  };

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/30"
              onClick={onPlay}
            >
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-foreground line-clamp-1">
                {track.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {track.surahName}
                </span>
                {track.verseRange && (
                  <Badge variant="outline" className="text-xs">
                    {track.verseRange}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {track.duration}
                </span>
                <span className="text-xs text-muted-foreground">
                  {track.date}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 ${isFavorited ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={onToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isCompleted && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
              Completed
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};