import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Camera, 
  Video, 
  Gamepad2, 
  Code2, 
  Globe, 
  MessageSquare, 
  Music, 
  Tv, 
  Play, 
  Pause, 
  Minus, 
  Lock, 
  Unlock, 
  Sparkles, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import AddAppModal from './AddAppModal';

const APP_ICONS = {
  Camera,
  Video,
  Gamepad2,
  Code2,
  Globe,
  MessageSquare,
  Music,
  Tv
};

export default function AppVault({
  apps,
  onAddApp,
  onDeleteApp,
  onToggleAppTimer,
  onSimulateMinusMinutes,
  onOpenNegotiator
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Custom App Vault & AI Time Limiter</span>
          </h2>
          <p className="text-xs text-slate-400">
            Set autonomous daily limits on high-dopamine apps. When limits hit zero, the AI Negotiator engages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Custom App</span>
        </button>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => {
          const IconComponent = APP_ICONS[app.iconName] || Globe;
          const remainingMinutes = Math.max(0, app.dailyLimitMinutes - app.usedMinutes);
          const percentUsed = Math.min(100, Math.round((app.usedMinutes / app.dailyLimitMinutes) * 100));
          const isAtLimit = remainingMinutes === 0 || app.isLocked;

          return (
            <div
              key={app.id}
              className={`relative overflow-hidden rounded-xl border p-4.5 transition-all duration-200 glass-card flex flex-col justify-between ${
                isAtLimit
                  ? 'border-rose-500/40 bg-rose-950/10 shadow-lg shadow-rose-950/20'
                  : app.isRunning
                  ? 'border-indigo-500/50 ring-1 ring-indigo-500/40 bg-slate-900/80'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Main Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2.5 rounded-xl flex items-center justify-center ${
                        isAtLimit
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {app.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {app.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {app.usedMinutes}m / {app.dailyLimitMinutes}m used
                      </span>
                    </div>
                  </div>

                  {/* Status & Delete */}
                  <div className="flex items-center space-x-1.5">
                    {isAtLimit ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    ) : app.isRunning ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Running</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-indigo-400 font-medium">
                        {remainingMinutes}m left
                      </span>
                    )}

                    <button
                      onClick={() => onDeleteApp(app.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1"
                      title="Remove App"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAtLimit ? 'bg-rose-500' : percentUsed > 75 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & Simulation Tools */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {/* Active Session Timer Toggle */}
                {isAtLimit ? (
                  <button
                    onClick={() => onOpenNegotiator(app)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                    <span>Engage AI Negotiator</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleAppTimer(app.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                      app.isRunning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                    }`}
                  >
                    {app.isRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Session</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Usage</span>
                      </>
                    )}
                  </button>
                )}

                {/* Simulation Control (Deducts 5 minutes or adds 5m to used) */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onSimulateMinusMinutes(app.id, 5)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center space-x-1 active:scale-95"
                    title="Simulate 5 minutes of app consumption for quick demoing"
                  >
                    <Minus className="w-3 h-3 text-rose-400" />
                    <span>Simulate -5m</span>
                  </button>

                  {/* Manual Lock/Unlock Trigger for Demo */}
                  {isAtLimit && (
                    <button
                      onClick={() => onOpenNegotiator(app)}
                      className="p-1.5 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                      title="Review negotiation"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add App Modal */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApp={onAddApp}
      />
    </div>
  );
}
