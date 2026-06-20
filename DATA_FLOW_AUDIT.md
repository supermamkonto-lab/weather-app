# 🔄 DATA FLOW AUDIT

**Scope:** From API to UI  
**Date:** 2026-06-20

---

## 📍 DATA SOURCE 1: wttr.in (Current Weather)

```
API Call
  ↓ https://wttr.in/{city}?format=j1&lang=pl
  ↓ (timeout: none - ISSUE!)
Parser
  ├─ response.data.current_condition[0]
  ├─ response.data.nearest_area[0]
  ├─ response.data.weather (3-day forecast)
  └─ response.data.weather[0].astronomy[0]
  ↓
State Update
  ├─ temp
  ├─ description
  ├─ location
  ├─ forecast
  └─ astronomy data
  ↓
UI Rendering
  ├─ WeatherDisplay (temp + description)
  ├─ ForecastCard (3 days)
  ├─ SunCard (sunrise/sunset)
  └─ Other components
```

**Issues Found:**
- ⚠️ No timeout on wttr.in call
- ⚠️ No error handling on parse errors
- ⚠️ No request retry
- ⚠️ Synchronous with AQI (should be parallel)

---

## 📍 DATA SOURCE 2: Open-Meteo (Air Quality)

```
Coordinates from wttr.in
  ↓
API Call
  ├─ lat = response.data.nearest_area[0].latitude
  └─ lon = response.data.nearest_area[0].longitude
  ↓ https://air-quality-api.open-meteo.com/v1/air-quality
  ↓ (timeout: 2000ms - GOOD!)
  ↓ Query params: pm2_5, pm10, us_aqi
Parser
  ├─ aqiResponse.data.current.pm2_5
  ├─ aqiResponse.data.current.pm10
  └─ aqiResponse.data.current.us_aqi
  ↓
Mapping
  ├─ PM2.5 → string (μg/m³)
  ├─ PM10 → string (μg/m³)
  └─ AQI → quality level (Dobra/Zła/etc)
  ↓
State Update
  ├─ pm25
  ├─ pm10
  ├─ aqi
  ├─ aqiColor
  └─ aqiEmoji
  ↓
UI Rendering
  └─ AQICard
```

**Issues Found:**
- ⚠️ Only fetched IF coordinates exist (breaks if wttr.in partial fails)
- ⚠️ Fallback to "Brak danych" (should show cached/retry)
- ⚠️ Dependent on wttr.in success (cascade failure risk)

---

## 📍 DATA SOURCE 3: AsyncStorage (Cache)

```
User opens app
  ↓
Check AsyncStorage
  ├─ cachedWeather key
  └─ favorites key
  ↓
Decision Tree
  ├─ If cache exists AND internet available
  │   ├─ Show cached data
  │   └─ Fetch fresh data in background
  ├─ If cache exists AND NO internet
  │   └─ Show cached data
  └─ If no cache
      └─ Show loading spinner
  ↓
On fetch complete
  ├─ Update state
  ├─ Update cache
  └─ Show fresh data
```

**Issues Found:**
- ⚠️ No TTL check (shows stale data forever)
- ⚠️ No schema versioning (breaks on schema change)
- ⚠️ Cache persists even if invalid

---

## 📍 DATA SOURCE 4: Favorites (User Input)

```
User Action: Add favorite
  ↓
addFavorite()
  ├─ Check not duplicate
  └─ Add to state: setFavorites([...])
  ↓
AsyncStorage.setItem('favorites', JSON.stringify(favorites))
  ↓
UI Update
  └─ Show in FavoritesList
  ↓
User Action: Search favorite city
  ├─ Get from favorites array
  ├─ Call fetchWeather(city)
  └─ Same as normal search
```

**Status:** Works well, no issues

---

## 🔀 DATA FLOW SEQUENCE DIAGRAM

```
User Search
    ↓
[fetchWeather]
    ├─ Validate input
    ├─ setLoading(true)
    ├─ setError('')
    ↓
[Parallel or Sequential]
    ├─ wttr.in (no timeout) ⚠️
    │   └─ Parse weather data
    │
    └─ Open-Meteo (2s timeout) ✅
        └─ Parse AQI data
    ↓
[Set State]
    ├─ setWeather(full_data)
    ├─ setLoading(false)
    ├─ cacheWeatherData()
    ↓
[UI Render]
    ├─ WeatherDisplay
    ├─ HourlyForecast
    ├─ AQICard
    └─ AllOtherCards
    ↓
[Error Handling]
    └─ If any fails: setError(message)
        └─ Show cached data as fallback
```

---

## ⚠️ CRITICAL DATA FLOW ISSUES

### Issue 1: Cascade Failure Risk

**Scenario:**
1. wttr.in succeeds (weather loads)
2. Open-Meteo fails (AQI doesn't load)
3. Result: Weather works, AQI shows "Brak danych"

**Current Behavior:** Acceptable (partial data is OK)  
**Could be Better:** Retry failed requests

---

### Issue 2: No Request Deduplication

**Scenario:**
1. User searches "Kraków"
2. App fetches weather (APIs called)
3. Immediately fetch again (same city)
4. APIs called again unnecessarily

**Current Behavior:** Wastes network/time  
**Should Be:** Check state before calling APIs

---

### Issue 3: Sequential Dependencies

**Current:**
```
1. Fetch wttr.in
2. Wait for response
3. Extract coordinates
4. Fetch Open-Meteo with coordinates
5. Wait for response
```

**Better:**
```
1. Fetch wttr.in
2. Fetch Open-Meteo with last known coordinates (or cached)
3. Update when both ready
```

---

### Issue 4: No Data Validation

**Current:**
```typescript
const current = response.data.current_condition[0];
// What if current_condition is undefined?
// What if [0] doesn't exist?
```

**Risk:** Runtime crash if API format changes

---

## ✅ ACTIONABLE DATA FLOW IMPROVEMENTS

| # | Issue | Fix | Impact | Time | Risk |
|---|-------|-----|--------|------|------|
| 1 | Sequential APIs | Promise.all() | -1000ms | 5 min | Low |
| 2 | No request dedup | Cache check in fetchWeather | Prevent waste | 10 min | Medium |
| 3 | Cascade failure | Parallel with fallbacks | Resilience | 20 min | Medium |
| 4 | No data validation | Add defensive checks | Stability | 15 min | Low |
| 5 | wttr.in no timeout | Add timeout | Prevent hang | 2 min | Low |
| 6 | Cache no TTL | Add 30-min expiry | Fresh data | 10 min | Low |

**Total Time:** 62 minutes  
**Total Benefit:** Better resilience, faster, more reliable

---

*DATA_FLOW_AUDIT.md complete*  
*Key issue: Sequential API calls (fixable in 5 min, saves 1 second)*
