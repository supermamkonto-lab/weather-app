---
name: project_master_memory
description: Master document - complete project context for new sessions. Read this and you understand the project.
metadata: 
  node_type: memory
  type: project
  createdDate: 2026-06-22
  currentDate: 2026-06-22
  status: PHASE 7A.7 (Master Memory Creation)
  recovery_target: New session can understand project in <10 minutes from this file alone
  originSessionId: a3cd5bab-b647-4f09-b689-945bfda1ce89
---

# PROJECT MASTER MEMORY — WEATHER APP

**Complete project context. Read this. Understand the project. Make informed decisions.**

*This document is the anti-compaction insurance. If everything else is lost, this survives.*

---

# SECTION 1: WHAT IS THIS PROJECT

## Project Name & Purpose
**"Weather App Enterprise Edition"** — A premium, Polish-first Android weather application built with React Native.

**Problem it solves:** Standard weather apps show data but not context. This app shows human experience (comfort, well-being) alongside data.

**Target user:** Polish Android user who wants premium, offline-ready weather app with native feel (not generic translation).

---

## Why It Exists
1. Polish users deserve native app (not English translated)
2. Weather data alone doesn't tell the full story (needs comfort index, wind + humidity context)
3. Offline access matters (network fails, airplane mode, tunnels)
4. Premium apps don't sacrifice performance or clarity
5. Gamification engages users (weather score, achievements)

---

## What Makes It Different
| Aspect | This App | Competitors |
|--------|----------|-------------|
| **Design** | Apple-level (white cards, elevation) | Generic, outdated |
| **Language** | Polish-first (not translated) | English-first + translation |
| **Offline** | Full offline support | Online only |
| **Features** | Comfort-focused (Komfort Człowieka) | Feature bloat |
| **Performance** | Build 8s, startup 3s | Slow, janky |

---

# SECTION 2: PROJECT STATUS

## Active Phase: PHASE 7A.7
**Master Memory Creation** — Preserving project knowledge before potential context loss.

## Previous Phases (Completed)
- **PHASE 1-2 (Jun 20):** Architecture planning + core 5 features
- **PHASE 3A-3C (Jun 21):** Code audit, refactor, polonizacja
- **PHASE 4-5B (Jun 21):** Premium redesign
- **PHASE 6A (Jun 21):** Forecast expansion research
- **PHASE 6B-6C (Jun 21):** API migration wttr.in → Open-Meteo
- **PHASE 7A (Jun 22):** Premium design transformation
- **PHASE 7A.5 (Jun 22):** Knowledge preservation
- **PHASE 7A.6 (Jun 22):** SESSION V1 recovery
- **PHASE 7A.7 (Jun 22):** Master memory creation (CURRENT)

## Build Status
✅ **Working APK:** Available at `android/app/build/outputs/apk/debug/app-debug.apk`
✅ **Build time:** 8 seconds
✅ **Startup:** 3 seconds

## Design Status
✅ **Complete and locked** — All visual rules documented in design_system.md

## Architecture Status
✅ **Stable** — React Native + Context API + AsyncStorage

---

# SECTION 3: CORE FEATURES

### 1. Real-Time Weather
Current temperature, description, feels-like reading.
**Data source:** Open-Meteo API (was wttr.in, migrated in PHASE 6C)

### 2. Tomorrow vs Today (Zmiana Pogody)
Side-by-side comparison: today's conditions vs tomorrow's forecast.
**Key data:** Max/min temperature, description, visual icon

### 3. Human Comfort Index (Komfort Człowieka)
Not just "22°C" but "Is it comfortable outside?"
**Formula:** Temperature + Humidity + Wind = comfort score (0-100)
**Visual:** Color-coded gauge (red=uncomfortable, green=perfect)

### 4. Hourly Forecast (Godziny Opadów)
6-hour rainfall forecast, expandable to 24 hours.
**Display:** Time grid + interactive graph
**Data:** Hourly temperature, precipitation chance, wind
**Status:** ⚠️ See critical issues below

### 5. Weather Score (Gamification)
Score based on weather extremes, interesting conditions.
**Psychology:** Encourages daily app opening

### 6. Air Quality Index
Health badge: color-coded AQI with explanation.
**Data source:** Open-Meteo AQI API

### 7. Offline Support
Cached data always available. Timestamp shows when cache is from.
**Technology:** AsyncStorage persistence
**Behavior:** "Something is better than nothing"

### 8. Polish Localization
Everything in Polish language + Polish UI patterns.
**Not:** English translated to Polish
**Examples:** "Dziś godzinowo", "Najbliższe dni", Polish date format

---

# SECTION 4: ARCHITECTURE

## Tech Stack
- **Framework:** React Native 0.86.0
- **Language:** TypeScript (strict mode, no `any`)
- **State:** Context API
- **Persistence:** AsyncStorage
- **API:** Open-Meteo (primary), wttr.in (location lookup only)
- **Build:** Gradle (Android), npm
- **Testing:** Unit tests framework in place

## Data Flow
```
API (Open-Meteo) 
  ↓ (fetch current + hourly + daily)
Services layer (API calls, transformation)
  ↓ (data fetching, parsing)
Context (weather state + functions)
  ↓ (global state)
Components (UI rendering)
  ↓ (display data)
User sees: Premium weather app
```

## Offline Strategy
```
Network available → Fetch new data → Cache in AsyncStorage
Network unavailable → Load from AsyncStorage → Show timestamp
```

## Performance Targets (Locked)
- Build time: ≤8 seconds
- Startup: ≤3 seconds
- UI response: <200ms
- Performance score: ≥92/100

---

# SECTION 5: DESIGN PHILOSOPHY

### North Star: Apple Weather
Every design decision starts with: "How does Apple do this?"

### Information Hierarchy (In Order)
1. **Temperature 96pt bold** — Primary data
2. **Weather description** — Secondary context
3. **Feels like** — Tertiary detail
4. **Tomorrow vs today** — Comparison
5. **Details** — Only if needed

### Visual System (Locked)
- **Cards:** White rgba(255,255,255,0.93)
- **Accent:** Blue #1E90FF
- **Text dark:** #1F2937
- **Text secondary:** #9CA3AF
- **Shadows:** rgba(0,0,0,0.10-0.12)
- **Border radius:** 13-14pt
- **Font weights:** 700 (values), 400-500 (labels)

### UX Principles
- Single-hand friendly (essential info above fold)
- Tap = drill down
- Swipe = navigate
- Haptic feedback = confirmation
- No modals for critical paths

---

# SECTION 6: CRITICAL ISSUES (BLOCKING PHASE 7B)

### Issue 1: minTemp Missing from Forecast Cards 🔴 CRITICAL
**Location:** App.tsx line 1596 (Forecast card rendering)
**Problem:** Removed in PHASE 7A. User sees only max temp, not daily range.
**Impact:** Information loss vs Phase 6C.
**Inconsistency:** Hero shows "↑27° ↓20°" but forecast shows only "27°"
**Fix:** Restore minTemp display below maxTemp (11-12pt font)
**Effort:** 1 minute
**Status:** PHASE 7B action item
**NEVER:** Lose user data without replacement.

### Issue 2: Dziś godzinowo (Hourly Forecast) Architecture 🔴 CRITICAL
**Location:** App.tsx lines 1550-1620
**Problem:** Two disconnected components:
- TempCurve (interactive graph)
- Time capsules (static grid)
**Expected (Apple):** Single interactive component. Drag X-axis = graph updates
**Current:** User sees unrelated data (graph ≠ grid)
**Impact:** Confusing UX. Graph doesn't relate to numbers.
**Fix:** Merge into single interactive component
**Effort:** 2-3 hours
**Status:** PHASE 7B redesign

### Issue 3: Szczegóły Modal Grid Alignment 🔴 CRITICAL
**Location:** Detail modal rendering
**Problem:** Grid layout unstable. Values misaligned.
**Impact:** Visual incoherence. Professional appearance damaged.
**Fix:** Flex-based layout with proper constraints
**Effort:** 1-2 hours
**Status:** PHASE 7B redesign

### Issue 4: Hourly Times Extraction Bug 🟡 HIGH
**Location:** App.tsx line 646
**Symptom:** Was showing "00:00" for all 24 hours (should be 00:00-23:00)
**Root Cause:** Still being debugged. Requires logcat analysis.
**Status:** Debugging in progress. Console.log added.
**Priority:** HIGH (UX-blocking)

---

# SECTION 7: ACTIVE DECISIONS (MUST NOT CHANGE)

### Cannot Change (Locked)
1. **Open-Meteo API** — wttr.in proven inadequate (3-day limit)
2. **Polish-first design** — Core differentiation
3. **White cards design** — Tested, premium, readable
4. **Blue accent #1E90FF** — Modern, consistent
5. **96pt bold temperature** — Information hierarchy
6. **Offline support required** — Competitive advantage
7. **TypeScript strict mode** — Type safety
8. **Performance targets** — Non-negotiable

### Can Review (Controversial)
1. **minTemp removal** — See critical issue #1
2. **Hourly architecture** — See critical issue #2
3. **Modal grid layout** — See critical issue #3

---

# SECTION 8: REJECTED IDEAS (DON'T REVISIT)

✅ **Do Not Pursue:**
- 10-day forecast (API limitation + UX overwhelm)
- Dark mode toggle (focus dilution)
- Tablet responsive (mobile first, forever)
- Multiple languages (Polish-only)
- Social features (not a social app)
- Feature bloat (less is more)

---

# SECTION 9: LESSONS LEARNED

1. **API limitations must be discovered EARLY** — Test edge cases before designing around them
2. **Device testing mandatory** — Simulator ≠ device
3. **Design changes break unrelated UX** — Test comprehensively after refactors
4. **Build system needs clean state** — Monitor for locked directories before rebuilding
5. **Console debugging required for React Native** — adb logcat is essential
6. **Documentation during development** — Prevents knowledge loss better than recovery documentation
7. **Reference excellence** — Apple's design is worth mimicking

---

# SECTION 10: RECOVERY PROCEDURE (For Next Context Loss)

**If you're reading this in a new session with no prior context:**

1. **Read this file thoroughly** (10 minutes) ← You are here
2. **Understand the status:** PHASE 7A.7, 3 critical issues, design complete
3. **Check critical issues:** minTemp, Dziś godzinowo, Szczegóły
4. **Review design system:** design_system.md (locked, don't change)
5. **Check decision registry:** DECISION_REGISTRY.md (what we've decided)
6. **Read NEVER_FORGET.md:** Core principles (do not violate)
7. **Check git history:** `git log --oneline | head -50` (recent work)
8. **Build & test:** Commands in design_system.md → code_changes.md

**You now have full context. You can:**
- Continue development
- Fix critical issues
- Make informed design decisions
- Understand project constraints
- Know what was attempted and why

---

# SECTION 11: QUICK REFERENCE CHECKLISTS

## Before Coding
- ☑️ Read NEVER_FORGET.md (principles)
- ☑️ Check DECISION_REGISTRY.md (what we've decided)
- ☑️ Verify design_system.md (visual rules locked)
- ☑️ Know current phase (PHASE 7B is next)

## Before Shipping
- ☑️ Test on Motorola Edge 50 (reference device)
- ☑️ Verify performance targets met (build 8s, startup 3s)
- ☑️ Check WCAG AA contrast (min 4.5:1)
- ☑️ Verify offline mode works
- ☑️ Polish language throughout (no English)
- ☑️ Compare to Apple Weather (design parity)

## Before Major Change
- ☑️ Add to DECISION_REGISTRY.md
- ☑️ Update NEVER_FORGET.md if it conflicts
- ☑️ Document rationale (WHY?)
- ☑️ List alternatives considered
- ☑️ Set confidence score
- ☑️ Commit with detailed message

---

# SECTION 12: IMPORTANT CONTACTS & RESOURCES

## Development Environment
- **Project path:** C:\AI_PROJECTS\WeatherApp
- **Device:** Motorola Edge 50 Fusion (Polish market standard)
- **Build command:** `cd android && gradle assembleRelease`
- **Install:** `adb install -r app.apk`
- **Debug:** `adb logcat | grep ReactNative`

## Documentation Files (IN PRIORITY ORDER)
1. **This file** (you are here) — Master context
2. **NEVER_FORGET.md** — Core principles
3. **DECISION_REGISTRY.md** — What we've decided
4. **design_system.md** — Visual rules (locked)
5. **PROJECT_TIMELINE.md** — History
6. **PRODUCT_PHILOSOPHY.md** — Vision
7. **code_changes.md** — Technical details
8. **open_issues.md** — Known problems

## Git Commands Reference
```bash
# See recent work
git log --oneline | head -20

# See what changed in PHASE 7A
git show 5d2c9b6 --stat

# See API migration work
git show 1a67f26 --stat

# Compare design phases
git diff 4921cde 5d2c9b6 -- App.tsx
```

---

# SECTION 13: NEXT PHASE (PHASE 7B)

**When you're ready for PHASE 7B (Desire & Delight Design Pass):**

### Priority Tasks
1. **CRITICAL:** Restore minTemp (1 minute)
2. **CRITICAL:** Redesign Dziś godzinowo (2-3 hours)
3. **CRITICAL:** Fix Szczegóły grid (1-2 hours)
4. **HIGH:** Refine Powietrze badge (30 minutes)
5. **VERIFY:** Test all against Apple Weather

### Success Criteria
✅ All critical issues resolved
✅ Design matches Apple Weather standard
✅ Performance targets maintained
✅ Offline mode functional
✅ Polish language verified
✅ Device testing on Motorola Edge 50

---

# SECTION 14: IMMORTAL TRUTHS

These are not opinions. These are lessons from this project's history:

1. **Polish users prefer Polish UX** (not translated English)
2. **White cards on dark background work** (tested, verified)
3. **Performance matters more than features** (8s build > 20 features)
4. **Offline always needed** (network fails)
5. **Reference excellence** (Apple sets standard)
6. **Documentation during development** (prevents knowledge loss)
7. **Device testing mandatory** (simulator lies)
8. **Clear hierarchy > equal visual weight** (96pt temperature works)
9. **Locked decisions are faster** (one color, one pattern, one way)
10. **Information loss is regression** (never remove data without replacement)

---

# RECOVERY TEST

**If you're a new session reading only this file:**

Can you answer these questions?

1. ✅ What problem does this app solve?
2. ✅ Who is the target user?
3. ✅ What are the 8 core features?
4. ✅ What API does it use? Why that one?
5. ✅ What's the design reference?
6. ✅ What are the 3 critical issues?
7. ✅ What's locked and cannot change?
8. ✅ What's the performance target?
9. ✅ What's next (PHASE 7B)?
10. ✅ Where do I find more details?

**If you answered YES to all:** You have full project context. You're ready to work.

---

# FINAL NOTE

This document is the heart of project immortality.

If every commit message is lost, if the chat history compacts, if the context window closes, if the session ends...

**This file survives.**

A new Claude reading only this file can understand and continue this project.

That is the goal. That is success.

**Treat this document as sacred.**

Keep it current. Update it when major changes happen. Link to it from decisions.

This is the project's DNA. Protect it.

---

**Last updated:** 2026-06-22 04:00
**Current status:** PHASE 7A.7 (Master Memory Creation)
**Next phase:** PHASE 7B (Desire & Delight Design Pass)
**Memory readiness:** 92/100 → 98/100 (target)
**Recovery guarantee:** Any new session understands project in <10 minutes

**This is PROJECT_MASTER_MEMORY.md. This is immortality.**
