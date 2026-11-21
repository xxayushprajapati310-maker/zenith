# Zenith — AI-Powered Digital Wellbeing & Life-Balance Dashboard

> **Autonomous Life-Balance OS & Cognitive Equilibrium Dashboard** built with React, Vite, Tailwind CSS, Lucide Icons, and Web Audio API synthesizer. Designed to harmonize deep work, physical vitality, sleep architecture, and screen discipline with strict 24-hour daily allotment governance.

---

## ✨ Features Overview

### 1. Life Balance Activity Tracker & Single-Active Timers
- **Strict Single Active Mode**: Only one activity tracker runs at a time. Starting any activity automatically pauses all other running trackers.
- **Custom Time Interval Allotment**: Each activity features an editable scheduled interval (e.g. `09:00 AM - 12:00 PM`). An active slot indicator dynamically highlights when you are currently in your scheduled window.
- **24-Hour Day Allocation Limit**: Strict restriction ensuring the sum of all daily allotted target times never exceeds 24 hours (1,440 minutes). Features a live real-time budget meter displaying allocated vs unallocated buffer time.
- **Custom Ordered Sequence**: Reorder the sequence of your day at will using the Up/Down controls or the **"Sort by Schedule"** button.
- **Add & Edit Activities**: Full control to add new activities or edit existing ones (name, category, scheduled interval, target duration, color, and animated emoji).
- **Live Zenith Balance Score (0–100)**: Dynamically calculated based on positive habits vs. digital screen overload.

### 2. 12:00 AM Midnight Rollover & Bottom-Right Archives
- **Automatic Midnight Archiving**: Every night at 12:00 AM, Zenith autonomously captures the day's activity logs, scores, and goal completions, archiving them into permanent history in `localStorage`.
- **Fresh Daily Reset**: Logged minutes and app session counters reset cleanly for the new day while preserving all scheduled targets and sequences.
- **Bottom-Right Corner Access**: A persistent floating button in the bottom-right corner provides immediate one-click access to the **Activity Archives Drawer**, where past days' records, timeline stats, and scores are reviewed.
- **Simulate Midnight (12 AM) Button**: Test the archive and rollover process at any moment with a single click.

### 3. Custom App Vault & AI Time Limiter
- **Default App Vault**: Preloaded with Instagram, YouTube, Steam/Gaming, and VS Code.
- **Add Custom Apps**: Configure custom app limits, categories, and timers.
- **Instant Demo Controls**: Active session timer controls plus a `Simulate -5m` button to quickly demo app depletion.
- **AI Negotiator Modal**: When an app hits 0 minutes remaining, it locks automatically. Users can state an emergency reason or complete a **Mindful Reflex Challenge** to request an AI-evaluated `+10 min` extension.

### 4. Daily Goals & "AI Rescue My Day"
- **Priority-Tagged Daily Goals**: Track high-impact objectives with priority badges (`High`, `Medium`, `Low`), estimated durations, and one-click completion.
- **AI Rescue My Day Engine**:
  - Assesses completed vs. pending tasks alongside today's logs.
  - Computes a **Burnout & Focus Risk Rating** (`Low`, `Moderate`, `High`, `Critical`).
  - Synthesizes a **Rest-of-Day Chronological Time-Blocked Schedule**.
  - Delivers targeted neuroscience & circadian hygiene behavioral tips.

### 5. Sound Effects & Modern Aesthetics
- **Synthesized Web Audio**: Crisp chime on timer start, soft tone on pause, tactile clicks, and alert sounds with zero external media files.
- **Sound Toggle**: Easy Mute/Unmute audio control in the top navigation bar.
- **Refined Color Palette**: High-contrast Jet Black (`#05070B`), Crisp White, Pale Brown (`#C4A484`), Soft Cream (`#F5EFE6`), with RGB Emerald, Blue, Amber, and Crimson accents (minimizing purple).
- **Animated Emojis**: Micro-animations including bounce, float, wiggle, and pulse for all activity icons.

---

## 🛠️ Quick Start

```powershell
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build
```

---

## 🔒 Privacy & Architecture

All activities, historical archives, and configurations remain strictly on your local machine using the browser's `localStorage`. Minimal zero-bloat architecture under **300 KB** source code.
