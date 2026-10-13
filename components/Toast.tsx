'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { AppNotification } from '@/types';

interface ToastProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {notifications.map((n) => {
        const isSuccess = n.type === 'success';
        const isError = n.type === 'error';
        const isWarning = n.type === 'warning';

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-5 fade-in duration-300 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/95 border-purple-500/40 text-purple-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {isError && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
              {isWarning && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="h-4 w-4 text-purple-400 shrink-0" />
              )}
              <span className="text-xs font-medium text-slate-100">{n.message}</span>
            </div>

            <button
              onClick={() => onDismiss(n.id)}
              className="ml-3 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
