'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Playlist, Mood } from '@/types';
import { POPULAR_MOODS } from '@/lib/demo-data';

interface CreateManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}

export const CreateManualModal: React.FC<CreateManualModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState<Mood>('Study');
  const [colorFrom, setColorFrom] = useState('#2e1065');
  const [colorTo, setColorTo] = useState('#db2777');
  const [tagsStr, setTagsStr] = useState('Chill, Focus, Lo-Fi');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const now = new Date().toISOString();
    const newPlaylist: Playlist = {
      id: `manual-pl-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A custom lo-fi playlist created manually.',
      mood,
      gradient: {
        from: colorFrom,
        to: colorTo,
        pattern: 'dots',
      },
      tracks: [
        {
          id: `trk-${Date.now()}-1`,
          title: 'First Melodic Step',
          artist: 'Independent Producer',
          duration: '2:35',
          durationSeconds: 155,
          bpm: 75,
          key: 'C Minor',
          tags: ['Lo-Fi', mood],
        },
      ],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      tags,
      aiGenerated: false,
      tempo: 'mellow',
    };

    onCreate(newPlaylist);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-purple-500/40 bg-lofi-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-black text-white mb-1">Create Playlist Manually</h2>
        <p className="text-xs text-slate-400 mb-5">
          Define custom title, mood category, and aesthetic gradient cover.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight Espresso & Tape Warmth"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white bg-slate-900"
            >
              {POPULAR_MOODS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.icon} {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Atmospheric vibe notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Gradient Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colorFrom}
                  onChange={(e) => setColorFrom(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{colorFrom}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                End Gradient Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colorTo}
                  onChange={(e) => setColorTo(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{colorTo}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>Create Playlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
