'use client';

import React from 'react';
import { 
  Disc3, 
  Sparkles, 
  Plus, 
  Database, 
  Sliders, 
  CloudRain, 
  FileDown, 
  LayoutDashboard, 
  ListMusic 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface NavbarProps {
  activeTab: 'dashboard' | 'playlists' | 'atmosphere';
  setActiveTab: (tab: 'dashboard' | 'playlists' | 'atmosphere') => void;
  onOpenGenerator: () => void;
  onOpenCreateManual: () => void;
  onOpenConfig: () => void;
  onExportAll: () => void;
  playlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
  onOpenCreateManual,
  onOpenConfig,
  onExportAll,
  playlistCount,
}) => {
  const isSupabaseActive = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-lofi-border/60 bg-lofi-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-lg shadow-purple-600/30">
            <Disc3 className="h-6 w-6 text-white animate-spin-slow" />
            <div className="absolute h-2 w-2 rounded-full bg-white shadow-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
                LO-FI BEAT
              </span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                AI GEN
              </span>
            </div>
            <p className="text-[11px] text-lofi-muted hidden sm:block">
              Playlist Generator & Chill Ambient Studio
            </p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2 bg-lofi-card/80 p-1 rounded-xl border border-lofi-border/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'playlists'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ListMusic className="h-3.5 w-3.5" />
            <span>Playlists ({playlistCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'atmosphere'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Atmosphere</span>
          </button>
        </nav>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenConfig}
            title={isSupabaseActive ? 'Supabase Database Connected' : 'Demo Mode (LocalStorage Active). Click for setup details.'}
            className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
              isSupabaseActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Database className="h-3 w-3" />
            <span>{isSupabaseActive ? 'Supabase Live' : 'Demo Storage'}</span>
          </button>

          <button
            onClick={onExportAll}
            title="Export all playlists as JSON backup"
            className="hidden sm:flex items-center space-x-1 p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-lofi-border/40 text-xs transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onOpenConfig}
            title="System Configuration & API Keys"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-lofi-border/40 text-xs transition-colors"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onOpenCreateManual}
            title="Create Empty Playlist Manually"
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-lofi-border/50 hover:border-purple-500/50 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 shadow-md shadow-purple-600/30 hover:shadow-purple-600/50 transition-all transform active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Generate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
