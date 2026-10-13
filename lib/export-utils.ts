import { Playlist } from '@/types';

export function exportPlaylistToCSV(playlist: Playlist): void {
  const headers = ['Track #', 'Title', 'Artist', 'Duration', 'BPM', 'Key', 'Tags'];
  
  const rows = playlist.tracks.map((track, index) => [
    (index + 1).toString(),
    `"${(track.title || '').replace(/"/g, '""')}"`,
    `"${(track.artist || '').replace(/"/g, '""')}"`,
    `"${track.duration || '2:30'}"`,
    track.bpm?.toString() || '75',
    `"${track.key || 'N/A'}"`,
    `"${(track.tags || []).join('; ')}"`,
  ]);

  const csvMeta = [
    `# Playlist: "${playlist.title.replace(/"/g, '""')}"`,
    `# Mood: "${playlist.mood}"`,
    `# Description: "${(playlist.description || '').replace(/"/g, '""')}"`,
    `# Generated with: Lo-Fi Beat Playlist Generator (AI Workshop)`,
    '',
  ];

  const csvContent = [
    ...csvMeta,
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\r\n');

  downloadFile(
    csvContent,
    `${sanitizeFilename(playlist.title)}-playlist.csv`,
    'text/csv;charset=utf-8;'
  );
}

export function exportPlaylistToJSON(playlist: Playlist): void {
  const jsonContent = JSON.stringify(playlist, null, 2);
  downloadFile(
    jsonContent,
    `${sanitizeFilename(playlist.title)}-playlist.json`,
    'application/json;charset=utf-8;'
  );
}

export function exportAllPlaylistsToJSON(playlists: Playlist[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    generator: 'Lo-Fi Beat Playlist Generator',
    version: '1.0.0',
    count: playlists.length,
    playlists,
  };
  const jsonContent = JSON.stringify(payload, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(
    jsonContent,
    `lofi-playlists-backup-${dateStr}.json`,
    'application/json;charset=utf-8;'
  );
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 50);
}
