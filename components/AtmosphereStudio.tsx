'use client';

import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Radio, 
  Coffee, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  Music2 
} from 'lucide-react';
import { getAudioEngine } from '@/lib/audio-engine';

export const AtmosphereStudio: React.FC = () => {
  const [activeNoise, setActiveNoise] = useState<'none' | 'rain' | 'vinyl' | 'coffee'>('rain');
  const [noiseVolume, setNoiseVolume] = useState(0.5);
  const [synthPlaying, setSynthPlaying] = useState(false);
  const [selectedBpm] = useState(72);

  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      alert('Focus session complete! Take a relaxing break.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSecondsLeft]);

  const toggleSound = (type: 'rain' | 'vinyl' | 'coffee') => {
    const engine = getAudioEngine();
    if (activeNoise === type) {
      setActiveNoise('none');
      engine.setAmbientSound('none');
    } else {
      setActiveNoise(type);
      engine.setAmbientSound(type);
      engine.setAmbientVolume(noiseVolume);
    }
  };

  const toggleLoFiSynth = () => {
    const engine = getAudioEngine();
    if (synthPlaying) {
      engine.stopLoFiTrack();
      setSynthPlaying(false);
    } else {
      engine.startLoFiTrack(selectedBpm);
      setSynthPlaying(true);
    }
  };

  const setTimerPreset = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    setTimerRunning(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
          <Sparkles className="h-3.5 w-3.5 text-pink-400" />
          <span>Interactive Soundscape & Focus Timer</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Lo-Fi Atmosphere Studio
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Mix analog noise textures with procedural lo-fi chords while timing your deep work sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Radio className="h-5 w-5 text-pink-400" />
            <span>Analog Ambience Textures</span>
          </h2>

          <div className="space-y-4">
            <div
              onClick={() => toggleSound('rain')}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                activeNoise === 'rain'
                  ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-900/30'
                  : 'border-lofi-border/60 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <CloudRain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Gentle Window Rain</h3>
                  <p className="text-xs text-slate-400">Shaped pink noise with lowpass resonance</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {activeNoise === 'rain' ? 'Active' : 'Tap to Play'}
              </span>
            </div>

            <div
              onClick={() => toggleSound('vinyl')}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                activeNoise === 'vinyl'
                  ? 'border-amber-500 bg-amber-600/20 text-white shadow-lg shadow-amber-900/30'
                  : 'border-lofi-border/60 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                  <Radio className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Dusty Vinyl Crackle</h3>
                  <p className="text-xs text-slate-400">Vintage 33 RPM needle groove pops</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {activeNoise === 'vinyl' ? 'Active' : 'Tap to Play'}
              </span>
            </div>

            <div
              onClick={() => toggleSound('coffee')}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                activeNoise === 'coffee'
                  ? 'border-rose-500 bg-rose-600/20 text-white shadow-lg shadow-rose-900/30'
                  : 'border-lofi-border/60 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                  <Coffee className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Tokyo Cafe Murmur</h3>
                  <p className="text-xs text-slate-400">Warm sub-ambient room atmosphere</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                {activeNoise === 'coffee' ? 'Active' : 'Tap to Play'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ambience Volume</span>
              <span>{Math.round(noiseVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={noiseVolume}
              onChange={(e) => {
                const val = Number(e.target.value);
                setNoiseVolume(val);
                getAudioEngine().setAmbientVolume(val);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music2 className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Lo-Fi Rhodes Synthesizer
                </span>
              </div>
              <span className="text-[11px] text-purple-300 font-mono">
                {selectedBpm} BPM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time Web Audio API mellow 7th & 9th chords with tape flutter.
            </p>
            <button
              onClick={toggleLoFiSynth}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                synthPlaying
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30'
              }`}
            >
              {synthPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{synthPlaying ? 'Stop Synthesizer Chords' : 'Play Lo-Fi Chord Loop'}</span>
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <span>Deep Work Focus Timer</span>
              </h2>
              <span className="text-xs text-slate-400">Pomodoro Technique</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { min: 25, label: '25 min' },
                { min: 45, label: '45 min' },
                { min: 60, label: '60 min' },
              ].map((p) => (
                <button
                  key={p.min}
                  onClick={() => setTimerPreset(p.min)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    timerMinutes === p.min
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-lofi-border bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-4 border-purple-500/20 bg-black/40 shadow-inner">
                <div
                  className="absolute inset-0 rounded-full border-4 border-purple-500 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      100 * (1 - timerSecondsLeft / (timerMinutes * 60))
                    }% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                  }}
                />
                <div className="text-center z-10 space-y-1">
                  <span className="font-mono text-5xl font-black tracking-tight text-white">
                    {formatTimer(timerSecondsLeft)}
                  </span>
                  <p className="text-xs text-purple-300 font-semibold uppercase tracking-widest">
                    {timerRunning ? 'Stay Focused' : 'Paused'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 ${
                timerRunning
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95'
              }`}
            >
              {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{timerRunning ? 'Pause Timer' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={() => setTimerPreset(timerMinutes)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
