import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Code, ShieldAlert, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { PROMPT_ARCHITECTURE } from '../data/initialData';

export default function PromptArchitectureModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('coach'); // 'coach' | 'negotiator'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentData = PROMPT_ARCHITECTURE[activeTab];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#080C16] border border-indigo-500/40 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Autonomous LLM Architecture
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Zero Hallucination Schema
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Zenith AI Prompt Architecture & System Governance
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

        {/* Navigation Tabs */}
        <div className="mt-4 flex border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('coach')}
            className={`pb-3 px-4 font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'coach'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Coach (Rescue My Day)</span>
          </button>
          <button
            onClick={() => setActiveTab('negotiator')}
            className={`pb-3 px-4 font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'negotiator'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>AI Negotiator (App Limiter)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-5 space-y-5">
          {/* Section: System Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Production System Prompt & Role Definition</span>
              </span>
              <button
                onClick={() => handleCopy(currentData.systemPrompt)}
                className="px-2.5 py-1 rounded-md text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-200/90 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {currentData.systemPrompt}
            </pre>
          </div>

          {/* Section: Evaluation Rules */}
          <div>
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 mb-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Neuro-Behavioral Guardrails & Decision Rules</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentData.evaluationRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2"
                >
                  <span className="font-mono text-indigo-400 font-bold">{idx + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Why Structured JSON Matters */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Reliability & Production Integration</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Zenith uses strict JSON schema validation and zero-shot temperature controls (0.2) to eliminate hallucinations.
              Even in full offline environments or when API rate limits occur, the internal deterministic neuro-cognitive ruleset guarantees 100% uptime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
