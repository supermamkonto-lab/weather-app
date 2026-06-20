import axios from 'axios';

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

const WTTR_API = 'https://wttr.in';
const TIMEOUT = 10000;

export const fetchWeatherData = async (cityName: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${WTTR_API}/${encodeURIComponent(cityName)}?format=j1&lang=pl`,
      { timeout: TIMEOUT }
    );

    // Validate response structure
    if (!response.data?.current_condition?.[0] || !response.data?.nearest_area?.[0]) {
      throw new Error('Invalid wttr.in response structure');
    }

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch weather for ${cityName}: ${error}`);
  }
};

export const parseWeatherResponse = (data: any): Weather => {
  const current = data.current_condition[0];
  const location = data.nearest_area[0];
  const forecastDays = data.weather?.slice(1, 4) || [];
  const astronomy = data.weather?.[0]?.astronomy?.[0];
  const lat = location.latitude;
  const lon = location.longitude;

  if (!lat || !lon) {
    throw new Error('Could not extract coordinates from response');
  }

  const tempC = current.temp_C;
  const windKmph = current.windspeedKmph;
  const humidity = current.humidity;
  const feelsLikeTemp = calculateFeelsLike(tempC, humidity, windKmph);
  const now = new Date();
  const lastUpdate = now.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const forecast = forecastDays.map((day: any) => ({
    date: day.date,
    maxTemp: `${day.maxtempC}°C`,
    minTemp: `${day.mintempC}°C`,
    description: day.hourly[4]?.weatherDesc[0]?.value || 'Brak danych',
    icon: getWeatherIcon(day.hourly[4]?.weatherDesc[0]?.value || ''),
  }));

  return {
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
    sunrise: astronomy?.sunrise || 'N/A',
    sunset: astronomy?.sunset || 'N/A',
    pm25: 'Brak danych dla lokalizacji',
    pm10: 'Brak danych dla lokalizacji',
    aqi: 'Brak danych dla lokalizacji',
    aqiColor: '#666',
    aqiEmoji: '⚪',
    lastUpdate,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    tempC,
    windKmph,
  };
};

const calculateFeelsLike = (tempC: number, humidity: number, windKmph: number): string => {
  // Wind Chill formula (for temps < 10°C, needs wind)
  if (tempC < 10 && windKmph > 4.8) {
    const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmph, 0.16) + 0.3965 * tempC * Math.pow(windKmph, 0.16);
    return windChill.toFixed(0);
  }

  // Heat Index formula (for temps >= 10°C with moderate-high humidity)
  if (tempC >= 10) {
    if (humidity >= 40) {
      // Simplified heat index approximation
      const exponent = (17.62 * tempC) / (tempC + 243.12);
      const vapPressure = 6.112 * Math.exp(exponent);
      const heatIndex = tempC + 0.5555 * ((humidity / 100) * vapPressure - 10);
      return heatIndex.toFixed(0);
    }
    return tempC.toFixed(0); // No adjustment for low humidity
  }

  return tempC.toFixed(0);
};

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
