import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Playlist } from '@/types';
import { INITIAL_DEMO_PLAYLISTS } from './demo-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl !== 'https://your-project.supabase.co'
  );
};

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return supabaseClient;
};

const LOCAL_STORAGE_KEY = 'lofi_playlists_db_v1';

export async function fetchAllPlaylists(): Promise<Playlist[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, fallback to local:', error.message);
      } else if (data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          mood: item.mood,
          gradient: item.gradient || { from: '#1e1b4b', to: '#0284c7' },
          tracks: item.tracks || [],
          isFavorite: Boolean(item.is_favorite),
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          tags: item.tags || [],
          aiGenerated: Boolean(item.ai_generated),
          vibePrompt: item.vibe_prompt,
          tempo: item.tempo,
        }));
      }
    } catch (err) {
      console.warn('Failed to query Supabase, fallback to localStorage', err);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing localStorage playlists', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PLAYLISTS));
  }

  return INITIAL_DEMO_PLAYLISTS;
}

export async function createPlaylist(playlist: Playlist): Promise<Playlist> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('playlists')
        .insert({
          id: playlist.id,
          title: playlist.title,
          description: playlist.description,
          mood: playlist.mood,
          gradient: playlist.gradient,
          tracks: playlist.tracks,
          is_favorite: playlist.isFavorite,
          tags: playlist.tags,
          ai_generated: playlist.aiGenerated,
          vibe_prompt: playlist.vibePrompt,
          tempo: playlist.tempo,
          created_at: playlist.createdAt,
          updated_at: playlist.updatedAt,
        })
        .select()
        .single();

      if (!error && data) {
        syncLocalAdd(playlist);
        return playlist;
      }
    } catch (err) {
      console.warn('Supabase insert error, saving locally:', err);
    }
  }

  syncLocalAdd(playlist);
  return playlist;
}

export async function updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | null> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.mood !== undefined) dbUpdates.mood = updates.mood;
      if (updates.gradient !== undefined) dbUpdates.gradient = updates.gradient;
      if (updates.tracks !== undefined) dbUpdates.tracks = updates.tracks;
      if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      await client
        .from('playlists')
        .update(dbUpdates)
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  return syncLocalUpdate(id, updates);
}

export async function deletePlaylist(id: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (client) {
    try {
      await client.from('playlists').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  syncLocalDelete(id);
  return true;
}

export function resetLocalStorageToDemo(): Playlist[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PLAYLISTS));
  }
  return INITIAL_DEMO_PLAYLISTS;
}

function syncLocalAdd(playlist: Playlist) {
  if (typeof window === 'undefined') return;
  const current = getLocalPlaylists();
  const next = [playlist, ...current.filter((p) => p.id !== playlist.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
}

function syncLocalUpdate(id: string, updates: Partial<Playlist>): Playlist | null {
  if (typeof window === 'undefined') return null;
  const current = getLocalPlaylists();
  let updatedPlaylist: Playlist | null = null;
  const next = current.map((p) => {
    if (p.id === id) {
      updatedPlaylist = {
        ...p,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedPlaylist;
    }
    return p;
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  return updatedPlaylist;
}

function syncLocalDelete(id: string) {
  if (typeof window === 'undefined') return;
  const current = getLocalPlaylists();
  const next = current.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
}

function getLocalPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_PLAYLISTS;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return INITIAL_DEMO_PLAYLISTS;
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_PLAYLISTS;
  }
}
