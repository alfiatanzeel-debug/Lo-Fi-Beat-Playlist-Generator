import { NextRequest, NextResponse } from 'next/server';
import { GeneratorParams, Playlist, Track } from '@/types';

const MOOD_THEMES: Record<string, {
  adjectives: string[];
  nouns: string[];
  artists: string[];
  colors: [string, string, string];
  tags: string[];
  bpmRange: [number, number];
}> = {
  'Study': {
    adjectives: ['Library', 'Pencil Sketch', 'Deep Focus', 'Midnight', 'Quiet', 'Chapter', 'Exam Week'],
    nouns: ['Pages', 'High Ceilings', 'Notebook', 'Coffee Mug', 'Reading Desk', 'Dust Motes', 'Clock Ticks'],
    artists: ['StudySession', 'Neon Paper', 'Felt Keys Co.', 'Kanso Beats', 'Akira Chill', 'Late Learner'],
    colors: ['#064e3b', '#065f46', '#0d9488'],
    tags: ['Study', 'Alpha Waves', 'Felt Piano', 'Minimalist'],
    bpmRange: [68, 76],
  },
  'Focus': {
    adjectives: ['Terminal', 'Bitshift', 'Neon Grid', 'Quantum', 'Hyper', 'Deep State', 'Logic'],
    nouns: ['Cursor', 'Syntax Highlighting', 'Async Flow', 'Binary Rain', 'Memory Buffer', 'Dark IDE'],
    artists: ['Echo State', 'Bitshift Dreams', 'Tape Logic', 'Synth Noir', 'Cyber Zen', 'Kanso Beats'],
    colors: ['#2e1065', '#581c87', '#db2777'],
    tags: ['Coding Flow', 'Synth Lofi', 'Sidechain', 'Steady Drum'],
    bpmRange: [78, 86],
  },
  'Rainy Day': {
    adjectives: ['Window', 'Droplets', 'Petrichor', 'Overcast', 'Grey Sky', 'Steaming', 'Puddle'],
    nouns: ['Umbrella', 'Glass Mist', 'Slipping Water', 'Warm Tea', 'Cardigan', 'Quiet Porch', 'Thunder Echo'],
    artists: ['Nostalgic Cloud', 'Aura Dust', 'Rainy Mood Lab', 'Sleepy Cat Collective', 'Mellow Drop'],
    colors: ['#1e1b4b', '#312e81', '#0284c7'],
    tags: ['Rain Ambient', 'Rhodes Keys', 'Downtempo', 'Tape Hiss'],
    bpmRange: [65, 74],
  },
  'Sleep': {
    adjectives: ['Heavy Blanket', 'Dreaming', 'Slumber', 'Velvet', 'Midnight', 'Soft Pillow', 'Whispering'],
    nouns: ['Moonlight', 'Pixel Stars', 'Lullaby', 'Dormant Mind', 'Night Breeze', 'Shadows', 'Lucid Waves'],
    artists: ['Lullaby Soundworks', 'Aura Dust', 'Sleepy Cat Collective', 'Drifting Cloud', 'Hush Records'],
    colors: ['#0f172a', '#1e1b4b', '#3b0764'],
    tags: ['Sleep', 'Sub Bass', 'Tape Warmth', 'Lowpass'],
    bpmRange: [60, 68],
  },
  'Chill': {
    adjectives: ['Sunday', 'Golden Hour', 'Pastel', 'Breeze', 'Rooftop', 'Sunbeam', 'Easy'],
    nouns: ['Skateboard', 'Cassette', 'Polaroid', 'Lemonade', 'Balcony', 'Dusk', 'Bicycle Ride'],
    artists: ['Sunset Tape Co.', 'Kanso Beats', 'Peach Sound', 'Lofi Breeze', 'Analog Honey', 'Wavy Palms'],
    colors: ['#831843', '#be185d', '#f59e0b'],
    tags: ['Chillhop', 'Warm Guitar', 'Smooth Bass', 'Soulful'],
    bpmRange: [72, 80],
  },
  'Coffee Shop': {
    adjectives: ['Espresso', 'Matcha', 'Ceramic', 'Morning', 'Roasted', 'Vintage', 'Artisan'],
    nouns: ['Foam Art', 'Cup Clinks', 'Croissant', 'Apron', 'Corner Booth', 'Steam Wand', 'Bookstore'],
    artists: ['Sipping Tea', 'Bitshift Dreams', 'Caffeine Beat', 'JazzHop Society', 'Barista Grooves'],
    colors: ['#451a03', '#78350f', '#c2410c'],
    tags: ['Cafe Buzz', 'Jazzy Rhodes', 'Upright Bass', 'MPC Grooves'],
    bpmRange: [74, 82],
  },
};

const MUSICAL_KEYS = ['C Major', 'A Minor', 'Eb Major', 'C Minor', 'G Major', 'F Minor', 'Db Major', 'Bb Minor'];

function generateFallbackPlaylist(params: GeneratorParams): Playlist {
  const moodKey = Object.keys(MOOD_THEMES).find(
    (k) => k.toLowerCase() === params.mood.toLowerCase()
  ) || 'Chill';
  const theme = MOOD_THEMES[moodKey] || MOOD_THEMES['Chill'];

  const count = Math.min(Math.max(params.trackCount || 5, 3), 12);
  const tracks: Track[] = [];

  for (let i = 0; i < count; i++) {
    const adj = theme.adjectives[(i * 3 + Math.floor(Math.random() * 3)) % theme.adjectives.length];
    const noun = theme.nouns[(i * 2 + Math.floor(Math.random() * 2)) % theme.nouns.length];
    const artist = theme.artists[i % theme.artists.length];
    const durationMin = 2;
    const durationSec = Math.floor(15 + Math.random() * 40);
    const bpm = Math.floor(
      theme.bpmRange[0] + Math.random() * (theme.bpmRange[1] - theme.bpmRange[0])
    );

    tracks.push({
      id: `gen-trk-${Date.now()}-${i}`,
      title: `${adj} ${noun}`,
      artist: artist,
      duration: `${durationMin}:${durationSec.toString().padStart(2, '0')}`,
      durationSeconds: durationMin * 60 + durationSec,
      bpm,
      key: MUSICAL_KEYS[Math.floor(Math.random() * MUSICAL_KEYS.length)],
      tags: [theme.tags[0], theme.tags[1]],
      notes: `Generated with warm lo-fi texture for ${params.mood}`,
    });
  }

  const promptSnippet = params.vibePrompt ? ` - ${params.vibePrompt.slice(0, 30)}` : '';
  const now = new Date().toISOString();

  return {
    id: `pl-${Date.now()}`,
    title: `${params.mood} Session${promptSnippet ? `: ${params.vibePrompt.slice(0, 25)}` : ' Tape'}`,
    description: params.vibePrompt
      ? `Atmospheric lo-fi playlist inspired by: "${params.vibePrompt}". Curated for optimal ${params.mood.toLowerCase()} mindset.`
      : `Relaxing lo-fi beats curated specifically for ${params.mood.toLowerCase()} mood, featuring tape warmth, mellow keys, and subtle crackle.`,
    mood: params.mood,
    gradient: {
      from: theme.colors[0],
      via: theme.colors[1],
      to: theme.colors[2],
      pattern: 'dots',
    },
    tracks,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    tags: [...theme.tags, params.tempo || 'mellow'],
    aiGenerated: true,
    vibePrompt: params.vibePrompt,
    tempo: params.tempo,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GeneratorParams = await req.json();
    const { mood = 'Study', trackCount = 5, vibePrompt = '', tempo = 'mellow' } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      const playlist = generateFallbackPlaylist({ mood, trackCount, vibePrompt, tempo });
      return NextResponse.json({
        playlist,
        source: 'smart_fallback',
        message: 'Generated via built-in Lo-Fi Generator. Provide GEMINI_API_KEY in .env.local for live Gemini AI generation.',
      });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are an expert Lo-Fi hip-hop producer and musical curator.
Generate an aesthetic, cozy, and inspiring lo-fi beat playlist based on the user's requested mood, prompt, and tempo.
Return ONLY a valid JSON object with no markdown wrappers or other commentary.
Schema:
{
  "title": "string (evocative, aesthetic lo-fi title)",
  "description": "string (1-2 sentences capturing the atmospheric vibe)",
  "mood": "${mood}",
  "gradient": {
    "from": "#hex color matching mood",
    "via": "#hex color",
    "to": "#hex color"
  },
  "tags": ["3 to 5 mood tags like Rhodes, Rain, Vinyl, Downtempo"],
  "tracks": [
    {
      "title": "string (song title, aesthetic lo-fi naming style)",
      "artist": "string (fictional or aesthetic indie lo-fi artist name)",
      "duration": "MM:SS (e.g. 2:42)",
      "bpm": number (typically 65-88),
      "key": "string (e.g. Eb Minor, C Major)",
      "tags": ["2 vibe tags"]
    }
  ]
}`;

    const userPrompt = `Generate a lo-fi playlist with:
- Mood: ${mood}
- Target Track Count: ${trackCount}
- Extra Vibe Prompt: ${vibePrompt || 'Cozy late night atmospheric vibes'}
- Tempo Preference: ${tempo}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const playlist = generateFallbackPlaylist({ mood, trackCount, vibePrompt, tempo });
      return NextResponse.json({
        playlist,
        source: 'fallback_on_api_error',
        message: `Gemini returned ${response.status}. Served smart fallback.`,
      });
    }

    const geminiData = await response.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Empty response from Gemini');
    }

    let parsed: any;
    try {
      const cleaned = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const playlist = generateFallbackPlaylist({ mood, trackCount, vibePrompt, tempo });
      return NextResponse.json({ playlist, source: 'fallback_parse_error' });
    }

    const now = new Date().toISOString();
    const formattedTracks: Track[] = (parsed.tracks || []).map((t: any, idx: number) => {
      const parts = (t.duration || '2:30').split(':');
      const min = parseInt(parts[0], 10) || 2;
      const sec = parseInt(parts[1], 10) || 30;
      return {
        id: `ai-trk-${Date.now()}-${idx}`,
        title: t.title || `Track ${idx + 1}`,
        artist: t.artist || 'Lo-Fi Chill Collective',
        duration: t.duration || '2:30',
        durationSeconds: min * 60 + sec,
        bpm: Number(t.bpm) || 75,
        key: t.key || 'C Minor',
        tags: Array.isArray(t.tags) ? t.tags : ['Lo-Fi', mood],
      };
    });

    const playlist: Playlist = {
      id: `ai-pl-${Date.now()}`,
      title: parsed.title || `${mood} Melodies`,
      description: parsed.description || `A curated collection of ${mood.toLowerCase()} lo-fi beats.`,
      mood: parsed.mood || mood,
      gradient: parsed.gradient || { from: '#1e1b4b', via: '#312e81', to: '#0284c7' },
      tracks: formattedTracks,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [mood, 'Gemini AI', tempo],
      aiGenerated: true,
      vibePrompt,
      tempo,
    };

    return NextResponse.json({
      playlist,
      source: 'gemini_ai',
      message: 'Successfully generated using Google Gemini AI!',
    });
  } catch (error: any) {
    const body: GeneratorParams = { mood: 'Chill', trackCount: 5, vibePrompt: '', tempo: 'mellow' };
    const playlist = generateFallbackPlaylist(body);
    return NextResponse.json({
      playlist,
      source: 'catch_fallback',
      error: error?.message || 'Server error',
    });
  }
}
