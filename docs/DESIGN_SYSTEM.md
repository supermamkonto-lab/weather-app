---
name: design_system
description: "Complete design system - colors, typography, spacing, elevation, shadows"
metadata: 
  node_type: memory
  type: reference
  lastUpdated: 2026-06-22T02:35:00Z
  phase: 7A
  originSessionId: bfcdca2f-0252-4b7e-92d0-d4edbc3a00c8
---

# DESIGN SYSTEM — WEATHER APP

**Established:** PHASE 7A (Jun 22 01:52)
**Last verified:** Jun 22 02:30
**Status:** ✅ COMPLETE AND LOCKED

---

## 1. COLOR PALETTE

### Primary Accent
- **Value:** `#1E90FF`
- **Name:** Bright Blue (Dodger Blue)
- **Usage:** Temperature values, active states, chart lines, highlights
- **App.tsx examples:** 
  - Forecast card temperatures (line 1596)
  - TempCurve line color (TempCurve.tsx line 60)
  - Active chip shadow (line 2382)

### Surface (Card Background)
- **Value:** `rgba(255,255,255,0.93)`
- **Opacity:** 93% white (7% transparency)
- **Usage:** Dashboard cards, forecast cards, detail cards
- **Fallback:** `#ffffff` for solid white
- **App.tsx examples:**
  - dashboardItem (line 2497)
  - Forecast cards (line 1592)
  - detailGridItem (line 2800)

### Text — Primary (Dark)
- **Value:** `#1F2937`
- **Name:** Dark gray
- **Usage:** Values, headings on white backgrounds, primary text
- **App.tsx examples:**
  - dashboardValue (line 2523)
  - detailGridValue (line 2813)
  - Forecast card description (line 1603)

### Text — Secondary (Medium Gray)
- **Values:**
  - `#9CA3AF` (Neutral gray) — labels, subtle text
  - `#6B7280` (Darker gray) — descriptions, fine print
- **Usage:** Labels, secondary information, descriptions
- **App.tsx examples:**
  - dashboardLabel (line 2512)
  - Forecast day name (line 1599)
  - Forecast description (line 1603)

### Text — On Dark/Light Backgrounds
- **White text:** `#fff` or `rgba(255,255,255,0.95)`
- **Usage:** Hero section, blue backgrounds
- **App.tsx:** heroTemp (line 2232), heroDesc (line 2240)

### Shadows (Component Elevation)
- **Color:** `rgba(0,0,0,0.10)` to `rgba(0,0,0,0.12)`
- **Standard:** 0.10 opacity (for most cards)
- **Stronger:** 0.12 opacity (for prominent cards)
- **Usage:** All card shadows, elevation effects

### Special Accent (Blue Glow)
- **Value:** `rgba(30,144,255,0.4)`
- **Usage:** Active favorite chip shadow
- **App.tsx:** favoriteChipActive (line 2391)

### Status Colors (from weather data)
- **Success (Clear):** Green tones in AQI
- **Warning (Clouds):** Orange "Długość dnia" background (should be made consistent)
- **Note:** Still to be unified in Phase 7B

---

## 2. TYPOGRAPHY

### Hierarchy Levels

#### HERO TEMPERATURE (Largest)
- **Font size:** 96pt
- **Font weight:** 700 (bold)
- **Letter spacing:** -2
- **Color:** #fff (white)
- **Shadow:** textShadowColor `rgba(0,0,0,0.25)`, textShadowRadius 10
- **Usage:** Main temperature display in Hero
- **App.tsx:** styles.heroTemp (line 2229)

#### LARGE TITLE (Primary Data)
- **Font size:** 32pt
- **Font weight:** 700 (bold)
- **Color:** #1e90ff (blue)
- **Letter spacing:** -1
- **Usage:** Forecast card max temperature
- **App.tsx:** Forecast card temp (line 1596)

#### TITLE (Headings)
- **Font size:** 20pt
- **Font weight:** 700
- **Usage:** Section titles, important headings
- **App.tsx:** Section titles ("Przegląd", "Szczegóły")

#### BODY (Main Content)
- **Font sizes:** 14-16pt
- **Font weights:** 500-700
- **Color:** #1f2937 (primary) or #9ca3af (secondary)
- **Usage:** Values, descriptions, labels
- **Examples:**
  - Dashboard value (14-16pt) — line 2523
  - Detail value (18pt) — line 2813

#### SUBTITLE (Secondary Information)
- **Font size:** 13-14pt
- **Font weight:** 400-500
- **Color:** rgba(255,255,255,0.75) (on dark) or #9ca3af (on white)
- **Usage:** Hero meta (feels like, range), descriptions
- **App.tsx:** heroMeta (line 2256)

#### CAPTION (Smallest)
- **Font size:** 10-12pt
- **Font weight:** 400-600
- **Color:** #9ca3af or #6b7280
- **Usage:** Labels, time, fine print
- **App.tsx:** Dashboard labels (line 2512)

### Text Shadow Rules
- **Hero section:** Always textShadowColor `rgba(0,0,0,0.25)`, textShadowRadius 10
- **Other sections:** No shadows (text on white)
- **Exception:** Titles on blue might have subtle shadow

---

## 3. SPACING SYSTEM

### Padding (Inside Components)

#### Card Padding
- **Vertical:** 14-16pt (standard for most cards)
- **Horizontal:** 12-16pt (depend on component)
- **App.tsx examples:**
  - dashboardItem: paddingVertical 14, paddingHorizontal 12 (line 2500-2501)
  - Forecast card: padding 16 (line 1592)
  - detailGridItem: paddingVertical 16, paddingHorizontal 12 (line 2806-2807)

#### Button Padding
- **Vertical:** 10-12pt
- **Horizontal:** 14-16pt
- **Chip padding:** 12-16pt

### Margin (Space Between Components)

#### Card Margin (Vertical spacing)
- **Between cards:** marginBottom 6-10pt
- **Standard:** marginBottom 6 (dashboard items)
- **Larger gaps:** marginBottom 10 (between sections)

#### Section Margin
- **Top/bottom:** 12-16pt
- **Between major sections:** 16-20pt

#### Gap (Inside containers)
- **Standard gap:** 8pt (between items in row/column)
- **App.tsx:** dashboardGrid gap 8 (line 2486)

### Rhythm
- **Base unit:** 2pt
- **Spacing values:** 4, 6, 8, 10, 12, 14, 16 (multiples of 2)
- **Consistency:** Never use arbitrary values like 7pt or 15pt

---

## 4. ELEVATION & SHADOWS

### Card Elevation Levels

#### Level 1 (Subtle)
- **elevation:** 1
- **shadowColor:** rgba(0,0,0,0.10)
- **shadowOpacity:** 0.6
- **shadowRadius:** 3-4
- **shadowOffset:** { height: 1 }
- **Usage:** Minimal depth, secondary cards

#### Level 2 (Standard Cards)
- **elevation:** 2
- **shadowColor:** rgba(0,0,0,0.10)
- **shadowOpacity:** 0.6
- **shadowRadius:** 4
- **shadowOffset:** { height: 1-2 }
- **Usage:** Quick action buttons, standard widgets
- **App.tsx:** quickAction (line 2291)

#### Level 3 (Prominent Cards)
- **elevation:** 3
- **shadowColor:** rgba(0,0,0,0.10-0.12)
- **shadowOpacity:** 1
- **shadowRadius:** 5
- **shadowOffset:** { height: 2 }
- **Usage:** Dashboard items, forecast cards, details
- **App.tsx:** dashboardItem (line 2499), Forecast (line 1592)

#### Level 5 (Active/Highlighted)
- **elevation:** 5
- **shadowColor:** rgba(30,144,255,0.4)
- **shadowOpacity:** 1
- **shadowRadius:** 8
- **shadowOffset:** { height: 2-3 }
- **Usage:** Active favorite city chip
- **App.tsx:** favoriteChipActive (line 2391)

### Border Radius Rules
- **Standard:** 13-14pt
- **Consistency:** Same radius for all cards
- **App.tsx examples:**
  - Card border: 13-14
  - Button border: 13-14
  - Never mix (no 12, 15, 16 unless exceptional)

---

## 5. COMPONENT STYLING REFERENCE

### Hero Section (Temperature Display)

**Container:**
- Background: Dark (gradient via bg)
- Padding: No standard padding (full screen)

**Temperature:**
- fontSize: 96
- fontWeight: 700
- letterSpacing: -2
- color: #fff

**Description:**
- fontSize: 18
- fontWeight: 500
- color: rgba(255,255,255,0.95)

**Meta (feels like / range):**
- fontSize: 13
- fontWeight: 400
- color: rgba(255,255,255,0.75)

---

### Dashboard Item (Przegląd Card)

```javascript
backgroundColor: 'rgba(255,255,255,0.93)'
borderRadius: 13
paddingVertical: 14
paddingHorizontal: 12
marginBottom: 6
elevation: 3
shadowColor: 'rgba(0,0,0,0.12)'
shadowOpacity: 1
shadowRadius: 5
shadowOffset: { height: 2 }
```

**Label (OPADY, WIATR, etc):**
- fontSize: 10-11
- fontWeight: 500
- color: #9ca3af
- marginBottom: 6

**Value (brak, 9 km/h, etc):**
- fontSize: 24
- fontWeight: 700
- color: #1f2937

---

### Forecast Card (Najbliższe dni)

```javascript
width: '48%'
backgroundColor: '#ffffff'
borderRadius: 14
padding: 16
elevation: 3
shadowColor: 'rgba(0,0,0,0.10)'
shadowOpacity: 1
shadowRadius: 5
shadowOffset: { height: 2 }
```

**Temperature:**
- fontSize: 32
- fontWeight: 700
- color: #1e90ff
- letterSpacing: -1
- marginBottom: 4

**Day name:**
- fontSize: 11
- fontWeight: 600
- color: #9ca3af
- marginBottom: 8

**Description:**
- fontSize: 11
- fontWeight: 500
- color: #6b7280

---

### Detail Grid Item (Szczegóły)

```javascript
backgroundColor: '#ffffff'
borderRadius: 13
paddingVertical: 16
paddingHorizontal: 12
marginBottom: 10
elevation: 3
shadowColor: 'rgba(0,0,0,0.10)'
shadowOpacity: 1
shadowRadius: 5
shadowOffset: { height: 2 }
```

**Label:**
- fontSize: 10-11
- fontWeight: 500
- color: #9ca3af

**Value:**
- fontSize: 18
- fontWeight: 700
- color: #1f2937

---

### Quick Action Button

```javascript
backgroundColor: 'rgba(255,255,255,0.10)'
borderRadius: 13
paddingVertical: 10
paddingHorizontal: 10
marginRight: 10
borderWidth: 1.2
borderColor: 'rgba(255,255,255,0.28)'
elevation: 2
shadowColor: 'rgba(0,0,0,0.15)'
shadowOpacity: 0.8
shadowRadius: 6
```

**Text:**
- fontSize: 14
- fontWeight: 700
- marginTop: 2
- letterSpacing: 0.3

---

## 6. ANIMATION & MOTION

### Transitions
- **Card press:** activeOpacity 0.7-0.82
- **Fade in:** Animated.View with opacity interpolation
- **Slide:** translateY transform (e.g., Hero slides up on load)

**App.tsx example:** Hero animated (line 1304) with contentAnim opacity and translateY

### Haptics
- Used on button presses (haptic() function)
- Provides tactile feedback for important interactions

---

## 7. RESPONSIVE & PLATFORM NOTES

### Android Specifics
- **Elevation:** Primary depth method (shadowColor less effective)
- **Shadow:** Works via elevation property, not direct shadow
- **Opacity:** rgba values work for transparency
- **Device:** Tested on Motorola Edge 50 Fusion (6.7")

### Apple Weather Pattern References
- White cards on dark background (implemented ✅)
- Clear hierarchy: temperature > day > description
- Subtle secondary information
- Blue as primary accent (implemented ✅)
- Generous spacing and padding (implemented ✅)

---

## 8. DO NOT DO

### Anti-Patterns (Avoid These)

❌ **Don't:**
- Mix radius values (13, 14, 12, 16) — use 13-14 only
- Use arbitrary colors outside palette
- Shadow on cards without elevation
- Text without proper contrast
- Padding/margin without rhythm (2pt base unit)
- Emoji in UI (removed in Phase 7)
- Overlapping shadows (creates visual noise)

✅ **Do:**
- Maintain consistent color palette
- Always pair elevation with appropriate shadow
- Keep typography hierarchy clear
- Use spacing multiples of 2
- Test on device regularly
- Follow Apple Weather pattern

---

## Summary Table

| Element | Primary Value | Backup | Usage |
|---------|---------------|--------|-------|
| Accent color | #1E90FF | - | All highlights |
| Surface | rgba(255,255,255,0.93) | #ffffff | Cards |
| Text primary | #1F2937 | - | Values |
| Text secondary | #9CA3AF | #6B7280 | Labels |
| Text on dark | #fff | rgba(255,255,255,0.95) | Hero |
| Card padding | 14-16pt | 12pt horizontal | Standard |
| Card margin | 6-10pt | - | Vertical spacing |
| Border radius | 13-14pt | - | ALL cards |
| Elevation (cards) | 3 | 2-5 range | Depth |
| Shadow radius | 5 | 4-8 range | Softness |

---

**Status:** Design system locked as of PHASE 7A.
**No changes permitted** until Design System Refinement phase.
**All new UI must follow these rules exactly.**
