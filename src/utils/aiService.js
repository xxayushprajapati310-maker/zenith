import { PROMPT_ARCHITECTURE } from '../data/initialData';

/**
 * Calculates the Zenith Balance Score (0 - 100)
 * Weights:
 * - Study & Deep Work: up to +25
 * - Sleep: up to +25
 * - Exercise: up to +20
 * - Outdoor Games / Sun: up to +15
 * - Indoor Games: balanced up to +10 (penalized if > 90m)
 * - Screen Time: penalty if exceeding target (up to -30)
 */
export function calculateZenithScore(activities) {
  let score = 0;

  const study = activities.find(a => a.id === 'study');
  const sleep = activities.find(a => a.id === 'sleep');
  const exercise = activities.find(a => a.id === 'exercise');
  const outdoor = activities.find(a => a.id === 'outdoor');
  const indoor = activities.find(a => a.id === 'indoor');
  const screen = activities.find(a => a.id === 'screen');

  // Study: ratio to target, max 25 pts
  if (study && study.targetMinutes > 0) {
    const studyRatio = Math.min(1.2, study.currentMinutes / study.targetMinutes);
    score += Math.min(25, studyRatio * 25);
  }

  // Sleep: optimal 7-8 hrs (420-480 min). Target ratio max 25 pts
  if (sleep && sleep.targetMinutes > 0) {
    const sleepRatio = Math.min(1.0, sleep.currentMinutes / sleep.targetMinutes);
    score += sleepRatio * 25;
  }

  // Exercise: max 20 pts
  if (exercise && exercise.targetMinutes > 0) {
    const exRatio = Math.min(1.2, exercise.currentMinutes / exercise.targetMinutes);
    score += Math.min(20, exRatio * 20);
  }

  // Outdoor Games & Sun: max 15 pts
  if (outdoor && outdoor.targetMinutes > 0) {
    const outRatio = Math.min(1.2, outdoor.currentMinutes / outdoor.targetMinutes);
    score += Math.min(15, outRatio * 15);
  }

  // Indoor Games: up to 10 pts if reasonable (<= target), minor penalty if > 2x target
  if (indoor) {
    if (indoor.currentMinutes <= indoor.targetMinutes) {
      score += Math.min(10, (indoor.currentMinutes / (indoor.targetMinutes || 60)) * 10);
    } else {
      const over = indoor.currentMinutes - indoor.targetMinutes;
      score += Math.max(0, 10 - (over / 20));
    }
  }

  // Screen Time Penalty: if exceeds target, deduct up to 25 pts
  if (screen && screen.targetMinutes > 0) {
    if (screen.currentMinutes > screen.targetMinutes) {
      const excess = screen.currentMinutes - screen.targetMinutes;
      const penalty = Math.min(25, (excess / 60) * 8);
      score -= penalty;
    }
  }

  return Math.max(5, Math.min(100, Math.round(score)));
}

/**
 * AI Negotiator Evaluation
 * Analyzes whether to grant +10 minutes based on stated reason, app category, and current score
 */
export async function evaluateAppNegotiation({
  app,
  reason,
  zenithScore,
  pendingGoalsCount,
  apiKey = ''
}) {
  // If Gemini API Key is provided, call Gemini
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `System: ${PROMPT_ARCHITECTURE.negotiator.systemPrompt}
User Context:
- App: ${app.name} (${app.category})
- Daily limit: ${app.dailyLimitMinutes} mins, Used: ${app.usedMinutes} mins
- User Reason for requesting +10m: "${reason}"
- Zenith Balance Score: ${zenithScore}/100
- Pending Goals remaining: ${pendingGoalsCount}

Respond ONLY with valid JSON matching the schema provided.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to intelligent rule engine:', err);
    }
  }

  // Built-in Cognitive Rule Engine (Simulated Neuro-Behavioral AI)
  await new Promise(r => setTimeout(r, 800)); // Natural processing delay

  const lowerReason = (reason || '').toLowerCase().trim();
  const workKeywords = ['work', 'study', 'urgent', 'assignment', 'boss', 'client', 'email', 'project', 'research', 'homework', 'tutorial', 'code', 'bug', 'class'];
  const habitKeywords = ['bored', 'scroll', 'reel', 'reels', 'shorts', 'just 5', 'relax', 'addiction', 'tiktok', 'game', 'feed', 'meme', 'fun', 'nothing'];
  const educationalKeywords = ['lecture', 'documentation', 'learn', 'course', 'exam', 'paper', 'interview'];

  const hasWorkIntent = workKeywords.some(kw => lowerReason.includes(kw));
  const hasEducationalIntent = educationalKeywords.some(kw => lowerReason.includes(kw));
  const hasPassiveBoredom = habitKeywords.some(kw => lowerReason.includes(kw)) || lowerReason.length < 12;

  if (hasEducationalIntent || (hasWorkIntent && zenithScore >= 35)) {
    return {
      decision: 'APPROVED',
      grantedMinutes: 10,
      title: 'Exception Granted: Legitimate Utility Detected',
      verdictReasoning: `Your stated reason indicates productive/educational utility for ${app.name}. Because your Zenith Balance is at ${zenithScore}/100, a structured 10-minute sprint is approved.`,
      alternativeAction: 'Focus strictly on your stated objective without switching to recommended feeds.',
      coachingNudge: 'Set an internal mental timer. Once this 10-minute block ends, step away from the screen for 2 minutes.'
    };
  }

  if (hasPassiveBoredom || zenithScore < 35 || pendingGoalsCount >= 3) {
    return {
      decision: 'DENIED',
      grantedMinutes: 0,
      title: 'Request Denied: High Dopamine Craving Detected',
      verdictReasoning: `Your explanation ("${reason}") aligns with habitual dopamine-seeking rather than critical necessity. You have ${pendingGoalsCount} pending goals and your current Zenith Balance is ${zenithScore}/100.`,
      alternativeAction: 'Do 10 deep diaphragmatic breaths or complete 1 quick high-priority goal first.',
      coachingNudge: 'The urge to scroll peaks for 90 seconds and then dissipates. Drink a glass of water to reset your dopamine baseline.'
    };
  }

  // Moderate / Conditional Case
  return {
    decision: 'CONDITIONAL',
    grantedMinutes: 10,
    title: 'Conditional Approval: Single Extension Allowed',
    verdictReasoning: `We recognize your need to wrap up on ${app.name}. An emergency +10 minutes is credited, but this exhausts your negotiation quota for this app today.`,
    alternativeAction: 'Close other background tabs to maintain single-task focus.',
    coachingNudge: 'Commit to closing the application as soon as the 10-minute chime sounds.'
  };
}

/**
 * AI Rescue My Day Evaluation
 * Reviews goals and balance metrics to synthesize a revised schedule and risk score
 */
export async function evaluateRescueDay({
  activities,
  goals,
  zenithScore,
  apiKey = ''
}) {
  const completedGoals = goals.filter(g => g.completed);
  const pendingGoals = goals.filter(g => !g.completed);

  const study = activities.find(a => a.id === 'study')?.currentMinutes || 0;
  const sleep = activities.find(a => a.id === 'sleep')?.currentMinutes || 0;
  const exercise = activities.find(a => a.id === 'exercise')?.currentMinutes || 0;
  const screen = activities.find(a => a.id === 'screen')?.currentMinutes || 0;
  const outdoor = activities.find(a => a.id === 'outdoor')?.currentMinutes || 0;

  // If Gemini API Key is provided, call Gemini
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `System: ${PROMPT_ARCHITECTURE.coach.systemPrompt}
User Context:
- Completed Goals: ${completedGoals.map(g => g.title).join('; ') || 'None'}
- Pending Goals: ${pendingGoals.map(g => `${g.title} (${g.priority} priority, ${g.estimatedMinutes}m)`).join('; ') || 'None'}
- Today's Logs: Study ${study}m, Sleep ${sleep}m, Exercise ${exercise}m, Outdoor ${outdoor}m, Screen ${screen}m
- Zenith Score: ${zenithScore}/100

Respond strictly in valid JSON matching the schema.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to cognitive synthesis:', err);
    }
  }

  // Built-in Neuro-Behavioral Rescue Engine
  await new Promise(r => setTimeout(r, 900));

  let riskRating = 'Low';
  let riskScore = 20;

  if (screen > 300 && exercise < 30) {
    riskRating = 'High';
    riskScore = 78;
  } else if (pendingGoals.length >= 3 && study < 60) {
    riskRating = 'Moderate';
    riskScore = 55;
  } else if (sleep < 360 && screen > 240) {
    riskRating = 'Critical';
    riskScore = 89;
  } else if (zenithScore >= 75) {
    riskRating = 'Low';
    riskScore = 18;
  } else {
    riskRating = 'Moderate';
    riskScore = 48;
  }

  // Generate dynamic revised schedule blocks starting from current time
  const now = new Date();
  const formatTime = (d) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  const addMins = (d, mins) => new Date(d.getTime() + mins * 60000);

  let cursor = new Date(now.getTime() + 10 * 60000); // 10 mins from now
  const schedule = [];

  // 1. Immediate Nervous System Reset
  const block1End = addMins(cursor, 15);
  schedule.push({
    timeBlock: `${formatTime(cursor)} - ${formatTime(block1End)}`,
    action: exercise === 0 ? 'Vigorous 15-Min Reset & Hydration' : 'Optic Rest & Sunlight Exposure',
    type: 'movement',
    rationale: 'Breaks sympathetic nervous system loop and clears adenosine buildup.'
  });
  cursor = block1End;

  // 2. High Priority Sprint
  const topPending = pendingGoals.find(g => g.priority === 'High') || pendingGoals[0];
  const sprintDuration = topPending ? Math.min(50, topPending.estimatedMinutes) : 40;
  const block2End = addMins(cursor, sprintDuration);
  schedule.push({
    timeBlock: `${formatTime(cursor)} - ${formatTime(block2End)}`,
    action: topPending ? `Deep Focus Sprint: ${topPending.title}` : 'Consolidated High-Impact Work Block',
    type: 'focus',
    rationale: 'Aligns with ultradian rhythm peak before mental fatigue sets in.'
  });
  cursor = block2End;

  // 3. Cognitive Decompression
  const block3End = addMins(cursor, 15);
  schedule.push({
    timeBlock: `${formatTime(cursor)} - ${formatTime(block3End)}`,
    action: 'Offline Breathing or Outdoor Stroll',
    type: 'recovery',
    rationale: 'Zero screen engagement allows synaptic consolidation without burnout.'
  });
  cursor = block3End;

  // 4. Secondary Priority Wrap-Up
  const secondaryPending = pendingGoals.find(g => g !== topPending);
  const block4End = addMins(cursor, 35);
  schedule.push({
    timeBlock: `${formatTime(cursor)} - ${formatTime(block4End)}`,
    action: secondaryPending ? `Targeted Closure: ${secondaryPending.title}` : 'Day Wrap-Up & Inbox Zero',
    type: 'focus',
    rationale: 'Wraps up remaining cognitive loops before evening melatonin surge.'
  });
  cursor = block4End;

  // 5. Evening Wind-down
  const block5End = addMins(cursor, 45);
  schedule.push({
    timeBlock: `${formatTime(cursor)} - ${formatTime(block5End)}`,
    action: 'Digital Sunset: Dim Lights & Screen Ban',
    type: 'winddown',
    rationale: 'Protects natural circadian rhythm and optimizes tonight\'s REM sleep architecture.'
  });

  return {
    burnoutRiskRating: riskRating,
    riskScorePercent: riskScore,
    diagnosticSummary: `You have completed ${completedGoals.length}/${goals.length} goals today with ${Math.round(screen / 60)}h ${screen % 60}m of screen exposure and ${Math.round(exercise)}m of physical activity. ${riskRating === 'High' || riskRating === 'Critical' ? 'Your cognitive fatigue index is elevated; urgent time-blocking and digital boundaries are advised.' : 'Your day balance has strong recovery potential with targeted re-sequencing.'}`,
    revisedSchedule: schedule,
    behavioralTips: [
      {
        title: 'The 20-20-20 Optic Rule',
        insight: 'For every 20 minutes of screen work, look at an object 20 feet away for 20 seconds to relax ciliary eye muscles.',
        tag: 'Neuroscience'
      },
      {
        title: 'Ultradian Rhythm Alignment',
        insight: 'Human attention naturally peaks for 45-50 minutes followed by a trough. Respect the trough rather than forcing attention with caffeine.',
        tag: 'Focus Protocol'
      },
      {
        title: 'Circadian Light Hygiene',
        insight: 'Dim warm ambient lighting after 8:00 PM prevents blue-spectrum light from suppressing pineal melatonin secretion.',
        tag: 'Sleep Architecture'
      }
    ]
  };
}
