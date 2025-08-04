import React from 'react';
import { ChevronRight, BookOpen, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface SurahCardProps {
  surah: Surah;
  onClick: (surah: Surah) => void;
  className?: string;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick, className = '' }) => {
  return (
    <Card 
      className={`bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer animate-fade-in ${className}`}
      onClick={() => onClick(surah)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">{surah.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{surah.name}</h3>
              <p className="text-lg font-arabic text-muted-foreground">{surah.nameArabic}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <Badge variant={surah.type === 'Makkan' ? 'default' : 'secondary'} className="text-xs">
            {surah.type}
          </Badge>
          <span>•</span>
          <span>{surah.verses} verses</span>
          <span>•</span>
          <span>Juz {surah.juz}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{surah.length}</span>
            {surah.sajdah && (
              <Badge variant="outline" className="text-xs ml-1">
                Sajdah
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {surah.themes.slice(0, 2).map((theme, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};