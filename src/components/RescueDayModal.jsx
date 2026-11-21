import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Lightbulb, 
  RotateCcw,
  Loader2,
  Zap,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { evaluateRescueDay } from '../utils/aiService';

export default function RescueDayModal({
  isOpen,
  onClose,
  activities,
  goals,
  zenithScore,
  apiKey
}) {
  const [loading, setLoading] = useState(true);
  const [rescuePlan, setRescuePlan] = useState(null);

  useEffect(() => {
    if (isOpen) {
      runRescueEvaluation();
    }
  }, [isOpen]);

  const runRescueEvaluation = async () => {
    setLoading(true);
    try {
      const plan = await evaluateRescueDay({
        activities,
        goals,
        zenithScore,
        apiKey
      });
      setRescuePlan(plan);
    } catch (err) {
      console.error('Rescue evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRiskColor = (rating) => {
    switch (rating) {
      case 'Low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Critical':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movement':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'focus':
        return <Flame className="w-4 h-4 text-indigo-400" />;
      case 'recovery':
        return <Sun className="w-4 h-4 text-cyan-400" />;
      case 'winddown':
        return <Moon className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#090E1A] border border-indigo-500/30 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Autonomous Cognitive Coach
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {apiKey ? 'Live Gemini Engine' : 'Cognitive Heuristics Engine'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                AI Rescue My Day — Re-Sequencing Protocol
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

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <Sparkles className="w-4 h-4 text-cyan-400 absolute inset-0 m-auto" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-semibold text-white">Synthesizing Circadian Energy Profile...</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Correlating remaining high-priority goals with screen fatigue and movement deficit.
              </p>
            </div>
          </div>
        ) : rescuePlan ? (
          <div className="mt-6 space-y-6 animate-in fade-in duration-200">
            {/* Risk Assessment Banner */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Burnout & Focus Risk:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${getRiskColor(rescuePlan.burnoutRiskRating)}`}>
                    {rescuePlan.burnoutRiskRating} Risk ({rescuePlan.riskScorePercent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  {rescuePlan.diagnosticSummary}
                </p>
              </div>

              <button
                onClick={runRescueEvaluation}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-1 flex-shrink-0 self-end sm:self-auto"
                title="Re-run calculation"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-Analyze</span>
              </button>
            </div>

            {/* Revised Schedule Blocks */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Optimal Schedule for Rest of Today</span>
              </div>

              <div className="space-y-2.5">
                {rescuePlan.revisedSchedule.map((block, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 mt-0.5 sm:mt-0 flex-shrink-0">
                        {getTypeIcon(block.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-indigo-300">
                            {block.timeBlock}
                          </span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {block.type}
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-white mt-0.5">
                          {block.action}
                        </h5>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {block.rationale}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neuro-Behavioral Tips */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Targeted Behavioral Interventions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rescuePlan.behavioralTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                        {tip.tag}
                      </span>
                      <h6 className="text-xs font-bold text-white mt-1">
                        {tip.title}
                      </h6>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {tip.insight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
              >
                <span>Adopt Revised Schedule</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
