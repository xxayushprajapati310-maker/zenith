import React, { useState } from 'react';
import { 
  BookOpen, 
  Moon, 
  Flame, 
  Compass, 
  Dice5, 
  Monitor, 
  Play, 
  Pause, 
  Plus, 
  Edit3, 
  Check, 
  Clock, 
  Timer,
  RotateCcw
} from 'lucide-react';

const ICON_MAP = {
  BookOpen,
  Moon,
  Flame,
  Compass,
  Dice5,
  Monitor
};

export default function ActivityTracker({
  activities,
  onToggleTimer,
  onAddMinutes,
  onUpdateTarget,
  onResetActivity
}) {
  const [editingTargetId, setEditingTargetId] = useState(null);
  const [tempTargetValue, setTempTargetValue] = useState('');

  const handleStartEdit = (activity) => {
    setEditingTargetId(activity.id);
    setTempTargetValue(activity.targetMinutes.toString());
  };

  const handleSaveTarget = (id) => {
    const val = parseInt(tempTargetValue, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget(id, val);
    }
    setEditingTargetId(null);
  };

  const formatHoursMinutes = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Timer className="w-5 h-5 text-indigo-400" />
            <span>Life Balance Activity Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track real-world vitality vs digital load with live timers & instant quick-add increments.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Live Timer Sync Active</span>
        </div>
      </div>

      {/* Six Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => {
          const IconComponent = ICON_MAP[activity.iconName] || BookOpen;
          const progressPercent = Math.min(100, Math.round((activity.currentMinutes / activity.targetMinutes) * 100));
          const isOver = activity.currentMinutes > activity.targetMinutes;

          return (
            <div
              key={activity.id}
              className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 glass-card flex flex-col justify-between ${
                activity.isRunning 
                  ? 'ring-2 ring-indigo-500/50 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'hover:border-slate-700'
              }`}
            >
              {/* Top Accent Gradient Ribbon */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: activity.color }}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
                      style={{
                        backgroundColor: `${activity.color}1A`,
                        color: activity.color,
                        border: `1px solid ${activity.color}33`
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {activity.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatHoursMinutes(activity.currentMinutes)} logged
                      </span>
                    </div>
                  </div>

                  {/* Live Status Badge */}
                  {activity.isRunning ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Tracking</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {progressPercent}%
                    </span>
                  )}
                </div>

                {/* Progress Bar & Target Display */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <span>Daily Target:</span>
                      {editingTargetId === activity.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={tempTargetValue}
                            onChange={(e) => setTempTargetValue(e.target.value)}
                            className="w-14 px-1.5 py-0.5 text-xs bg-slate-900 border border-indigo-500 rounded text-white font-mono"
                            min="10"
                            max="720"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTarget(activity.id);
                              if (e.key === 'Escape') setEditingTargetId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveTarget(activity.id)}
                            className="p-0.5 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(activity)}
                          className="font-mono text-slate-300 hover:text-indigo-400 flex items-center space-x-1 underline decoration-dotted decoration-slate-600 transition-colors"
                          title="Click to edit target minutes"
                        >
                          <span>{formatHoursMinutes(activity.targetMinutes)}</span>
                          <Edit3 className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      )}
                    </div>
                    <span className={`text-[11px] font-mono ${isOver && activity.category === 'consumption' ? 'text-rose-400' : 'text-slate-400'}`}>
                      {activity.currentMinutes >= activity.targetMinutes 
                        ? (activity.category === 'consumption' ? '⚠️ Over limit' : '✓ Target Met') 
                        : `${activity.targetMinutes - activity.currentMinutes}m left`}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: activity.color
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Live Timer Toggle & Quick Add Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                {/* Live Play / Pause Button */}
                <button
                  onClick={() => onToggleTimer(activity.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                    activity.isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {activity.isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                {/* Quick Add Increments (+15m, +30m, +1h) */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onAddMinutes(activity.id, 15)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 15 minutes"
                  >
                    +15m
                  </button>
                  <button
                    onClick={() => onAddMinutes(activity.id, 30)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 30 minutes"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => onAddMinutes(activity.id, 60)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 1 hour"
                  >
                    +1h
                  </button>
                  <button
                    onClick={() => onResetActivity(activity.id)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Reset today's logged minutes"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
