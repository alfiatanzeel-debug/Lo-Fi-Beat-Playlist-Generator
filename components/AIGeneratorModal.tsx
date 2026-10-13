'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Wand2 
} from 'lucide-react';
import { GeneratorParams, Mood, Playlist } from '@/types';
import { POPULAR_MOODS } from '@/lib/demo-data';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGeneratedPlaylist: (playlist: Playlist) => void;
  initialMood?: string;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const INSPIRATION_PROMPTS = [
  'Rain outside an attic window with hot jasmine tea',
  'Late night coding in dark mode with neon reflections',
  'Cozy espresso bar with vinyl jazz playing softly',
  'Stargazing from a rooftop wrapped in a warm blanket',
  'Autumn leaves falling on quiet library stone steps',
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaveGeneratedPlaylist,
  initialMood = 'Study',
  onNotify,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(initialMood);
  const [customMood, setCustomMood] = useState('');
  const [trackCount, setTrackCount] = useState<number>(5);
  const [tempo, setTempo] = useState<'mellow' | 'mid-tempo' | 'upbeat'>('mellow');
  const [vibePrompt, setVibePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<Playlist | null>(null);

  React.useEffect(() => {
    if (initialMood) {
      setSelectedMood(initialMood);
    }
  }, [initialMood]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedResult(null);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 4);
    }, 900);

    const moodToUse = customMood.trim() ? customMood.trim() : selectedMood;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: moodToUse,
          trackCount,
          vibePrompt,
          tempo,
        } as GeneratorParams),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.playlist) {
        setGeneratedResult(data.playlist);
        if (data.source === 'gemini_ai') {
          onNotify('Gemini AI created your playlist!', 'success');
        } else {
          onNotify('Generated with Smart Lo-Fi Engine', 'info');
        }
      } else {
        throw new Error(data.error || 'Failed to generate playlist');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Generation error:', err);
      onNotify('Could not generate playlist. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedResult) return;
    onSaveGeneratedPlaylist(generatedResult);
    onClose();
  };

  const loadingMessages = [
    'Connecting to Google Gemini...',
    'Tuning vinyl flutter & ambient frequencies...',
    'Composing Rhodes chords and mellow drum loops...',
    'Finalizing track titles and atmospheric aesthetic...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/40 bg-lofi-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-lg shadow-purple-600/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              AI Lo-Fi Playlist Generator
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Powered by Google Gemini &bull; Select vibe, tempo, and atmosphere
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full vinyl-grooves border-4 border-purple-500/50 shadow-2xl animate-spin-vinyl">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-slate-950 animate-ping" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 animate-pulse">
                {loadingMessages[loadingStep]}
              </h3>
              <p className="text-xs text-slate-400">
                Crafting personalized lo-fi suggestions...
              </p>
            </div>
          </div>
        )}

        {!isLoading && generatedResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div
              className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${generatedResult.gradient?.from || '#1e1b4b'}, ${generatedResult.gradient?.via || '#312e81'}, ${generatedResult.gradient?.to || '#0284c7'})`,
              }}
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-black/40 px-3 py-0.5 text-xs font-semibold backdrop-blur-md">
                    {generatedResult.mood}
                  </span>
                  <span className="text-xs text-white/80">
                    {generatedResult.tracks.length} tracks &bull; {generatedResult.tempo || 'mellow'}
                  </span>
                </div>
                <h3 className="text-2xl font-black drop-shadow-md">
                  {generatedResult.title}
                </h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl drop-shadow">
                  {generatedResult.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Curated Tracklist Preview
              </h4>
              {generatedResult.tracks.map((track, i) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-mono text-[11px] w-4">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-white">{track.title}</p>
                      <p className="text-slate-400 text-[11px]">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                    <span className="rounded bg-purple-950/80 px-2 py-0.5 text-purple-300 font-mono">
                      {track.bpm} BPM
                    </span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setGeneratedResult(null)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Re-configure</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all transform active:scale-95"
              >
                <Check className="h-4 w-4" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>
        )}

        {!isLoading && !generatedResult && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                1. Select Core Mood
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {POPULAR_MOODS.map((m) => {
                  const isSelected = selectedMood === m.name && !customMood;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.name);
                        setCustomMood('');
                      }}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-600/20 text-white shadow-md shadow-purple-600/30 font-semibold'
                          : 'border-lofi-border/60 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl mb-1">{m.icon}</span>
                      <span className="text-xs">{m.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Or enter a custom mood (e.g. Cyberpunk Rainy Alley, Rooftop Sunset)..."
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. Track Count
                  </label>
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                    {trackCount} Tracks
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={trackCount}
                  onChange={(e) => setTrackCount(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>EP (3 tracks)</span>
                  <span>Standard (5-6)</span>
                  <span>Album (10 tracks)</span>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  3. Tempo & Groove
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['mellow', 'mid-tempo', 'upbeat'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTempo(t)}
                      className={`capitalize py-2 rounded-xl text-xs font-medium border transition-all ${
                        tempo === t
                          ? 'border-pink-500 bg-pink-500/20 text-white font-semibold'
                          : 'border-lofi-border/60 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t === 'mellow' ? 'Slow (68)' : t === 'mid-tempo' ? 'Mid (76)' : 'Lively (84)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  4. Atmospheric Vibe Prompt (Optional)
                </label>
                <span className="text-[11px] text-slate-400">Be as specific as you like</span>
              </div>
              <textarea
                rows={2}
                placeholder="Describe your scene: e.g. studying for calculus at 2am with lo-fi rain and warm acoustic guitar..."
                value={vibePrompt}
                onChange={(e) => setVibePrompt(e.target.value)}
                className="w-full rounded-xl glass-input p-3 text-xs text-white placeholder-slate-500 resize-none"
              />

              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-500 flex items-center mr-1">
                  <Wand2 className="h-3 w-3 mr-1" /> Quick Ideas:
                </span>
                {INSPIRATION_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setVibePrompt(prompt)}
                    className="rounded-lg bg-white/5 hover:bg-purple-900/30 border border-lofi-border/40 px-2 py-1 text-[11px] text-slate-300 hover:text-purple-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:opacity-95 transition-all transform active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Playlist with Gemini</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
