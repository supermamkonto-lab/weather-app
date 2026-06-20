import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CACHED_WEATHER: 'cachedWeather',
  FAVORITES: 'favorites',
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry<T> = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_TTL) {
      await AsyncStorage.removeItem(key); // Clean up expired cache
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Cache read error for key ${key}:`, error);
    return null;
  }
};

export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error(`Cache write error for key ${key}:`, error);
  }
};

export const clearCache = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Cache clear error for key ${key}:`, error);
  }
};

export const cacheWeather = (data: any) => cacheData(STORAGE_KEYS.CACHED_WEATHER, data);
export const getCachedWeather = () => getCachedData(STORAGE_KEYS.CACHED_WEATHER);
export const cacheFavorites = (data: string[]) => cacheData(STORAGE_KEYS.FAVORITES, data);
export const getCachedFavorites = () => getCachedData(STORAGE_KEYS.FAVORITES);
