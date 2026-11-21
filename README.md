# Zenith — AI-Powered Digital Wellbeing & Life-Balance Dashboard

> **Autonomous Life-Balance OS & Cognitive Equilibrium Dashboard** built with React, Vite, Tailwind CSS, and Lucide Icons. Designed to harmonize deep work, physical vitality, sleep architecture, and screen discipline with intelligent AI intervention.

---

## ✨ Features Overview

### 1. Life Balance Activity Tracker & Live Timers
- **Six Core Vitality Pillars**:
  - 📖 **Study & Deep Work** (Indigo)
  - 🌙 **Sleep & Recovery** (Violet)
  - 🔥 **Exercise & Fitness** (Emerald)
  - 🧭 **Outdoor Games & Sun Exposure** (Cyan)
  - 🎲 **Indoor Games** (Amber)
  - 📱 **Screen Time Load** (Rose)
- **Live Timers & Quick Add**: Support for live start/pause session timers with second-level precision, plus quick increments (`+15m`, `+30m`, `+1h`) and inline editable daily targets.
- **Live Zenith Balance Score (0–100)**: Dynamically calculated based on positive physical & mental habits vs. digital screen consumption.

### 2. Custom App Vault & AI Time Limiter
- **Default App Vault**: Preloaded with Instagram, YouTube, Steam/Gaming, and VS Code.
- **Custom App Management**: Add any app, category, and custom minute limit via the `+ Add Custom App` modal.
- **Instant Demo Controls**: Active session timer controls plus a `Simulate -5m` button to test daily limits and locking behavior during live demos.
- **AI Vault Negotiator Modal**: When an app hits 0 minutes remaining, it enters **LOCKED** state. The user can:
  - Submit a stated justification evaluated by the AI Guardian.
  - Complete an **Intentional Mindfulness Challenge** (conscious affirmation test) to override mindless dopamine loops.
  - Receive an approved emergency `+10 min` extension with actionable cognitive coaching.

### 3. Daily Goals & "AI Rescue My Day"
- **Priority-Tagged Daily Goals**: Track high-impact objectives with priority badges (`High`, `Medium`, `Low`), estimated durations, and one-click completion.
- **AI Rescue My Day Engine**:
  - Assesses completed vs. pending tasks alongside today's sleep, exercise, and screen metrics.
  - Computes a **Burnout & Focus Risk Rating** (`Low`, `Moderate`, `High`, `Critical`).
  - Synthesizes a **Rest-of-Day Chronological Time-Blocked Schedule** (focus sprints, nervous system resets, optic recovery, digital sunset).
  - Delivers targeted neuroscience & circadian hygiene behavioral tips.

### 4. Prompt Architecture & Demo Readiness
- **Load Demo Data**: Instant 1-click presets in the header (`🌟 Balanced High Achiever` vs `⚠️ Digital Overload Alert`) for effortless demonstrations.
- **Prompt Architecture Modal**: Full inspection of the system prompts, evaluation rubrics, guardrails, and structured JSON schemas utilized by the AI Coach and AI Negotiator.
- **Settings & API Configuration**:
  - Works 100% offline out-of-the-box using the built-in deterministic cognitive neuro-behavioral engine.
  - Optional Google Gemini API key configuration to upgrade to live multimodal LLM inference.
  - Full JSON data backup export and local storage reset.

---

## 🚀 Tech Stack & Design

- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS (Custom Dark Slate & Indigo Glassmorphism UI)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (Local-first, 100% private)
- **Repository Footprint**: Minimal zero-bloat architecture (< 2 MB repository size, no heavy media or video assets)

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Generates an optimized, lightning-fast bundle in `dist/`.

---

## 🔒 Privacy & Architecture

All activities, app usage counters, and goal data remain strictly on your local machine using the browser's `localStorage`. No personal telemetry or usage data is transmitted externally.
