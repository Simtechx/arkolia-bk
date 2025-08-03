import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

interface Track {
  id: string;
  title: string;
  audioUrl?: string;
  surahName: string;
  duration: string;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null,
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    // Set up event listeners
    const handleLoadStart = () => {
      setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
    };
    
    const handleCanPlay = () => {
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        duration: audio.duration || 0 
      }));
    };
    
    const handleTimeUpdate = () => {
      setAudioState(prev => ({ 
        ...prev, 
        currentTime: audio.currentTime || 0 
      }));
    };
    
    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };
    
    const handleError = () => {
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: false,
        error: 'Failed to load audio' 
      }));
    };
    
    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };
    
    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current || !track.audioUrl) return;
    
    const audio = audioRef.current;
    
    // If same track, don't reload
    if (currentTrack?.id === track.id) return;
    
    // Load new track
    audio.src = track.audioUrl;
    audio.load();
    setCurrentTrack(track);
    setAudioState(prev => ({ 
      ...prev, 
      currentTime: 0, 
      duration: 0,
      error: null 
    }));
  }, [currentTrack]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      setAudioState(prev => ({ 
        ...prev, 
        error: 'Failed to play audio',
        isPlaying: false 
      }));
    });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [audioState.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setAudioState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setAudioState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  // Format time helper
  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    currentTrack,
    audioState,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    formatTime,
  };
};