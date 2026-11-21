import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  Loader2,
  KeyRound
} from 'lucide-react';
import { evaluateAppNegotiation } from '../utils/aiService';

export default function AINegotiatorModal({
  isOpen,
  onClose,
  app,
  zenithScore,
  pendingGoalsCount,
  apiKey,
  onGrantExtension
}) {
  const [reason, setReason] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('reason'); // 'reason' | 'focus-check'
  
  // Cognitive Focus Challenge State
  const [focusWord, setFocusWord] = useState('I choose intentional focus over habitual scrolling');
  const [userTypedWord, setUserTypedWord] = useState('');

  if (!isOpen || !app) return null;

  const handleNegotiate = async (e) => {
    if (e) e.preventDefault();
    if (!reason.trim()) return;

    setIsEvaluating(true);
    try {
      const evaluation = await evaluateAppNegotiation({
        app,
        reason,
        zenithScore,
        pendingGoalsCount,
        apiKey
      });
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFocusCheckSubmit = async () => {
    if (userTypedWord.trim().toLowerCase() !== focusWord.toLowerCase()) {
      alert('Text does not match. Re-read and type intentionally.');
      return;
    }
    
    // Auto-approve with conscious reflection credit
    setIsEvaluating(true);
    await new Promise(r => setTimeout(r, 600));
    setResult({
      decision: 'APPROVED',
      grantedMinutes: 10,
      title: 'Mindfulness Gate Cleared',
      verdictReasoning: 'You passed the intentional reflection challenge. Your prefrontal cortex has overridden the automatic habit loop.',
      alternativeAction: 'Maintain strict single-task discipline during these 10 minutes.',
      coachingNudge: 'When this 10-minute block expires, physically stand up before doing anything else.'
    });
    setIsEvaluating(false);
  };

  const handleApplyVerdict = () => {
    if (result && (result.decision === 'APPROVED' || result.decision === 'CONDITIONAL')) {
      onGrantExtension(app.id, result.grantedMinutes || 10);
    }
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setResult(null);
    setUserTypedWord('');
    setActiveTab('reason');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B1120] border border-rose-500/40 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Glowing backdrop warning */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 rounded-full blur-3xl opacity-20 bg-rose-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Lock className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                  Daily Limit Reached
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {app.dailyLimitMinutes}m Exhausted
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                AI Vault Negotiator: {app.name}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Result View */}
        {result ? (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 ${
                result.decision === 'APPROVED' || result.decision === 'CONDITIONAL'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {result.decision === 'APPROVED' || result.decision === 'CONDITIONAL' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-white text-sm">
                    {result.title}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                    result.decision === 'APPROVED' || result.decision === 'CONDITIONAL'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {result.decision}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.verdictReasoning}
                </p>
              </div>
            </div>

            {/* AI Coaching Nudge */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Neuro-Behavioral Guidance</span>
              </div>
              <p className="text-xs text-slate-300">
                {result.coachingNudge}
              </p>
              {result.alternativeAction && (
                <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Alternative suggestion: {result.alternativeAction}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
              {result.decision === 'APPROVED' || result.decision === 'CONDITIONAL' ? (
                <button
                  onClick={handleApplyVerdict}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
                >
                  <span>Accept +10 Mins & Unlock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  Close & Respect Boundary
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Negotiation Input View */
          <div className="mt-5 space-y-4">
            {/* Context Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Current Balance Score</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{zenithScore}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Pending Goals Remaining</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{pendingGoalsCount} goals</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('reason')}
                className={`pb-2 px-3 font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'reason'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Provide Stated Purpose</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('focus-check')}
                className={`pb-2 px-3 font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'focus-check'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Mindful Reflex Challenge</span>
              </button>
            </div>

            {activeTab === 'reason' ? (
              <form onSubmit={handleNegotiate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Why do you need an emergency +10 minutes for {app.name}?
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    The AI Guardian evaluates urgency, work context, and your current life balance score before deciding.
                  </p>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. I need to message a project teammate regarding a code review deadline..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>{apiKey ? 'Powered by Gemini AI' : 'Powered by Cognitive Heuristic AI'}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Give Up & Step Away
                    </button>
                    <button
                      type="submit"
                      disabled={isEvaluating || !reason.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center space-x-1.5"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Negotiation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dopamine loops trigger unconscious phone tapping. Type the mindfulness affirmation below to verify deliberate intent:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 select-none">
                  "{focusWord}"
                </div>
                <input
                  type="text"
                  placeholder="Type the exact phrase here..."
                  value={userTypedWord}
                  onChange={(e) => setUserTypedWord(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFocusCheckSubmit}
                    disabled={isEvaluating || !userTypedWord.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all"
                  >
                    {isEvaluating ? 'Checking...' : 'Verify Focus & Unlock +10m'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
