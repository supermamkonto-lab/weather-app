# RECOVERY_BOOTSTRAP.md — Emergency Project Recovery Procedure

**Use this file ONLY when Claude session context is completely lost.**

**If you're reading this, assume:**
- All conversation history is gone
- Global Claude memory is inaccessible
- Only local files and GitHub exist
- You need to recover full project context in <10 minutes

---

## ⚡ QUICK START (2 minutes)

**You are a new Claude session with NO context about this project.**

Read this in order:

1. **This file** (you're reading it now) — 1 minute
2. **CLAUDE.md** — 2 minutes
3. **PROJECT_STATE.md** — 1 minute
4. Then proceed to Step-by-Step Recovery below

---

## 📍 WHERE YOU ARE

**Project:** Weather App (React Native with TypeScript)  
**Location:** `/c/AI_PROJECTS/WeatherApp/`  
**GitHub:** https://github.com/supermamkonto-lab/weather-app  
**Phase:** PHASE 7A.10 (Documentation consolidation) — COMPLETE  
**Next:** PHASE 7B (Fix 3 critical UI issues, 4-6 hours)

---

## 🔄 STEP-BY-STEP RECOVERY

### Step 1: Read PROJECT_MASTER_MEMORY.md (5 minutes)

**Location:** `.claude-backup/TIER_1_CRITICAL/PROJECT_MASTER_MEMORY.md`

**What you'll learn:**
- Project vision and architecture
- Current status and next steps
- All critical information in one place
- Recovery procedure validation

**Why critical:** This is the master document. Everything else references it.

```bash
cat .claude-backup/TIER_1_CRITICAL/PROJECT_MASTER_MEMORY.md
```

### Step 2: Read PROJECT_TIMELINE.md (2 minutes)

**Location:** `.claude-backup/TIER_1_CRITICAL/PROJECT_TIMELINE.md`

**What you'll learn:**
- Project history (PHASE 1 through PHASE 7A)
- What was completed in each phase
- Why certain decisions were made
- Progress overview

**Why important:** Understand how we got here and why.

```bash
cat .claude-backup/TIER_1_CRITICAL/PROJECT_TIMELINE.md
```

### Step 3: Read DECISION_REGISTRY.md (3 minutes)

**Location:** `.claude-backup/TIER_1_CRITICAL/DECISION_REGISTRY.md`

**What you'll learn:**
- All important decisions with rationale
- What was decided, why, and status
- Prevents revisiting rejected ideas
- Explains design choices

**Why critical:** Prevents wasting time on already-decided issues.

```bash
cat .claude-backup/TIER_1_CRITICAL/DECISION_REGISTRY.md
```

### Step 4: Read OPEN_ISSUES_AND_ROADMAP.md (2 minutes)

**Location:** `docs/OPEN_ISSUES_AND_ROADMAP.md` OR `.claude-backup/TIER_2_IMPORTANT/OPEN_ISSUES_AND_ROADMAP.md`

**What you'll learn:**
- 3 critical issues for PHASE 7B
- 3 high-priority issues
- 4 low-priority issues
- Exact fix procedures

**Why important:** Tells you what needs fixing and how.

```bash
cat docs/OPEN_ISSUES_AND_ROADMAP.md
```

### Step 5: Read CURRENT_STATUS.md (1 minute)

**Location:** `docs/CURRENT_STATUS.md` OR `.claude-backup/TIER_2_IMPORTANT/CURRENT_STATUS.md`

**What you'll learn:**
- Active phase number
- Forbidden actions (don't do these!)
- Next steps
- Success criteria

**Why important:** Keeps you from breaking things.

```bash
cat docs/CURRENT_STATUS.md
```

### Step 6: Know the Rules (2 minutes)

**Location:** `.claude-backup/TIER_1_CRITICAL/NEVER_FORGET.md`

**What you'll learn:**
- Non-negotiable principles
- What NOT to do
- Lessons learned from past mistakes
- Hard constraints

**Why critical:** Breaking these rules causes project damage.

```bash
cat .claude-backup/TIER_1_CRITICAL/NEVER_FORGET.md
```

### Step 7: Understand Communication Style (1 minute)

**Location:** `.claude-backup/TIER_3_USER_CONTEXT/feedback_file_paths.md`

**What you'll learn:**
- How to communicate with user Pablo
- Always show full file paths
- Show artifacts and evidence
- Display status for every action

**Why important:** Ensures consistent user experience.

```bash
cat .claude-backup/TIER_3_USER_CONTEXT/feedback_file_paths.md
```

---

## ✅ YOU NOW HAVE

After reading above (total ~17 minutes):

- ✅ Project vision and architecture
- ✅ Complete project history
- ✅ All decisions and rationale
- ✅ List of issues and fixes needed
- ✅ Current status and next steps
- ✅ Non-negotiable rules
- ✅ Communication preferences

**Result:** You understand the entire project and can continue work seamlessly.

---

## 🎯 NEXT ACTIONS

**After recovery is complete:**

1. **Verify you understand:**
   - What the project does ✅
   - Current status (PHASE 7A.10) ✅
   - Next phase (PHASE 7B) ✅
   - What needs fixing (3 critical issues) ✅

2. **Read project-specific instructions:**
   - Open: `CLAUDE.md` (in project root)
   - Open: `PROJECT_STATE.md` (if it exists)

3. **Start work on PHASE 7B:**
   - Read: `docs/OPEN_ISSUES_AND_ROADMAP.md`
   - Priority 1: Restore minTemp (1 minute)
   - Priority 2: Redesign Dziś godzinowo (2-3 hours)
   - Priority 3: Redesign Szczegóły grid (1-2 hours)

---

## 📂 BACKUP STRUCTURE

All recovery files are in: `/c/AI_PROJECTS/WeatherApp/.claude-backup/`

```
.claude-backup/
├── TIER_1_CRITICAL/ (MUST READ)
│   ├── PROJECT_MASTER_MEMORY.md ← Start here
│   ├── PROJECT_TIMELINE.md
│   ├── DECISION_REGISTRY.md
│   ├── NEVER_FORGET.md
│   ├── SESSION_V1_CLOSEOUT_REPORT.md
│   ├── SESSION_V2_KNOWLEDGE_ARCHIVE.md
│   └── SESSION_V1_V2_CONSOLIDATION_REPORT.md
│
├── TIER_2_IMPORTANT/ (Should read)
│   ├── DESIGN_SYSTEM.md
│   ├── DESIGN_DECISIONS.md
│   ├── OPEN_ISSUES_AND_ROADMAP.md
│   ├── CURRENT_STATUS.md
│   └── RECOVERY_VALIDATION.md
│
└── TIER_3_USER_CONTEXT/ (Reference)
    ├── feedback_file_paths.md
    ├── feedback_communication_style.md
    ├── user_environment.md
    └── user_permissions_weatherapp.md
```

---

## 🆘 IF YOU'RE STILL LOST

1. **Read docs/README.md** — Full navigation guide
2. **Read docs/PROJECT_MASTER_MEMORY.md** — Complete context (also in backup)
3. **Check GitHub** — Code is there: https://github.com/supermamkonto-lab/weather-app
4. **See BOOT_PROMPT.md** — Emergency bootstrap instructions

---

## ✨ RECOVERY COMPLETE

When you've read all 7 steps above, you have:

- ✅ Full project context
- ✅ Understanding of architecture
- ✅ Knowledge of decisions made
- ✅ List of issues + fixes
- ✅ Current status
- ✅ Project rules
- ✅ Communication preferences

**Time spent:** ~17 minutes  
**Readiness:** 100%  
**Ready to code:** YES ✅

---

**This file ensures project continuity after Claude crashes or resets.**

**Last updated:** 2026-06-22 (Phase 7A.10)  
**Recovery Score:** 92/100  
**Expected recovery time:** <20 minutes from zero context
