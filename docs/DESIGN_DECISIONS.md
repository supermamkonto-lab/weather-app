---
name: design_decisions
description: WHY each major design decision was made - rationale and alternatives
metadata: 
  node_type: memory
  type: project
  lastUpdated: 2026-06-22T02:45:00Z
  originSessionId: bfcdca2f-0252-4b7e-92d0-d4edbc3a00c8
---

# DESIGN DECISIONS LOG — WEATHER APP

**Purpose:** Document the reasoning behind each major decision
**Scope:** PHASE 7A onwards
**Format:** Decision → Rationale → Alternatives → Impact

---

## DECISION 1: White Cards Instead of Transparent

### What Changed
- **From:** `rgba(255,255,255,0.14)` transparent cards
- **To:** `rgba(255,255,255,0.93)` white cards
- **Affected sections:** Dashboard (Przegląd), Forecast (Najbliższe dni), Details (Szczegóły)

### Why This Decision

#### Problem (PHASE 6C)
- White text (#fff) on transparent white background was invisible
- User couldn't see "WIATR: 9 km/h" or other values
- Dashboard items were unreadable
- Violates WCAG contrast requirements

#### Rationale (Chosen Solution)
- Apple Weather uses white cards on dark background
- White cards + dark text = maximum contrast and readability
- Establishes clear visual hierarchy
- Makes app feel premium and intentional
- Solves visibility crisis immediately

#### Alternatives Considered
1. ❌ Keep transparent, change text color to darker
   - Would reduce contrast further
   - Would clash with dark background theme
   - Still wouldn't look premium

2. ❌ Use light gray cards (#f5f7fa)
   - Tested, but too similar to original
   - Doesn't create enough depth
   - Feels less premium

3. ✅ Use white cards (CHOSEN)
   - Maximum contrast
   - Apple Weather standard
   - Looks intentional and premium

### Impact
- ✅ All text now readable
- ✅ Professional appearance
- ✅ Clear data hierarchy
- ✅ Matches Apple Weather pattern
- ⚠️ Required dark text color change (#1f2937)

### Evidence
- Screenshots: audit_02.png shows readable dashboard values
- User feedback: Premium feeling improved to 92/100

---

## DECISION 2: Temperature 96pt Bold with -2px Tracking

### What Changed
- **From:** 88pt, fontWeight 200 (light)
- **To:** 96pt, fontWeight 700 (bold), letterSpacing -2
- **Affected:** Hero section (main temperature display)

### Why This Decision

#### Problem
- Temperature was large but light weight
- Didn't visually dominate the screen
- User might not immediately understand it's 22°C
- Didn't convey "this is the most important number"

#### Rationale
- Temperature is THE primary data point
- User looks at phone first thing to see "what's the weather?"
- Must be dominant instantly
- Bold weight + increased size + tight tracking = unmistakable hierarchy
- Apple Weather uses similarly dominant temperature display

#### Alternatives Considered
1. ❌ Keep 88pt, increase weight to 700
   - Would help but not enough impact
   - Doesn't match Apple Weather scale

2. ❌ Go to 100pt, keep weight 300
   - Too large, makes spacing awkward
   - Doesn't feel premium without weight

3. ✅ 96pt, 700 weight, -2 tracking (CHOSEN)
   - Visually dominant
   - Feels premium and confident
   - Matches Apple reference
   - Fits screen layout naturally

### Impact
- ✅ Temperature immediately visible
- ✅ Clear primary hierarchy
- ✅ Premium appearance
- ✅ User experience improved (understands weather at glance)
- ⚠️ Required text shadow adjustment (darker, larger blur)

### Evidence
- Screenshots: audit_01.png shows 22° dominates Hero
- User rating: "Temperature dominates" — success metric achieved

---

## DECISION 3: Blue #1E90FF as Primary Accent

### What Changed
- **From:** Red #f44336 (forecast temperature)
- **To:** Blue #1E90FF (across temperature, accent, chart)
- **Applied to:** Forecast cards, TempCurve, active states

### Why This Decision

#### Problem
- Red color implies danger, heat, urgency
- User sees "27°" in red and might think "too hot!"
- Doesn't match modern, calm aesthetic
- Inconsistent color usage (red here, blue there)

#### Rationale
- Blue conveys calm, trust, cool aesthetic
- Modern weather apps use blue for temperature
- Single accent color = visual consistency
- Blue on white/dark = excellent contrast
- Matches "cool, pleasant, professional" brand feeling

#### Alternatives Considered
1. ❌ Keep red for temperature
   - Associated with danger/heat
   - Feels alarmist
   - Clashes with calm app feeling

2. ❌ Orange (warm but professional)
   - Too similar to warning color
   - Less premium than blue

3. ✅ Blue #1E90FF (CHOSEN)
   - Modern and professional
   - Associated with calm and sky
   - High contrast on all backgrounds
   - Matches Apple Weather aesthetic

### Impact
- ✅ Unified color palette
- ✅ Professional appearance
- ✅ Visual consistency throughout app
- ✅ Better user psychology (calm, not alarmed)
- ✅ Supports accessibility (high contrast)

### Evidence
- Screenshots: audit_05.png shows blue 27° vs 26° cards
- Design system: #1E90FF locked as primary accent

---

## DECISION 4: Elevation System (3 levels)

### What Changed
- **From:** Flat design with borders
- **To:** Elevation 2-3 with shadows and no borders
- **Applied to:** All cards (dashboard, forecast, details)

### Why This Decision

#### Problem
- Flat cards with subtle borders looked boring
- No sense of depth or premium material
- Borders don't create clear visual separation
- Looked like basic app, not premium product

#### Rationale
- Physical design principle: elevation = depth
- Apple Human Interface: elevation creates hierarchy
- Shadows convey material depth
- Removes borders (modern, clean)
- Each elevation level = clear importance hierarchy

#### Alternatives Considered
1. ❌ Add stronger borders
   - Would look dated
   - Too graphic, not premium
   - Still no depth perception

2. ❌ Add background color instead
   - Creates visual noise
   - Doesn't convey depth
   - Inconsistent across screens

3. ✅ Elevation + shadow system (CHOSEN)
   - Modern material design principle
   - Creates clear depth perception
   - Apple Weather standard
   - Looks premium and intentional

### Impact
- ✅ Visual depth and hierarchy
- ✅ Premium appearance
- ✅ Clear separation between elements
- ✅ Consistent elevation across app
- ✅ Better touch feedback (cards feel "liftable")

### Evidence
- Screenshots: All audit_XX.png show white cards with subtle shadows
- Design system: Elevation 1-5 defined and locked

---

## DECISION 5: Removed minTemp from Forecast Cards

### What Changed
- **From:** Shows both maxTemp and minTemp
- **To:** Shows only maxTemp (32pt blue)
- **Code:** Line 1596 displays maxTemp, minTemp line removed

### Status
⚠️ **CONTROVERSIAL — Rationale Unclear**

### What We Know
- **Commit message:** No explanation given
- **Theory 1:** Reduce visual clutter (32pt temperature dominates)
- **Theory 2:** Accidentally removed during redesign
- **Theory 3:** Intended for Phase 7B refinement

### Why This Might Be Valid
- Forecast cards focus on maxTemp (most important)
- Range visible in Hero meta ("↑27° ↓20°")
- Visual simplification
- Forces attention to primary data

### Why This Is Problematic
- **Apple Weather always shows range** (27° / 20°)
- User loses information (min temperature)
- Forecast card is incomplete data
- Inconsistent: Hero shows range, forecast doesn't
- Information loss = UX regression

### Alternatives
1. ❌ Keep removed (current state)
   - Loses user information
   - Inconsistent with Apple

2. ✅ Restore minTemp (RECOMMENDED)
   - Below maxTemp (smaller font)
   - Layout: 27° / 20° or stacked
   - Matches Apple pattern
   - Complete information

3. ⚠️ Show range in card description
   - Could work but less prominent
   - User has to read more

### Current Status
**DECISION PENDING** — Flagged as PHASE 7B task
**Recommendation:** RESTORE minTemp

### Evidence
- audit_05.png, audit_06.png: Shows only maxTemp in cards
- Apple Weather reference: Always shows range
- User expectation: Temperature range is important

---

## DECISION 6: Font Weight Consistency (700 for values, 400-500 for labels)

### What Changed
- **From:** Varied weights (500-800 for different sections)
- **To:** Standardized: 700 for values, 400-500 for labels

### Why This Decision

#### Problem
- Some values were 800 weight (too heavy)
- Some labels were 600 (too prominent)
- No clear hierarchy
- Inconsistent throughout app

#### Rationale
- Values = data (700 = readable, not too heavy)
- Labels = descriptors (400-500 = subtle)
- Consistent pattern throughout
- Improves readability
- Professional appearance

#### Result
- All dashboard values: 700 weight
- All labels: 400-500 weight
- Clear visual hierarchy
- Consistent typography system

---

## DECISION 7: Card Padding 14-16pt Vertical, 12-16pt Horizontal

### What Changed
- **From:** Varied padding (10, 12, 14pt)
- **To:** Standard: 14-16pt vertical, 12-16pt horizontal

### Why This Decision

#### Problem
- Random padding values throughout
- Some cards felt cramped, others spacious
- No rhythm or system
- Unprofessional appearance

#### Rationale
- Base unit = 2pt
- All padding = multiple of 2pt
- 14-16pt vertical = comfortable reading space
- 12-16pt horizontal = responsive to content
- Creates visual rhythm
- Matches Apple Human Interface guidelines

#### Impact
- ✅ Consistent spacing
- ✅ Professional appearance
- ✅ Better readability
- ✅ Systematic approach

---

## DECISION 8: Border Radius 13-14pt Standard

### What Changed
- **From:** Various radius (12, 14, 16pt)
- **To:** Standard: 13-14pt all cards and buttons

### Why This Decision

#### Problem
- Mixed radius values (12, 14, 16)
- No consistency
- Looked like patches from different designs

#### Rationale
- Modern apps use gentle curves (13-14pt)
- Not too sharp, not too rounded
- All cards need same radius
- Creates cohesive visual language
- Matches contemporary design standards

#### Impact
- ✅ Unified appearance
- ✅ Professional look
- ✅ Clear design system
- ✅ Easier to maintain

---

## DECISION 9: Shadow Color rgba(0,0,0,0.10) vs rgba(0,0,0,0.12)

### What Changed
- **From:** No standard shadow color
- **To:** Standard: rgba(0,0,0,0.10-0.12) with opacity 1

### Why This Decision

#### Problem
- Shadows inconsistent
- Some too dark, some invisible
- No shadow system

#### Rationale
- 0.10 opacity = subtle but visible
- 0.12 opacity = stronger for emphasis
- Works on both light and dark backgrounds
- Doesn't overpower UI
- Professional appearance

#### Result
- Standard shadow: rgba(0,0,0,0.10), opacity 1, radius 4-5
- Emphasis shadow: rgba(0,0,0,0.12), opacity 1, radius 5
- Special shadow: rgba(30,144,255,0.4) for active states (blue glow)

---

## DECISION 10: Removed Emoji from UI

### Context
- **Phase 6:** Emoji were used throughout (☁️, ☀️, 🌙)
- **Phase 7A:** All emoji removed
- **Reason:** Premium apps don't use emoji; weather descriptions in Polish instead

### Why This Decision

#### Rationale
- Premium apps (Apple Weather) use icon systems
- Emoji are casual and unprofessional
- Weather descriptions in words = more information
- Icon font is more consistent and scalable
- Improves accessibility (emoji descriptions unclear)

#### Impact
- ✅ More professional appearance
- ✅ Better accessibility
- ✅ Cleaner UI
- ✅ Unified visual language

---

## SUMMARY OF DECISIONS

| Decision | Status | Impact | Confidence |
|----------|--------|--------|-----------|
| White cards | ✅ Locked | High (premium + readable) | 100% |
| Temperature 96pt bold | ✅ Locked | High (dominates) | 100% |
| Blue accent #1E90FF | ✅ Locked | High (consistent) | 100% |
| Elevation system | ✅ Locked | High (depth) | 100% |
| Remove minTemp | ⚠️ Review | Negative (loss) | **50%** |
| Font weight 700/400 | ✅ Locked | High (readable) | 95% |
| Card padding system | ✅ Locked | Medium (rhythm) | 90% |
| Border radius 13-14 | ✅ Locked | Medium (style) | 90% |
| Shadow system | ✅ Locked | High (depth) | 95% |
| Remove emoji | ✅ Locked | Medium (pro) | 85% |

---

## Contested Decision

### minTemp Removal
- **Locked in:** Phase 7A commit 5d2c9b6
- **Question:** Was this intentional or accidental?
- **Impact:** Information loss (regresja)
- **Resolution:** PHASE 7B will restore minTemp
- **Confidence:** 50% that this was intended

### Recommendation
Treat as temporary removal pending Phase 7B refinement. Restore minTemp to forecast cards.

---

## Design Philosophy Underlying All Decisions

1. **Apple Human Interface Reference** — Look at Apple Weather, Apple Health, etc.
2. **Information Hierarchy** — Primary data largest/boldest
3. **Visual Consistency** — One palette, one set of rules
4. **Readability Over Style** — Dark text on light backgrounds
5. **Depth Through Elevation** — Modern, not flat
6. **Spacing Rhythm** — Multiples of base unit (2pt)
7. **Professional Appearance** — No casual elements (emoji)
8. **User Focus** — Decision improves user experience or app reliability

---

**All decisions locked until PHASE 8 (Final Polish)**
**minTemp exception: Restoring in PHASE 7B**
