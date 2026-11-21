import React, { useState } from 'react';
import { X, Plus, Clock, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const PRESET_EMOJIS = [
  { emoji: '📚', anim: 'animate-emoji-wiggle', label: 'Study' },
  { emoji: '⚡', anim: 'animate-emoji-bounce', label: 'Energy' },
  { emoji: '🌙', anim: 'animate-emoji-float', label: 'Sleep' },
  { emoji: '🌿', anim: 'animate-emoji-float', label: 'Nature' },
  { emoji: '🎲', anim: 'animate-emoji-bounce', label: 'Games' },
  { emoji: '💻', anim: 'animate-emoji-pulse', label: 'Tech' },
  { emoji: '🧘', anim: 'animate-emoji-float', label: 'Mindful' },
  { emoji: '🎨', anim: 'animate-emoji-wiggle', label: 'Art' },
  { emoji: '🎵', anim: 'animate-emoji-bounce', label: 'Music' },
  { emoji: '🏊', anim: 'animate-emoji-float', label: 'Swim' },
  { emoji: '🏃', anim: 'animate-emoji-bounce', label: 'Run' },
  { emoji: '☕', anim: 'animate-emoji-pulse', label: 'Break' }
];

const PRESET_COLORS = [
  { name: 'Pale Brown', hex: '#C4A484' },
  { name: 'Warm Cream', hex: '#F5EFE6' },
  { name: 'RGB Emerald', hex: '#10B981' },
  { name: 'RGB Blue', hex: '#3B82F6' },
  { name: 'RGB Amber', hex: '#F59E0B' },
  { name: 'RGB Crimson', hex: '#EF4444' }
];

export default function AddActivityModal({
  isOpen,
  onClose,
  onAddActivity,
  currentAllocatedMinutes
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('positive');
  const [selectedEmoji, setSelectedEmoji] = useState(PRESET_EMOJIS[0]);
  const [color, setColor] = useState(PRESET_COLORS[0].hex);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const MAX_DAY_MINUTES = 1440; // 24 Hours
  const remainingBudgetMinutes = Math.max(0, MAX_DAY_MINUTES - currentAllocatedMinutes);

  // Auto-sync target minutes when time interval changes
  const handleTimeChange = (newStart, newEnd) => {
    setStartTime(newStart);
    setEndTime(newEnd);

    if (newStart && newEnd) {
      const [sh, sm] = newStart.split(':').map(Number);
      const [eh, em] = newEnd.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff <= 0) diff += 1440; // overnight wrap
      setTargetMinutes(diff);
      setErrorMsg('');
    }
  };

  const formatIntervalString = (start, end) => {
    const formatTimePart = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH < 10 ? '0' + displayH : displayH}:${m < 10 ? '0' + m : m} ${period}`;
    };
    return `${formatTimePart(start)} - ${formatTimePart(end)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedTarget = parseInt(targetMinutes, 10);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setErrorMsg('Target minutes must be a positive number.');
      sound.playAlert();
      return;
    }

    // 24-HOUR DAILY RESTRICTION
    if (currentAllocatedMinutes + parsedTarget > MAX_DAY_MINUTES) {
      const excess = (currentAllocatedMinutes + parsedTarget) - MAX_DAY_MINUTES;
      setErrorMsg(`24-Hour Limit Exceeded: Daily total cannot exceed 1,440m (24h). You only have ${remainingBudgetMinutes}m left in your daily budget (over by ${excess}m).`);
      sound.playAlert();
      return;
    }

    onAddActivity({
      id: `act-${Date.now()}`,
      name: name.trim(),
      category,
      emoji: selectedEmoji.emoji,
      animationClass: selectedEmoji.anim,
      iconName: 'Sparkles',
      color,
      startTime,
      endTime,
      formattedInterval: formatIntervalString(startTime, endTime),
      currentMinutes: 0,
      targetMinutes: parsedTarget,
      isRunning: false,
      timerSeconds: 0
    });

    sound.playSuccess();
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#090D15] border border-[#C4A484]/40 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#C4A484] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C4A484]/20 border border-[#C4A484]/40 flex items-center justify-center text-xl">
              <span className={selectedEmoji.anim}>{selectedEmoji.emoji}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Life Activity</h3>
              <p className="text-xs text-slate-400">Allot time interval within your 24h budget</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 24-Hour Budget Indicator */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">24-Hour Day Budget Remaining:</span>
            <span className="ml-2 font-mono font-bold text-[#C4A484]">
              {Math.floor(remainingBudgetMinutes / 60)}h {remainingBudgetMinutes % 60}m unallocated
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
            {currentAllocatedMinutes}m / 1440m used
          </span>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Activity Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reading Philosophy, Meditation, Evening Coding"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C4A484]"
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Animated Emoji
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_EMOJIS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(item);
                    sound.playClick();
                  }}
                  className={`p-2 rounded-xl text-lg flex items-center justify-center transition-all ${
                    selectedEmoji.emoji === item.emoji
                      ? 'bg-[#C4A484]/30 border-2 border-[#C4A484] shadow-md shadow-[#C4A484]/20 scale-105'
                      : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={item.anim}>{item.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Highlight Color Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => {
                    setColor(col.hex);
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all flex items-center space-x-2 ${
                    color === col.hex
                      ? 'border-white font-bold text-white bg-slate-800'
                      : 'border-slate-800 text-slate-400 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.hex }} />
                  <span className="truncate">{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Interval Allotment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scheduled Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange(e.target.value, endTime)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-[#C4A484]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scheduled End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange(startTime, e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-[#C4A484]"
              />
            </div>
          </div>

          {/* Target Minutes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Allotted Target Duration
              </label>
              <span className="text-xs font-mono font-bold text-[#C4A484]">
                {targetMinutes} mins ({Math.floor(targetMinutes / 60)}h {targetMinutes % 60}m)
              </span>
            </div>
            <input
              type="number"
              min="5"
              max={remainingBudgetMinutes > 0 ? remainingBudgetMinutes : 1440}
              value={targetMinutes}
              onChange={(e) => {
                setTargetMinutes(parseInt(e.target.value, 10) || 0);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-[#C4A484]"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C4A484] hover:bg-[#b5926f] text-black shadow-lg shadow-[#C4A484]/30 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Allot & Add Activity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
