import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Weather {
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

interface ForecastDay {
  date: string;
  maxTemp: string;
  minTemp: string;
  description: string;
  icon: string;
}

const WEATHER_TRANSLATIONS: { [key: string]: string } = {
  'sunny': 'Słonecznie',
  'clear': 'Czyste niebo',
  'partly cloudy': 'Częściowo pochmurnie',
  'cloudy': 'Pochmurnie',
  'overcast': 'Całkowicie pochmurnie',
  'light rain': 'Lekki deszcz',
  'patchy light rain': 'Przerywany lekki deszcz',
  'moderate rain': 'Umiarkowany deszcz',
  'heavy rain': 'Intensywny deszcz',
  'patchy rain nearby': 'Przerywany deszcz w pobliżu',
  'thundery outbreaks possible': 'Możliwe wyładowania burzowe',
  'patchy light snow': 'Przerywany lekki śnieg',
  'light snow': 'Lekki śnieg',
  'heavy snow': 'Intensywny śnieg',
  'fog': 'Mgła',
  'mist': 'Mgła',
  'windy': 'Wietrzny',
};

const translateWeather = (desc: string): string => {
  const lower = desc.toLowerCase();
  return WEATHER_TRANSLATIONS[lower] || desc;
};

const getWeatherIcon = (desc: string): string => {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes('sunny') || lowerDesc.includes('clear')) return '☀️';
  if (lowerDesc.includes('cloud')) return '☁️';
  if (lowerDesc.includes('rain')) return '🌧️';
  if (lowerDesc.includes('snow')) return '❄️';
  if (lowerDesc.includes('storm') || lowerDesc.includes('thunder')) return '⛈️';
  if (lowerDesc.includes('fog') || lowerDesc.includes('mist')) return '🌫️';
  if (lowerDesc.includes('wind')) return '💨';
  return '🌤️';
};

const getAQIColor = (aqi: string): { color: string; emoji: string; text: string } => {
  const lower = aqi.toLowerCase();
  if (lower.includes('dobra')) return { color: '#4CAF50', emoji: '🟢', text: 'Dobra' };
  if (lower.includes('umiarkowana')) return { color: '#FFC107', emoji: '🟡', text: 'Umiarkowana' };
  if (lower.includes('wrażliwych')) return { color: '#FF9800', emoji: '🟠', text: 'Niezdrowa dla wrażliwych' };
  if (lower.includes('zła') || lower.includes('niezdrowa')) return { color: '#F44336', emoji: '🔴', text: 'Zła' };
  if (lower.includes('bardzo')) return { color: '#1a1a1a', emoji: '⚫', text: 'Bardzo zła' };
  return { color: '#666', emoji: '⚪', text: 'Brak danych' };
};

const calculateFeelsLike = (tempC: number, humidity: number, windKmph: number): string => {
  // Uproszczony wind chill (dla temperatury poniżej 10°C)
  if (tempC < 10) {
    const windMph = windKmph / 1.609;
    const windchill = 35.74 + (0.6215 * tempC) - (35.75 * Math.pow(windMph, 0.16)) + (0.4275 * tempC * Math.pow(windMph, 0.16));
    return Math.round(windchill).toString();
  }
  // Dla wyższych temp bierz pod uwagę wilgotność (heat index)
  const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541, c5 = -0.00683783, c6 = -0.05481717, c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
  const T = tempC * 9/5 + 32; // Convert to Fahrenheit
  const RH = humidity;
  const HI = c1 + c2*T + c3*RH + c4*T*RH + c5*T*T + c6*RH*RH + c7*T*T*RH + c8*T*RH*RH + c9*T*T*RH*RH;
  return Math.round((HI - 32) * 5/9).toString(); // Convert back to Celsius
};

export default function App() {
  const [city, setCity] = useState('Częstochowa');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['Częstochowa', 'Warszawa', 'Kraków']);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showAQIModal, setShowAQIModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [cachedWeather, setCachedWeather] = useState<Weather | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadFavoritesFromStorage();
    fetchWeather();
  }, []);

  const loadFavoritesFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
      const cached = await AsyncStorage.getItem('cachedWeather');
      if (cached) setCachedWeather(JSON.parse(cached));
    } catch (e) {
      console.log('AsyncStorage load error');
    }
  };

  const saveFavoritesToStorage = async (fav: string[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(fav));
    } catch (e) {
      console.log('AsyncStorage save error');
    }
  };

  const cacheWeatherData = async (w: Weather) => {
    try {
      const cacheData = { data: w, timestamp: Date.now() };
      await AsyncStorage.setItem('cachedWeather', JSON.stringify(cacheData));
    } catch (e) {
      console.log('AsyncStorage cache error');
    }
  };

  const getCachedWeather = async (): Promise<Weather | null> => {
    try {
      const cached = await AsyncStorage.getItem('cachedWeather');
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
      if (age > CACHE_TTL) return null; // Cache expired
      return data;
    } catch (e) {
      return null;
    }
  };

  const getColors = () => ({
    bg: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    bgAlt: isDarkMode ? '#2a2a2a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333',
    textAlt: isDarkMode ? '#999' : '#666',
    header: isDarkMode ? '#0d47a1' : '#1e90ff',
    button: isDarkMode ? '#1e90ff' : '#1e90ff',
    border: isDarkMode ? '#333' : '#e0e0e0',
  });

  const fetchWeather = async (cityName: string = city) => {
    if (!cityName.trim()) {
      setError('Wpisz nazwę miasta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parallel API calls for faster loading
      const wttrPromise = axios.get(
        `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=pl`,
        { timeout: 10000 }
      );

      let aqiResponse: any = null;
      const wttrResponse = await wttrPromise;

      // Validate API response structure
      if (!wttrResponse.data?.current_condition?.[0] || !wttrResponse.data?.nearest_area?.[0]) {
        throw new Error('Invalid wttr.in response structure');
      }

      const current = wttrResponse.data.current_condition[0];
      const location = wttrResponse.data.nearest_area[0];
      const forecastDays = wttrResponse.data.weather?.slice(1, 4) || [];
      const astronomy = wttrResponse.data.weather?.[0]?.astronomy?.[0];
      const lat = location.latitude;
      const lon = location.longitude;

      if (!lat || !lon) {
        throw new Error('Could not extract coordinates from response');
      }

      // Fetch AQI data in parallel (non-blocking)
      let pm25 = 'Brak danych dla lokalizacji';
      let pm10 = 'Brak danych dla lokalizacji';
      let aqi = 'Brak danych dla lokalizacji';
      let aqiColor = '#666';
      let aqiEmoji = '⚪';

      try {
        // Non-blocking AQI fetch - timeout 2 sec (parallel with weather)
        aqiResponse = await Promise.race([
          axios.get(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi`,
            { timeout: 2000 }
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('AQI timeout')), 2000))
        ]);

        if (aqiResponse && aqiResponse.data && aqiResponse.data.current) {
          const aqiData = aqiResponse.data.current;

          // Bezpieczna obsługa każdej wartości
          const hasPM25 = aqiData.pm2_5 !== null && aqiData.pm2_5 !== undefined && typeof aqiData.pm2_5 === 'number';
          const hasPM10 = aqiData.pm10 !== null && aqiData.pm10 !== undefined && typeof aqiData.pm10 === 'number';
          const hasAQI = aqiData.us_aqi !== null && aqiData.us_aqi !== undefined && typeof aqiData.us_aqi === 'number';

          if (hasPM25) pm25 = `${Math.round(aqiData.pm2_5)} μg/m³`;
          if (hasPM10) pm10 = `${Math.round(aqiData.pm10)} μg/m³`;

          if (hasAQI) {
            const usAqi = aqiData.us_aqi;
            if (usAqi <= 50) aqi = 'Dobra';
            else if (usAqi <= 100) aqi = 'Umiarkowana';
            else if (usAqi <= 150) aqi = 'Niezdrowa dla wrażliwych';
            else if (usAqi <= 200) aqi = 'Zła';
            else if (usAqi <= 300) aqi = 'Bardzo zła';
            else aqi = 'Niebezpieczna';

            const aqiInfo = getAQIColor(aqi);
            aqiColor = aqiInfo.color;
            aqiEmoji = aqiInfo.emoji;
          }
        }
      } catch (err) {
        // Jeśli API fails, wartości domyślne
      }

      const tempC = current.temp_C;
      const windKmph = current.windspeedKmph;
      const humidity = current.humidity;
      const feelsLikeTemp = calculateFeelsLike(tempC, humidity, windKmph);
      const now = new Date();
      const lastUpdate = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

      const forecast = forecastDays.map((day: any) => ({
        date: day.date,
        maxTemp: `${day.maxtempC}°C`,
        minTemp: `${day.mintempC}°C`,
        description: day.hourly[4]?.weatherDesc[0]?.value || 'Brak danych',
        icon: getWeatherIcon(day.hourly[4]?.weatherDesc[0]?.value || ''),
      }));

      const weatherData = {
        temp: `${tempC}°C`,
        description: translateWeather(current.weatherDesc[0].value),
        location: `${location.areaName[0].value}, ${location.country[0].value}`,
        feelsLike: `${feelsLikeTemp}°C`,
        humidity: `${humidity}%`,
        windSpeed: `${windKmph} km/h`,
        icon: getWeatherIcon(current.weatherDesc[0].value),
        forecast,
        pressure: `${current.pressure_mb || current.pressure || 'N/A'} mb`,
        visibility: `${current.visibility_km || current.visibility || 'N/A'} km`,
        uvIndex: `${current.uv_index || current.uvIndex || 'N/A'}`,
        sunrise: astronomy.sunrise,
        sunset: astronomy.sunset,
        pm25,
        pm10,
        aqi,
        aqiColor,
        aqiEmoji,
        lastUpdate,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        tempC,
        windKmph,
      };
      setWeather(weatherData);
      cacheWeatherData(weatherData);
      setCity(cityName);
    } catch (err) {
      if (cachedWeather) {
        setWeather(cachedWeather);
        setError('📡 Bez internetu - pokazuję ostatnie dane');
      } else {
        setError('Nie znaleziono miasta');
        setWeather(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = () => {
    if (!favorites.includes(city) && city.trim()) {
      const updated = [...favorites, city];
      setFavorites(updated);
      saveFavoritesToStorage(updated);
    }
  };

  const removeFavorite = (fav: string) => {
    const updated = favorites.filter(f => f !== fav);
    setFavorites(updated);
    saveFavoritesToStorage(updated);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    setRefreshing(false);
  };

  const calculateDayLength = (sunrise: string, sunset: string): string => {
    try {
      const sunriseMatch = sunrise.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      const sunsetMatch = sunset.match(/(\d+):(\d+)\s*(AM|PM)?/i);

      if (!sunriseMatch || !sunsetMatch) return "N/A";

      let sunriseH = parseInt(sunriseMatch[1], 10);
      const sunriseM = parseInt(sunriseMatch[2], 10);
      const sunrisePeriod = sunriseMatch[3]?.toUpperCase() || 'AM';

      let sunsetH = parseInt(sunsetMatch[1], 10);
      const sunsetM = parseInt(sunsetMatch[2], 10);
      const sunsetPeriod = sunsetMatch[3]?.toUpperCase() || 'PM';

      if (sunrisePeriod === 'PM' && sunriseH !== 12) sunriseH += 12;
      if (sunrisePeriod === 'AM' && sunriseH === 12) sunriseH = 0;

      if (sunsetPeriod === 'PM' && sunsetH !== 12) sunsetH += 12;
      if (sunsetPeriod === 'AM' && sunsetH === 12) sunsetH = 0;

      const diff = (sunsetH * 60 + sunsetM) - (sunriseH * 60 + sunriseM);
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h ${mins}m`;
    } catch (e) {
      return "N/A";
    }
  };

  const generateWeatherInsight = (weather: Weather): string => {
    const desc = weather.description.toLowerCase();
    const temp = parseInt(weather.temp);
    const humidity = parseInt(weather.humidity);
    const hasRain = desc.includes('deszcz') || desc.includes('rain');
    const isClear = desc.includes('słonecznie') || desc.includes('czyste');
    const isCloudy = desc.includes('chmur') || desc.includes('cloud');

    let insight = 'Dzień ';

    if (temp > 25) insight += 'będzie ciepły';
    else if (temp > 15) insight += 'będzie przyjemny';
    else insight += 'będzie chłodny';

    if (hasRain) insight += ' z opadami. Weź parasol.';
    else if (isClear) insight += ' i słoneczny.';
    else if (isCloudy) insight += ' i pochmurny.';
    else insight += '.';

    if (humidity > 80) insight += ' Wilgoć wysoka.';

    return insight;
  };

  const generateComfortRecommendations = (weather: Weather): string[] => {
    const recommendations: string[] = [];
    const temp = parseInt(weather.temp);
    const humidity = parseInt(weather.humidity);
    const uv = parseInt(weather.uvIndex);
    const desc = weather.description.toLowerCase();
    const hasRain = desc.includes('deszcz') || desc.includes('rain');

    if (temp > 15 && temp < 25 && !hasRain && humidity < 80) {
      recommendations.push('✅ Dobry dzień na spacer');
    }
    if (uv > 6) {
      recommendations.push('⚠️ Wysoki UV - użyj filtru');
    }
    if (hasRain) {
      recommendations.push('⚠️ Zabierz parasol');
    }
    if (humidity > 75) {
      recommendations.push('⚠️ Wysoka wilgotność - mogą być alergeny');
    }
    if (temp < 10) {
      recommendations.push('⚠️ Zimno - weź kurtkę');
    }

    return recommendations.length > 0 ? recommendations : ['✅ Warunki neutralne'];
  };

  const calculateWeatherScore = (weather: Weather): number => {
    let score = 70;
    const temp = parseInt(weather.temp);
    const humidity = parseInt(weather.humidity);
    const uv = parseInt(weather.uvIndex);
    const desc = weather.description.toLowerCase();
    const hasRain = desc.includes('deszcz') || desc.includes('rain');
    const aqi = weather.aqi.toLowerCase();

    if (temp >= 18 && temp <= 24) score += 15;
    else if (temp >= 15 && temp <= 27) score += 10;
    else score -= 10;

    if (!hasRain) score += 10;
    else score -= 15;

    if (humidity >= 40 && humidity <= 60) score += 5;
    else if (humidity > 80) score -= 10;

    if (uv <= 3) score += 5;
    else if (uv > 8) score -= 10;

    if (aqi === 'dobra') score += 10;
    else if (aqi.includes('umiarkowana')) score += 5;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const generateWeatherChange = (weather: Weather): { tempChange: string; windChange: string; rainChange: string } => {
    // Get tomorrow's forecast from API data
    const tomorrowForecast = weather.forecast?.[0];

    let tempChange = 'Brak prognozy';
    let rainChange = 'brak danych';

    if (tomorrowForecast) {
      // Parse real temperatures from forecast
      const todayTempC = weather.tempC || 0;
      const tomorrowMaxTempC = parseInt(tomorrowForecast.maxTemp.replace(/[^0-9-]/g, '')) || 0;

      const diff = tomorrowMaxTempC - todayTempC;
      if (diff > 0) {
        tempChange = `+${diff}°C cieplej`;
      } else if (diff < 0) {
        tempChange = `${diff}°C chłodniej`;
      } else {
        tempChange = 'bez zmian';
      }

      // Check tomorrow's rain conditions
      const tomorrowDesc = tomorrowForecast.description.toLowerCase();
      rainChange = tomorrowDesc.includes('deszcz') || tomorrowDesc.includes('rain') ? 'opady' : 'bez opadów';
    }

    const windKmph = weather.windKmph || 0;
    const windChange = windKmph > 10 ? `+${windKmph} km/h` : `${windKmph} km/h`;

    return { tempChange, windChange, rainChange };
  };

  const generateHourlyRain = (): Array<{ hour: string; emoji: string; percent: number }> => {
    const hours = [];
    const desc = weather?.description || '';
    const isRainyWeather = desc.toLowerCase().includes('rain') || desc.toLowerCase().includes('storm');
    const basePercent = isRainyWeather ? 60 + Math.random() * 30 : Math.random() * 20;

    for (let i = 0; i < 6; i++) {
      const hour = (new Date().getHours() + i) % 24;
      const percent = Math.max(0, Math.min(100, basePercent + (Math.random() - 0.5) * 30));
      const emoji = getWeatherIcon(weather?.description || '');
      hours.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        emoji,
        percent: Math.round(percent)
      });
    }
    return hours;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e90ff" />

      <View style={styles.header}>
        <Text style={styles.title}>⛅ Pogoda</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              if (weather) {
                setShowForecastModal(true);
              }
            }}
          >
            <Text style={styles.menuButtonText}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Text style={styles.menuButtonText}>≡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Wpisz miasto..."
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={() => {
              fetchWeather();
              setShowSearch(false);
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              fetchWeather();
              setShowSearch(false);
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.content}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1e90ff']}
            tintColor="#1e90ff"
          />
        }
      >

        {/* Ulubione miasta */}
        <Text style={styles.favoritesTitle}>⭐ Ulubione miasta</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesScroll}>
          {favorites.map((fav, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.favoriteChip, city === fav && styles.favoriteChipActive]}
              onPress={() => fetchWeather(fav)}
            >
              <Text style={[styles.favoriteChipText, city === fav && styles.favoriteChipTextActive]}>
                {fav}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />
        ) : weather ? (
          <>
            {/* DASHBOARD 5 SEKUND - Wszystko co Paweł potrzebuje w szybkim spojrzeniu */}
            <View style={styles.dashboardBox}>
              <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#333' }}>
                📊 Dashboard
              </Text>

              {/* Temperatura + Odczuwalna */}
              <View style={styles.dashboardTempSection}>
                <View style={styles.dashboardTempBox}>
                  <Text style={styles.dashboardLabel}>Temperatura</Text>
                  <Text style={styles.dashboardBigTemp}>{weather.temp}</Text>
                </View>
                <View style={styles.dashboardTempBox}>
                  <Text style={styles.dashboardLabel}>Odczuwalna</Text>
                  <Text style={styles.dashboardBigTemp} numberOfLines={1}>{weather.feelsLike}</Text>
                </View>
              </View>

              {/* Opady + Wiatr + AQI */}
              <View style={styles.dashboardGrid}>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>☔ Opady</Text>
                  <Text style={styles.dashboardValue}>{generateWeatherChange(weather).rainChange}</Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>💨 Wiatr</Text>
                  <Text style={styles.dashboardValue} numberOfLines={1}>{weather.windSpeed}</Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>💧 Wilgotność</Text>
                  <Text style={styles.dashboardValue}>{weather.humidity}</Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>{weather.aqiEmoji} Jakość powietrza</Text>
                  <Text style={[styles.dashboardValue, { color: weather.aqiColor }]}>
                    {weather.aqi}
                  </Text>
                </View>
              </View>

              {/* Komfort Dnia + Zmiana */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff9e6', borderRadius: 8 }}>
                  <Text style={styles.dashboardLabel}>🎯 Komfort</Text>
                  <Text style={[styles.dashboardValue, { color: '#ff9800', fontSize: 28 }]}>
                    {calculateWeatherScore(weather)}/100
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff3e0', borderRadius: 8 }}>
                  <Text style={styles.dashboardLabel}>📈 Jutro</Text>
                  <Text style={[styles.dashboardValue, { color: '#ff9800', fontSize: 16 }]}>
                    {generateWeatherChange(weather).tempChange}
                  </Text>
                </View>
              </View>

            </View>

            {/* SZCZEGÓŁY + LOKACJA */}
            <View style={styles.weatherBox}>
              <View style={styles.locationHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.location}>{weather.location}</Text>
                  <Text style={styles.dateTime}>
                    {currentTime.toLocaleDateString('pl-PL')}
                  </Text>
                  <Text style={styles.dateTime}>
                    {currentTime.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}
                  </Text>
                  <Text style={styles.lastUpdate}>
                    Aktualizacja: {weather.lastUpdate}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => {
                    if (favorites.includes(city)) {
                      removeFavorite(city);
                    } else {
                      addFavorite();
                    }
                  }}
                >
                  <Text style={styles.favoriteButtonText}>
                    {favorites.includes(city) ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.iconTempRow}>
                <Text style={styles.bigIcon}>{weather.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.description}>{weather.description}</Text>
                  <Text style={styles.insight}>{generateWeatherInsight(weather)}</Text>
                </View>
              </View>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Odczuwa się</Text>
                  <Text style={styles.detailValue}>{weather.feelsLike}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Wilgotność</Text>
                  <Text style={styles.detailValue}>{weather.humidity}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Wiatr</Text>
                  <Text style={styles.detailValue}>{weather.windSpeed}</Text>
                </View>
              </View>

              {/* Rekomendacje */}
              <View style={styles.comfortCard}>
                <Text style={styles.comfortTitle}>💡 Czy wyjść?</Text>
                {generateComfortRecommendations(weather).map((rec, idx) => (
                  <Text key={idx} style={styles.comfortText}>{rec}</Text>
                ))}
              </View>

              {/* Szczegóły pogody */}
              <Text style={styles.detailsTitle}>📊 Szczegóły</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Ciśnienie</Text>
                  <Text style={styles.detailGridValue}>{weather.pressure}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Widoczność</Text>
                  <Text style={styles.detailGridValue}>{weather.visibility}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Indeks UV</Text>
                  <Text style={styles.detailGridValue}>{weather.uvIndex}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>🌅 Wschód</Text>
                  <Text style={styles.detailGridValue}>{weather.sunrise}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Zachód</Text>
                  <Text style={styles.detailGridValue}>{weather.sunset}</Text>
                </View>
                <View style={[styles.detailGridItem, { backgroundColor: '#fff3cd' }]}>
                  <Text style={styles.detailGridLabel}>☀️ Długość dnia</Text>
                  <Text style={[styles.detailGridValue, { color: '#ff9800' }]}>
                    {calculateDayLength(weather.sunrise, weather.sunset)}
                  </Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>PM2.5</Text>
                  <Text style={styles.detailGridValue}>{weather.pm25}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>PM10</Text>
                  <Text style={styles.detailGridValue}>{weather.pm10}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.detailGridItem, { backgroundColor: weather.aqiColor }]}
                  onPress={() => setShowAQIModal(true)}
                >
                  <Text style={styles.detailGridLabel}>Jakość powietrza</Text>
                  <Text style={[styles.detailGridValue, { color: '#fff', fontSize: 18 }]}>
                    {weather.aqiEmoji} {weather.aqi}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </>
        ) : null}
      </ScrollView>


      {/* Forecast Modal - 3 days selection */}
      <Modal
        visible={showForecastModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowForecastModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowForecastModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Prognoza</Text>
            <View style={{ width: 40 }} />
          </View>

          {weather && (
            <ScrollView style={styles.modalContent}>
              {weather.forecast.map((day, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.forecastCard}
                  onPress={() => {
                    setSelectedDay(day);
                    setShowForecastModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.forecastHeader}>
                    <Text style={styles.forecastDate}>{day.date}</Text>
                    <Text style={styles.forecastIcon}>{day.icon}</Text>
                  </View>
                  <Text style={styles.forecastDesc}>{translateWeather(day.description)}</Text>
                  <View style={styles.forecastTemp}>
                    <Text style={styles.forecastMax}>Maks: {day.maxTemp}</Text>
                    <Text style={styles.forecastMin}>Min: {day.minTemp}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* AQI Details Modal */}
      <Modal
        visible={showAQIModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAQIModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAQIModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Jakość Powietrza</Text>
            <View style={{ width: 40 }} />
          </View>
          {weather && (
            <ScrollView style={styles.modalContent}>
              <View style={[styles.modalDayCard, { backgroundColor: weather.aqiColor }]}>
                <Text style={[styles.modalDate, { color: '#fff' }]}>
                  {weather.aqiEmoji} {weather.aqi}
                </Text>
                <Text style={[styles.modalDesc, { color: '#fff', marginTop: 16 }]}>
                  PM2.5: {weather.pm25}
                </Text>
                <Text style={[styles.modalDesc, { color: '#fff' }]}>
                  PM10: {weather.pm10}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Modal dla szczegółów dnia */}
      <Modal
        visible={selectedDay !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDay(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedDay(null)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Szczegóły dnia</Text>
            <View style={{ width: 40 }} />
          </View>

          {selectedDay && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalDayCard}>
                <View style={styles.modalDayHeader}>
                  <Text style={styles.modalDate}>{selectedDay.date}</Text>
                  <Text style={styles.modalDayIcon}>{selectedDay.icon}</Text>
                </View>

                <Text style={styles.modalDesc}>{translateWeather(selectedDay.description)}</Text>

                <View style={styles.modalDetailsGrid}>
                  <View style={styles.modalDetailBox}>
                    <Text style={styles.modalDetailLabel}>Temperatura maks.</Text>
                    <Text style={styles.modalDetailValue}>{selectedDay.maxTemp}</Text>
                  </View>
                  <View style={styles.modalDetailBox}>
                    <Text style={styles.modalDetailLabel}>Temperatura min.</Text>
                    <Text style={styles.modalDetailValue}>{selectedDay.minTemp}</Text>
                  </View>
                </View>

                <Text style={styles.modalInfoText}>
                  Dotknij, aby wrócić do poprzedniej strony
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#1e90ff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 24, // Increased for better tall-screen utilization (Motorola)
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    marginBottom: 24, // Increased spacing for tall screen
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: 50,
    borderRadius: 8,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  favoritesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  favoritesScroll: {
    marginBottom: 16,
    flexGrow: 0,
  },
  favoriteChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  favoriteChipActive: {
    backgroundColor: '#1e90ff',
  },
  favoriteChipText: {
    fontSize: 12,
    color: '#1e90ff',
    fontWeight: '600',
  },
  favoriteChipTextActive: {
    color: '#fff',
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 40,
  },
  dashboardBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  dashboardLargeItem: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  dashboardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  dashboardTempSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dashboardTempBox: {
    alignItems: 'center',
  },
  dashboardBigTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  dashboardFeelsLike: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  weatherBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e90ff',
  },
  dateTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  lastUpdate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  iconTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigIcon: {
    fontSize: 56,
    marginRight: 12,
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  insight: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  changeCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  changeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  changeText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  hourlyCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  hourlyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 10,
  },
  hourlyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hourlyItem: {
    alignItems: 'center',
  },
  hourlyHour: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  hourlyEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  hourlyPercent: {
    fontSize: 10,
    color: '#1565c0',
    fontWeight: '600',
  },
  widgetCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e90ff',
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  widgetItem: {
    alignItems: 'center',
  },
  widgetLabel: {
    fontSize: 20,
  },
  widgetValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#666',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9800',
    marginTop: 4,
  },
  comfortCard: {
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  comfortTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  comfortText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 14,
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailGridItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  detailGridLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  detailGridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e90ff',
  },
  forecastTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },
  forecastCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  forecastIcon: {
    fontSize: 24,
  },
  forecastDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  forecastTemp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastMax: {
    fontSize: 11,
    color: '#d32f2f',
    fontWeight: '600',
  },
  forecastMin: {
    fontSize: 11,
    color: '#0066cc',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalCloseButton: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalDayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e90ff',
  },
  modalDayIcon: {
    fontSize: 56,
  },
  modalDesc: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalDetailBox: {
    width: '48%',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  modalDetailValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  modalInfoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
