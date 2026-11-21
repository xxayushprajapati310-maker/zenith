import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  Target, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import RescueDayModal from './RescueDayModal';

export default function GoalsSection({
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
  activities,
  zenithScore,
  apiKey
}) {
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('High');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [tag, setTag] = useState('Deep Work');

  const completedCount = goals.filter(g => g.completed).length;
  const totalMinutesRemaining = goals
    .filter(g => !g.completed)
    .reduce((acc, g) => acc + (g.estimatedMinutes || 0), 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      title: title.trim(),
      priority,
      estimatedMinutes: parseInt(estimatedMinutes, 10) || 30,
      completed: false,
      tag
    });

    setTitle('');
    setShowAddForm(false);
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Low':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Rescue Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Daily High-Impact Goals</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {completedCount}/{goals.length} completed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritize key outcomes. Use AI Rescue to dynamically re-sequence if your day gets off-track.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Rescue My Day Button */}
          <button
            onClick={() => setIsRescueModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 active:scale-95 border border-indigo-400/30"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Rescue My Day</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Add Goal Collapsible Card */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-indigo-300">New High-Impact Goal</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                required
                placeholder="What is the single outcome to achieve?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                placeholder="Est. Mins"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
              >
                Save Goal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Goal Items List */}
      <div className="space-y-2.5">
        {goals.map((goal) => {
          return (
            <div
              key={goal.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 glass-card flex items-center justify-between gap-3 ${
                goal.completed
                  ? 'border-slate-800/60 bg-slate-950/40 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => onToggleGoal(goal.id)}
                  className="flex-shrink-0 text-slate-500 hover:text-indigo-400 transition-colors"
                  title={goal.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium tracking-tight truncate ${
                      goal.completed ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}
                  >
                    {goal.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{goal.estimatedMinutes}m est</span>
                    </span>
                    {goal.tag && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">{goal.tag}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${getPriorityStyle(goal.priority)}`}>
                  {goal.priority}
                </span>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
            No goals scheduled today. Click "+ Add Goal" above to define your targets.
          </div>
        )}
      </div>

      {/* Rescue Modal */}
      <RescueDayModal
        isOpen={isRescueModalOpen}
        onClose={() => setIsRescueModalOpen(false)}
        activities={activities}
        goals={goals}
        zenithScore={zenithScore}
        apiKey={apiKey}
      />
    </div>
  );
}
