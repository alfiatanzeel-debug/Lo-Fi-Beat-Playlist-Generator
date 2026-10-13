'use client';

import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Disc3, 
  CloudRain, 
  Radio, 
  Coffee, 
  ExternalLink, 
  Sparkles 
} from 'lucide-react';
import { Playlist, Track } from '@/types';
import { getAudioEngine } from '@/lib/audio-engine';

interface MusicPlayerProps {
  currentPlaylist: Playlist | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentPlaylist,
  currentTrackIndex,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
}) => {
  const [progressSec, setProgressSec] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'vinyl' | 'coffee'>('rain');
  const [ambientVol, setAmbientVol] = useState(0.4);
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);

  const currentTrack: Track | null = currentPlaylist?.tracks?.[currentTrackIndex] || null;

  const totalDurationSec = React.useMemo(() => {
    if (!currentTrack) return 160;
    if (currentTrack.durationSeconds) return currentTrack.durationSeconds;
    const parts = (currentTrack.duration || '2:30').split(':');
    return (parseInt(parts[0], 10) || 2) * 60 + (parseInt(parts[1], 10) || 30);
  }, [currentTrack]);

  useEffect(() => {
    const engine = getAudioEngine();
    if (isPlaying && currentTrack) {
      engine.startLoFiTrack(currentTrack.bpm || 75);
      engine.setAmbientSound(ambientSound);
    } else {
      engine.stopLoFiTrack();
    }
  }, [isPlaying, currentTrack, currentPlaylist]);

  useEffect(() => {
    const engine = getAudioEngine();
    if (isPlaying) {
      engine.setAmbientSound(ambientSound);
    }
  }, [ambientSound, isPlaying]);

  useEffect(() => {
    const engine = getAudioEngine();
    engine.setMasterVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  useEffect(() => {
    const engine = getAudioEngine();
    engine.setAmbientVolume(ambientVol);
  }, [ambientVol]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= totalDurationSec) {
            onNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalDurationSec, onNext]);

  useEffect(() => {
    setProgressSec(0);
  }, [currentTrackIndex, currentPlaylist?.id]);

  if (!currentPlaylist || !currentTrack) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(
    `${currentTrack.title} ${currentTrack.artist}`
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-500/30 bg-lofi-card/95 backdrop-blur-2xl shadow-2xl px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center justify-between text-[11px] text-purple-300/80 border-b border-purple-500/10 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-3 w-3 text-pink-400" />
            <span className="font-semibold text-white">Audio Demonstration:</span>
            <span>
              Real-time Web Audio Lo-Fi Rhodes synthesizer & ambient noise. Track names are AI-curated.
            </span>
          </div>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <span>Listen on Spotify</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 min-w-0 max-w-[280px] sm:max-w-xs">
            <div
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full vinyl-grooves border-2 border-purple-500/40 shadow-lg ${
                isPlaying ? 'animate-spin-vinyl' : ''
              }`}
            >
              <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />
              </div>
            </div>

            <div className="truncate space-y-0.5">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                  {currentTrack.title}
                </h4>
                {isPlaying && (
                  <div className="flex items-end space-x-0.5 h-3 shrink-0">
                    <span className="w-0.5 bg-pink-500 animate-eq-1" />
                    <span className="w-0.5 bg-purple-400 animate-eq-2" />
                    <span className="w-0.5 bg-cyan-400 animate-eq-3" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentTrack.artist} &bull; <span className="text-purple-300">{currentPlaylist.title}</span>
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl flex flex-col items-center space-y-1.5">
            <div className="flex items-center space-x-4">
              <button
                onClick={onPrev}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => (isPlaying ? onPause() : onPlay())}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-white" />
                ) : (
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="w-full flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="w-8 text-right font-mono">{formatSeconds(progressSec)}</span>
              <input
                type="range"
                min="0"
                max={totalDurationSec}
                value={progressSec}
                onChange={(e) => setProgressSec(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="w-8 font-mono">{formatSeconds(totalDurationSec)}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowAmbientMenu(!showAmbientMenu)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-colors ${
                  ambientSound !== 'none'
                    ? 'bg-purple-600/20 text-purple-200 border-purple-500/30'
                    : 'bg-white/5 text-slate-400 border-white/5'
                }`}
                title="Ambient background texture"
              >
                {ambientSound === 'rain' && <CloudRain className="h-3.5 w-3.5 text-blue-400" />}
                {ambientSound === 'vinyl' && <Radio className="h-3.5 w-3.5 text-amber-400" />}
                {ambientSound === 'coffee' && <Coffee className="h-3.5 w-3.5 text-rose-400" />}
                {ambientSound === 'none' && <Disc3 className="h-3.5 w-3.5" />}
                <span className="capitalize">{ambientSound === 'none' ? 'Ambience Off' : ambientSound}</span>
              </button>

              {showAmbientMenu && (
                <div className="absolute right-0 bottom-10 w-44 rounded-2xl border border-lofi-border bg-lofi-card p-2 shadow-2xl space-y-1">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Background Ambience
                  </div>
                  {[
                    { id: 'rain', label: 'Raindrops', icon: CloudRain },
                    { id: 'vinyl', label: 'Vinyl Crackle', icon: Radio },
                    { id: 'coffee', label: 'Cafe Murmur', icon: Coffee },
                    { id: 'none', label: 'Mute Ambience', icon: Disc3 },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAmbientSound(item.id as any);
                        setShowAmbientMenu(false);
                      }}
                      className={`flex w-full items-center space-x-2 px-2 py-1.5 rounded-xl text-xs transition-colors ${
                        ambientSound === item.id
                          ? 'bg-purple-600/30 text-white font-semibold'
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
