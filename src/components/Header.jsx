import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Settings2, RotateCcw, Clock, ShieldCheck, Flame, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Header({
  zenithScore,
  onOpenPromptDrawer,
  onOpenSettings,
  onLoadDemo,
  onResetData
}) {
  const [time, setTime] = useState(new Date());
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-[#C4A484] border-[#C4A484]/40 bg-[#C4A484]/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#05070B]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Left: Brand Identity with Animated Emoji */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#C4A484] via-[#A8825D] to-[#2B1E12] shadow-lg shadow-[#C4A484]/20 ring-1 ring-white/20">
            <span className="text-xl animate-emoji-float select-none">⚖️</span>
            <div className="absolute -inset-0.5 bg-[#C4A484] rounded-xl blur-sm opacity-30 -z-10" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                ZENITH
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C4A484]/20 text-[#F5EFE6] border border-[#C4A484]/40 font-mono">
                24H OS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Cognitive Equilibrium & 24h Autonomous Habit Balancer
            </p>
          </div>
        </div>

        {/* Center: Live Clock */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-[#C4A484]" />
            <span className="font-mono text-white font-semibold">{formatTime(time)}</span>
            <span className="text-slate-500">•</span>
            <span>{formatDate(time)}</span>
          </div>
          <div className="h-3 w-px bg-slate-700/60" />
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-mono">Single Active Tracker</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-[#C4A484]/15 border-[#C4A484]/40 text-[#C4A484] hover:bg-[#C4A484]/25'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Live Zenith Score Pill */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getScoreColor(zenithScore)} transition-all duration-300`}>
            <Flame className="w-4 h-4" />
            <span className="hidden xs:inline">Score:</span>
            <span className="font-mono text-sm font-bold">{zenithScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>

          {/* Load Demo Data Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowDemoMenu(!showDemoMenu);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
              title="Load Pre-configured Demo Scenarios"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C4A484]" />
              <span className="hidden sm:inline">Demo Presets</span>
            </button>

            {showDemoMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDemoMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#090D15] border border-slate-700 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Select Demo Scenario
                  </div>
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onLoadDemo('balanced');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                  >
                    <span>🌟 Balanced High Achiever</span>
                    <span className="text-[10px] text-emerald-400 font-mono">92/100</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playAlert();
                      onLoadDemo('overloaded');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                  >
                    <span>⚠️ Digital Overload Alert</span>
                    <span className="text-[10px] text-red-400 font-mono">34/100</span>
                  </button>
                  <div className="h-px bg-slate-800 my-1" />
                  <button
                    onClick={() => {
                      sound.playClick();
                      onResetData();
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-300 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-red-400" />
                    <span>Reset All to Defaults</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Prompt Architecture Drawer Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPromptDrawer();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C4A484]/15 hover:bg-[#C4A484]/25 text-[#F5EFE6] border border-[#C4A484]/35 transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm"
            title="Inspect AI System Prompts & Schemas"
          >
            <Terminal className="w-3.5 h-3.5 text-[#C4A484]" />
            <span className="hidden md:inline">Prompts</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all active:scale-95"
            title="Configure Gemini API & Preferences"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
