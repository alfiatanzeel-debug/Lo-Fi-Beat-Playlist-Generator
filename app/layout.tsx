import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lo-Fi Beat Playlist Generator | AI Music Workshop',
  description: 'Generate personalized chill, study, and sleep lo-fi playlists with Google Gemini AI and Supabase.',
  keywords: ['lo-fi', 'playlist generator', 'gemini ai', 'chillhop', 'study beats', 'ambient sound'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎧</text></svg>" />
      </head>
      <body className="bg-lofi-bg text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
