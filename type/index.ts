export type Mood =
  | 'Study'
  | 'Focus'
  | 'Relax'
  | 'Sleep'
  | 'Rainy Day'
  | 'Chill'
  | 'Coffee Shop'
  | 'Late Night'
  | 'Tokyo Rain'
  | 'Sunset Drive'
  | string;

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string; // e.g. "2:45"
  durationSeconds?: number;
  bpm: number;
  key?: string;
  tags?: string[];
  notes?: string;
}

export interface PlaylistCoverGradient {
  from: string;
  via?: string;
  to: string;
  pattern?: 'dots' | 'grid' | 'stripes' | 'waves';
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  mood: Mood;
  gradient: PlaylistCoverGradient;
  tracks: Track[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  aiGenerated: boolean;
  vibePrompt?: string;
  tempo?: string;
}

export interface FilterState {
  search: string;
  mood: string;
  onlyFavorites: boolean;
  sortBy: 'newest' | 'oldest' | 'tracks-desc' | 'tracks-asc' | 'title-asc';
}

export interface GeneratorParams {
  mood: Mood;
  trackCount: number;
  vibePrompt: string;
  tempo: 'mellow' | 'mid-tempo' | 'upbeat';
  includeRainAmbience?: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentPlaylist: Playlist | null;
  currentTrackIndex: number;
  progressSeconds: number;
  durationSeconds: number;
  volume: number;
  isMuted: boolean;
  ambientSound: 'none' | 'rain' | 'vinyl' | 'coffee';
  ambientVolume: number;
  isLoFiSynthActive: boolean;
}

export interface StatsSummary {
  totalPlaylists: number;
  totalTracks: number;
  favoriteCount: number;
  totalMinutes: number;
  moodDistribution: Record<string, number>;
  topMood: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
