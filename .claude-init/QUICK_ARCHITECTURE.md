# 🏗️ QUICK_ARCHITECTURE — How Does It Work?

**One-page mental model of the entire system.**

---

## DATA FLOW (High Level)

```
1. App starts
   ↓
2. Load favorites from AsyncStorage
   ↓
3. Get device location (or use favorite)
   ↓
4. Fetch from Open-Meteo API
   ├─ Current weather
   ├─ Hourly forecast (24h)
   └─ Daily forecast (7 days)
   ↓
5. Parse WMO codes → Polish descriptions
   ↓
6. Store in Context API + AsyncStorage
   ↓
7. Render UI (subscribes to Context changes)
   ↓
8. User interaction → Repeat from step 3
```

---

## MAIN COMPONENTS

**App.tsx** (~2800 lines)
- Entire UI in one file
- 5 screens (Hero, Hourly, Daily, Details, Air Quality)
- Context API integration
- All styling

**WeatherContext**
- Manages: currentWeather, hourlyForecast, dailyForecast, favorites
- Provides: fetchWeather(), setFavorite(), etc.

**AsyncStorage**
- Persists: favorites, settings
- Restores on app restart

**Open-Meteo API**
- 3 endpoints: /weather (current), /forecast (hourly + daily)
- No authentication (free tier)

---

## 5 SCREENS

| Screen | Purpose | Key Data |
|--------|---------|----------|
| **Hero** | Current weather | Temp, description, wind, humidity, UV |
| **Hourly** | Next 24 hours | Temperature curve, time capsules |
| **Daily** | Next 7 days | Min/max temps, forecast cards |
| **Details** | Granular info | Visibility, pressure, sunrise, day length |
| **Air Quality** | Pollution level | AQI index, badge color |

---

## CRITICAL FILES

**MUST EXIST:**
- `App.tsx` — All UI, all logic
- `package.json` — Dependencies (React Native, TypeScript, etc.)
- `android/gradle/wrapper/` — Gradle build system

**SHOULD NOT CHANGE:**
- `DESIGN_SYSTEM.md` — Colors, fonts (in docs/)
- `ACTIVE_DECISIONS.md` — Locked decisions (right here)

---

## BUILD PIPELINE

```
TypeScript + React Native (src/)
  ↓
Metro Bundler (transpile to JavaScript)
  ↓
Gradle (Android build system)
  ↓
APK Assembly (~8 seconds)
  ↓
Output: app/build/outputs/apk/debug/app-debug.apk (~50MB)
  ↓
ADB install to device/emulator
  ↓
App runs (startup ~3 seconds)
```

---

## DEPENDENCIES (Version Locked)

- `react-native: 0.86.0` ← LOCKED
- `react: 19.2.3` ← LOCKED
- `typescript: ^5.8.3` ← LOCKED
- `@react-native-async-storage` ← Persistence
- Others in package.json

**Do NOT upgrade without testing.**

---

## STATE MANAGEMENT

**No Redux.** No Zustand.

**Architecture:**
- Context API stores data
- AsyncStorage persists across restarts
- Components subscribe to Context changes
- Minimal re-renders (performance optimized)

---

## WHAT CAN BREAK

❌ **If you delete:**
- App.tsx → App is gone
- package.json → Dependencies lost
- android/gradle/wrapper/ → Build fails

❌ **If you change:**
- Design colors → Breaks premium look
- API endpoint → Code incompatible
- Language → Polish descriptions lost

---

## WHERE TO LEARN MORE

**Quick start:** This file (you're reading it)

**Full architecture:** `docs/PROJECT_ARCHITECTURE_MAP.md` (12 KB)

**Design details:** `docs/DESIGN_SYSTEM.md` (11 KB)

**How to build:** `docs/WORKSTATION_REBUILD.md` (11 KB)

---

**Next:** Read [BOOT_SEQUENCE.md](BOOT_SEQUENCE.md)
