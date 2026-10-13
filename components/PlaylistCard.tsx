'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreVertical, 
  FileSpreadsheet, 
  FileCode, 
  Edit3, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { Playlist } from '@/types';
import { exportPlaylistToCSV, exportPlaylistToJSON } from '@/lib/export-utils';

interface PlaylistCardProps {
  playlist: Playlist;
  isPlaying: boolean;
  onPlay: (playlist: Playlist) => void;
  onPause: () => void;
  onViewDetails: (playlist: Playlist) => void;
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isPlaying,
  onPlay,
  onPause,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onNotify,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const totalDurationMin = React.useMemo(() => {
    let totalSec = 0;
    playlist.tracks.forEach((t) => {
      if (t.durationSeconds) {
        totalSec += t.durationSeconds;
      } else {
        const parts = (t.duration || '2:30').split(':');
        totalSec += (parseInt(parts[0], 10) || 2) * 60 + (parseInt(parts[1], 10) || 30);
      }
    });
    return Math.round(totalSec / 60);
  }, [playlist.tracks]);

  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    exportPlaylistToCSV(playlist);
    onNotify(`Exported "${playlist.title}" as CSV file`, 'success');
  };

  const handleExportJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    exportPlaylistToJSON(playlist);
    onNotify(`Exported "${playlist.title}" as JSON file`, 'success');
  };

  return (
    <div
      onClick={() => onViewDetails(playlist)}
      className="glass-panel group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/40 flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 shadow-lg">
          <div
            className={`absolute right-1 top-2 h-full w-full rounded-full vinyl-grooves border-4 border-slate-900 transition-all duration-500 flex items-center justify-center ${
              isPlaying
                ? 'translate-x-10 animate-spin-vinyl shadow-2xl opacity-100'
                : 'translate-x-3 opacity-60 group-hover:translate-x-7 group-hover:opacity-90'
            }`}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-slate-950" />
            </div>
          </div>

          <div
            className="relative z-10 h-full w-full rounded-xl p-4 flex flex-col justify-between shadow-md"
            style={{
              background: `linear-gradient(135deg, ${playlist.gradient?.from || '#1e1b4b'} 0%, ${playlist.gradient?.via || '#312e81'} 50%, ${playlist.gradient?.to || '#0284c7'} 100%)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white border border-white/10 shadow-sm">
                {playlist.mood}
              </span>

              {playlist.aiGenerated && (
                <span className="flex items-center space-x-1 rounded-full bg-purple-950/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-purple-200 border border-purple-400/30">
                  <Sparkles className="h-2.5 w-2.5 text-pink-400" />
                  <span>Gemini AI</span>
                </span>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium text-white/80 line-clamp-1 drop-shadow">
                  {playlist.tracks.length} tracks &bull; ~{totalDurationMin} min
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPlaying) {
                    onPause();
                  } else {
                    onPlay(playlist);
                  }
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full shadow-xl transition-all transform active:scale-95 ${
                  isPlaying
                    ? 'bg-pink-500 text-white scale-105 shadow-pink-500/50'
                    : 'bg-white text-purple-950 hover:scale-105 hover:bg-slate-100 shadow-black/50'
                }`}
                title={isPlaying ? 'Pause' : 'Play Lo-Fi Preview'}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {playlist.title}
            </h3>

            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(playlist.id);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                title={playlist.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`h-4 w-4 transition-transform active:scale-125 ${
                    playlist.isFavorite
                      ? 'fill-rose-500 text-rose-500'
                      : 'hover:fill-rose-500/30'
                  }`}
                />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-6 z-30 w-44 rounded-xl border border-lofi-border bg-lofi-card/95 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(playlist);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                      <span>Edit Playlist</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Export as CSV</span>
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Export as JSON</span>
                    </button>

                    <div className="my-1 border-t border-slate-700/50" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(playlist.id);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {playlist.description || 'Lo-fi beats collection designed for focus and relaxation.'}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex flex-wrap gap-1">
          {playlist.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-purple-300/80"
            >
              #{tag}
            </span>
          ))}
        </div>

        {isPlaying && (
          <div className="flex items-center space-x-1 text-pink-400 text-[10px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
            <span>PLAYING</span>
          </div>
        )}
      </div>
    </div>
  );
};
