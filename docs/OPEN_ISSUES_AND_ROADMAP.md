---
name: open_issues
description: "All known bugs, regressions, and design debt awaiting resolution"
metadata: 
  node_type: memory
  type: project
  lastUpdated: 2026-06-22T02:50:00Z
  originSessionId: bfcdca2f-0252-4b7e-92d0-d4edbc3a00c8
---

# OPEN ISSUES — WEATHER APP

**Status:** All issues from PHASE 7A audit + preceding development
**Severity:** Critical, High, Medium, Low
**Timeline:** PHASE 7B will address all of these

---

## CRITICAL ISSUES (Blocking)

### 1. REGRESJA UX: Missing minTemp in Forecast Cards

**Severity:** 🔴 CRITICAL
**Location:** App.tsx lines 1590-1609 (Forecast card rendering)
**Introduced:** PHASE 7A commit 5d2c9b6
**Discovered:** PHASE 7A Audit (Jun 22 02:16)

**Problem:**
```
Shows: 27° Jutro
Should show: 27° / 20° Jutro (range)
```

**Impact:**
- User loses important information (minimum daily temperature)
- Inconsistent with Apple Weather pattern (always shows range)
- Incomplete forecast data
- Information regression vs Phase 6C

**Root Cause:**
- Line removed in Phase 7A redesign:
  ```javascript
  <Text>{day.minTemp.replace('°C', '°')}</Text>
  ```
- Reason for removal unclear (see design_decisions.md)

**How to Fix:**
1. Restore minTemp display below/beside maxTemp
2. Format: Either stacked (27° / 20°) or spaced (27° on top, 20° below)
3. Use smaller font for minTemp (11-12pt)
4. Color: Same or slightly lighter gray

**Code to Add:**
```javascript
// After maxTemp display
<Text style={{ fontSize: 11, fontWeight: '600', color: '#9ca3af', marginBottom: 2 }}>
  {day.minTemp.replace('°C', '°')}
</Text>
```

**Priority:** ✅ FIX IMMEDIATELY (PHASE 7B)
**Estimated effort:** 1 minute
**Testing:** Compare to Apple Weather, verify range visible

---

### 2. ARCHITECTURE: Dziś godzinowo Split into 2 Components

**Severity:** 🔴 CRITICAL (UX)
**Location:** App.tsx ~1550-1620
**Components:** TempCurve.tsx + time capsules (separate grid)
**Status:** Identified in PHASE 7A Audit

**Problem:**
Current structure:
```
┌─────────────────────────────────┐
│        TempCurve (Graph)        │  ← Interactive
│   Blue curve, points, time mark │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Time capsules (Grid 5 columns) │  ← Separate data
│  00:00 01:00 02:00 03:00 04:00 │
│  22°   22°   22°   21°   21°   │
└─────────────────────────────────┘
```

**Expected (Apple Weather):**
```
Single component: Drag X-axis to see different times
Graph follows cursor selection
Show selected hour's details below
```

**Impact:**
- User sees disconnected data (graph doesn't relate to capsules)
- Must look at graph AND capsules separately
- No interactivity between components
- Confusing "what does this time mean?" experience

**Root Cause:**
- TempCurve is SVG-based display
- Time capsules are separate React grid
- No unified data model
- Not designed as single interactive component

**Proposed Solution:**
1. Create unified component: `<HourlyForecast>`
2. Unify data source (one state, one point = one hour)
3. Add interactivity: Tap/drag on graph → show capsule details
4. Layout: Graph on top, interactive slider below
5. Or: Horizontal scroll with graph + capsule synchronized

**Priority:** ⚠️ PHASE 7B (redesign required)
**Estimated effort:** 2-3 hours
**Dependencies:** Requires component restructuring

---

## HIGH SEVERITY ISSUES

### 3. DESIGN DEBT: Szczegóły (Details) Dashboard Style

**Severity:** 🟠 HIGH
**Location:** App.tsx ~1610-1750 (Szczegóły section rendering)
**Status:** Identified in PHASE 7A Audit

**Problem:**
Current structure:
```
2x2 grid layout:
┌──────────┬──────────┐
│ 1025 hPa │ 50 km    │  (Pressure, Visibility)
├──────────┼──────────┤
│ 0        │ 16h 30m  │  (UV Index, Day length)
│          │ [orange] │  ← Orange background looks cheap
├──────────┼──────────┤
│ 04:30    │ 21:00    │  (Sunrise, Sunset)
└──────────┴──────────┘
```

**Issues:**
1. Dashboard-like 2x2 grid (not premium)
2. Inconsistent backgrounds (orange on "Długość dnia")
3. No visual variety or hierarchy
4. Looks like spreadsheet data, not widget

**Expected (Apple Weather style):**
```
Mini-widget layout:
┌─────────────────┐
│ 🌡️ Ciśnienie      │
│ 1025 hPa        │
└─────────────────┘

┌─────────────────┐
│ 👁️ Widoczość     │
│ 50 km           │
└─────────────────┘

[etc. — each as separate mini-card]
```

**Impact:**
- Looks developer-ish, not premium
- Colored backgrounds create visual noise
- Inconsistent component design
- Detracts from premium appearance

**Root Cause:**
- Grid layout optimized for space, not aesthetics
- Orange background is remnant of old styling
- No mini-widget component model

**Proposed Solution:**
1. Convert 2x2 grid → responsive grid (1-2 columns)
2. Each item = separate white card (mini-widget)
3. Icon + label + large value format
4. Remove all colored backgrounds
5. Consistent padding/spacing throughout

**Priority:** ⚠️ PHASE 7B (redesign)
**Estimated effort:** 1-2 hours

---

## MEDIUM SEVERITY ISSUES

### 4. BADGE: Powietrze (Air Quality) in Hero

**Severity:** 🟡 MEDIUM
**Location:** App.tsx ~1325-1328 (heroBadge)
**Status:** Flagged in PHASE 7B Audit

**Problem:**
Current:
```
┌──────────────────────────┐
│ ● Powietrze: Umiarkowana │  ← Icon + text in row
└──────────────────────────┘
```

Issues:
1. Small icon doesn't match premium feel
2. Layout is cramped (icon + text in one row)
3. Looks developer-made, not designed
4. Badge position competes with main temperature

**Expected:**
```
Large icon + Large number (AQI) + word description
Similar to Apple Health style badges
```

**Impact:** ⚠️ Minor (Hero works, but this element feels off)

**Priority:** 🟡 PHASE 7B (refinement)
**Estimated effort:** 30 minutes

---

### 5. VISUAL: Quick Action Buttons Could Be More Premium

**Severity:** 🟡 MEDIUM
**Location:** App.tsx ~1380-1420 (Quick actions: Prognoza, ICM, Sport, Porównaj)
**Status:** Works, but could be refined

**Current:**
- White outline buttons with elevation 2
- OK appearance, but basic

**Could improve:**
- Add more visual feedback (color accent on text)
- Larger icons
- More prominent layout

**Priority:** 🟡 PHASE 7C (Enhancement)
**Estimated effort:** 1 hour

---

## LOW SEVERITY ISSUES

### 6. RESPONSIVE: Tablet Layout Not Optimized

**Severity:** 🔵 LOW
**Status:** Not tested on tablets
**Impact:** Low (primary device = phone)

**Note:** Weather app is mobile-first. Tablet support = future phase.

---

### 7. DARK MODE: Not Implemented

**Severity:** 🔵 LOW
**Status:** Not implemented
**Impact:** Nice to have, not critical

**Note:** Apple weather has dark mode. Could be Phase 8 task.

---

### 8. ANIMATIONS: Limited Motion/Transitions

**Severity:** 🔵 LOW
**Status:** Identified in PHASE 7A Audit
**Impact:** Would add 10-20 points to premium feeling

**What works:**
- Hero fade-in on load ✅
- Card press feedback (activeOpacity) ✅

**What's missing:**
- Smooth transitions between screens
- Pull-to-refresh animation
- Hourly chart scroll animation
- Value change animations

**Priority:** 🔵 PHASE 8 (Polish)

---

## ARCHITECTURE DEBT

### 9. Component Organization

**Status:** Acceptable for current scope
**Future improvement:** Extract more components
- Currently: Most UI in App.tsx
- Could be: Separate Hero, Dashboard, Forecast, Details components

**Priority:** Later refactoring (after design complete)

---

## TESTING ISSUES

### 10. No Automated Tests

**Status:** No unit tests
**Impact:** Manual testing only
**Priority:** After design complete

---

## SUMMARY TABLE

| # | Issue | Severity | Type | PHASE 7B | Effort |
|---|-------|----------|------|----------|--------|
| 1 | minTemp missing | 🔴 CRITICAL | Regression | ✅ FIX | 1 min |
| 2 | Dziś godzinowo split | 🔴 CRITICAL | Architecture | ⚠️ REDESIGN | 2-3h |
| 3 | Szczegóły grid | 🟠 HIGH | Design debt | ⚠️ REDESIGN | 1-2h |
| 4 | Powietrze badge | 🟡 MEDIUM | Polish | ⚠️ REFINE | 30m |
| 5 | Quick actions | 🟡 MEDIUM | Enhancement | ⏸️ Optional | 1h |
| 6 | Tablet layout | 🔵 LOW | Responsive | ⏸️ Future | TBD |
| 7 | Dark mode | 🔵 LOW | Feature | ⏸️ Future | TBD |
| 8 | Animations | 🔵 LOW | Polish | ⏸️ Future | TBD |
| 9 | Components | 🔵 LOW | Architecture | ⏸️ Refactor | TBD |
| 10 | Tests | 🔵 LOW | QA | ⏸️ QA phase | TBD |

---

## PHASE 7B Action Plan

### Must Fix (Blocking)
1. ✅ Restore minTemp (1 min)

### Should Fix (Redesign)
2. ⚠️ Redesign Dziś godzinowo (2-3h)
3. ⚠️ Redesign Szczegóły (1-2h)
4. ⚠️ Refine Powietrze badge (30m)

### Timeline
- minTemp: First 1 minute
- Rest: Staggered based on complexity
- Target: Complete PHASE 7B by Jun 22 18:00

---

## Not Issues (Working As Designed)

✅ Temperature display (96pt, bold, blue)
✅ White card design
✅ Elevation system
✅ Design system consistency
✅ Color palette
✅ Typography hierarchy
✅ Spacing rhythm
✅ Border radius consistency
✅ Hero section layout
✅ Favorite cities chip design

---

**Document Status:** All issues documented and prioritized.
**Next Step:** PHASE 7A.5 continues with documentation (ETAP 7-8).
**PHASE 7B:** Ready to proceed once documentation complete.
