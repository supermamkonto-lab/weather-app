# PROJECT_ARCHITECTURE_MAP.md — Complete Architecture Overview

**For:** New developers who need to understand project structure without reading entire codebase  
**Read time:** 10 minutes  
**Target:** 95% architectural understanding

---

## FOLDER STRUCTURE (Essential Only)

```
WeatherApp/
├── src/                          ← Application source code (React Native + TypeScript)
│   ├── App.tsx                   ← Main app component (~2800 lines, all UI)
│   ├── screens/                  ← Screen components
│   ├── components/               ← Reusable UI components
│   ├── context/                  ← Context API for state management
│   ├── services/                 ← API integration (Open-Meteo)
│   ├── utils/                    ← Helper functions
│   └── types/                    ← TypeScript type definitions
│
├── android/                      ← Android build configuration
│   ├── app/src/                  ← Android source code
│   ├── gradle/wrapper/           ← Gradle wrapper (automatic download)
│   └── build.gradle              ← Build configuration
│
├── docs/                         ← Public documentation (14 files)
│   ├── README.md                 ← Navigation hub
│   ├── PROJECT_MASTER_MEMORY.md  ← Complete context
│   ├── DESIGN_SYSTEM.md          ← Visual rules (LOCKED)
│   ├── DECISION_REGISTRY.md      ← All decisions with rationale
│   └── ... (10 more docs)
│
├── .claude-backup/               ← Disaster recovery (protected)
│   ├── TIER_1_CRITICAL/          ← Session knowledge
│   ├── TIER_2_IMPORTANT/         ← Reference docs
│   ├── TIER_3_USER_CONTEXT/      ← User preferences
│   └── ... (recovery files)
│
├── package.json                  ← Dependencies (React, React Native, TypeScript)
├── tsconfig.json                 ← TypeScript configuration (strict mode)
├── .gitignore                    ← Protection rules (memory/, .claude-backup/)
├── CLAUDE.md                     ← Project instructions
├── RECOVERY_BOOTSTRAP.md         ← Emergency recovery guide
└── PROJECT_STATE.md              ← Current project status

(node_modules/, .git/, build artifacts — omitted, automatically generated)
```

---

## MAIN FILES (Critical Components)

### 1. App.tsx (~2800 lines) — THE ENTIRE UI

**This is the ONLY file users interact with. Contains:**

```
SCREENS:
├── Hero Section (current weather)
│   ├── Temperature display (96pt blue)
│   ├── Weather description (Polish)
│   ├── Wind, humidity, UV
│   └── Favorite cities buttons
│
├── Dziś godzinowo (Hourly forecast)
│   ├── Temperature curve (line graph)
│   └── Time capsules (hourly grid)
│
├── Prognoza (Daily forecast)
│   ├── 7-day forecast cards
│   ├── Min/max temps
│   └── Weather icons
│
├── Szczegóły (Details)
│   ├── Visibility
│   ├── Pressure
│   ├── Sunrise/sunset
│   └── Day length
│
└── Powietrze (Air quality)
    ├── Air quality index
    └── Badge visualization

STYLING:
├── Colors (LOCKED in DESIGN_SYSTEM.md)
├── Typography (96pt → 32pt → 14pt)
├── Spacing (8pt rhythm)
└── Elevation (shadow system)
```

**Key sections:**
- `heroTemp` (line ~2229): 96pt temperature display
- `favoriteChip` (line ~2385): City selection buttons
- `forecast cards` (line ~1590): 7-day forecast
- `detailGridItem` (line ~2788): Details section

---

### 2. Open-Meteo API Integration

**Data flow:**

```
App.tsx (state management via Context API)
    ↓
fetch from Open-Meteo API
    ↓
└─ Current weather endpoint
├─ Hourly forecast endpoint (24 hours)
└─ Daily forecast endpoint (7 days)
    ↓
Parse WMO codes → Polish weather descriptions
    ↓
Store in AsyncStorage (offline cache)
    ↓
Render on screen
```

**Key endpoints:**
- `/weather` — Current conditions
- `/forecast` — Hourly + daily predictions
- WMO codes → Polish translations (weather-api.ts)

**Never use:** wttr.in, WeatherStack, or custom parsing

---

### 3. State Management (Context API + AsyncStorage)

**Architecture:**

```
WeatherContext
├── currentWeather (current conditions)
├── hourlyForecast (next 24 hours)
├── dailyForecast (next 7 days)
├── favorites (saved cities)
└── settings (user preferences)
    ↓
AsyncStorage (persist on device)
    ↓
Automatic restore on app startup
```

**Why this design:**
- No external state library (simpler)
- AsyncStorage provides offline support
- Context allows deep component access

---

### 4. UI Components

**Component hierarchy:**

```
App.tsx (main)
├── Header (navigation)
├── HeroSection
│   ├── TemperatureDisplay (96pt)
│   └── CurrentWeatherDetails
├── HourlyForecast
│   ├── TemperatureCurve (graph)
│   └── TimeCapsules (data points)
├── DailyForecast
│   ├── ForecastCard (repeated x7)
│   └── WeatherIcon
├── DetailsSection
│   ├── DetailGridItem (repeated x4-6)
│   └── DataValue
└── AirQualityBadge
```

**Key principle:** Every component follows DESIGN_SYSTEM.md rules

---

## DATA FLOW (Complete Picture)

```
1. App starts
   ↓
2. Load favorites from AsyncStorage
   ↓
3. Get device location (or use favorite)
   ↓
4. Fetch current weather from Open-Meteo
   ↓
5. Fetch hourly forecast (24h)
   ↓
6. Fetch daily forecast (7 days)
   ↓
7. Parse WMO codes → Polish descriptions
   ↓
8. Store in Context + AsyncStorage
   ↓
9. Render UI (subscribe to Context changes)
   ↓
10. User interaction (change city, refresh)
    ↓
    [Repeat from step 3]
```

---

## CRITICAL DEPENDENCIES (Don't Touch)

**If you remove these, app BREAKS:**

```
react-native: 0.86.0          ← Core framework
react: 19.2.3                 ← React library
typescript: ^5.8.3            ← Type safety
@react-native-async-storage:  ← Persistent storage
@react-native-geolocation:    ← Location API (if used)
[Any others in package.json]   ← Must be version-locked
```

**Never:**
- ❌ Upgrade without testing
- ❌ Downgrade to older versions
- ❌ Mix with incompatible packages

---

## FILES THAT MUST NEVER BE REMOVED

| File | Why |
|------|-----|
| App.tsx | Only UI file |
| package.json | Dependency manifest |
| android/gradle/wrapper/ | Build system |
| .gitignore | Protection rules |
| .claude-backup/ | Disaster recovery |
| docs/ | Documentation |

---

## API INTEGRATION SPECIFICS

### Open-Meteo Endpoints

**Current:**
```
GET https://api.open-meteo.com/v1/weather
?latitude=51.77&longitude=19.45
&current=temperature_2m,weather_code,wind_speed...
```

**Hourly:**
```
GET https://api.open-meteo.com/v1/forecast
?latitude=51.77&longitude=19.45
&hourly=temperature_2m,weather_code...
&forecast_days=1
```

**Daily:**
```
GET https://api.open-meteo.com/v1/forecast
?latitude=51.77&longitude=19.45
&daily=temperature_2m_max,temperature_2m_min...
&forecast_days=7
```

### WMO Code Mapping

```
WMO Code  → Description (Polish)
0         → Bezchmurnie (Clear)
1-3       → Popartnie pochmurnie (Partly cloudy)
45-48     → Mgła (Fog)
51-67     → Deszcz (Rain)
71-85     → Śnieg (Snow)
80-82     → Przelotne opady (Showers)
85-86     → Śnieg ze zmieszanym deszczem (Mixed)
90-99     → Burza (Thunderstorm)
```

---

## DESIGN SYSTEM (Locked)

**Colors:**
```
Primary:      #1E90FF (Dodger Blue)
Surface:      rgba(255, 255, 255, 0.93) (White)
Text primary: #1F2937 (Dark gray)
Text secondary: #9CA3AF (Medium gray)
```

**Typography:**
```
Hero temp:    96pt, weight 700, letter-spacing -2
Section head: 32pt, weight 600
Body:         14pt, weight 400
```

**Spacing:**
```
Rhythm: 8pt gaps
Padding: 14-16pt standard
Margins: 8-16pt
```

**Elevation:**
```
Level 1: shadow offset 0,2px
Level 2: shadow offset 0,4px
Level 3: shadow offset 0,6px
Level 4: shadow offset 0,8px
Level 5: shadow offset 0,12px
```

---

## BUILD PIPELINE

```
Source (TypeScript + React Native)
    ↓
Metro Bundler (transpile → JavaScript)
    ↓
Gradle (Android build system)
    ↓
APK assembly (~8 seconds)
    ↓
Output: app/build/outputs/apk/debug/app-debug.apk (~50MB)
    ↓
ADB install to device
    ↓
App runs (startup ~3 seconds)
```

---

## KEY ARCHITECTURAL DECISIONS

| Decision | Why | Alternative Rejected |
|----------|-----|----------------------|
| React Native | Fast dev, native feel | Web app, native iOS/Android |
| Android first | Target market is Polish Android users | iOS-first, multi-platform equally |
| Open-Meteo | Free, no API key, 16-day forecast | wttr.in (limited), WeatherStack (paid) |
| Context API | Simple state, no external deps | Redux, Zustand (overkill for this) |
| AsyncStorage | Offline support, persistent | SQLite (overkill), Cache only |
| Locked design | Premium feel, visual consistency | Material Design, flexible styling |

---

## DEPENDENCIES BETWEEN CORE FILES

```
App.tsx (UI)
├── depends on: package.json (React, Open-Meteo client)
├── depends on: AsyncStorage (persistent state)
├── depends on: Context API (state management)
├── depends on: DESIGN_SYSTEM.md (visual rules)
└── depends on: android/gradle (build system)

WeatherContext (state)
└── depends on: Open-Meteo API

Build system (gradle)
└── depends on: package.json (npm dependencies must be installed first)

Documentation (docs/)
└── depends on: NEVER (reference only)
```

---

## WHAT HAPPENS IF YOU...

### Delete App.tsx?
❌ App is completely broken. No UI exists.  
⚠️ Restore from git or .claude-backup/

### Delete package.json?
❌ No way to install dependencies.  
⚠️ All npm packages are useless without manifest.

### Change design colors?
❌ VIOLATES design system (locked).  
⚠️ Premium feel is ruined.  
✅ Update DESIGN_SYSTEM.md instead (requires approval).

### Change Open-Meteo to wttr.in?
❌ API structure is different, code breaks.  
⚠️ Forecast data becomes incompatible.  
⚠️ This decision was made in PHASE 6C.

### Upgrade React Native 0.86.0 → 0.87.0?
⚠️ May cause compatibility issues.  
✅ Test thoroughly before upgrading.  
✅ Update package.json + package-lock.json + npm install.

---

## RECOVERY CHECKLIST

If rebuilding project from source:

- [ ] Clone from GitHub
- [ ] Run `npm install`
- [ ] Verify `package.json` dependencies
- [ ] Check `android/gradle/wrapper` Gradle version
- [ ] Set JAVA_HOME and ANDROID_HOME
- [ ] Run `./gradlew assembleDebug`
- [ ] Verify APK created
- [ ] Connect device, enable USB debugging
- [ ] Run `adb install -r app-debug.apk`
- [ ] Verify app launches
- [ ] Test hero screen, hourly forecast, 7-day forecast
- [ ] Confirm design matches DESIGN_SYSTEM.md

---

**This architecture is intentionally simple and stable for long-term maintenance.**

**Read DESIGN_SYSTEM.md for visual details.**  
**Read DECISION_REGISTRY.md for why these choices were made.**  
**Read OPEN_ISSUES_AND_ROADMAP.md for what needs fixing (PHASE 7B).**
