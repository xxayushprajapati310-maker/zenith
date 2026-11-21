import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Edit3, 
  RotateCcw, 
  Clock, 
  Timer, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import AddActivityModal from './AddActivityModal';
import EditActivityModal from './EditActivityModal';
import { sound } from '../utils/soundEffects';

export default function ActivityTracker({
  activities,
  onToggleTimer,
  onAddMinutes,
  onUpdateTarget,
  onResetActivity,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivitySequence,
  onSortActivitiesChronologically
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Total allocated target minutes across all activities
  const totalAllocatedMinutes = activities.reduce((sum, act) => sum + (act.targetMinutes || 0), 0);
  const MAX_DAY_MINUTES = 1440; // 24 Hours
  const remainingBudgetMinutes = Math.max(0, MAX_DAY_MINUTES - totalAllocatedMinutes);
  const budgetUsagePercent = Math.min(100, Math.round((totalAllocatedMinutes / MAX_DAY_MINUTES) * 100));

  const formatHoursMinutes = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Check if current system time is within the activity's allotted interval
  const isCurrentlyInSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    if (startMins <= endMins) {
      return currentMins >= startMins && currentMins <= endMins;
    } else {
      // Crosses midnight (e.g. 23:00 to 07:00)
      return currentMins >= startMins || currentMins <= endMins;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Timer className="w-5 h-5 text-[#C4A484]" />
              <span>Life Balance Activity Tracker</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Single Active Mode</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Only 1 activity runs at a time. Allot intervals freely within your strict 24-hour daily budget.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              onSortActivitiesChronologically();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center space-x-1.5 active:scale-95"
            title="Automatically sort sequence by scheduled start time"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C4A484]" />
            <span className="hidden sm:inline">Sort by Schedule</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#C4A484] hover:bg-[#b5926f] text-black shadow-md shadow-[#C4A484]/20 transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Activity</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Day Allocation Budget Bar */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#C4A484]" />
            <span className="font-semibold text-slate-200">24-Hour Day Allocation Limit:</span>
            <span className="font-mono text-white font-bold">
              {formatHoursMinutes(totalAllocatedMinutes)} / 24h 00m
            </span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Remaining Budget:</span>
            <span className={`font-bold ${remainingBudgetMinutes === 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatHoursMinutes(remainingBudgetMinutes)} unallocated
            </span>
          </div>
        </div>

        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalAllocatedMinutes > 1440 
                ? 'bg-red-500' 
                : budgetUsagePercent > 90 
                ? 'bg-amber-400' 
                : 'bg-gradient-to-r from-[#C4A484] via-emerald-400 to-[#F5EFE6]'
            }`}
            style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
          />
        </div>
      </div>

      {/* Ordered Sequence Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity, index) => {
          const inSlot = isCurrentlyInSlot(activity.startTime, activity.endTime);
          const progressPercent = Math.min(100, Math.round((activity.currentMinutes / activity.targetMinutes) * 100));
          const isOver = activity.currentMinutes > activity.targetMinutes;

          return (
            <div
              key={activity.id}
              className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 glass-card flex flex-col justify-between ${
                activity.isRunning 
                  ? 'ring-2 ring-[#C4A484]/70 border-[#C4A484] bg-slate-900/90 shadow-xl shadow-[#C4A484]/15' 
                  : inSlot
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Top Accent Ribbon */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: activity.color || '#C4A484' }}
              />

              {/* Card Header & Controls */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Animated Emoji Badge */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-transform hover:scale-110 shadow-inner"
                      style={{
                        backgroundColor: `${activity.color || '#C4A484'}20`,
                        border: `1px solid ${activity.color || '#C4A484'}40`
                      }}
                    >
                      <span className={activity.animationClass || 'animate-emoji-bounce'}>
                        {activity.emoji || '✨'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          #{index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {activity.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatHoursMinutes(activity.currentMinutes)} logged
                      </span>
                    </div>
                  </div>

                  {/* Move Sequence Buttons */}
                  <div className="flex items-center space-x-0.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onMoveActivitySequence(activity.id, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Move sequence up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onMoveActivitySequence(activity.id, 'down');
                      }}
                      disabled={index === activities.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Move sequence down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setEditingActivity(activity);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-[#C4A484] transition-colors ml-1"
                      title="Edit activity details & alloted interval"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Allotted Time Interval Banner */}
                <div className="mt-3.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#C4A484]" />
                    <button
                      onClick={() => setEditingActivity(activity)}
                      className="hover:underline decoration-dotted text-slate-200"
                      title="Click to edit time interval"
                    >
                      {activity.formattedInterval || 'Allot time slot'}
                    </button>
                  </div>

                  {/* Slot status pill */}
                  {activity.isRunning ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C4A484]/20 text-[#C4A484] border border-[#C4A484]/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A484] animate-ping" />
                      <span>Running Now</span>
                    </span>
                  ) : inSlot ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span>In Slot</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Scheduled
                    </span>
                  )}
                </div>

                {/* Progress Bar & Target Display */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Target: {formatHoursMinutes(activity.targetMinutes)}
                    </span>
                    <span className={isOver && activity.category === 'consumption' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {activity.currentMinutes >= activity.targetMinutes 
                        ? (activity.category === 'consumption' ? '⚠️ Over limit' : '✓ Done') 
                        : `${activity.targetMinutes - activity.currentMinutes}m left`}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: activity.color || '#C4A484'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Single Timer Toggle & Quick Increments */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                {/* Single Timer Run Toggle (Mutual Exclusivity) */}
                <button
                  onClick={() => {
                    if (activity.isRunning) {
                      sound.playTimerPause();
                    } else {
                      sound.playTimerStart();
                    }
                    onToggleTimer(activity.id);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    activity.isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-[#C4A484] hover:bg-[#b5926f] text-black shadow-[#C4A484]/20'
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
                      <span>Start Slot</span>
                    </>
                  )}
                </button>

                {/* Quick Add Increments (+15m, +30m, +1h) */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAddMinutes(activity.id, 15);
                    }}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 15 minutes"
                  >
                    +15m
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAddMinutes(activity.id, 30);
                    }}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 30 minutes"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAddMinutes(activity.id, 60);
                    }}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors active:scale-95"
                    title="Add 1 hour"
                  >
                    +1h
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onResetActivity(activity.id);
                    }}
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

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddActivity={onAddActivity}
        currentAllocatedMinutes={totalAllocatedMinutes}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        activity={editingActivity}
        onUpdateActivity={onUpdateActivity}
        onDeleteActivity={onDeleteActivity}
        currentAllocatedMinutes={totalAllocatedMinutes}
      />
    </div>
  );
}
