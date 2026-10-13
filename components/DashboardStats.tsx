'use client';

import React from 'react';
import { 
  ListMusic, 
  Heart, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Headphones, 
  Play, 
  ArrowRight 
} from 'lucide-react';
import { Playlist, StatsSummary } from '@/types';
import { POPULAR_MOODS } from '@/lib/demo-data';

interface DashboardStatsProps {
  playlists: Playlist[];
  onPlayPlaylist: (playlist: Playlist) => void;
  onOpenPlaylistDetail: (playlist: Playlist) => void;
  onOpenGeneratorWithMood: (mood: string) => void;
  onNavigateToPlaylists: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  playlists,
  onPlayPlaylist,
  onOpenPlaylistDetail,
  onOpenGeneratorWithMood,
  onNavigateToPlaylists,
}) => {
  const stats: StatsSummary = React.useMemo(() => {
    let totalTracks = 0;
    let totalSeconds = 0;
    let favoriteCount = 0;
    const moodDist: Record<string, number> = {};

    playlists.forEach((p) => {
      totalTracks += p.tracks.length;
      if (p.isFavorite) favoriteCount++;

      moodDist[p.mood] = (moodDist[p.mood] || 0) + 1;

      p.tracks.forEach((t) => {
        if (t.durationSeconds) {
          totalSeconds += t.durationSeconds;
        } else {
          const parts = (t.duration || '2:30').split(':');
          const m = parseInt(parts[0], 10) || 2;
          const s = parseInt(parts[1], 10) || 30;
          totalSeconds += m * 60 + s;
        }
      });
    });

    let topMood = 'Chill';
    let topCount = 0;
    Object.entries(moodDist).forEach(([mood, count]) => {
      if (count > topCount) {
        topCount = count;
        topMood = mood;
      }
    });

    return {
      totalPlaylists: playlists.length,
      totalTracks,
      favoriteCount,
      totalMinutes: Math.round(totalSeconds / 60),
      moodDistribution: moodDist,
      topMood,
    };
  }, [playlists]);

  const recentPlaylists = playlists.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
              <Sparkles className="h-3 w-3 text-pink-400" />
              <span>AI Workshop Edition &bull; Powered by Google Gemini</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Curate Your Atmosphere with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
                Lo-Fi Beats
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Generate mood-crafted lo-fi playlists in seconds. Manage your library, sync with Supabase cloud, listen to relaxing synthesized vinyl chords, and export anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenGeneratorWithMood('Focus')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-600/40 transition-all transform active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Lo-Fi Playlist</span>
            </button>
            <button
              onClick={onNavigateToPlaylists}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-slate-700/60 text-slate-200 text-sm font-medium transition-all"
            >
              <span>Explore Library</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Playlists</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <ListMusic className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{stats.totalPlaylists}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Collections created</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-pink-400">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracks</span>
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <Headphones className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{stats.totalTracks}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Suggested lo-fi beats</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Playtime</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl md:text-3xl font-extrabold text-white">
                {(stats.totalMinutes / 60).toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">hrs</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalMinutes} total minutes</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Favorites</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <Heart className="h-4 w-4 fill-rose-500/40 text-rose-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{stats.favoriteCount}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Top-rated selections</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Instant AI Vibe Generator
              </h2>
            </div>
            <span className="text-xs text-slate-400">Pick a mood to generate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POPULAR_MOODS.map((m) => (
              <button
                key={m.name}
                onClick={() => onOpenGeneratorWithMood(m.name)}
                className="group relative flex flex-col items-start p-3.5 rounded-xl bg-white/5 hover:bg-purple-900/20 border border-lofi-border/60 hover:border-purple-500/40 transition-all text-left"
              >
                <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">{m.icon}</span>
                <span className="text-xs font-bold text-white group-hover:text-purple-300">{m.name}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">{m.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Mood Distribution
              </h2>
            </div>
            <span className="text-xs text-purple-300 font-medium">Top: {stats.topMood}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.moodDistribution).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No playlists yet. Generate one above!</p>
            ) : (
              Object.entries(stats.moodDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([mood, count]) => {
                  const percent = Math.round((count / Math.max(1, stats.totalPlaylists)) * 100);
                  return (
                    <div key={mood} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{mood}</span>
                        <span className="text-slate-400">{count} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Recent Playlists</span>
            <span className="text-xs font-normal text-slate-400">({recentPlaylists.length})</span>
          </h2>
          <button
            onClick={onNavigateToPlaylists}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onOpenPlaylistDetail(playlist)}
              className="glass-panel group relative rounded-2xl p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div
                className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 shadow-md transition-transform group-hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${playlist.gradient?.from || '#1e1b4b'}, ${playlist.gradient?.to || '#0284c7'})`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayPlaylist(playlist);
                  }}
                  className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-900 shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all opacity-90 group-hover:opacity-100"
                  title="Play Lo-Fi Preview"
                >
                  <Play className="h-4 w-4 fill-purple-900 ml-0.5" />
                </button>

                <div className="absolute top-2 left-2 rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white">
                  {playlist.mood}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 line-clamp-1 transition-colors">
                  {playlist.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {playlist.tracks.length} tracks &bull; {playlist.tracks[0]?.artist || 'Lo-Fi Chill'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
