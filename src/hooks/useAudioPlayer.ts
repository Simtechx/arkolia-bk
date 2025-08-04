import { useState, useRef, useEffect, useCallback } from 'react';

interface Track {
  id: string;
  title: string;
  surahName: string;
  duration: string;
  date: string;
  verseRange: string;
  audioUrl?: string;
}

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
  });

  const initializeAudio = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!track.audioUrl) return;

    setState(prev => ({ ...prev, isLoading: true }));
    
    const audio = new Audio(track.audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    });

    audio.addEventListener('error', () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
      }));
      console.error('Error loading audio');
    });

    return audio;
  }, []);

  const play = useCallback((track: Track) => {
    if (state.currentTrack?.id !== track.id) {
      const audio = initializeAudio(track);
      setState(prev => ({
        ...prev,
        currentTrack: track,
        currentTime: 0,
      }));
      
      if (audio) {
        audio.play().then(() => {
          setState(prev => ({ ...prev, isPlaying: true }));
        }).catch(console.error);
      }
    } else if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play().then(() => {
          setState(prev => ({ ...prev, isPlaying: true }));
        }).catch(console.error);
      }
    }
  }, [state.currentTrack, state.isPlaying, initializeAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    seekTo,
    setVolume,
  };
};