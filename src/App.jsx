import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ZenithScoreCard from './components/ZenithScoreCard';
import ActivityTracker from './components/ActivityTracker';
import AppVault from './components/AppVault';
import GoalsSection from './components/GoalsSection';
import AINegotiatorModal from './components/AINegotiatorModal';
import PromptArchitectureModal from './components/PromptArchitectureModal';
import SettingsModal from './components/SettingsModal';
import { 
  INITIAL_ACTIVITIES, 
  INITIAL_APPS, 
  INITIAL_GOALS, 
  DEMO_PRESET_BALANCED, 
  DEMO_PRESET_OVERLOADED 
} from './data/initialData';
import { calculateZenithScore } from './utils/aiService';

const STORAGE_KEYS = {
  ACTIVITIES: 'zenith_activities_v1',
  APPS: 'zenith_apps_v1',
  GOALS: 'zenith_goals_v1',
  API_KEY: 'zenith_api_key_v1'
};

export default function App() {
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

  // Modal states
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [negotiatingApp, setNegotiatingApp] = useState(null);

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

  // 3. Live 1-Second Timer Engine
  useEffect(() => {
    const interval = setInterval(() => {
      // Ticking running activities
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

      // Ticking running apps in Vault
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

        // Trigger AI negotiator modal automatically if app hits limit while running
        if (newlyLockedApp) {
          setNegotiatingApp(newlyLockedApp);
        }

        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 4. Calculate Live Zenith Score
  const zenithScore = calculateZenithScore(activities);

  // --- Handlers: Activity Tracker ---
  const handleToggleActivityTimer = (id) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, isRunning: !act.isRunning };
      }
      return act;
    }));
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

  // --- Handlers: App Vault ---
  const handleAddApp = (newApp) => {
    setApps(prev => [newApp, ...prev]);
  };

  const handleDeleteApp = (id) => {
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAppTimer = (id) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        if (app.isLocked || app.usedMinutes >= app.dailyLimitMinutes) {
          setNegotiatingApp(app);
          return app;
        }
        return { ...app, isRunning: !app.isRunning };
      }
      return app;
    }));
  };

  const handleSimulateMinusMinutes = (id, simulatedMinutes) => {
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
          setNegotiatingApp(updated);
        }
        return updated;
      }
      return app;
    }));

    // Also increase General Screen Time activity by the simulated minutes for realism!
    setActivities(prev => prev.map(act => {
      if (act.id === 'screen') {
        return { ...act, currentMinutes: act.currentMinutes + simulatedMinutes };
      }
      return act;
    }));
  };

  const handleGrantExtension = (appId, grantedMinutes) => {
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
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (newGoal) => {
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (id) => {
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
    setActivities(INITIAL_ACTIVITIES);
    setApps(INITIAL_APPS);
    setGoals(INITIAL_GOALS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.APPS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16">
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

        {/* 2. Feature 1: Life Balance Activity Tracker & Live Timers */}
        <section aria-label="Activity Tracker">
          <ActivityTracker
            activities={activities}
            onToggleTimer={handleToggleActivityTimer}
            onAddMinutes={handleAddActivityMinutes}
            onUpdateTarget={handleUpdateActivityTarget}
            onResetActivity={handleResetActivity}
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

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Zenith — Cognitive Equilibrium & Autonomous Life-Balance OS</span>
          <span className="font-mono text-[11px] text-slate-400">Zero-Bloat Single Page Architecture &bull; Local-First</span>
        </div>
      </footer>
    </div>
  );
}
