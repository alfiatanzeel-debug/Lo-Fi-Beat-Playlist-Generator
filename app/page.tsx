'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { PlaylistExplorer } from '@/components/PlaylistExplorer';
import { AtmosphereStudio } from '@/components/AtmosphereStudio';
import { AIGeneratorModal } from '@/components/AIGeneratorModal';
import { PlaylistDetailModal } from '@/components/PlaylistDetailModal';
import { PlaylistEditModal } from '@/components/PlaylistEditModal';
import { CreateManualModal } from '@/components/CreateManualModal';
import { ConfigModal } from '@/components/ConfigModal';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Toast } from '@/components/Toast';

import { Playlist, AppNotification, Track } from '@/types';
import { 
  fetchAllPlaylists, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  resetLocalStorageToDemo 
} from '@/lib/supabase';
import { exportAllPlaylistsToJSON } from '@/lib/export-utils';

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'playlists' | 'atmosphere'>('dashboard');

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorMood, setGeneratorMood] = useState('Study');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedPlaylistForDetail, setSelectedPlaylistForDetail] = useState<Playlist | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      setNotifications((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    []
  );

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const loaded = await fetchAllPlaylists();
        setPlaylists(loaded);
        if (loaded.length > 0) {
          setCurrentPlaylist(loaded[0]);
          setCurrentTrackIndex(0);
        }
      } catch (err) {
        console.error('Failed to load playlists:', err);
      } finally {
        setIsLoadingPlaylists(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPlaylistForDetail) {
      const fresh = playlists.find((p) => p.id === selectedPlaylistForDetail.id);
      if (fresh) setSelectedPlaylistForDetail(fresh);
    }
  }, [playlists, selectedPlaylistForDetail]);

  const handlePlayPlaylist = (playlist: Playlist, trackIndex: number = 0) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    addNotification(`Playing "${playlist.tracks[trackIndex]?.title || playlist.title}"`, 'info');
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return;
    const prevIdx =
      currentTrackIndex === 0 ? currentPlaylist.tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const handleToggleFavorite = async (id: string) => {
    const target = playlists.find((p) => p.id === id);
    if (!target) return;

    const nextFav = !target.isFavorite;
    await updatePlaylist(id, { isFavorite: nextFav });

    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: nextFav } : p))
    );

    if (currentPlaylist?.id === id) {
      setCurrentPlaylist((prev) => (prev ? { ...prev, isFavorite: nextFav } : prev));
    }

    addNotification(
      nextFav ? `Saved "${target.title}" to favorites!` : `Removed from favorites`,
      'info'
    );
  };

  const handleSaveGeneratedPlaylist = async (newPlaylist: Playlist) => {
    try {
      const saved = await createPlaylist(newPlaylist);
      setPlaylists((prev) => [saved, ...prev]);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'],
        });
      } catch {}

      addNotification(`Playlist "${saved.title}" saved to library!`, 'success');
      setActiveTab('playlists');
    } catch (err) {
      console.error('Error saving playlist:', err);
      addNotification('Failed to save playlist', 'error');
    }
  };

  const handleCreateManual = async (newPlaylist: Playlist) => {
    const saved = await createPlaylist(newPlaylist);
    setPlaylists((prev) => [saved, ...prev]);
    addNotification(`Created playlist "${saved.title}"`, 'success');
    setActiveTab('playlists');
  };

  const handleSaveEdit = async (id: string, updates: Partial<Playlist>) => {
    await updatePlaylist(id, updates);
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (currentPlaylist?.id === id) {
      setCurrentPlaylist((prev) => (prev ? { ...prev, ...updates } : prev));
    }
    addNotification('Playlist updated successfully!', 'success');
  };

  const handleUpdatePlaylistTracks = async (playlistId: string, updatedTracks: Track[]) => {
    await updatePlaylist(playlistId, { tracks: updatedTracks });
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, tracks: updatedTracks } : p))
    );
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist((prev) => (prev ? { ...prev, tracks: updatedTracks } : prev));
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    const target = playlists.find((p) => p.id === id);
    if (!confirm(`Are you sure you want to delete "${target?.title || 'this playlist'}"?`)) {
      return;
    }

    await deletePlaylist(id);
    setPlaylists((prev) => prev.filter((p) => p.id !== id));

    if (currentPlaylist?.id === id) {
      setIsPlaying(false);
      setCurrentPlaylist(null);
    }
    if (selectedPlaylistForDetail?.id === id) {
      setSelectedPlaylistForDetail(null);
    }

    addNotification(`Deleted playlist`, 'info');
  };

  const handleResetDemoData = () => {
    const resetList = resetLocalStorageToDemo();
    setPlaylists(resetList);
    setCurrentPlaylist(resetList[0]);
    addNotification('Library reset to original demo playlists', 'success');
  };

  const handleExportAll = () => {
    exportAllPlaylistsToJSON(playlists);
    addNotification(`Exported all ${playlists.length} playlists as JSON backup!`, 'success');
  };

  const handleImportPlaylists = async (importedList: Playlist[]) => {
    const combined = [...importedList, ...playlists.filter((p) => !importedList.some((imp) => imp.id === p.id))];
    for (const p of importedList) {
      await createPlaylist(p);
    }
    setPlaylists(combined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lofi-bg text-slate-100 pb-28">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGenerator={() => {
          setGeneratorMood('Study');
          setIsGeneratorOpen(true);
        }}
        onOpenCreateManual={() => setIsManualModalOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onExportAll={handleExportAll}
        playlistCount={playlists.length}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 md:py-8">
        {isLoadingPlaylists ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading your Lo-Fi sanctuary...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardStats
                playlists={playlists}
                onPlayPlaylist={handlePlayPlaylist}
                onOpenPlaylistDetail={(p) => setSelectedPlaylistForDetail(p)}
                onOpenGeneratorWithMood={(mood) => {
                  setGeneratorMood(mood);
                  setIsGeneratorOpen(true);
                }}
                onNavigateToPlaylists={() => setActiveTab('playlists')}
              />
            )}

            {activeTab === 'playlists' && (
              <PlaylistExplorer
                playlists={playlists}
                isPlaying={isPlaying}
                activePlaylistId={currentPlaylist?.id}
                onPlay={handlePlayPlaylist}
                onPause={handlePause}
                onViewDetails={(p) => setSelectedPlaylistForDetail(p)}
                onEdit={(p) => setEditingPlaylist(p)}
                onDelete={handleDeletePlaylist}
                onToggleFavorite={handleToggleFavorite}
                onOpenGenerator={() => {
                  setGeneratorMood('Focus');
                  setIsGeneratorOpen(true);
                }}
                onOpenCreateManual={() => setIsManualModalOpen(true)}
                onImportPlaylists={handleImportPlaylists}
                onNotify={addNotification}
              />
            )}

            {activeTab === 'atmosphere' && <AtmosphereStudio />}
          </>
        )}
      </main>

      <MusicPlayer
        currentPlaylist={currentPlaylist}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
      />

      <AIGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        initialMood={generatorMood}
        onSaveGeneratedPlaylist={handleSaveGeneratedPlaylist}
        onNotify={addNotification}
      />

      <PlaylistDetailModal
        playlist={selectedPlaylistForDetail}
        isOpen={Boolean(selectedPlaylistForDetail)}
        onClose={() => setSelectedPlaylistForDetail(null)}
        isPlaying={isPlaying && currentPlaylist?.id === selectedPlaylistForDetail?.id}
        currentTrackId={
          currentPlaylist?.id === selectedPlaylistForDetail?.id
            ? currentPlaylist?.tracks[currentTrackIndex]?.id
            : undefined
        }
        onPlayPlaylist={handlePlayPlaylist}
        onPause={handlePause}
        onToggleFavorite={handleToggleFavorite}
        onUpdatePlaylistTracks={handleUpdatePlaylistTracks}
        onNotify={addNotification}
      />

      <PlaylistEditModal
        playlist={editingPlaylist}
        isOpen={Boolean(editingPlaylist)}
        onClose={() => setEditingPlaylist(null)}
        onSave={handleSaveEdit}
      />

      <CreateManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onCreate={handleCreateManual}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onResetDemoData={handleResetDemoData}
        onNotify={addNotification}
      />

      <Toast notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}
