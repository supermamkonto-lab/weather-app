# 🔨 APP.TSX REFACTOR PLAN

**Current State:** 1,286 lines in one file  
**Target State:** Modular architecture with component separation  
**Risk Level:** Medium (refactor in phases, maintain working state)

---

## 🎯 DECOMPOSITION STRATEGY

### Module Breakdown

```
App.tsx (1,286 lines)
│
├─ Types (→ src/types/index.ts)
│  ├─ Weather interface
│  ├─ ForecastDay interface
│  └─ AQI response types
│
├─ Constants (→ src/constants/weather.ts)
│  ├─ WEATHER_TRANSLATIONS
│  ├─ AQI mappings
│  ├─ Colors
│  ├─ API_ENDPOINTS
│  └─ AsyncStorage keys
│
├─ Utilities (→ src/utils/)
│  ├─ weatherCalculations.ts (already exists)
│  ├─ translation.ts (translateWeather)
│  ├─ weatherIcon.ts (getWeatherIcon)
│  ├─ aqiColor.ts (getAQIColor)
│  └─ formatting.ts (formatters)
│
├─ Services (→ src/services/)
│  ├─ weatherService.ts (fetchWeather, parseWeather)
│  ├─ aqiService.ts (fetchAQI)
│  ├─ cacheService.ts (AsyncStorage operations)
│  └─ locationService.ts (location handling)
│
├─ Hooks (→ src/hooks/)
│  ├─ useWeather.ts (fetch + cache logic)
│  ├─ useFavorites.ts (favorites management)
│  └─ useRefresh.ts (pull-to-refresh)
│
├─ Components (→ src/components/)
│  ├─ WeatherHeader.tsx (title + menu)
│  ├─ SearchInput.tsx (city search)
│  ├─ FavoritesList.tsx (favorite cities)
│  ├─ WeatherDisplay.tsx (current weather)
│  ├─ WeatherChangeCard.tsx (today vs tomorrow)
│  ├─ ComfortCard.tsx (recommendations)
│  ├─ HourlyForecast.tsx (6-hour forecast)
│  ├─ WeatherScore.tsx (score + explanation)
│  ├─ AQICard.tsx (air quality)
│  ├─ ErrorBoundary.tsx (error handling)
│  └─ LoadingSpinner.tsx (loading state)
│
├─ Styles (→ src/styles/)
│  ├─ globalStyles.ts (colors, spacing)
│  ├─ componentStyles.ts (component-specific)
│  └─ motorolaStyles.ts (device-specific)
│
└─ App.tsx (reduced)
   ├─ Main component logic
   ├─ State orchestration
   ├─ Navigation
   └─ Modal handling
```

---

## 📋 DETAILED DECOMPOSITION

### 1. TYPES (→ src/types/weather.ts)

**Current:** Lines 18-50 in App.tsx

**Move:**
```typescript
export interface Weather {
  temp: string;
  description: string;
  location: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  icon: string;
  forecast: ForecastDay[];
  pressure: string;
  visibility: string;
  uvIndex: string;
  sunrise: string;
  sunset: string;
  pm25: string;
  pm10: string;
  aqi: string;
  aqiColor: string;
  aqiEmoji: string;
  lastUpdate: string;
  latitude?: number;
  longitude?: number;
  tempC?: number;
  windKmph?: number;
}

export interface ForecastDay {
  date: string;
  maxTemp: string;
  minTemp: string;
  description: string;
  icon: string;
}
```

**File:** `src/types/weather.ts` (new)  
**Lines:** ~40  
**Time:** 5 min  
**Risk:** None (just moving, no logic change)  
**Benefit:** Reusable types, cleaner imports

---

### 2. CONSTANTS (→ src/constants/)

**Create: src/constants/translations.ts**
```typescript
export const WEATHER_TRANSLATIONS = {
  'sunny': 'Słonecznie',
  'clear': 'Czyste niebo',
  // ... (70 lines total)
};
```

**Create: src/constants/aqi.ts**
```typescript
export const AQI_MAPPING = {
  'dobra': { color: '#4CAF50', emoji: '🟢' },
  'umiarkowana': { color: '#FFC107', emoji: '🟡' },
  // ...
};
```

**Create: src/constants/api.ts**
```typescript
export const API_ENDPOINTS = {
  WEATHER: 'https://wttr.in/',
  AQI: 'https://air-quality-api.open-meteo.com/v1/air-quality',
};

export const API_TIMEOUTS = {
  WEATHER: 10000,
  AQI: 2000,
  DEFAULT: 5000,
};

export const STORAGE_KEYS = {
  CACHED_WEATHER: 'cachedWeather',
  FAVORITES: 'favorites',
  CACHE_TIMESTAMP: 'cacheTimestamp',
};
```

**Files:** 3 new files  
**Total Lines:** ~150  
**Time:** 10 min  
**Risk:** None  
**Benefit:** Constants centralized, easy to change, DRY

---

### 3. UTILITIES (→ src/utils/)

**Create: src/utils/weatherIcon.ts**
```typescript
export const getWeatherIcon = (desc: string): string => {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes('sunny') || lowerDesc.includes('clear')) return '☀️';
  if (lowerDesc.includes('cloud')) return '☁️';
  // ...
  return '🌤️';
};
```

**Create: src/utils/aqiColor.ts**
```typescript
export const getAQIColor = (aqi: string) => {
  const lower = aqi.toLowerCase();
  if (lower.includes('dobra')) return { color: '#4CAF50', emoji: '🟢' };
  // ...
};
```

**Create: src/utils/translation.ts**
```typescript
export const translateWeather = (desc: string): string => {
  const lower = desc.toLowerCase();
  return WEATHER_TRANSLATIONS[lower] || desc;
};
```

**Refactor: src/utils/weatherCalculations.ts**
- Move calculations here (already partial)
- Add better error handling

**Files:** 3 new, 1 enhanced  
**Total Lines:** ~80  
**Time:** 15 min  
**Risk:** Low (pure functions)  
**Benefit:** Testable, reusable, DRY

---

### 4. SERVICES (→ src/services/)

**Create: src/services/weatherService.ts**
```typescript
export const fetchWeatherData = async (city: string) => {
  const response = await axios.get(
    `${API_ENDPOINTS.WEATHER}${encodeURIComponent(city)}?format=j1&lang=pl`,
    { timeout: API_TIMEOUTS.WEATHER }
  );
  return parseWeatherResponse(response.data);
};

const parseWeatherResponse = (data: any) => {
  const current = data.current_condition[0];
  const location = data.nearest_area[0];
  // ... parsing logic
  return weatherObject;
};
```

**Create: src/services/aqiService.ts**
```typescript
export const fetchAQIData = async (lat: number, lon: number) => {
  try {
    const response = await Promise.race([
      axios.get(`${API_ENDPOINTS.AQI}?latitude=${lat}&longitude=${lon}...`),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AQI timeout')), API_TIMEOUTS.AQI)
      )
    ]);
    return parseAQIResponse(response.data);
  } catch (error) {
    return getDefaultAQI();
  }
};
```

**Create: src/services/cacheService.ts**
```typescript
export const getCachedWeather = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
  const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
  
  // Check if cache is still valid (< 30 min old)
  if (data && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < 30 * 60 * 1000) {
      return JSON.parse(data);
    }
  }
  return null;
};

export const cacheWeatherData = async (data: Weather) => {
  await AsyncStorage.setItem(STORAGE_KEYS.CACHED_WEATHER, JSON.stringify(data));
  await AsyncStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
};
```

**Files:** 3 new  
**Total Lines:** ~150  
**Time:** 20 min  
**Risk:** Medium (refactor logic, test thoroughly)  
**Benefit:** Testable, reusable, cacheable, error handling

---

### 5. HOOKS (→ src/hooks/)

**Create: src/hooks/useWeather.ts**
```typescript
export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    try {
      const cached = await getCachedWeather();
      if (cached) setWeather(cached);
      
      const freshData = await fetchWeatherData(city);
      await cacheWeatherData(freshData);
      setWeather(freshData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
};
```

**Create: src/hooks/useFavorites.ts**
```typescript
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = useCallback(async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (data) setFavorites(JSON.parse(data));
  }, []);

  const addFavorite = useCallback(async (city: string) => {
    const updated = [...favorites, city];
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  }, [favorites]);

  const removeFavorite = useCallback(async (city: string) => {
    const updated = favorites.filter(f => f !== city);
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  }, [favorites]);

  return { favorites, loadFavorites, addFavorite, removeFavorite };
};
```

**Create: src/hooks/useRefresh.ts**
```typescript
export const useRefresh = (fetchFn: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFn();
    } finally {
      setRefreshing(false);
    }
  }, [fetchFn]);

  return { refreshing, onRefresh };
};
```

**Files:** 3 new  
**Total Lines:** ~120  
**Time:** 15 min  
**Risk:** Low (custom hooks, easy to test)  
**Benefit:** Reusable logic, composable, cleaner components

---

### 6. COMPONENTS (→ src/components/)

Each component gets extracted:

**src/components/WeatherDisplay.tsx** (~100 lines)
- Current temperature
- Weather description
- Location
- Feels like

**src/components/HourlyForecast.tsx** (~80 lines)
- 6-hour rain forecast
- Icons and percentages

**src/components/WeatherChangeCard.tsx** (~60 lines)
- Today vs tomorrow
- Temperature change
- Wind change

**src/components/ComfortCard.tsx** (~50 lines)
- Comfort recommendations
- Smart suggestions

**src/components/WeatherScore.tsx** (~50 lines)
- Score display
- Explanation text

**src/components/AQICard.tsx** (~60 lines)
- PM2.5, PM10
- AQI with color/emoji

**src/components/SearchInput.tsx** (~40 lines)
- Search box
- City input

**src/components/FavoritesList.tsx** (~50 lines)
- Favorite cities
- Add/remove buttons

**src/components/WeatherHeader.tsx** (~30 lines)
- Title + menu button

**src/components/LoadingSpinner.tsx** (~20 lines)
- Loading indicator

**src/components/ErrorDisplay.tsx** (~20 lines)
- Error messages

**Files:** 11 new  
**Total Lines:** ~650  
**Time:** 45 min (extract + refactor)  
**Risk:** Medium (need to test each component)  
**Benefit:** Reusable, testable, maintainable, modularity

---

### 7. STYLES (→ src/styles/)

**Create: src/styles/colors.ts**
```typescript
export const COLORS = {
  PRIMARY: '#2196F3',
  BACKGROUND: '#F5F5F5',
  CARD: '#FFFFFF',
  TEXT: '#333333',
  TEXT_LIGHT: '#666666',
  ERROR: '#F44336',
  SUCCESS: '#4CAF50',
  // ...
};
```

**Create: src/styles/spacing.ts**
```typescript
export const SPACING = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};
```

**Create: src/styles/componentStyles.ts**
```typescript
export const getWeatherDisplayStyles = (isDark = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? COLORS.DARK : COLORS.BACKGROUND,
    padding: SPACING.L,
  },
  // ...
});
```

**Files:** 3 new  
**Total Lines:** ~200  
**Time:** 20 min  
**Risk:** Low (styling only)  
**Benefit:** Theming support, DRY, consistency

---

## 📊 DECOMPOSITION SUMMARY

| Module | Files | Lines | Time | Risk |
|--------|-------|-------|------|------|
| Types | 1 | 40 | 5 min | None |
| Constants | 3 | 150 | 10 min | None |
| Utilities | 4 | 80 | 15 min | Low |
| Services | 3 | 150 | 20 min | Medium |
| Hooks | 3 | 120 | 15 min | Low |
| Components | 11 | 650 | 45 min | Medium |
| Styles | 3 | 200 | 20 min | Low |
| App.tsx | 1 | 100-150 | 30 min | High |
| **TOTAL** | **29** | **~1,500** | **160 min** | **Medium** |

---

## ⚠️ REFACTORING RISKS

### 1. Breaking Changes
- Component props need careful API design
- Service signatures must be stable

### 2. Testing
- Need unit tests for each service/component
- Integration tests for data flow

### 3. Import Hell
- Need clear module boundaries
- Avoid circular dependencies

### 4. State Management
- Multiple useState hooks can get complex
- Consider Context API if deeply nested

---

## ✅ ACTIONABLE REFACTOR PLAN

| # | File | Change | Time | Risk | Benefit |
|---|------|--------|------|------|---------|
| 1 | src/types/weather.ts | Create (extract types from App.tsx) | 5 min | None | Reusable types |
| 2 | src/constants/api.ts | Create (API endpoints + keys) | 10 min | None | Centralized config |
| 3 | src/constants/translations.ts | Create (extract WEATHER_TRANSLATIONS) | 5 min | None | Easy translation updates |
| 4 | src/utils/translation.ts | Create + Extract (translateWeather) | 5 min | Low | Testable |
| 5 | src/utils/weatherIcon.ts | Create + Extract (getWeatherIcon) | 5 min | Low | Testable |
| 6 | src/utils/aqiColor.ts | Create + Extract (getAQIColor) | 5 min | Low | Testable |
| 7 | src/services/cacheService.ts | Create (AsyncStorage operations) | 15 min | Low | Cacheable, versioned |
| 8 | src/services/weatherService.ts | Create + Extract (API logic) | 20 min | Medium | Testable, reusable |
| 9 | src/services/aqiService.ts | Create + Extract (AQI logic) | 10 min | Medium | Testable, timeout handling |
| 10 | src/hooks/useWeather.ts | Create (custom hook for weather) | 10 min | Low | Reusable logic |
| 11 | src/hooks/useFavorites.ts | Create (favorites hook) | 10 min | Low | Reusable logic |
| 12 | src/components/WeatherDisplay.tsx | Extract from App.tsx | 15 min | Medium | Reusable component |
| 13 | src/components/HourlyForecast.tsx | Extract from App.tsx | 15 min | Medium | Reusable component |
| 14 | src/components/WeatherScore.tsx | Extract from App.tsx | 10 min | Low | Reusable component |
| 15 | src/components/AQICard.tsx | Extract from App.tsx | 10 min | Low | Reusable component |
| 16 | src/components/SearchInput.tsx | Extract from App.tsx | 10 min | Low | Reusable component |
| 17 | src/components/FavoritesList.tsx | Extract from App.tsx | 15 min | Medium | Reusable component |
| 18 | src/styles/colors.ts | Create (extract hardcoded colors) | 10 min | None | Theming ready |
| 19 | src/styles/spacing.ts | Create (spacing constants) | 5 min | None | Consistency |
| 20 | App.tsx | Refactor (use new modules) | 30 min | High | Reduced from 1286→150 LOC |

**Total Time Estimate:** 160 minutes (~2.5 hours)  
**Total Risk:** Medium (needs thorough testing after each step)

---

## 📋 RECOMMENDED EXECUTION ORDER

1. **Phase 1 (No Risk):** Steps 1-3, 18-19 (15 min)
2. **Phase 2 (Low Risk):** Steps 4-6, 10-11 (45 min)
3. **Phase 3 (Medium Risk):** Steps 7-9, 12-17 (75 min)
4. **Phase 4 (High Risk):** Step 20 (30 min - update App.tsx)

**Can be done incrementally with working app at each phase.**

---

*Document: APP_REFACTOR_PLAN.md*  
*Status: Analysis complete, ready for execution*
