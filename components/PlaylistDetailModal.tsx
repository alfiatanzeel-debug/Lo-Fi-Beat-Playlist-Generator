'use client';

import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Heart, 
  FileSpreadsheet, 
  FileCode, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  Music 
} from 'lucide-react';
import { Playlist, Track } from '@/types';
import { exportPlaylistToCSV, exportPlaylistToJSON } from '@/lib/export-utils';

interface PlaylistDetailModalProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  currentTrackId?: string;
  onPlayPlaylist: (playlist: Playlist, trackIndex?: number) => void;
  onPause: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdatePlaylistTracks: (playlistId: string, updatedTracks: Track[]) => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  playlist,
  isOpen,
  onClose,
  isPlaying,
  currentTrackId,
  onPlayPlaylist,
  onPause,
  onToggleFavorite,
  onUpdatePlaylistTracks,
  onNotify,
}) => {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newDuration, setNewDuration] = useState('2:35');
  const [newBpm, setNewBpm] = useState(75);

  if (!isOpen || !playlist) return null;

  const handleAddTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parts = newDuration.split(':');
    const min = parseInt(parts[0], 10) || 2;
    const sec = parseInt(parts[1], 10) || 30;

    const newTrack: Track = {
      id: `custom-trk-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Independent Producer',
      duration: newDuration.trim() || '2:30',
      durationSeconds: min * 60 + sec,
      bpm: Number(newBpm) || 75,
      key: 'C Minor',
      tags: ['Custom', playlist.mood],
    };

    const nextTracks = [...playlist.tracks, newTrack];
    onUpdatePlaylistTracks(playlist.id, nextTracks);
    setNewTitle('');
    setNewArtist('');
    setShowAddTrack(false);
    onNotify(`Added "${newTrack.title}" to playlist!`, 'success');
  };

  const handleRemoveTrack = (trackId: string) => {
    const nextTracks = playlist.tracks.filter((t) => t.id !== trackId);
    onUpdatePlaylistTracks(playlist.id, nextTracks);
    onNotify('Track removed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-purple-500/40 bg-lofi-card/95 shadow-2xl backdrop-blur-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/40 text-slate-300 hover:text-white hover:bg-black/60 backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{
            background: `linear-gradient(135deg, ${playlist.gradient?.from || '#1e1b4b'} 0%, ${playlist.gradient?.via || '#312e81'} 50%, ${playlist.gradient?.to || '#0284c7'} 100%)`,
          }}
        >
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                {playlist.mood}
              </span>
              {playlist.aiGenerated && (
                <span className="flex items-center space-x-1 rounded-full bg-purple-950/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30">
                  <Sparkles className="h-3 w-3 text-pink-400" />
                  <span>Google Gemini AI</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md">
              {playlist.title}
            </h2>

            <p className="text-xs md:text-sm text-white/90 leading-relaxed drop-shadow">
              {playlist.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {playlist.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-black/30 backdrop-blur-md px-2 py-0.5 text-[11px] text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 z-10">
            <button
              onClick={() => {
                if (isPlaying) {
                  onPause();
                } else {
                  onPlayPlaylist(playlist, 0);
                }
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-purple-950 text-xs font-bold shadow-xl hover:bg-slate-100 transition-all transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-purple-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-purple-950" />
                  <span>Play All</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleFavorite(playlist.id)}
              className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title={playlist.isFavorite ? 'Remove Favorite' : 'Save as Favorite'}
            >
              <Heart
                className={`h-4 w-4 ${
                  playlist.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-b border-lofi-border/60 bg-lofi-card">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Music className="h-4 w-4 text-purple-400" />
            <span>{playlist.tracks.length} Tracks in playlist</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddTrack(!showAddTrack)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Track</span>
            </button>

            <button
              onClick={() => exportPlaylistToCSV(playlist)}
              title="Download CSV"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-xs transition-colors border border-emerald-500/20"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={() => exportPlaylistToJSON(playlist)}
              title="Download JSON"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs transition-colors border border-cyan-500/20"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
          </div>
        </div>

        {showAddTrack && (
          <form
            onSubmit={handleAddTrackSubmit}
            className="p-4 bg-purple-950/20 border-b border-lofi-border/60 flex flex-wrap items-center gap-3 animate-in fade-in"
          >
            <input
              type="text"
              placeholder="Track Title *"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 min-w-[140px] rounded-xl glass-input px-3.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Artist"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              className="w-36 rounded-xl glass-input px-3.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="2:30"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-20 rounded-xl glass-input px-3.5 py-1.5 text-xs text-white text-center"
            />
            <input
              type="number"
              placeholder="75 BPM"
              value={newBpm}
              onChange={(e) => setNewBpm(Number(e.target.value))}
              className="w-20 rounded-xl glass-input px-3.5 py-1.5 text-xs text-white text-center"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddTrack(false)}
              className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
          {playlist.tracks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No tracks in this playlist yet. Click "Add Track" above!
            </div>
          ) : (
            playlist.tracks.map((track, index) => {
              const isCurrentTrack = currentTrackId === track.id;
              const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(
                `${track.title} ${track.artist}`
              )}`;
              const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${track.title} ${track.artist} lofi`
              )}`;

              return (
                <div
                  key={track.id}
                  className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isCurrentTrack
                      ? 'bg-purple-900/30 border-purple-500/60 shadow-lg shadow-purple-950/50'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <button
                      onClick={() => onPlayPlaylist(playlist, index)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                        isCurrentTrack && isPlaying
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-purple-600 hover:text-white'
                      }`}
                    >
                      {isCurrentTrack && isPlaying ? (
                        <Pause className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <span className="text-slate-500 font-mono text-xs w-4">
                      {index + 1}
                    </span>

                    <div className="truncate">
                      <p className={`text-xs font-bold truncate ${isCurrentTrack ? 'text-pink-300' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {track.artist} {track.key ? `&bull; Key: ${track.key}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-xs">
                    <span className="hidden sm:inline rounded-md bg-purple-950/80 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/20">
                      {track.bpm} BPM
                    </span>

                    <span className="text-slate-400 font-mono text-[11px] w-10 text-right">
                      {track.duration}
                    </span>

                    <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <a
                        href={spotifySearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Search and listen on Spotify"
                        className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={youtubeSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Search and stream on YouTube"
                        className="p-1 rounded-md text-rose-400 hover:bg-rose-500/20 transition-colors"
                      >
                        <Radio className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <button
                      onClick={() => handleRemoveTrack(track.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from playlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
