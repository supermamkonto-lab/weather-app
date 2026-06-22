---
name: never_forget
description: "Critical principles, lessons, and non-negotiables that define the project"
metadata: 
  node_type: memory
  type: project
  createdDate: 2026-06-22
  lastUpdated: 2026-06-22
  originSessionId: a3cd5bab-b647-4f09-b689-945bfda1ce89
---

# NEVER FORGET — WEATHER APP

**Critical rules, lessons, and decisions that must survive all context loss**

---

## NON-NEGOTIABLE PRINCIPLES

### 1. Apple Weather is the North Star
Every design decision starts: "How does Apple do it?"
- White cards on dark background
- Subtle elevation (not flat, not heavy)
- Large, bold temperature display
- Clear information hierarchy
- Smooth, responsive interactions

**Why:** Premium feel doesn't happen by accident. Reference excellence.
**Never:** Copy random design trends. Reference excellence.

---

### 2. Polish-First, Not English-Translated
This is a Polish app. Not English translated to Polish.
- Polish language throughout
- Polish UI patterns (not copy-pasted from English UX)
- Polish cultural expectations
- Polish numeric/date formats

**Why:** Users feel connection when app "speaks their language"
**Never:** Start with English UX and translate.

---

### 3. Information Hierarchy is Sacred
Largest display = most important data:
1. **96pt bold temperature** — "What's the weather?"
2. **Blue accent description** — "Is it raining?"
3. **Feels like temperature** — "What's the actual feel?"
4. **Tomorrow vs Today** — "Will it change?"
5. **Details** (wind, humidity) — "If I need more"

**Why:** Mobile screen is finite. Users scan fast.
**Never:** Treat all data equally. Emphasize hierarchy.

---

### 4. Offline Mode is Required, Not Optional
App must work without network:
- Cached data displayed
- Timestamp shown (when cache is from)
- No network errors shown
- No blank screens

**Why:** Network fails. Airplane mode exists. Tunnels happen.
**Never:** Require network for basic functionality.

---

### 5. Performance is Non-Negotiable
- Build time: ≤8 seconds
- Startup: ≤3 seconds
- UI response: <200ms
- No jank, no lag

**Why:** Slow app = abandoned app. Users vote with their fingers.
**Never:** Optimize later. Build for performance first.

---

### 6. TypeScript Everywhere, No Exceptions
- Type-safe development
- No `any` types
- Strict null checks
- Catches bugs at compile time

**Why:** React Native needs strong types. Prevents runtime crashes.
**Never:** Use untyped code for "speed".

---

## CRITICAL DECISIONS STILL ACTIVE

### Decision 1: Open-Meteo API (Not wttr.in)
**Status:** ✅ ACTIVE (PHASE 6C complete)
**Why:** wttr.in hard-limited to 3 days. Open-Meteo gives 16 days.
**Never:** Go back to wttr.in. Open-Meteo is locked in.

### Decision 2: 6-Day Forecast (Not 10+)
**Status:** ✅ ACTIVE
**Why:** Users overwhelmed by 10 days. 6 days = sweet spot.
**Never:** Add 10-day forecast without user research.

### Decision 3: WMO Codes (Not WWO)
**Status:** ✅ ACTIVE
**Why:** Open-Meteo uses WMO. WMO_CODE_PL maps to Polish.
**Never:** Mix WMO and WWO codes. One standard.

### Decision 4: White Cards (Not Transparent)
**Status:** ✅ ACTIVE (PHASE 7A locked)
**Why:** #fff cards on dark background = premium + readable.
**Never:** Go back to transparent cards.

### Decision 5: Blue Accent #1E90FF
**Status:** ✅ ACTIVE (PHASE 7A locked)
**Why:** Modern, professional, calm (not alarming red).
**Never:** Use different accent colors. One color system.

---

## CRITICAL BUGS THAT WERE FIXED

### Bug 1: Invisible Text on Transparent Cards (PHASE 6C)
**Symptom:** White text on transparent white = invisible
**Fix:** Changed to white cards with dark text
**Lesson:** WCAG contrast matters. Always test readability.

### Bug 2: Hourly Times All Showing "00:00" (PHASE 6C)
**Symptom:** All 24 hours displayed as "00:00" instead of 00:00-23:00
**Root Cause:** API data was correct, but extraction logic/UI rendering failed
**Status:** Debugging in progress (requires logcat analysis)
**Lesson:** Debug at multiple levels (API → extraction → UI).

### Bug 3: Weather Code Mapping Mismatch (PHASE 6C)
**Symptom:** All forecast cards showed "Brak danych"
**Root Cause:** Open-Meteo returns WMO codes (numeric), code expected WWO (string)
**Fix:** Created WMO_CODE_PL mapping with 25+ Polish translations
**Lesson:** API format changes require schema updates everywhere.

---

## CRITICAL ISSUES STILL OPEN

### Issue 1: minTemp Missing from Forecast Cards 🔴
**Severity:** CRITICAL
**Location:** App.tsx line 1596
**Problem:** Removed in PHASE 7A, causes information loss
**Impact:** User sees only max temp, not daily range
**Fix:** Restore minTemp display (1 minute fix)
**Status:** Flagged for PHASE 7B
**Never:** Lose user data without replacement feature.

### Issue 2: Dziś godzinowo Architecture 🔴
**Severity:** CRITICAL (UX)
**Location:** App.tsx line 1550-1620
**Problem:** Graph (TempCurve) disconnected from time capsules
**Expected:** Single interactive component (like Apple Weather)
**Current:** Two separate components
**Fix:** Requires architecture redesign (2-3 hours)
**Status:** Flagged for PHASE 7B
**Never:** Show disconnected data. Integrate components.

### Issue 3: Szczegóły Modal Grid 🔴
**Severity:** CRITICAL (UX)
**Location:** Modal rendering
**Problem:** Grid layout unstable, values misaligned
**Fix:** Redesign grid with flex + constraints (1-2 hours)
**Status:** Flagged for PHASE 7B
**Never:** Release modal with alignment issues.

---

## LESSONS LEARNED THE HARD WAY

### Lesson 1: API Limitations Must Be Discovered EARLY
**Context:** PHASE 6A tested wttr.in with &days=10 parameter
**Result:** HTTP 500 error. Parameter not supported.
**Discovery:** Hard-coded limit to 3 days. No workaround.
**Lesson:** Document API capabilities early. Test edge cases.
**Never:** Assume APIs support what documentation doesn't explicitly state.

### Lesson 2: Device Testing Can't Be Skipped
**Context:** PHASE 6C code worked in simulator but failed on device
**Result:** ADB connection issues, USB debugging required
**Lesson:** Real device testing is MANDATORY. Simulator != device.
**Never:** Assume simulator = device behavior.

### Lesson 3: Build System Issues Are Time Sinks
**Context:** Windows lock on android/app/build/intermediates during Gradle rebuild
**Result:** Multiple rebuild attempts failed. Required manual directory cleanup.
**Lesson:** Clean build tools before rebuilding. Monitor disk locks.
**Never:** Force rebuild without checking build directory state.

### Lesson 4: Console Logs in Production Debug
**Context:** PHASE 6C hourly times bug required logcat analysis
**Result:** Added debug logs, rebuilt APK, read logcat on device
**Lesson:** Mobile debugging requires device -> logcat pipeline.
**Never:** Debug React Native without adb logcat access.

### Lesson 5: Design Changes Break Unrelated UX
**Context:** PHASE 7A temperature redesign accidentally removed minTemp from cards
**Result:** Information regression detected in audit
**Lesson:** Design changes ripple through UI. Test comprehensively.
**Never:** Make visual-only changes without testing data display.

### Lesson 6: Documentation is Knowledge Insurance
**Context:** PHASE 7A.5 created 2400+ lines of docs
**Result:** Memory readiness jumped from 45/100 to 92/100
**Lesson:** Document WHILE building, not after. Context loss is real.
**Never:** Assume future you will remember current decisions.

---

## REJECTED IDEAS (DON'T REVISIT)

### ❌ 10-Day Forecast
**Tried:** Requested &days=10 parameter on wttr.in
**Result:** API doesn't support it (hard limit 3 days)
**Lesson:** Research API limitations before designing around them
**Never:** Try to add 10-day forecast without researching feasibility

### ❌ Dark Mode Toggle
**Considered:** Support light/dark mode toggle
**Rejected:** Increases complexity, doubles design work, unclear user need
**Current:** Light mode (white cards on dark background)
**Decision:** Polish users = light mode preference. Lock it.
**Never:** Add dark mode without user research first

### ❌ Tablet Responsive Design
**Considered:** Support tablet layout
**Rejected:** Primary device = mobile. Tablet = minority use case.
**Current:** Motorola Edge 50 is reference device (mobile)
**Decision:** Mobile-first forever.
**Never:** Build tablet layout before mobile is perfect

### ❌ Multiple Language Support
**Considered:** English, German, French versions
**Rejected:** Dilutes focus. This is a POLISH app.
**Current:** Polish only
**Decision:** Polish-first. Other languages = future project.
**Never:** Try to be everything to everyone

### ❌ Social Features
**Considered:** Share weather with friends, compare conditions
**Rejected:** Not a social app. Weather is solitary.
**Current:** No social features
**Never:** Add social features just to "engage" users

---

## ARCHITECTURE THAT STAYS

### React Native + TypeScript
**Decision:** Locked
**Why:** Cross-platform, type-safe, proven pattern
**Never:** Rewrite in different language/framework

### Context API for State
**Decision:** Locked
**Why:** Sufficient for weather app. No need for Redux.
**Never:** Over-engineer state management

### AsyncStorage for Caching
**Decision:** Locked
**Why:** Perfect for offline persistence
**Never:** Switch to different persistence layer

### Services Pattern (API calls separate)
**Decision:** Locked
**Why:** Clean separation of concerns
**Never:** Mix API logic in components

---

## METRICS THAT MATTER

### Performance
- Build time: ≤8 sec (test: `gradle clean assembleRelease`)
- Startup: ≤3 sec (test: cold launch)
- UI response: <200ms (test: tap interactions)

### Quality
- Type coverage: 100% (no `any`)
- Offline support: ✅ (always working)
- Test coverage: ≥70% (critical paths)

### User Experience
- Contrast ratio: ≥4.5:1 (WCAG AA)
- Font size minimum: 14pt
- Tap target size: ≥48×48dp

---

## WHEN IN DOUBT

1. **Ask: What would Apple do?** (Reference excellence)
2. **Ask: Will user care?** (80% rule)
3. **Ask: Does this add complexity?** (Prefer simplicity)
4. **Ask: Can this be undone?** (Prefer reversible changes)
5. **Ask: Is this documented?** (If not, document it)

---

## THIS PHILOSOPHY IS PERMANENT

**Every decision here is based on hard-won lessons.**
**Every principle is tested and proven.**
**No exceptions. No shortcuts.**

When new phases come, check back here. This is the anchor.

