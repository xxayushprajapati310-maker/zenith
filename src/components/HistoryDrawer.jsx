import React from 'react';
import { X, Calendar, RotateCcw, Clock, Award, CheckCircle2, Download, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function HistoryDrawer({
  isOpen,
  onClose,
  archives,
  onSimulateMidnightRollover
}) {
  if (!isOpen) return null;

  const handleSimulate = () => {
    sound.playSuccess();
    onSimulateMidnightRollover();
  };

  const handleExportHistory = () => {
    const blob = new Blob([JSON.stringify(archives, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenith-activity-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (score >= 60) return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
    if (score >= 40) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-red-400 bg-red-500/15 border-red-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080C14] border border-[#C4A484]/40 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full blur-3xl opacity-15 bg-[#C4A484] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#C4A484]/20 text-[#C4A484] border border-[#C4A484]/30">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C4A484] font-mono">
                  Autonomous Daily Vault
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  12:00 AM Auto-Archiving
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Previous Days Activity Archives
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Simulate 12AM & Export */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
              <span>Midnight (12:00 AM) Rollover Engine</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every day at 12:00 AM, Zenith automatically saves today's activity log here and starts a clean daily timer.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
            <button
              onClick={handleSimulate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C4A484] hover:bg-[#b5926f] text-black shadow-md shadow-[#C4A484]/25 transition-all flex items-center space-x-1.5 active:scale-95"
              title="Test the 12:00 AM midnight archive and reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Midnight (12 AM)</span>
            </button>
            <button
              onClick={handleExportHistory}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
              title="Export Archive JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Archives List */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Archived Days History ({archives.length} records)</span>
            <span>Chronological Order</span>
          </div>

          {archives.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
              No historical archives yet. Click "Simulate Midnight (12 AM)" above or wait for 12:00 AM rollover!
            </div>
          ) : (
            archives.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Archive Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-mono text-[#C4A484]">
                      📅
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{item.date}</span>
                        {item.dayName && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {item.dayName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {Math.floor((item.totalLoggedMinutes || 0) / 60)}h {(item.totalLoggedMinutes || 0) % 60}m total logged
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getScoreBadge(item.zenithScore)} flex items-center space-x-1`}>
                      <Award className="w-3.5 h-3.5" />
                      <span>Score: {item.zenithScore}/100</span>
                    </div>
                    {item.completedGoals !== undefined && (
                      <span className="text-xs font-mono text-slate-400 px-2 py-1 rounded-lg bg-slate-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{item.completedGoals}/{item.totalGoals || 4} Goals</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Activities Breakdown Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {item.activities && item.activities.map((act, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-sm">{act.emoji || '✨'}</span>
                        <span className="truncate text-slate-300 text-[11px]">{act.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#C4A484] ml-1 flex-shrink-0">
                        {act.loggedMinutes || act.currentMinutes || 0}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
}
