# CLAUDE.md — Project Recovery Instructions

**This file directs every new Claude session on how to work with this project.**

**Date created:** 2026-06-22  
**Updated:** 2026-07-04 — WeatherApp V2 filozofia zatwierdzona  
**Project:** WeatherApp — Weather Experience (produkt premium)  
**Current Phase:** PHASE V2 ALPHA — żywy Hero + AI Advice  
**Restore point:** git tag `v1-stable-pre-v2` (V1 stabilna, nieruszona)  
**Design System:** `docs/DESIGN_SYSTEM_V2.md` — OBOWIĄZUJĄCY  
**Poprzedni DS:** `docs/DESIGN_SYSTEM.md` — archiwum (nie usuwać)

---

## 🎯 WHAT IS THIS PROJECT?

**Weather App** — React Native mobile application displaying:
- Current weather (temperature, wind, humidity, etc.)
- Hourly forecast (next 24 hours with temperature curve)
- Daily forecast (next 7 days)
- Detailed information (UV, air quality, visibility, etc.)
- Polish language UI (pl-PL locale)
- Apple Human Interface design principles

**Target device:** Motorola Edge 50 Fusion (reference device)  
**API:** Open-Meteo (free weather data, migrated from wttr.in in Phase 6C)  
**Tech stack:** React Native 0.86.0 + TypeScript (strict mode)

---

## 🏗️ ARCHITECTURE

### Core Layers

**UI Layer (App.tsx, ~2800 lines)**
- Main weather screen with hero section
- Favorites management
- Navigation between screens
- Design system enforcement (colors, typography, spacing)

**Data Layer (Context API + AsyncStorage)**
- Weather data caching
- User preferences (favorites, settings)
- Offline support

**API Layer (Open-Meteo)**
- Current weather endpoint
- Hourly forecast endpoint
- Daily forecast endpoint
- WMO code mapping to Polish descriptions

**Build System (Gradle + React Native)**
- Android APK compilation (~8 seconds)
- Release and debug builds
- Metro bundler for JS code

---

## 📊 CURRENT STATUS

**Phase:** PHASE 7A (Documentation & Recovery) — ✅ COMPLETE  
**Code Status:** Stable, design locked  
**Build Status:** ✅ Verified — builds & runs on Motorola Edge 50 Fusion (2026-06-22)  
**Documentation:** Complete (13 files in docs/, 4700+ lines)  
**GitHub:** All code synced, commits pushed  
**Recovery Score:** 92/100 (excellent)

**Next Phase:** PHASE 7B (4-6 hours)
1. Restore minTemp in forecast cards (1 min)
2. Redesign Dziś godzinowo (2-3 hours)
3. Redesign Szczegóły grid (1-2 hours)
4. Refine Powietrze badge (30 min)

---

## 📍 WHERE TO FIND THINGS

**Code:** `/c/AI_PROJECTS/WeatherApp/`

**GitHub:** https://github.com/supermamkonto-lab/weather-app

**Documentation:** `/c/AI_PROJECTS/WeatherApp/docs/`
- Start here: `docs/README.md`
- Project context: `docs/PROJECT_MASTER_MEMORY.md`
- Design rules: `docs/DESIGN_SYSTEM.md`
- Decision history: `docs/DECISION_REGISTRY.md`
- Open issues: `docs/OPEN_ISSUES_AND_ROADMAP.md`

**Backup & Recovery:** `/c/AI_PROJECTS/WeatherApp/.claude-backup/`
- TIER 1: Critical session knowledge
- TIER 2: Important project documentation
- TIER 3: User preferences & feedback

---

## 🚀 HOW TO WORK ON THIS PROJECT

### Before You Start

1. **Read project context** (5 minutes)
   - Open: `docs/README.md`
   - Then: `docs/PROJECT_MASTER_MEMORY.md`

2. **Know the rules** (3 minutes)
   - Open: `docs/NEVER_FORGET.md`
   - This file: `CLAUDE.md`

3. **Understand decisions** (5 minutes)
   - Open: `docs/DECISION_REGISTRY.md`
   - Prevents revisiting rejected ideas

4. **See what needs fixing** (2 minutes)
   - Open: `docs/OPEN_ISSUES_AND_ROADMAP.md`
   - PHASE 7B roadmap

### Build & Test

**Start development:**
```bash
cd /c/AI_PROJECTS/WeatherApp
npm start
```

**Build APK (debug):**
```bash
cd /c/AI_PROJECTS/WeatherApp/android
./gradlew assembleDebug
```

**Performance targets:**
- Build time: ~8 seconds ✅
- Startup time: ~3 seconds ✅
- Design system locked (no color/font changes)

### Rules (NON-NEGOTIABLE)

🔴 **DO NOT:**
- ❌ Change code without explicit request
- ❌ Build APK without explicit request
- ❌ Modify design system (locked, see DESIGN_SYSTEM.md)
- ❌ Ignore user feedback (see NEVER_FORGET.md)
- ❌ Reopen closed decisions (see DECISION_REGISTRY.md)

🟢 **DO:**
- ✅ Show full file paths (see feedback_file_paths.md)
- ✅ Reference docs when explaining features
- ✅ Check .claude-backup/ if context is unclear
- ✅ Verify recovery procedure after major changes
- ✅ Update SESSION_HANDOFF.md at end of session

---

## 🎨 DESIGN SYSTEM (LOCKED)

**These are FROZEN. Do not change:**

### Colors
- Primary: #1E90FF (blue)
- Surface: rgba(255,255,255,0.93) (white)
- Text primary: #1F2937 (dark gray)
- Text secondary: #9CA3AF (medium gray)

### Typography
- Hero temp: 96pt, weight 700, letter-spacing -2
- Section header: 32pt
- Body text: 14pt

### Spacing
- Rhythm: 8pt gaps
- Padding: 14-16pt standard
- Elevation: levels 2-5 with shadows

### Border Radius
- Standard: 13-14pt
- Cards: consistent across all screens

**Reference:** `docs/DESIGN_SYSTEM.md` (400+ lines, complete rules)  
**Decision rationale:** `docs/DESIGN_DECISIONS.md` (350+ lines, explains WHY)

---

## 🔄 DISASTER RECOVERY

**If Claude crashes / resets:**

1. **Read recovery guide:** `RECOVERY_BOOTSTRAP.md` (in project root)
2. **Load context files:** `.claude-backup/TIER_1_CRITICAL/`
3. **Recovery time:** ~5 minutes

**Critical files for recovery:**
- `PROJECT_MASTER_MEMORY.md` — Project context
- `SESSION_V2_KNOWLEDGE_ARCHIVE.md` — Recent discoveries
- `DECISION_REGISTRY.md` — All decisions
- `feedback_file_paths.md` — Communication style

**If backup is missing:** Check `docs/` folder (GitHub-backed)

---

## 📝 USER FEEDBACK (CRITICAL)

**User:** Pablo (Windows 11 Pro, Polish locale pl-PL)

**Communication style:** Always explain what each command does and why

**File paths:** Always show full absolute paths to created files

**Permissions:** Full PowerShell + screenshot access (weather app only)

**See:** `.claude-backup/TIER_3_USER_CONTEXT/`

---

## 🔐 PROTECTION

**Folders NOT in GitHub:**
- `.claude-backup/` — Local recovery only
- `memory/` — Session memory only
- `.claude/` — Claude Code config only
- `node_modules/`, `android/app/build/`, etc.

**See:** `.gitignore` (properly configured)

---

## 📞 WHEN IN DOUBT

**Order of authority:**
1. Read `docs/NEVER_FORGET.md` — Absolute rules
2. Read `docs/PROJECT_MASTER_MEMORY.md` — Project context
3. Read `docs/DESIGN_SYSTEM.md` — Visual rules
4. Read `docs/DECISION_REGISTRY.md` — What was decided and why
5. Read `docs/OPEN_ISSUES_AND_ROADMAP.md` — What needs fixing

**All answers are in these files.** If something is unclear, these docs have it.

---

## 📁 FILE PATHS CONFIGURATION

**Claude Code session folder:** `/c/AI_PROJECTS`

**This project location:** `/c/AI_PROJECTS/WeatherApp`

**Markdown links must use relative paths from session folder:**
- ✅ CORRECT: `[FILE.md](WeatherApp/docs/FILE.md)`
- ❌ WRONG: `[FILE.md](docs/FILE.md)` — missing WeatherApp prefix
- ❌ WRONG: `C:\AI_PROJECTS\WeatherApp\docs\FILE.md` — absolute paths don't work in Claude Code links

**Always show full path when creating files:**
- ✅ Ścieżka: `/c/AI_PROJECTS/WeatherApp/docs/FILENAME.md`
- ✅ Link: [FILENAME.md](WeatherApp/docs/FILENAME.md)

---

## ✅ YOU ARE READY WHEN

- ✅ You understand project vision (weather app, Open-Meteo API)
- ✅ You know current phase (PHASE 7A.10, next PHASE 7B)
- ✅ You've read NEVER_FORGET.md (rules are clear)
- ✅ You know design system is locked (no color/font changes)
- ✅ You can find every documentation file
- ✅ You know recovery procedure exists

**Estimated time to full readiness:** 15-20 minutes

---

**This file ensures project survival across Claude resets, crashes, or session loss.**

**Last updated:** 2026-06-22 (Phase 7A COMPLETE — deployment verified on device)  
**Next update:** After each major phase completion
