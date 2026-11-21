import React from 'react';
import { Sparkles, Activity, ShieldAlert, Award, TrendingUp, Info } from 'lucide-react';

export default function ZenithScoreCard({ zenithScore, activities }) {
  const study = activities.find(a => a.id === 'study');
  const sleep = activities.find(a => a.id === 'sleep');
  const exercise = activities.find(a => a.id === 'exercise');
  const outdoor = activities.find(a => a.id === 'outdoor');
  const screen = activities.find(a => a.id === 'screen');

  // Determine state labels and styling
  const getStatus = (score) => {
    if (score >= 85) {
      return {
        label: 'Zenith Equilibrium (Optimal)',
        desc: 'Exceptional neuro-chemical balance. Vital sleep, focused deep work, and natural movement are harmonized.',
        color: 'from-emerald-500 to-teal-400',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        emoji: '🌟',
        icon: Award
      };
    }
    if (score >= 65) {
      return {
        label: 'Healthy Alignment',
        desc: 'Productive and balanced rhythm. A short outdoor walk or water break will elevate you into optimal flow.',
        color: 'from-[#C4A484] to-[#F5EFE6]',
        badge: 'bg-[#C4A484]/15 text-[#F5EFE6] border-[#C4A484]/30',
        emoji: '🌿',
        icon: TrendingUp
      };
    }
    if (score >= 45) {
      return {
        label: 'Elevated Screen Strain',
        desc: 'Passive digital consumption is outpacing physical movement. Complete a focus sprint or step outside.',
        color: 'from-amber-500 to-orange-400',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        emoji: '⚡',
        icon: Activity
      };
    }
    return {
      label: 'Digital Overload & Dopamine Fatigue',
      desc: 'Screen exposure significantly exceeds physical & sleep recovery thresholds. Use "AI Rescue My Day" below.',
      color: 'from-red-500 to-rose-600',
      badge: 'bg-red-500/15 text-red-300 border-red-500/30',
      emoji: '⚠️',
      icon: ShieldAlert
    };
  };

  const status = getStatus(zenithScore);
  const StatusIcon = status.icon;

  const screenExcess = screen && screen.currentMinutes > screen.targetMinutes 
    ? screen.currentMinutes - screen.targetMinutes 
    : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-6 shadow-xl border border-slate-800">
      {/* Background ambient glow */}
      <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full blur-3xl opacity-15 bg-gradient-to-br ${status.color} pointer-events-none`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Radial Score Indicator */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="relative flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-900"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * zenithScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-1000 ease-out ${
                  zenithScore >= 80 
                    ? 'text-emerald-400' 
                    : zenithScore >= 60 
                    ? 'text-[#C4A484]' 
                    : zenithScore >= 40 
                    ? 'text-amber-400' 
                    : 'text-red-400'
                }`}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white font-mono">
                {zenithScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                Out of 100
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.badge}`}>
              <span className="text-sm animate-emoji-bounce">{status.emoji}</span>
              <span>{status.label}</span>
            </span>
          </div>
        </div>

        {/* Right: Live Diagnostics & Factor Breakdown */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg animate-emoji-float">⚖️</span>
                <h3 className="text-base font-bold text-white">
                  Zenith Live Life-Balance Index
                </h3>
              </div>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Calculated continuously</span>
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {status.desc}
            </p>
          </div>

          {/* Quick Pillar Breakdown Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Deep Work */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <span>📚</span>
                  <span>Deep Work</span>
                </span>
                <span className="font-mono text-blue-400 font-medium">
                  {Math.round((study?.currentMinutes || 0) / 60 * 10) / 10}h
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((study?.currentMinutes || 0) / (study?.targetMinutes || 180)) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target: {study?.targetMinutes}m
              </span>
            </div>

            {/* Sleep */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <span>🌙</span>
                  <span>Sleep</span>
                </span>
                <span className="font-mono text-[#C4A484] font-medium">
                  {Math.round((sleep?.currentMinutes || 0) / 60 * 10) / 10}h
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C4A484] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((sleep?.currentMinutes || 0) / (sleep?.targetMinutes || 480)) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target: {sleep?.targetMinutes}m
              </span>
            </div>

            {/* Movement */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Movement</span>
                </span>
                <span className="font-mono text-emerald-400 font-medium">
                  {(exercise?.currentMinutes || 0) + (outdoor?.currentMinutes || 0)}m
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (((exercise?.currentMinutes || 0) + (outdoor?.currentMinutes || 0)) / 120) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Ex + Outdoor
              </span>
            </div>

            {/* Screen Exposure */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <span>💻</span>
                  <span>Screen Load</span>
                </span>
                <span className={`font-mono font-medium ${screenExcess > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                  {Math.round((screen?.currentMinutes || 0) / 60 * 10) / 10}h
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${screenExcess > 0 ? 'bg-red-500' : 'bg-slate-400'}`}
                  style={{ width: `${Math.min(100, ((screen?.currentMinutes || 0) / (screen?.targetMinutes || 180)) * 100)}%` }}
                />
              </div>
              <span className={`text-[10px] mt-1 block font-mono ${screenExcess > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                {screenExcess > 0 ? `+${screenExcess}m over target` : 'Within safe limit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
