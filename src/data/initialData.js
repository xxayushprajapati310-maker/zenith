export const INITIAL_ACTIVITIES = [
  {
    id: 'study',
    name: 'Study & Deep Work',
    category: 'positive',
    iconName: 'BookOpen',
    color: '#6366F1', // Indigo
    accentClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    currentMinutes: 120,
    targetMinutes: 180,
    isRunning: false,
    timerSeconds: 0
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    category: 'positive',
    iconName: 'Moon',
    color: '#8B5CF6', // Violet
    accentClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    currentMinutes: 420, // 7 hours
    targetMinutes: 480, // 8 hours
    isRunning: false,
    timerSeconds: 0
  },
  {
    id: 'exercise',
    name: 'Exercise & Fitness',
    category: 'positive',
    iconName: 'Flame',
    color: '#10B981', // Emerald
    accentClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    currentMinutes: 45,
    targetMinutes: 60,
    isRunning: false,
    timerSeconds: 0
  },
  {
    id: 'outdoor',
    name: 'Outdoor Games & Sun',
    category: 'positive',
    iconName: 'Compass',
    color: '#06B6D4', // Cyan
    accentClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    currentMinutes: 30,
    targetMinutes: 60,
    isRunning: false,
    timerSeconds: 0
  },
  {
    id: 'indoor',
    name: 'Indoor Games',
    category: 'neutral',
    iconName: 'Dice5',
    color: '#F59E0B', // Amber
    accentClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    currentMinutes: 40,
    targetMinutes: 60,
    isRunning: false,
    timerSeconds: 0
  },
  {
    id: 'screen',
    name: 'General Screen Time',
    category: 'consumption',
    iconName: 'Monitor',
    color: '#F43F5E', // Rose
    accentClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    currentMinutes: 210, // 3.5 hrs
    targetMinutes: 180, // Max recommended limit
    isRunning: false,
    timerSeconds: 0
  }
];

export const INITIAL_APPS = [
  {
    id: 'app-instagram',
    name: 'Instagram',
    category: 'Social Media',
    iconName: 'Camera',
    dailyLimitMinutes: 30,
    usedMinutes: 25,
    isLocked: false,
    isRunning: false,
    activeSeconds: 0
  },
  {
    id: 'app-youtube',
    name: 'YouTube',
    category: 'Streaming & Video',
    iconName: 'Video',
    dailyLimitMinutes: 45,
    usedMinutes: 40,
    isLocked: false,
    isRunning: false,
    activeSeconds: 0
  },
  {
    id: 'app-gaming',
    name: 'Steam & Gaming',
    category: 'Entertainment',
    iconName: 'Gamepad2',
    dailyLimitMinutes: 60,
    usedMinutes: 55,
    isLocked: false,
    isRunning: false,
    activeSeconds: 0
  },
  {
    id: 'app-vscode',
    name: 'VS Code & Dev Tools',
    category: 'Productivity',
    iconName: 'Code2',
    dailyLimitMinutes: 240,
    usedMinutes: 160,
    isLocked: false,
    isRunning: false,
    activeSeconds: 0
  }
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Complete Distributed Systems Paper reading',
    priority: 'High',
    estimatedMinutes: 60,
    completed: true,
    tag: 'Academic'
  },
  {
    id: 'goal-2',
    title: '30-minute cardio session or brisk walk',
    priority: 'High',
    estimatedMinutes: 30,
    completed: true,
    tag: 'Health'
  },
  {
    id: 'goal-3',
    title: 'Refactor Zenith API client architecture',
    priority: 'Medium',
    estimatedMinutes: 90,
    completed: false,
    tag: 'Engineering'
  },
  {
    id: 'goal-4',
    title: 'Evening screen wind-down (no blue light after 10 PM)',
    priority: 'Low',
    estimatedMinutes: 45,
    completed: false,
    tag: 'Sleep Hygiene'
  }
];

export const DEMO_PRESET_BALANCED = {
  activities: [
    { id: 'study', currentMinutes: 210, targetMinutes: 180 },
    { id: 'sleep', currentMinutes: 480, targetMinutes: 480 },
    { id: 'exercise', currentMinutes: 60, targetMinutes: 60 },
    { id: 'outdoor', currentMinutes: 75, targetMinutes: 60 },
    { id: 'indoor', currentMinutes: 30, targetMinutes: 60 },
    { id: 'screen', currentMinutes: 150, targetMinutes: 180 }
  ],
  apps: [
    { id: 'app-instagram', usedMinutes: 15, isLocked: false },
    { id: 'app-youtube', usedMinutes: 30, isLocked: false },
    { id: 'app-gaming', usedMinutes: 20, isLocked: false },
    { id: 'app-vscode', usedMinutes: 190, isLocked: false }
  ],
  goals: [
    { id: 'goal-1', completed: true },
    { id: 'goal-2', completed: true },
    { id: 'goal-3', completed: true },
    { id: 'goal-4', completed: false }
  ]
};

export const DEMO_PRESET_OVERLOADED = {
  activities: [
    { id: 'study', currentMinutes: 45, targetMinutes: 180 },
    { id: 'sleep', currentMinutes: 300, targetMinutes: 480 },
    { id: 'exercise', currentMinutes: 0, targetMinutes: 60 },
    { id: 'outdoor', currentMinutes: 0, targetMinutes: 60 },
    { id: 'indoor', currentMinutes: 140, targetMinutes: 60 },
    { id: 'screen', currentMinutes: 420, targetMinutes: 180 }
  ],
  apps: [
    { id: 'app-instagram', usedMinutes: 30, isLocked: true },
    { id: 'app-youtube', usedMinutes: 45, isLocked: true },
    { id: 'app-gaming', usedMinutes: 60, isLocked: true },
    { id: 'app-vscode', usedMinutes: 45, isLocked: false }
  ],
  goals: [
    { id: 'goal-1', completed: false },
    { id: 'goal-2', completed: false },
    { id: 'goal-3', completed: false },
    { id: 'goal-4', completed: false }
  ]
};

export const PROMPT_ARCHITECTURE = {
  coach: {
    title: 'AI Rescue My Day & Schedule Optimizer',
    systemPrompt: `You are Zenith Cognitive Coach, an elite AI neuro-behavioral coach and circadian rhythm specialist.
Your goal is to rescue the user's day by analyzing their live activity logs, completed vs pending goals, and current energy reserves.

Input Data Provided:
- Completed Goals vs Pending Goals (with priority and estimated minutes)
- Time spent today: Study, Sleep, Exercise, Outdoor Games, Indoor Games, Screen Time
- Zenith Balance Score (0-100)

Output Requirement:
You MUST respond with valid JSON strictly adhering to the schema:
{
  "burnoutRiskRating": "Low" | "Moderate" | "High" | "Critical",
  "riskScorePercent": number, // 0-100
  "diagnosticSummary": string,
  "revisedSchedule": [
    {
      "timeBlock": string, // e.g. "04:30 PM - 05:15 PM"
      "action": string,
      "type": "focus" | "recovery" | "movement" | "winddown",
      "rationale": string
    }
  ],
  "behavioralTips": [
    {
      "title": string,
      "insight": string,
      "tag": string
    }
  ]
}`,
    evaluationRules: [
      'Prioritize restorative micro-breaks if Screen Time exceeds 4 hours without exercise.',
      'Front-load highest priority uncompleted tasks into 45-minute ultradian rhythm cycles.',
      'Mandate zero screen exposure 60 minutes before scheduled sleep if sleep deficit is detected.',
      'Recommend outdoor light exposure if Outdoor Games or Exercise is zero.'
    ]
  },
  negotiator: {
    title: 'AI Time Limiter & Negotiator Engine',
    systemPrompt: `You are Zenith AI Vault Gatekeeper, a compassionate yet disciplined cognitive focus guardian.
When a user exhausts their daily limit on a recreational app (e.g., Instagram, YouTube, Gaming) and requests an emergency +10 minute extension, you evaluate their reasoning and current day balance.

Input Parameters:
- App Name & Category
- Daily Limit vs Time Used
- User's Stated Reason / Emergency Justification
- Current Zenith Balance Score
- Pending High-Priority Goals Count

Evaluation Rubric:
1. Legitimate Work/Urgent Communication: APPROVE (+10 mins granted) with condition.
2. Emotional Reflex / Doomscrolling Craving: REJECT or Offer Substitute Action (e.g., 5-min walk, water break).
3. Educational / Academic Reference: APPROVE (+10 mins) with strict commitment check.
4. Zenith Score < 40 and 3+ Pending Goals: STRICT REJECTION unless critical emergency.

Output JSON Format:
{
  "decision": "APPROVED" | "DENIED" | "CONDITIONAL",
  "grantedMinutes": number, // 0 or 10
  "title": string,
  "verdictReasoning": string,
  "alternativeAction": string,
  "coachingNudge": string
}`,
    evaluationRules: [
      'Detect vague excuses ("just 5 more mins", "bored", "scrolling") and reject firmly.',
      'Acknowledge genuine collaboration ("messaging team lead", "watching course video") and grant +10m.',
      'Enforce a maximum of 2 extensions per app per calendar day.',
      'Reward healthy daytime habits (high Zenith score) with higher leniency.'
    ]
  }
};
