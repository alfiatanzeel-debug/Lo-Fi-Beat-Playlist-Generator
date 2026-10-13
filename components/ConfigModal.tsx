'use client';

import React from 'react';
import { 
  X, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Code2, 
  Copy, 
  Check 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemoData: () => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  onResetDemoData,
  onNotify,
}) => {
  const [copied, setCopied] = React.useState(false);
  const isSupabaseActive = isSupabaseConfigured();

  if (!isOpen) return null;

  const envSample = `# .env.local Configuration
# 1. Google Gemini AI Key (Get free key at: https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# 2. Supabase Cloud Database (Get at: https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    onNotify('Copied .env.local template to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/40 bg-lofi-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-black text-white mb-2">
          System & Workshop Configuration
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Check connection status and integrate your own Supabase database & Google Gemini API.
        </p>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${isSupabaseActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Database Status</h3>
                  <p className="text-[11px] text-slate-400">
                    {isSupabaseActive ? 'Connected to Supabase' : 'Offline / Local Demo Storage'}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isSupabaseActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-300'
                }`}>
                  {isSupabaseActive ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  <span>{isSupabaseActive ? 'Supabase Active' : 'Fallback Demo Mode Active'}</span>
                </span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Google Gemini AI</h3>
                  <p className="text-[11px] text-slate-400">
                    Server API Route (/api/generate)
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-pink-400" />
                  <span>Dual Mode (Live AI & Smart Fallback)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How to Connect Live API Keys (.env.local)
                </h4>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-[11px] text-purple-300 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
              {envSample}
            </pre>
            <p className="text-[11px] text-slate-400">
              Create a file named <code className="text-pink-300">.env.local</code> in the project root and paste your keys. No restart needed for server API routes!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (confirm('Reset your library back to the 6 default demo playlists?')) {
                  onResetDemoData();
                  onClose();
                }
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
