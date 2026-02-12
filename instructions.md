# Be My Valentine — Premium “WOW” Mode

## Project Overview

Build a premium, cinematic, single-page interactive web experience that asks:

> “Will you be my Valentine?”

This is a private web app deployed on GitHub Pages to share with my girlfriend.
It should feel **luxury**, **crafted**, **playful**, and **technically impressive** (“wow, you coded this?”).

No backend. No analytics. Static hosting only.

---

## Tech Stack Requirements

Use:

* React (Vite)
* Framer Motion (animations + transitions)
* Three.js via @react-three/fiber
* @react-three/drei for helpers

Must be compatible with GitHub Pages (subpath hosting).

---

## “WOW” Premium Requirements

This version must aim for a **wow effect**:

* Cinematic transitions (blur + fade + slight zoom)
* Layered depth (3D background + UI overlay separation)
* Soft bloom/glow highlights (tasteful)
* Parallax on desktop (mouse movement)
* Motion response on mobile (device orientation if possible, fallback to subtle auto motion)
* High-quality spring physics everywhere (no janky jumps)
* Elegant typography and spacing (looks premium, not template-ish)

Important: “wow” does NOT mean chaotic.
It means polished, intentional, and impressive.

---

## Content Configuration (Single Source of Truth)

All visible text + date details must be controlled via a single JSON file:

`content.json`

### Requirements

* The app must read from `content.json`
* If the user adds more messages, the app must automatically use them
* No hardcoded text in components (except fallback defaults if JSON fails)

### content.json example (edit freely)

```json
{
  "question": {
    "title": "Will you be my Valentine?",
    "subtitle": "I have something important to ask you..."
  },
  "buttons": {
    "yes": "Yes ❤️",
    "no": "No 🙈"
  },
  "escalationMessages": [
    "Are you sure? 🥺",
    "That feels like the wrong answer.",
    "Think again… gently 😌",
    "Hmm. Suspicious choice.",
    "This button is getting shy.",
    "It’s not cooperating, weird.",
    "Nope—try again 😇",
    "I admire the confidence.",
    "Okay but… why though?",
    "Your finger is determined.",
    "This is turning into a sport.",
    "I’m still waiting for “Yes”.",
    "Be honest… you want to click it.",
    "Last chance 😌",
    "Final answer? ❤️"
  ],
  "loader": {
    "title": "Checking compatibility...",
    "steps": [
      "Analyzing personality...",
      "Matching humor...",
      "Verifying cuteness...",
      "Running final calculation..."
    ],
    "result": "Compatibility: 100% ❤️"
  },
  "confirmation": {
    "title": "Yay ❤️",
    "subtitle": "You just made me the happiest person.",
    "finalMessage": "I can't wait for our Valentine's date."
  },
  "dateDetails": {
    "targetDate": "2026-02-14T19:30:00",
    "location": "📍 Your Surprise Location",
    "note": "Wear something cute 😉"
  }
}
```

### Escalation Message Behavior (Dynamic)

* The app must support **any number** of escalation messages.
* It should display them sequentially as attempts increase.
* If attempts exceed the number of messages, it should continue using the last message or loop gracefully (choose the option that feels nicest).

---

## Core Experience Flow

### Stage 1 — The Question Screen

* Centered question + subtitle
* Two buttons: Yes / No
* Premium visual background with subtle 3D motion
* Floating hearts / particles / soft bokeh vibe (tasteful, not cheesy)

### Stage 2 — Fake Compatibility Loader

After Yes:

* Cinematic transition (fade/blur/zoom)
* Show loader title
* Animate progress bar
* Show loader steps sequentially from JSON
* 3D element rotates or reacts during loading
* After ~4–6 seconds, show loader result from JSON
* Transition to confirmation

### Stage 3 — Confirmation + Countdown

* “Yay ❤️” + subtitle + final message from JSON
* Elegant celebration effect (confetti OR heart particles, tasteful)
* Live countdown to date from JSON
* Show editable date details (location + note)

---

## The “No” Button Behavior (Desktop + Mobile)

Important: **Escalation messages must work on BOTH desktop and mobile.**

### Desktop

* The “No” button should move away when cursor gets close.
* Movement must be smooth (spring).
* Must stay inside viewport bounds.
* Each escape increments the attempt counter and shows the next escalation message.

### Mobile

* The “No” button should dodge taps by jumping/repositioning.
* Each tap attempt increments the attempt counter and shows the next escalation message.

---

## Escalation System (High Level)

Track number of “No attempts”.

On each attempt:

* Show the next escalation message (from JSON)
* Animate message smoothly (fade/slide)
* Increase intensity progressively but keep it playful

Intensity scaling examples (implementation choice left to Cursor):

* “No” button becomes faster / more evasive
* “No” button shrinks slightly
* “Yes” button grows slightly
* “Yes” button glow increases

Avoid frustration:

* Cap intensity
* Keep everything smooth
* Never let buttons disappear completely unless it’s clearly intentional and still cute

---

## 3D / Visual “Wow” Requirements

Must include a subtle but impressive 3D background that:

* Adds depth and premium feel
* Reacts gently to cursor movement (desktop) / device motion (mobile)
* Does not distract from the question

Performance constraints:

* Lightweight geometry
* No heavy models
* Fast load
* Graceful fallback if WebGL fails

Optional premium extras (if easy):

* Soft bloom/glow
* Depth-of-field style blur feel
* Subtle vignette

---

## Motion & Polish Requirements

* Use Framer Motion transitions between stages (cinematic feel).
* All motion should be smooth, spring-based.
* No abrupt teleports (unless it’s part of a deliberate “No dodging” effect).
* Maintain a luxury, deliberate pacing.

---

## Responsiveness

Must work perfectly on:

* Desktop
* Mobile
* Small screens

No off-screen content. No overlap.

---

## Deployment Requirements

* Works on GitHub Pages under a subpath
* Builds cleanly with Vite
* Static-only

---

## Emotional Objective

This must:

* Make her laugh
* Feel romantic
* Feel like real effort
* Be impressive enough to show friends
* End with a warm payoff