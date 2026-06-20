import { useState, useCallback } from 'react';
import { fetchWeatherData, parseWeatherResponse, Weather } from '../services/weatherService';
import { fetchAQIData } from '../services/aqiService';
import { cacheWeather, getCachedWeather } from '../services/cacheService';

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Wpisz nazwę miasta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to get fresh data
      const wttrData = await fetchWeatherData(cityName);
      const weatherData = parseWeatherResponse(wttrData);

      // Fetch AQI data in parallel
      const aqiData = await fetchAQIData(weatherData.latitude!, weatherData.longitude!);
      const fullWeatherData = { ...weatherData, ...aqiData };

      setWeather(fullWeatherData);
      await cacheWeather(fullWeatherData);
    } catch (err) {
      const cachedData = await getCachedWeather() as Weather | null;
      if (cachedData) {
        setWeather(cachedData);
        setError('📡 Bez internetu - pokazuję ostatnie dane');
      } else {
        setError('Nie znaleziono miasta');
        setWeather(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCachedWeather = useCallback(async () => {
    try {
      const cached = await getCachedWeather() as Weather | null;
      if (cached) {
        setWeather(cached);
      }
    } catch (err) {
      console.error('Failed to load cached weather:', err);
    }
  }, []);

  return { weather, loading, error, fetchWeather, loadCachedWeather };
};
