---
name: critical_disaster_recovery_plan
description: "Critical disaster recovery - project + Claude global files backup strategy"
metadata:
  type: project
  criticality: "CRITICAL"
  lastUpdated: "2026-06-22T04:35:00Z"
  phase: "7A.10 - Disaster Recovery Planning"
---

# CRITICAL DISASTER RECOVERY PLAN

**Weather App — Claude Crash Recovery Strategy**

---

## EXECUTIVE SUMMARY

### Problem
If Claude crashes or resets, the **Global Claude Memory** (Session V1, V2 knowledge, user profiles, feedback) is lost. The project code survives (it's in GitHub), but the SESSION CONTEXT dies.

### Solution
Create **`project/.claude-backup/`** folder — a LOCAL copy of all critical global Claude files that:
1. **Survives Claude crashes** (stored in project, not in global Claude memory)
2. **Restores context in <5 minutes** (new Claude can load backup files)
3. **Never pushed to GitHub** (protected by .gitignore)
4. **Regularly synced** (copied from memory/ periodically)

### Result
**100% project recovery capability** — new Claude can:
- Read project code ✅ (from GitHub clone)
- Understand architecture ✅ (from docs/)
- Know history + decisions ✅ (from docs/)
- Recover session knowledge ✅ (from .claude-backup/)
- Know user preferences ✅ (from .claude-backup/)

---

## CRITICAL FILES AUDIT

### TIER 1: ABSOLUTELY CRITICAL (Must have for recovery)

**These files MUST be in backup:**

#### From memory/ (Global Claude):

1. **SESSION_V2_KNOWLEDGE_ARCHIVE.md** (14 KB)
   - **Path:** `/c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/SESSION_V2_KNOWLEDGE_ARCHIVE.md`
   - **Content:** All discoveries, decisions, code changes from Session V2
   - **Why critical:** Contains context that's not in GitHub (decisions, patterns, issues found)
   - **Recovery impact:** HIGH — new Claude won't understand recent work without this
   - **Backup to:** `project/.claude-backup/SESSION_V2_KNOWLEDGE.md`

2. **SESSION_V1_V2_CONSOLIDATION_REPORT.md** (14 KB)
   - **Path:** `/c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/SESSION_V1_V2_CONSOLIDATION_REPORT.md`
   - **Content:** What happened in V1+V2, consolidation decisions
   - **Why critical:** Explains project status & how docs were organized
   - **Recovery impact:** MEDIUM — helps understand project state
   - **Backup to:** `project/.claude-backup/CONSOLIDATION_AUDIT.md`

3. **PROJECT_MASTER_MEMORY.md** (15 KB)
   - **Path:** `/c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/PROJECT_MASTER_MEMORY.md`
   - **Content:** Complete project context snapshot
   - **Why critical:** Master document for project understanding
   - **Recovery impact:** MEDIUM — also in docs/ but good to have local copy
   - **Backup to:** `project/.claude-backup/PROJECT_MASTER_MEMORY.md`

4. **MEMORY.md** (1.7 KB)
   - **Path:** `/c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/MEMORY.md`
   - **Content:** Index of all memory files + their purposes
   - **Why critical:** Shows what documentation exists and where to find it
   - **Recovery impact:** HIGH — navigation for new Claude session
   - **Backup to:** `project/.claude-backup/MEMORY_INDEX.md`

5. **feedback_file_paths.md** (1.9 KB)
   - **Path:** `/c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/feedback_file_paths.md`
   - **Content:** Global instruction - always show full file paths
   - **Why critical:** User preference that must be respected in new session
   - **Recovery impact:** MEDIUM — ensures consistency in new Claude's output
   - **Backup to:** `project/.claude-backup/FEEDBACK_FILE_PATHS.md`

#### From project root:

6. **CLAUDE.md** (if exists)
   - **Path:** `/c/AI_PROJECTS/WeatherApp/CLAUDE.md` (or similar)
   - **Content:** Project-specific Claude instructions
   - **Why critical:** Directs new Claude on how to work on this project
   - **Recovery impact:** HIGH — tells new Claude what to do
   - **Status:** ⚠️ NOT FOUND (should create!)
   - **Action:** CREATE THIS FILE

#### From docs/ (Public but also backup):

7. **NEVER_FORGET.md** (11 KB)
   - **Path:** `/c/AI_PROJECTS/WeatherApp/docs/NEVER_FORGET.md`
   - **Content:** Non-negotiable principles, lessons learned
   - **Why critical:** Rules that guide all decisions
   - **Recovery impact:** MEDIUM — ensures decisions follow principles
   - **Status:** ✅ In docs/ + memory/
   - **Backup to:** `project/.claude-backup/NEVER_FORGET.md`

### TIER 2: VERY IMPORTANT (Should have for recovery)

**These files SHOULD be in backup:**

1. **feedback_communication_style.md** (1 KB)
   - Communication preferences for this user
   - **Backup to:** `project/.claude-backup/USER_FEEDBACK.md`

2. **user_environment.md** (1.2 KB)
   - User system info (Windows 11 Pro, Polish locale)
   - **Backup to:** `project/.claude-backup/USER_ENVIRONMENT.md`

3. **user_permissions_weatherapp.md** (1 KB)
   - Project-specific permissions (PowerShell, screenshot access)
   - **Backup to:** `project/.claude-backup/USER_PERMISSIONS.md`

4. **RECOVERY_TEST_RESULTS.md** (9.4 KB)
   - Proof that recovery procedures work
   - **Backup to:** `project/.claude-backup/RECOVERY_VALIDATION.md`

5. **PHASE_7A5_FINAL_REPORT.md** (12 KB)
   - Phase 7A.5 completion summary
   - **Backup to:** `project/.claude-backup/PHASE_REPORTS.md`

### TIER 3: SUPPORTING (Optional but helpful)

**These files are NICE TO HAVE:**

1. Current project phase status
2. Latest code audit results
3. Architecture notes
4. Performance metrics

---

## PROJECT FILES AUDIT

### Critical Project Files (Must exist)

**In repository root:**
- ✅ `LICENSE` — Legal (must have)
- ✅ `CHANGELOG.md` — Version history
- ✅ `.gitignore` — Prevents leaking secrets
- ✅ `package.json` — Dependencies (must have)
- ✅ `README.md` — Quick start (must have)

**In docs/ folder:**
- ✅ 13 files (4700+ lines) — Complete documentation

**In src/ folder:**
- ✅ Complete React Native code (must have)

**In android/ folder:**
- ✅ Gradle build config (must have)

### Critical Project Files (Need to verify)

**Missing / Need creation:**
- ❌ `CLAUDE.md` — **PROJECT-SPECIFIC CLAUDE INSTRUCTIONS**
  - **Path:** `/c/AI_PROJECTS/WeatherApp/CLAUDE.md` (should exist)
  - **Content:** How to work on this project
  - **Why critical:** Directs new Claude on approach
  - **Action:** CREATE IMMEDIATELY
  
- ⚠️ `RECOVERY_BOOTSTRAP.md` — **Initial Claude bootstrap document**
  - **Path:** `/c/AI_PROJECTS/WeatherApp/RECOVERY_BOOTSTRAP.md` (should exist)
  - **Content:** First steps for recovering project from disk
  - **Why critical:** Fast recovery without GitHub lookup
  - **Action:** CREATE IMMEDIATELY

- ⚠️ `QUICK_START_FOR_NEW_CLAUDE.md` — **Fast onboarding**
  - **Content:** How new Claude gets up to speed in 5 minutes
  - **Action:** CREATE IMMEDIATELY

---

## PROPOSED BACKUP STRUCTURE

### Directory: `project/.claude-backup/`

**Location:** `/c/AI_PROJECTS/WeatherApp/.claude-backup/`

**Contents (11 files):**

```
.claude-backup/
├── README.md (How to use this folder)
├── INDEX.md (Catalog of all files)
│
├── TIER_1_CRITICAL/
│   ├── SESSION_V2_KNOWLEDGE.md (14 KB) ← MOST IMPORTANT
│   ├── CONSOLIDATION_AUDIT.md (14 KB)
│   ├── PROJECT_MASTER_MEMORY.md (15 KB)
│   ├── MEMORY_INDEX.md (1.7 KB)
│   ├── FEEDBACK_FILE_PATHS.md (1.9 KB)
│   └── NEVER_FORGET.md (11 KB)
│
├── TIER_2_IMPORTANT/
│   ├── USER_FEEDBACK.md (1 KB)
│   ├── USER_ENVIRONMENT.md (1.2 KB)
│   ├── USER_PERMISSIONS.md (1 KB)
│   ├── RECOVERY_VALIDATION.md (9.4 KB)
│   └── PHASE_REPORTS.md (12 KB)
│
└── .gitignore (Prevent git from tracking this folder)
```

**Total size:** ~100 KB (small, lightweight)

**Git status:** Protected by .gitignore entry:
```
# Claude session backup (for disaster recovery only)
.claude-backup/
```

---

## WHY NOT JUST USE GITHUB?

### Problem with GitHub-only recovery:
1. ⏱️ **Slow:** Need to clone repo, navigate to docs/
2. 🔍 **Incomplete:** Session V2 knowledge not in GitHub (confidential)
3. 🧠 **Fragmented:** New Claude won't know user preferences
4. ❌ **Risky:** If GitHub is unreachable, total loss

### Advantages of Local Backup:
1. ⚡ **Fast:** Files are local, <5 min recovery
2. 📚 **Complete:** Includes session knowledge + user profile
3. 🔒 **Safe:** Survives GitHub outages
4. 🔐 **Private:** Session data stays on disk, not public

---

## RECOVERY PROCEDURE (New Claude)

### When New Claude Starts on Same Machine:

**Step 1: Load project (2 min)**
```bash
cd /c/AI_PROJECTS/WeatherApp

# Read GitHub docs
cat docs/README.md
cat docs/PROJECT_MASTER_MEMORY.md

# Read local backup
cat .claude-backup/SESSION_V2_KNOWLEDGE.md
cat .claude-backup/MEMORY_INDEX.md
```

**Step 2: Understand context (2 min)**
- User is Pablo (Polish locale, Windows 11)
- Project: React Native Weather App (Open-Meteo API)
- Phase: 7A.10 (documentation consolidation)
- Next: PHASE 7B (fix 3 critical UI issues)

**Step 3: Know how to work with this project (1 min)**
- Read `CLAUDE.md` for project-specific instructions
- Read `NEVER_FORGET.md` for non-negotiables
- Read `FEEDBACK_FILE_PATHS.md` for communication style

**Result:** New Claude has full context in <5 minutes ✅

---

## SYNC STRATEGY

### Regular Backups (Every Session)

**When:** Every time before pushing to GitHub or ending a major phase

**What to sync:**
```bash
# Copy from global memory to project backup
cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/SESSION_V2_KNOWLEDGE_ARCHIVE.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/SESSION_V2_KNOWLEDGE.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/SESSION_V1_V2_CONSOLIDATION_REPORT.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/CONSOLIDATION_AUDIT.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/PROJECT_MASTER_MEMORY.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/PROJECT_MASTER_MEMORY.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/MEMORY.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/MEMORY_INDEX.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/feedback_file_paths.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/FEEDBACK_FILE_PATHS.md

cp /c/AI_PROJECTS/WeatherApp/docs/NEVER_FORGET.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/NEVER_FORGET.md
```

**Backup user profile:**
```bash
cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/feedback_communication_style.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/USER_FEEDBACK.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/user_environment.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/USER_ENVIRONMENT.md

cp /c/Users/Pablo/.claude/projects/C--AI-PROJECTS/memory/user_permissions_weatherapp.md \
   /c/AI_PROJECTS/WeatherApp/.claude-backup/USER_PERMISSIONS.md
```

**Frequency:** 
- ✅ After every major completion (PHASE end, documentation, GitHub push)
- ✅ Before any risky operations
- ✅ Weekly if developing continuously

---

## FILES TO CREATE IMMEDIATELY

### 1. CLAUDE.md

**Location:** `/c/AI_PROJECTS/WeatherApp/CLAUDE.md`

**Content template:**
```markdown
# How to Work on Weather App (For Claude)

## Project Overview
- React Native 0.86.0 with TypeScript strict mode
- Android target: Motorola Edge 50 Fusion (reference device)
- API: Open-Meteo (migrated from wttr.in)
- Current phase: PHASE 7A.10 (documentation consolidation)
- Next phase: PHASE 7B (fix 3 critical UI issues)

## Critical Principles
1. Do NOT change code without explicit request
2. Do NOT build APK without explicit request
3. Always show full file paths (global feedback_file_paths.md)
4. Design system is LOCKED (see docs/DESIGN_SYSTEM.md)
5. Follow NEVER_FORGET.md principles

## Quick Commands
- Start dev: `npm start`
- Build APK: `./gradlew assembleDebug` (8 seconds)
- Test startup: ~3 seconds (tracked)
- Run tests: `npm test`

## Critical Files
- docs/README.md — Entry point
- docs/DESIGN_SYSTEM.md — Visual rules (LOCKED)
- docs/OPEN_ISSUES_AND_ROADMAP.md — PHASE 7B roadmap
- .claude-backup/ — Disaster recovery files

## When in Doubt
Read: docs/README.md → docs/NEVER_FORGET.md → docs/PROJECT_MASTER_MEMORY.md
```

### 2. RECOVERY_BOOTSTRAP.md

**Location:** `/c/AI_PROJECTS/WeatherApp/RECOVERY_BOOTSTRAP.md`

**Content:**
```markdown
# Emergency Bootstrap — Claude Recovery

If you're a new Claude session recovering this project:

## Step 1: Read These First (5 minutes)
1. `.claude-backup/MEMORY_INDEX.md` — What files exist
2. `.claude-backup/SESSION_V2_KNOWLEDGE.md` — What happened in V2
3. `docs/README.md` — Entry point
4. `CLAUDE.md` — How to work here

## Step 2: Understand Status
- Phase: PHASE 7A.10 (documentation complete)
- Next: PHASE 7B (4-6 hours of UX fixes)
- GitHub: All docs pushed, code synced
- Build: Working (8s build, 3s startup)

## Step 3: Know the Rules
Read `.claude-backup/NEVER_FORGET.md` — These are non-negotiable.

## Step 4: Start Work
Read `docs/OPEN_ISSUES_AND_ROADMAP.md` for what needs doing.

Recovery time: ~5 minutes. Ready to code.
```

### 3. QUICK_START_FOR_NEW_CLAUDE.md

**Location:** `/c/AI_PROJECTS/WeatherApp/QUICK_START_FOR_NEW_CLAUDE.md`

**Content:**
```markdown
# 5-Minute Quick Start (For New Claude)

## What is this project?
Weather app (React Native) showing current weather + forecasts using Open-Meteo API.

## Where is it?
- Code: `/c/AI_PROJECTS/WeatherApp/`
- GitHub: https://github.com/supermamkonto-lab/weather-app
- Backup: `.claude-backup/` (local disaster recovery)

## What's the current status?
✅ Code complete for PHASE 7A
⏳ PHASE 7B: Fix 3 UI issues (4-6 hours)
✅ Documentation complete (13 files in docs/)

## How do I get up to speed?
1. Read `docs/README.md` (2 min)
2. Read `.claude-backup/SESSION_V2_KNOWLEDGE.md` (2 min)
3. Read `docs/DESIGN_SYSTEM.md` (1 min)
4. Ready to code ✅

## What's off-limits?
- Don't change code without request
- Don't build APK without request
- Design system is locked (see docs/DESIGN_SYSTEM.md)

## Next steps?
Read `docs/OPEN_ISSUES_AND_ROADMAP.md` to see PHASE 7B tasks.
```

---

## IMPLEMENTATION CHECKLIST

### Immediate Actions (MUST DO):

- ⚠️ Create `.claude-backup/` folder
- ⚠️ Create `CLAUDE.md` (project instructions)
- ⚠️ Create `RECOVERY_BOOTSTRAP.md` (recovery guide)
- ⚠️ Create `QUICK_START_FOR_NEW_CLAUDE.md` (quick reference)
- ⚠️ Create `.claude-backup/.gitignore` (protect from git)
- ⚠️ Copy TIER 1 files to `.claude-backup/`
- ⚠️ Copy TIER 2 files to `.claude-backup/`
- ⚠️ Update main `.gitignore` to include `.claude-backup/`

### Regular Actions (Every Session):

- ⚠️ After each PHASE completion: Sync `.claude-backup/` with latest memory files
- ⚠️ Before GitHub push: Verify `.claude-backup/` is up to date
- ⚠️ Document any new critical files in `.claude-backup/INDEX.md`

### Documentation Updates:

- ✅ Update `docs/README.md` to mention `.claude-backup/` recovery
- ✅ Add link to `RECOVERY_BOOTSTRAP.md` in docs/README.md
- ✅ Add link to `CLAUDE.md` in docs/README.md

---

## WHY THIS MATTERS

### Scenario: Claude crashes mid-PHASE 7B

**Without backup:**
1. ❌ Project cloned from GitHub
2. ❌ New Claude reads docs/
3. ❌ New Claude misses SESSION V2 context
4. ❌ New Claude doesn't know user preferences
5. ❌ Recovery time: 30+ minutes (frustrating!)

**With backup:**
1. ✅ Project cloned from GitHub
2. ✅ New Claude reads docs/
3. ✅ New Claude reads `.claude-backup/SESSION_V2_KNOWLEDGE.md`
4. ✅ New Claude reads `.claude-backup/USER_FEEDBACK.md`
5. ✅ Recovery time: 5 minutes (smooth!)

### Impact
- **Recovery time:** 30 minutes → 5 minutes
- **Context loss:** Total → Zero
- **Development continuity:** Broken → Seamless

---

## CRITICAL REMINDER

### These Files CANNOT Be Recovered After Claude Crash:
- Session memory (if only in global Claude memory)
- User feedback (if only in global settings)
- Session decisions (if only in conversation)

### These Files CAN Be Recovered:
- Code (GitHub ✅)
- Public docs (GitHub ✅)
- Architecture (docs/ ✅)
- Session context (`.claude-backup/` ✅ after setup)

**ACTION:** Setup `.claude-backup/` TODAY, not after a crash!

---

## SUMMARY TABLE

| File | Critical? | Source | Backup Location | Auto-sync? |
|------|-----------|--------|-----------------|-----------|
| SESSION_V2_KNOWLEDGE_ARCHIVE.md | 🔴 YES | memory/ | .claude-backup/SESSION_V2_KNOWLEDGE.md | Manual |
| CONSOLIDATION_REPORT.md | 🟠 IMPORTANT | memory/ | .claude-backup/CONSOLIDATION_AUDIT.md | Manual |
| PROJECT_MASTER_MEMORY.md | 🟠 IMPORTANT | memory/ | .claude-backup/PROJECT_MASTER_MEMORY.md | Manual |
| MEMORY_INDEX.md | 🔴 YES | memory/ | .claude-backup/MEMORY_INDEX.md | Manual |
| FEEDBACK_FILE_PATHS.md | 🔴 YES | memory/ | .claude-backup/FEEDBACK_FILE_PATHS.md | Manual |
| NEVER_FORGET.md | 🟠 IMPORTANT | docs/ | .claude-backup/NEVER_FORGET.md | Manual |
| USER_FEEDBACK.md | 🟠 IMPORTANT | memory/ | .claude-backup/USER_FEEDBACK.md | Manual |
| USER_ENVIRONMENT.md | 🟠 IMPORTANT | memory/ | .claude-backup/USER_ENVIRONMENT.md | Manual |
| USER_PERMISSIONS.md | 🟠 IMPORTANT | memory/ | .claude-backup/USER_PERMISSIONS.md | Manual |
| RECOVERY_VALIDATION.md | 🔵 OPTIONAL | memory/ | .claude-backup/RECOVERY_VALIDATION.md | Manual |
| PHASE_REPORTS.md | 🔵 OPTIONAL | memory/ | .claude-backup/PHASE_REPORTS.md | Manual |

---

## FINAL VERDICT

### Current State: ⚠️ NOT READY FOR DISASTER

**Missing critical infrastructure:**
- ❌ No `.claude-backup/` folder
- ❌ No `CLAUDE.md` (project instructions)
- ❌ No `RECOVERY_BOOTSTRAP.md` (recovery guide)
- ❌ Global Claude memory not backed up locally

### After Implementation: ✅ 100% DISASTER READY

- ✅ All critical files backed up locally
- ✅ Recovery time <5 minutes
- ✅ Zero context loss after Claude crash
- ✅ User preferences preserved
- ✅ Session knowledge survives
- ✅ Development continuity maintained

### Effort to Implement: **15 minutes**

1. Create folder structure (2 min)
2. Create 3 new documents (8 min)
3. Copy files from memory/ (3 min)
4. Update .gitignore (2 min)

---

**Report Date:** 2026-06-22 04:35  
**Phase:** 7A.10 - Disaster Recovery Planning  
**Status:** ⚠️ IMPLEMENTATION REQUIRED  
**Priority:** 🔴 CRITICAL (must do before PHASE 7B)

**Next Step:** Create `.claude-backup/` folder and copy files immediately.
