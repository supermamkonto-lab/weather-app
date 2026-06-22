---
name: decision_registry
description: Registry of all strategic and tactical decisions made during project development
metadata: 
  node_type: memory
  type: project
  createdDate: 2026-06-22
  totalDecisions: 25
  originSessionId: a3cd5bab-b647-4f09-b689-945bfda1ce89
---

# DECISION REGISTRY — WEATHER APP

**Complete record of decisions: what was chosen, why, current status**

---

## STRATEGIC DECISIONS

### D-001: Project Type (Mobile Weather App)
**Date:** Jun 20, PHASE 1
**Decision:** Build premium Android weather app (React Native)
**Alternatives Considered:**
- Web app (rejected: mobile-first needed)
- iOS native (rejected: limits reach)
**Rationale:** Android users (Poland) deserve premium app. React Native = faster time to market.
**Status:** ✅ ACTIVE (core DNA)
**Still Valid:** YES — Native apps remain better UX than web

---

### D-002: Polish Localization Strategy
**Date:** Jun 20, PHASE 1
**Decision:** Polish-first design (not English translated to Polish)
**Alternatives Considered:**
- English UI with Polish translation (rejected: feels generic)
- Multi-language from start (rejected: delays Polish focus)
**Rationale:** Polish users deserve native UX. Language shapes expectations.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Specialized > generic

---

### D-003: Offline Support
**Date:** Jun 20, PHASE 1
**Decision:** AsyncStorage persistence + offline mode (required feature)
**Alternatives Considered:**
- Online-only (rejected: network fails)
- Cloud sync (rejected: unnecessary complexity)
**Rationale:** Network is unreliable. Something > nothing.
**Status:** ✅ ACTIVE (core feature)
**Still Valid:** YES — Offline access is competitive advantage

---

### D-004: API Choice: wttr.in (PHASE 1-6A)
**Date:** Jun 20, PHASE 1
**Decision:** Use wttr.in for weather data
**Rationale:** Free, reliable, good coverage
**Issues Discovered:** Hard-limited to 3-day forecast (no parameter override)
**Status:** ⏸️ REPLACED (PHASE 6C)
**Resolution:** Replaced with Open-Meteo (16-day free tier)

---

### D-005: API Migration: Open-Meteo (PHASE 6B-6C)
**Date:** Jun 21, PHASE 6B
**Decision:** Migrate from wttr.in to Open-Meteo for weather data
**Alternatives Considered:**
- Request API vendor support for longer forecast (rejected: no response)
- Accept 3-day limit (rejected: user needed 5-6 days)
**Rationale:** Open-Meteo offers 16-day free tier. Solves forecast limitation.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Tested and proven in production

---

### D-006: Code Mapping Standard: WMO (PHASE 6C)
**Date:** Jun 21, PHASE 6C
**Decision:** Use WMO codes (Open-Meteo standard) instead of WWO codes (wttr.in)
**Alternatives Considered:**
- Maintain WWO mapping (rejected: inconsistent)
- Custom weather code system (rejected: unnecessary)
**Rationale:** WMO is international standard. Open-Meteo uses it. One system.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Standard > custom

---

### D-007: Design Reference: Apple Weather
**Date:** Jun 22, PHASE 7A
**Decision:** Use Apple Weather as north star for UI design
**Alternatives Considered:**
- Google Weather (rejected: generic)
- Custom design (rejected: missing opportunity to learn from excellence)
**Rationale:** Apple sets premium standard. Reference excellence.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Apple design remains gold standard

---

### D-008: Polish-First Feature Selection
**Date:** Jun 22, PHASE 7A
**Decision:** Include features relevant to Polish climate:
- Zmiana Pogody (tomorrow vs today)
- Komfort Człowieka (human comfort, important for Poland's climate)
- Godziny Opadów (hourly rainfall, important for planning)
**Rationale:** Not all features relevant to all users. Choose for Poland.
**Status:** ✅ ACTIVE
**Still Valid:** YES — Targeted > generic

---

## TACTICAL DECISIONS

### D-009: Color Palette: Blue #1E90FF
**Date:** Jun 22, PHASE 7A
**Decision:** Use blue (#1E90FF) as primary accent
**Alternatives Considered:**
- Red (rejected: implies danger/heat)
- Orange (rejected: too warm)
- Green (rejected: doesn't match modern weather apps)
**Rationale:** Blue = calm, professional, sky association
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Modern standard

---

### D-010: Card Design: White (Not Transparent)
**Date:** Jun 22, PHASE 7A
**Decision:** Use white cards (rgba(255,255,255,0.93)) on dark background
**Alternatives Considered:**
- Transparent cards (rejected: visibility crisis in PHASE 6C)
- Light gray cards (rejected: insufficient contrast)
**Rationale:** Maximum contrast + readability + premium feel
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Tested and verified

---

### D-011: Temperature Display: 96pt Bold
**Date:** Jun 22, PHASE 7A
**Decision:** Display temperature at 96pt font weight 700 with -2px tracking
**Alternatives Considered:**
- 88pt light (rejected: not visually dominant)
- 100pt (rejected: too large, breaks layout)
**Rationale:** Temperature is primary data point. Must dominate.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Information hierarchy

---

### D-012: Font Weight System: 700 Values / 400-500 Labels
**Date:** Jun 22, PHASE 7A
**Decision:** Standardize font weights:
- Values: 700 (bold, readable)
- Labels: 400-500 (subtle, secondary)
**Alternatives Considered:**
- Mixed weights (rejected: inconsistent)
**Rationale:** Clear hierarchy through weight
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Consistent > varied

---

### D-013: Spacing System: 14-16pt Vertical / 12-16pt Horizontal
**Date:** Jun 22, PHASE 7A
**Decision:** Standardize card padding:
- Vertical: 14-16pt
- Horizontal: 12-16pt
- Base unit: 2pt multiples
**Rationale:** Creates visual rhythm, Apple standard
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Systematic approach

---

### D-014: Border Radius: 13-14pt Standard
**Date:** Jun 22, PHASE 7A
**Decision:** All cards use 13-14pt border radius
**Alternatives Considered:**
- Varied radius (rejected: inconsistent)
- Sharp corners (rejected: outdated)
**Rationale:** Modern, gentle curves
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Contemporary design

---

### D-015: Shadow System: rgba(0,0,0,0.10-0.12)
**Date:** Jun 22, PHASE 7A
**Decision:** Standardize shadow colors:
- Standard: rgba(0,0,0,0.10) opacity 1
- Emphasis: rgba(0,0,0,0.12) opacity 1
- Special: rgba(30,144,255,0.4) for active states
**Rationale:** Subtle but visible. Creates depth.
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Material design principle

---

### D-016: Remove Emoji (PHASE 6-7A)
**Date:** Jun 22, PHASE 7A
**Decision:** Remove all emoji (☀️, ☁️, 🌙) replace with descriptions
**Alternatives Considered:**
- Keep emoji (rejected: unprofessional, accessibility issues)
**Rationale:** Premium apps use icon systems, not emoji
**Status:** ✅ ACTIVE (locked)
**Still Valid:** YES — Professional > casual

---

## CONTROVERSIAL DECISIONS (PENDING REVIEW)

### D-017: Remove minTemp from Forecast Cards ⚠️
**Date:** Jun 22, PHASE 7A (commit 5d2c9b6)
**Decision:** Remove minTemp display from forecast cards
**Introduced:** Information loss (only shows max temp, not range)
**Alternatives Considered:**
- Keep minTemp (rejected: unclear reason)
**Current Status:** FLAGGED as REGRESJA
**Recommendation:** RESTORE in PHASE 7B
**Still Valid:** NO — Information loss not justified
**Confidence:** 30% (decision rationale not documented)

---

### D-018: Dziś godzinowo Architecture (Two Components) ⚠️
**Date:** Jun 22, PHASE 7A
**Decision:** Split hourly forecast into:
- TempCurve graph (interactive line chart)
- Time capsules grid (separate 5-column grid)
**Issue:** Components disconnected. User sees unrelated data.
**Expected (Apple):** Single interactive component
**Current Status:** FLAGGED for PHASE 7B redesign
**Still Valid:** NO — Architecture needs rethinking
**Confidence:** 25% (UX issue confirmed)

---

### D-019: Szczegóły Modal Grid Alignment ⚠️
**Date:** Jun 22, PHASE 7A
**Decision:** Grid layout for detail values
**Issue:** Values misaligned, layout unstable
**Current Status:** FLAGGED for PHASE 7B redesign
**Still Valid:** NO — Needs layout fix
**Confidence:** 40% (visual issue confirmed)

---

## BUILD & TESTING DECISIONS

### D-020: Build Target: Android Release APK
**Date:** Jun 20, PHASE 1
**Decision:** Build for Android release (not debug)
**Rationale:** Production-ready from day 1
**Status:** ✅ ACTIVE
**Still Valid:** YES

---

### D-021: Performance Targets
**Date:** Jun 20, PHASE 1
**Decision:** Set and maintain performance targets:
- Build time: ≤8 seconds
- Startup: ≤3 seconds
- UI response: <200ms
- Performance score: ≥92/100
**Status:** ✅ ACTIVE (monitored)
**Still Valid:** YES — Non-negotiable

---

### D-022: Device Reference: Motorola Edge 50 Fusion
**Date:** Jun 21, PHASE 3C
**Decision:** Motorola Edge 50 Fusion = reference device (Polish market standard)
**Rationale:** Common in Poland, realistic performance envelope
**Status:** ✅ ACTIVE
**Still Valid:** YES — Reference device doesn't change

---

## PROCESS DECISIONS

### D-023: Documentation During Development
**Date:** Jun 22, PHASE 7A.5
**Decision:** Create comprehensive documentation DURING development (not after)
**Rationale:** Context loss is real. Document while context is fresh.
**Status:** ✅ ACTIVE (PHASE 7A.5 example)
**Still Valid:** YES — Prevents knowledge loss

---

### D-024: Master Memory Architecture
**Date:** Jun 22, PHASE 7A.7
**Decision:** Create 5-layer memory structure:
1. PROJECT_MASTER_MEMORY.md (top-level)
2. PROJECT_TIMELINE.md (history)
3. PRODUCT_PHILOSOPHY.md (vision)
4. NEVER_FORGET.md (principles)
5. DECISION_REGISTRY.md (this file)
**Rationale:** Any new session needs to understand project in <10 minutes
**Status:** ✅ ACTIVE (in progress)
**Still Valid:** YES — Knowledge insurance

---

### D-025: Code Review Before Architecture
**Date:** Jun 21, PHASE 3A
**Decision:** Audit existing code before deciding on refactoring
**Rationale:** Understand system before redesigning it
**Status:** ✅ ACTIVE (best practice)
**Still Valid:** YES — Measure before optimizing

---

## DECISION SUMMARY TABLE

| ID | Decision | Date | Status | Still Valid? | Confidence |
|----|----------|------|--------|--------------|------------|
| D-001 | Mobile app (React Native) | Jun 20 | ✅ ACTIVE | YES | 100% |
| D-002 | Polish-first design | Jun 20 | ✅ ACTIVE | YES | 100% |
| D-003 | Offline support required | Jun 20 | ✅ ACTIVE | YES | 100% |
| D-004 | wttr.in API | Jun 20 | ⏸️ REPLACED | NO | — |
| D-005 | Open-Meteo migration | Jun 21 | ✅ ACTIVE | YES | 100% |
| D-006 | WMO code standard | Jun 21 | ✅ ACTIVE | YES | 100% |
| D-007 | Apple Weather reference | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-008 | Polish-specific features | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-009 | Blue #1E90FF accent | Jun 22 | ✅ ACTIVE | YES | 95% |
| D-010 | White card design | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-011 | 96pt bold temperature | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-012 | Font weight system | Jun 22 | ✅ ACTIVE | YES | 95% |
| D-013 | Spacing system | Jun 22 | ✅ ACTIVE | YES | 90% |
| D-014 | Border radius standard | Jun 22 | ✅ ACTIVE | YES | 90% |
| D-015 | Shadow system | Jun 22 | ✅ ACTIVE | YES | 95% |
| D-016 | Remove emoji | Jun 22 | ✅ ACTIVE | YES | 85% |
| D-017 | Remove minTemp | Jun 22 | ⚠️ REVIEW | NO | 30% |
| D-018 | Hourly architecture | Jun 22 | ⚠️ REVIEW | NO | 25% |
| D-019 | Detail grid layout | Jun 22 | ⚠️ REVIEW | NO | 40% |
| D-020 | Release APK build | Jun 20 | ✅ ACTIVE | YES | 100% |
| D-021 | Performance targets | Jun 20 | ✅ ACTIVE | YES | 100% |
| D-022 | Motorola reference device | Jun 21 | ✅ ACTIVE | YES | 100% |
| D-023 | Doc during development | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-024 | Master memory architecture | Jun 22 | ✅ ACTIVE | YES | 100% |
| D-025 | Code review first | Jun 21 | ✅ ACTIVE | YES | 100% |

---

## WHEN MAKING NEW DECISIONS

1. **Check this registry first** — Have we decided this before?
2. **Document immediately** — Add to registry, don't wait
3. **Include rationale** — WHY? Include alternatives considered
4. **Set status clearly** — ACTIVE, PENDING, REPLACED
5. **Confidence score** — How sure are we (0-100%)?
6. **Link to NEVER_FORGET** — Does this violate core principles?

**This is the project memory. Keep it current.**

