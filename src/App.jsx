import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ZenithScoreCard from './components/ZenithScoreCard';
import ActivityTracker from './components/ActivityTracker';
import AppVault from './components/AppVault';
import GoalsSection from './components/GoalsSection';
import AINegotiatorModal from './components/AINegotiatorModal';
import PromptArchitectureModal from './components/PromptArchitectureModal';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_APPS, 
  INITIAL_GOALS, 
  INITIAL_HISTORY_ARCHIVES,
  DEMO_PRESET_BALANCED, 
  DEMO_PRESET_OVERLOADED 
} from './data/initialData';
import { calculateZenithScore } from './utils/aiService';
import { sound } from './utils/soundEffects';
import { Calendar, History } from 'lucide-react';

const STORAGE_KEYS = {
  ACTIVITIES: 'zenith_activities_v2',
  APPS: 'zenith_apps_v2',
  GOALS: 'zenith_goals_v2',
  API_KEY: 'zenith_api_key_v2',
  HISTORY: 'zenith_history_v2',
  LAST_DATE: 'zenith_last_active_date_v2'
};

export default function App() {
  const getTodayString = () => new Date().toISOString().slice(0, 10);

  // 1. LocalStorage Initializers
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [apps, setApps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPS);
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    } catch {
      return '';
    }
  });

  const [archives, setArchives] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_HISTORY_ARCHIVES;
    } catch {
      return INITIAL_HISTORY_ARCHIVES;
    }
  });

  // Modal states
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [negotiatingApp, setNegotiatingApp] = useState(null);

  // Reference to hold current state for interval checks
  const activitiesRef = useRef(activities);
  const goalsRef = useRef(goals);
  activitiesRef.current = activities;
  goalsRef.current = goals;

  // 2. Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(archives));
  }, [archives]);

  // Archive today's day and reset for the new 12:00 AM day
  const archiveDayAndReset = (dateToArchive) => {
    const currentScore = calculateZenithScore(activitiesRef.current);
    const completedGoalsCount = goalsRef.current.filter(g => g.completed).length;
    const totalMinutesLogged = activitiesRef.current.reduce((sum, a) => sum + (a.currentMinutes || 0), 0);

    const newArchiveRecord = {
      id: `archive-${Date.now()}`,
      date: dateToArchive || getTodayString(),
      dayName: 'Past Day',
      zenithScore: currentScore,
      totalLoggedMinutes: totalMinutesLogged,
      completedGoals: completedGoalsCount,
      totalGoals: goalsRef.current.length,
      activities: activitiesRef.current.map(a => ({
        name: a.name,
        loggedMinutes: a.currentMinutes,
        targetMinutes: a.targetMinutes,
        emoji: a.emoji || '✨'
      }))
    };

    setArchives(prev => [newArchiveRecord, ...prev]);

    // Reset today's activity logged minutes & timers for a fresh day
    setActivities(prev => prev.map(act => ({
      ...act,
      currentMinutes: 0,
      timerSeconds: 0,
      isRunning: false
    })));

    // Reset daily app usage in vault
    setApps(prev => prev.map(app => ({
      ...app,
      usedMinutes: 0,
      activeSeconds: 0,
      isLocked: false,
      isRunning: false
    })));

    localStorage.setItem(STORAGE_KEYS.LAST_DATE, getTodayString());
  };

  // 3. 12:00 AM Midnight Rollover & 1-Second Timer Engine
  useEffect(() => {
    // Check rollover on initial load
    const storedDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
    const today = getTodayString();
    if (storedDate && storedDate !== today) {
      archiveDayAndReset(storedDate);
    } else if (!storedDate) {
      localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
    }

    const interval = setInterval(() => {
      // Midnight (12:00 AM) auto check
      const currentDay = getTodayString();
      const lastSavedDay = localStorage.getItem(STORAGE_KEYS.LAST_DATE) || currentDay;
      if (lastSavedDay !== currentDay) {
        archiveDayAndReset(lastSavedDay);
      }

      // Ticking ONE running activity timer (Single Active Mode)
      setActivities(prev => {
        let changed = false;
        const updated = prev.map(act => {
          if (act.isRunning) {
            changed = true;
            const newSec = (act.timerSeconds || 0) + 1;
            if (newSec >= 60) {
              return {
                ...act,
                currentMinutes: act.currentMinutes + 1,
                timerSeconds: 0
              };
            }
            return { ...act, timerSeconds: newSec };
          }
          return act;
        });
        return changed ? updated : prev;
      });

      // Ticking running app in Vault
      setApps(prev => {
        let changed = false;
        let newlyLockedApp = null;

        const updated = prev.map(app => {
          if (app.isRunning && !app.isLocked) {
            changed = true;
            const newSec = (app.activeSeconds || 0) + 1;
            if (newSec >= 60) {
              const newUsed = app.usedMinutes + 1;
              const willLock = newUsed >= app.dailyLimitMinutes;
              if (willLock) {
                newlyLockedApp = { ...app, usedMinutes: newUsed, isLocked: true, isRunning: false };
              }
              return {
                ...app,
                usedMinutes: newUsed,
                activeSeconds: 0,
                isRunning: !willLock,
                isLocked: willLock
              };
            }
            return { ...app, activeSeconds: newSec };
          }
          return app;
        });

        if (newlyLockedApp) {
          sound.playAlert();
          setNegotiatingApp(newlyLockedApp);
        }

        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 4. Calculate Live Zenith Score
  const zenithScore = calculateZenithScore(activities);

  // --- Handlers: Activity Tracker (Single Active Exclusivity & 24h Limit) ---
  const handleToggleActivityTimer = (id) => {
    setActivities(prev => {
      const targetAct = prev.find(a => a.id === id);
      const isCurrentlyRunning = targetAct ? targetAct.isRunning : false;

      return prev.map(act => {
        if (act.id === id) {
          return { ...act, isRunning: !isCurrentlyRunning };
        }
        // ONLY ONE ACTIVITY RUNS AT A TIME: Pause all other activities!
        return { ...act, isRunning: false };
      });
    });
  };

  const handleAddActivityMinutes = (id, minutes) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, currentMinutes: Math.max(0, act.currentMinutes + minutes) };
      }
      return act;
    }));
  };

  const handleUpdateActivityTarget = (id, targetMinutes) => {
    // Check 24 hour restriction
    const otherAllocated = activities
      .filter(a => a.id !== id)
      .reduce((sum, a) => sum + (a.targetMinutes || 0), 0);

    if (otherAllocated + targetMinutes > 1440) {
      alert(`Cannot exceed 24-hour limit! Maximum available is ${1440 - otherAllocated} minutes.`);
      sound.playAlert();
      return;
    }

    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, targetMinutes };
      }
      return act;
    }));
  };

  const handleResetActivity = (id) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, currentMinutes: 0, timerSeconds: 0, isRunning: false };
      }
      return act;
    }));
  };

  // Add / Edit / Delete Activity
  const handleAddActivity = (newAct) => {
    setActivities(prev => [...prev, newAct]);
  };

  const handleUpdateActivity = (id, updatedFields) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, ...updatedFields } : act));
  };

  const handleDeleteActivity = (id) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  // Reorder sequence at will (Up / Down)
  const handleMoveActivitySequence = (id, direction) => {
    setActivities(prev => {
      const index = prev.findIndex(a => a.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Sort activities chronologically by scheduled start time
  const handleSortActivitiesChronologically = () => {
    setActivities(prev => {
      const copy = [...prev];
      copy.sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
      return copy;
    });
  };

  // --- Handlers: App Vault ---
  const handleAddApp = (newApp) => {
    sound.playSuccess();
    setApps(prev => [newApp, ...prev]);
  };

  const handleDeleteApp = (id) => {
    sound.playClick();
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAppTimer = (id) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        if (app.isLocked || app.usedMinutes >= app.dailyLimitMinutes) {
          sound.playAlert();
          setNegotiatingApp(app);
          return app;
        }
        if (app.isRunning) {
          sound.playTimerPause();
        } else {
          sound.playTimerStart();
        }
        return { ...app, isRunning: !app.isRunning };
      }
      return app;
    }));
  };

  const handleSimulateMinusMinutes = (id, simulatedMinutes) => {
    sound.playClick();
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        const newUsed = app.usedMinutes + simulatedMinutes;
        const isLocked = newUsed >= app.dailyLimitMinutes;
        const updated = {
          ...app,
          usedMinutes: newUsed,
          isLocked,
          isRunning: isLocked ? false : app.isRunning
        };
        if (isLocked) {
          sound.playAlert();
          setNegotiatingApp(updated);
        }
        return updated;
      }
      return app;
    }));

    // Also increase General Screen Time activity for realism
    setActivities(prev => prev.map(act => {
      if (act.id === 'screen') {
        return { ...act, currentMinutes: act.currentMinutes + simulatedMinutes };
      }
      return act;
    }));
  };

  const handleGrantExtension = (appId, grantedMinutes) => {
    sound.playSuccess();
    setApps(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          dailyLimitMinutes: app.dailyLimitMinutes + grantedMinutes,
          isLocked: false,
          isRunning: false
        };
      }
      return app;
    }));
  };

  // --- Handlers: Daily Goals ---
  const handleToggleGoal = (id) => {
    sound.playClick();
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) sound.playSuccess();
        return { ...g, completed: nextState };
      }
      return g;
    }));
  };

  const handleAddGoal = (newGoal) => {
    sound.playSuccess();
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (id) => {
    sound.playClick();
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // --- Handlers: Presets & Reset ---
  const handleLoadDemo = (presetKey) => {
    const preset = presetKey === 'balanced' ? DEMO_PRESET_BALANCED : DEMO_PRESET_OVERLOADED;

    setActivities(prev => prev.map(act => {
      const match = preset.activities.find(p => p.id === act.id);
      return match ? { ...act, currentMinutes: match.currentMinutes, targetMinutes: match.targetMinutes, isRunning: false } : act;
    }));

    setApps(prev => prev.map(app => {
      const match = preset.apps.find(p => p.id === app.id);
      return match ? { ...app, usedMinutes: match.usedMinutes, isLocked: match.isLocked, isRunning: false } : app;
    }));

    setGoals(prev => prev.map(g => {
      const match = preset.goals.find(p => p.id === g.id);
      return match ? { ...g, completed: match.completed } : g;
    }));
  };

  const handleResetAllData = () => {
    sound.playClick();
    setActivities(INITIAL_ACTIVITIES);
    setApps(INITIAL_APPS);
    setGoals(INITIAL_GOALS);
    setArchives(INITIAL_HISTORY_ARCHIVES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.APPS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.LAST_DATE);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col font-sans selection:bg-[#C4A484] selection:text-black pb-24">
      {/* Top Navigation Bar */}
      <Header
        zenithScore={zenithScore}
        onOpenPromptDrawer={() => setIsPromptDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadDemo={handleLoadDemo}
        onResetData={handleResetAllData}
      />

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full space-y-8 flex-1">
        {/* 1. Live Zenith Balance Score Section */}
        <section aria-label="Zenith Score Card">
          <ZenithScoreCard
            zenithScore={zenithScore}
            activities={activities}
          />
        </section>

        {/* 2. Feature 1: Life Balance Activity Tracker & Single Active Timers */}
        <section aria-label="Activity Tracker">
          <ActivityTracker
            activities={activities}
            onToggleTimer={handleToggleActivityTimer}
            onAddMinutes={handleAddActivityMinutes}
            onUpdateTarget={handleUpdateActivityTarget}
            onResetActivity={handleResetActivity}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onMoveActivitySequence={handleMoveActivitySequence}
            onSortActivitiesChronologically={handleSortActivitiesChronologically}
          />
        </section>

        {/* Two-Column Grid for App Vault and Daily Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Feature 2: Custom App Vault & AI Time Limiter */}
          <section className="lg:col-span-7" aria-label="App Vault">
            <AppVault
              apps={apps}
              onAddApp={handleAddApp}
              onDeleteApp={handleDeleteApp}
              onToggleAppTimer={handleToggleAppTimer}
              onSimulateMinusMinutes={handleSimulateMinusMinutes}
              onOpenNegotiator={(app) => setNegotiatingApp(app)}
            />
          </section>

          {/* Feature 3: Daily Goals & AI Rescue My Day */}
          <section className="lg:col-span-5" aria-label="Daily Goals">
            <GoalsSection
              goals={goals}
              onToggleGoal={handleToggleGoal}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
              activities={activities}
              zenithScore={zenithScore}
              apiKey={apiKey}
            />
          </section>
        </div>
      </main>

      {/* Modals & Drawers */}
      <AINegotiatorModal
        isOpen={!!negotiatingApp}
        onClose={() => setNegotiatingApp(null)}
        app={negotiatingApp}
        zenithScore={zenithScore}
        pendingGoalsCount={goals.filter(g => !g.completed).length}
        apiKey={apiKey}
        onGrantExtension={handleGrantExtension}
      />

      <PromptArchitectureModal
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={setApiKey}
        onResetAllData={handleResetAllData}
        activities={activities}
        apps={apps}
        goals={goals}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        archives={archives}
        onSimulateMidnightRollover={() => archiveDayAndReset()}
      />

      {/* PERSISTENT FLOATING BUTTON IN BOTTOM-RIGHT CORNER */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            sound.playClick();
            setIsHistoryDrawerOpen(true);
          }}
          className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#0C101A] hover:bg-[#121826] border border-[#C4A484]/50 shadow-2xl shadow-black/80 hover:border-[#C4A484] transition-all duration-300 active:scale-95 text-white"
          title="Access Previous Days Activity Archives & 12AM Rollover"
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-0.5 bg-[#C4A484] rounded-2xl blur-sm opacity-25 group-hover:opacity-45 transition-opacity -z-10" />

          <div className="p-1.5 rounded-xl bg-[#C4A484]/20 text-[#C4A484] border border-[#C4A484]/40">
            <Calendar className="w-4 h-4 animate-emoji-float" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white tracking-wide">
              Daily Archives
            </span>
            <span className="text-[9px] font-mono text-[#C4A484]">
              {archives.length} Days Saved
            </span>
          </div>

          <span className="text-xs ml-1 font-mono text-slate-400 group-hover:text-white transition-colors">
            &rarr;
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Zenith — Cognitive Equilibrium & 24h Autonomous Life-Balance OS</span>
          <span className="font-mono text-[11px] text-slate-400">Zero-Bloat Single Page Architecture &bull; 24h Strict Limit</span>
        </div>
      </footer>
    </div>
  );
}
