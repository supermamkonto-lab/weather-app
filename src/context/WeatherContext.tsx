import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Weather, AppState } from '../types';

const WeatherContext = createContext<{
  state: AppState;
  fetchWeather: (city?: string) => Promise<void>;
  setCity: (city: string) => void;
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  setDarkMode: (isDark: boolean) => void;
} | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    weather: null,
    loading: false,
    error: null,
    city: 'Częstochowa',
    favorites: ['Częstochowa', 'Warszawa', 'Kraków'],
    isDarkMode: false,
  });

  const fetchWeather = async (city?: string) => {
    const targetCity = city || state.city;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(
        `https://wttr.in/${targetCity}?format=j1&lang=pl`
      );

      // Process weather data
      const weatherData = response.data.current_condition[0];
      const location = response.data.nearest_area[0];

      setState(prev => ({
        ...prev,
        weather: {
          temp: `${weatherData.temp_C}°C`,
          description: weatherData.lang_pl[0].value,
          location: `${location.areaName[0].value}, ${location.country[0].value}`,
          feelsLike: `${weatherData.FeelsLikeC}°C`,
          humidity: `${weatherData.humidity}%`,
          windSpeed: `${weatherData.windspeedKmph} km/h`,
          icon: '☀️',
          forecast: [],
          pressure: `${weatherData.pressure} mb`,
          visibility: `${weatherData.visibility} km`,
          uvIndex: `${weatherData.uvIndex}`,
          sunrise: '04:30 AM',
          sunset: '09:01 PM',
          pm25: 'N/A',
          pm10: 'N/A',
          aqi: 'Dobra',
          aqiColor: '#4CAF50',
          aqiEmoji: '🟢',
          lastUpdate: new Date().toLocaleTimeString('pl-PL'),
          tempC: parseInt(weatherData.temp_C),
          windKmph: weatherData.windspeedKmph,
        },
        city: targetCity,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Błąd pobierania danych',
        loading: false,
      }));
    }
  };

  const setCity = (city: string) => {
    setState(prev => ({ ...prev, city }));
  };

  const addFavorite = (city: string) => {
    setState(prev => ({
      ...prev,
      favorites: [...new Set([...prev.favorites, city])],
    }));
  };

  const removeFavorite = (city: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f !== city),
    }));
  };

  const setDarkMode = (isDark: boolean) => {
    setState(prev => ({ ...prev, isDarkMode: isDark }));
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <WeatherContext.Provider value={{ state, fetchWeather, setCity, addFavorite, removeFavorite, setDarkMode }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
