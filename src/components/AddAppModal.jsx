import React, { useState } from 'react';
import { X, Shield, Plus, Camera, Video, Gamepad2, Code2, Globe, MessageSquare, Music, Tv } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { name: 'Social Media', icon: 'Camera', defaultLimit: 30 },
  { name: 'Streaming & Video', icon: 'Video', defaultLimit: 45 },
  { name: 'Entertainment & Gaming', icon: 'Gamepad2', defaultLimit: 60 },
  { name: 'Developer Tools', icon: 'Code2', defaultLimit: 180 },
  { name: 'Chat & Messaging', icon: 'MessageSquare', defaultLimit: 45 },
  { name: 'Browsing & News', icon: 'Globe', defaultLimit: 30 },
  { name: 'Audio & Music', icon: 'Music', defaultLimit: 90 },
  { name: 'Streaming Series', icon: 'Tv', defaultLimit: 60 }
];

export default function AddAppModal({ isOpen, onClose, onAddApp }) {
  const [appName, setAppName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].name);
  const [iconName, setIconName] = useState(CATEGORY_OPTIONS[0].icon);
  const [dailyLimit, setDailyLimit] = useState(CATEGORY_OPTIONS[0].defaultLimit);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appName.trim()) return;

    onAddApp({
      id: `app-${Date.now()}`,
      name: appName.trim(),
      category,
      iconName,
      dailyLimitMinutes: parseInt(dailyLimit, 10) || 30,
      usedMinutes: 0,
      isLocked: false,
      isRunning: false,
      activeSeconds: 0
    });

    setAppName('');
    onClose();
  };

  const handleSelectCategory = (cat) => {
    setCategory(cat.name);
    setIconName(cat.icon);
    setDailyLimit(cat.defaultLimit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Custom App to Vault</h3>
              <p className="text-xs text-slate-400">Enforce AI-governed daily time limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              App / Service Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TikTok, Reddit, Netflix, Discord"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category & Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`text-left px-2.5 py-2 rounded-xl text-xs border transition-all flex items-center space-x-2 ${
                    category === cat.name
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Daily Limit (Minutes)
              </label>
              <span className="text-xs font-mono text-indigo-400 font-bold">
                {dailyLimit} mins ({Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="360"
              step="5"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>5m</span>
              <span>60m</span>
              <span>180m</span>
              <span>360m</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Lock & Protect App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
