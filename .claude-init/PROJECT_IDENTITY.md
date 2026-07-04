# 🌤️ PROJECT_IDENTITY — What Is This?

## THE PROJECT

**Weather App** — Premium Android weather application built with React Native.

Displays real-time weather, hourly forecast, 7-day forecast, and detailed metrics.

**Language:** Polish (pl-PL locale)  
**Platform:** Android (Motorola Edge 50 Fusion reference device)  
**Tech:** React Native 0.86.0 + TypeScript (strict mode)

---

## THE PROBLEM IT SOLVES

❌ **Problem:** Official weather apps are generic, cluttered, ugly.

❌ **Alternative apps:** Copy Android/iOS design → lose native feel.

✅ **This app:** Premium UX. Polish-first. Android-native feel via Apple design principles.

---

## WHO USES IT

**Target:** Polish Android user who:
- Wants weather information, not 100 features
- Values premium look & feel
- Expects offline support
- Prefers Polish UI over English translation

---

## WHAT'S DIFFERENT

| Aspect | This App | Others |
|--------|----------|--------|
| **Language** | Polish UI (not translated) | English first, Polish later |
| **Design** | Apple HIG + Android native | Material Design (generic) |
| **Features** | Weather excellence (5 screens) | Feature bloat (50+ screens) |
| **Data** | Open-Meteo (free, 16-day) | API key required |
| **UX** | Premium feel | Functional only |

---

## CORE SCREENS

1. **Hero** (Current Weather)
   - Temperature (96pt blue)
   - Polish description (Bezchmurnie, Deszcz, etc.)
   - Wind, humidity, UV index

2. **Dziś godzinowo** (Hourly)
   - 24-hour temperature curve
   - Polish time labels
   - Tap for details

3. **Prognoza** (7-Day Forecast)
   - Daily forecast cards
   - Min/max temps
   - Weather icons

4. **Szczegóły** (Details)
   - Visibility, pressure, sunrise/sunset
   - Day length, UV index

5. **Powietrze** (Air Quality)
   - Air quality badge
   - Risk indicator

---

## KEY FACTS

- **Code:** ~2800 lines (App.tsx only — entire UI)
- **API:** Open-Meteo (free, no key needed)
- **Build time:** ~8 seconds
- **Startup:** ~3 seconds
- **Design:** LOCKED (cannot change colors, fonts)
- **Phase:** PHASE 7A complete → PHASE 7B (fixes needed)

---

## GITHUB

Repository: https://github.com/supermamkonto-lab/weather-app

Public: Yes, safe to publish (19 docs + code)

---

**Next:** Read [CURRENT_MISSION.md](CURRENT_MISSION.md)
