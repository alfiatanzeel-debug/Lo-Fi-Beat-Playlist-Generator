'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Sparkles, 
  FileUp, 
  ArrowUpDown, 
  Disc3 
} from 'lucide-react';
import { Playlist, FilterState } from '@/types';
import { PlaylistCard } from './PlaylistCard';
import { POPULAR_MOODS } from '@/lib/demo-data';

interface PlaylistExplorerProps {
  playlists: Playlist[];
  isPlaying: boolean;
  activePlaylistId?: string;
  onPlay: (playlist: Playlist) => void;
  onPause: () => void;
  onViewDetails: (playlist: Playlist) => void;
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenGenerator: () => void;
  onOpenCreateManual: () => void;
  onImportPlaylists: (imported: Playlist[]) => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PlaylistExplorer: React.FC<PlaylistExplorerProps> = ({
  playlists,
  isPlaying,
  activePlaylistId,
  onPlay,
  onPause,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenGenerator,
  onOpenCreateManual,
  onImportPlaylists,
  onNotify,
}) => {
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    mood: 'All',
    onlyFavorites: false,
    sortBy: 'newest',
  });

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredPlaylists = useMemo(() => {
    return playlists
      .filter((p) => {
        if (filter.search.trim()) {
          const query = filter.search.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(query);
          const matchesDesc = (p.description || '').toLowerCase().includes(query);
          const matchesMood = p.mood.toLowerCase().includes(query);
          const matchesTags = (p.tags || []).some((t) => t.toLowerCase().includes(query));
          const matchesTracks = (p.tracks || []).some(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              t.artist.toLowerCase().includes(query)
          );

          if (!matchesTitle && !matchesDesc && !matchesMood && !matchesTags && !matchesTracks) {
            return false;
          }
        }

        if (filter.mood !== 'All' && p.mood.toLowerCase() !== filter.mood.toLowerCase()) {
          return false;
        }

        if (filter.onlyFavorites && !p.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filter.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filter.sortBy === 'tracks-desc') {
          return b.tracks.length - a.tracks.length;
        }
        if (filter.sortBy === 'tracks-asc') {
          return a.tracks.length - b.tracks.length;
        }
        if (filter.sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [playlists, filter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedList: Playlist[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.playlists)
          ? parsed.playlists
          : [];

        if (importedList.length > 0) {
          onImportPlaylists(importedList);
          onNotify(`Successfully imported ${importedList.length} playlists!`, 'success');
        } else {
          onNotify('No valid playlists found in file', 'warning');
        }
      } catch (err) {
        console.error('Import parse error:', err);
        onNotify('Invalid JSON backup file format', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-panel rounded-2xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, artist, track name, or mood tags..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full rounded-xl glass-input pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400"
            />
            {filter.search && (
              <button
                onClick={() => setFilter({ ...filter, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setFilter({ ...filter, onlyFavorites: !filter.onlyFavorites })}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter.onlyFavorites
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-lofi-border/60 hover:bg-white/10'
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  filter.onlyFavorites ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span>Favorites Only</span>
            </button>

            <div className="relative">
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="rounded-xl glass-input pl-3 pr-8 py-2 text-xs text-slate-200 bg-slate-900 border border-lofi-border appearance-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="tracks-desc">Sort: Most Tracks</option>
                <option value="tracks-asc">Sort: Fewest Tracks</option>
                <option value="title-asc">Sort: Title (A-Z)</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import JSON Backup"
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-lofi-border/60 transition-colors"
            >
              <FileUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setFilter({ ...filter, mood: 'All' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter.mood === 'All'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Moods ({playlists.length})
          </button>

          {POPULAR_MOODS.map((m) => {
            const count = playlists.filter((p) => p.mood.toLowerCase() === m.name.toLowerCase()).length;
            const isSelected = filter.mood.toLowerCase() === m.name.toLowerCase();
            return (
              <button
                key={m.name}
                onClick={() => setFilter({ ...filter, mood: m.name })}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                <span className="text-[10px] text-slate-400 ml-0.5">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing {filteredPlaylists.length} of {playlists.length} playlists
        </span>
        {filter.search && (
          <span>
            Filtered by keyword: &ldquo;<strong className="text-white">{filter.search}</strong>&rdquo;
          </span>
        )}
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Disc3 className="h-8 w-8 animate-spin-slow" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No playlists match your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search filters, or generate a fresh new lo-fi collection with Google Gemini AI.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setFilter({ search: '', mood: 'All', onlyFavorites: false, sortBy: 'newest' })}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenGenerator}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Playlist</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isPlaying={isPlaying && activePlaylistId === playlist.id}
              onPlay={onPlay}
              onPause={onPause}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onNotify={onNotify}
            />
          ))}
        </div>
      )}
    </div>
  );
};
