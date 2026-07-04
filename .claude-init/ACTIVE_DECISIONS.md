# 🔒 ACTIVE_DECISIONS — What's Locked?

**These decisions are FINAL.** Do not revisit, reopen, or challenge.

---

## PLATFORM & LANGUAGE

| Decision | Status | Why |
|----------|--------|-----|
| Android-first | 🔒 LOCKED | Target market is Polish Android users |
| Polish language | 🔒 LOCKED | Premium UX requires Polish-first design |
| React Native | 🔒 LOCKED | Fast dev, native feel on Android |
| No iOS version | 🔒 LOCKED | Focus on one platform excellence |
| No multi-language | 🔒 LOCKED | Translation degrades premium feel |

---

## API & DATA

| Decision | Status | Why |
|----------|--------|-----|
| Open-Meteo API | 🔒 LOCKED | Free (16-day forecast), no API key required |
| Not wttr.in | 🔒 LOCKED | Limited forecast, deprecated in PHASE 6C |
| Polish descriptions | 🔒 LOCKED | WMO codes → Polish (not English + translation) |

---

## DESIGN (VISUAL)

| Decision | Status | Why |
|----------|--------|-----|
| Apple HIG reference | 🔒 LOCKED | Creates premium, intentional feel on Android |
| Primary color #1E90FF | 🔒 LOCKED | Apple weather blue (iconic) |
| White surface rgba(255,255,255,0.93) | 🔒 LOCKED | Premium glass morphism |
| Hero temperature 96pt | 🔒 LOCKED | Dominant, readable, premium |
| No emoji icons | 🔒 LOCKED | Premium apps don't use emoji |
| Border radius 13-14pt | 🔒 LOCKED | Consistent rounded aesthetic |
| Elevation system (shadows) | 🔒 LOCKED | Visual hierarchy locked |

---

## ARCHITECTURE

| Decision | Status | Why |
|----------|--------|-----|
| Context API (not Redux) | 🔒 LOCKED | Simple, sufficient for this scope |
| AsyncStorage (not SQLite) | 🔒 LOCKED | Persistent state, offline support, not overkill |
| App.tsx only (~2800 lines) | 🔒 LOCKED | Everything in one file (performance, clarity) |
| No external state library | 🔒 LOCKED | Minimal dependencies = stability |

---

## FEATURE SCOPE

| Decision | Status | Why |
|----------|--------|-----|
| 5 screens maximum | 🔒 LOCKED | Excellence over feature bloat |
| 7-day forecast (not 14+) | 🔒 LOCKED | Sufficient for Polish weather patterns |
| Current + Hourly + Daily | 🔒 LOCKED | Complete coverage without bloat |
| Favorites (cities) | 🔒 LOCKED | Essential for weather app |
| No notifications | 🔒 LOCKED | Out of scope for PHASE 7 |
| No offline maps | 🔒 LOCKED | Out of scope, too complex |

---

## RULES (NON-NEGOTIABLE)

| Rule | Enforcement |
|------|------------|
| **No design changes** | Breaking = project fail |
| **No API changes** | Code incompatibility |
| **No language switches** | Lost premium feel |
| **No platform changes** | Architectural rewrite |
| **No feature creep** | Project bloat |

---

## IF YOU WANT TO CHANGE SOMETHING

1. **Ask Master Admin first**
2. Master Admin evaluates impact
3. If approved: New decision in ACTIVE_DECISIONS.md
4. All consequences documented

**Most likely response:** "No, it's locked for a reason."

---

## WHERE TO FIND RATIONALE

For detailed WHY behind each decision:
- See: `docs/DECISION_REGISTRY.md` (13 KB, comprehensive)
- See: `docs/DESIGN_DECISIONS.md` (13 KB, design rationale)
- See: `docs/NEVER_FORGET.md` (11 KB, core principles)

---

**Next:** Read [QUICK_ARCHITECTURE.md](QUICK_ARCHITECTURE.md)
