-- ==============================================================================
-- LO-FI BEAT PLAYLIST GENERATOR - SUPABASE SCHEMA
-- ==============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor -> Run
-- This creates the 'playlists' table, enables Row Level Security (RLS),
-- and sets up public access policies for the workshop demo.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.playlists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    mood TEXT NOT NULL,
    gradient JSONB DEFAULT '{"from": "#1e1b4b", "to": "#0284c7"}'::jsonb,
    tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]'::jsonb,
    ai_generated BOOLEAN DEFAULT false,
    vibe_prompt TEXT,
    tempo TEXT DEFAULT 'mellow',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Demo policies (read/write for public workshop users)
CREATE POLICY "Allow public read access"
ON public.playlists
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access"
ON public.playlists
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access"
ON public.playlists
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access"
ON public.playlists
FOR DELETE
TO public
USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON public.playlists (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_mood ON public.playlists (mood);
CREATE INDEX IF NOT EXISTS idx_playlists_is_favorite ON public.playlists (is_favorite);
