// Weather App Type Definitions

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

export interface WeatherChangeData {
  tempChange: string;
  windChange: string;
  rainChange: string;
}

export interface HourlyRainData {
  hour: string;
  emoji: string;
  percent: number;
}

export interface ComfortData {
  recommendations: string[];
  score: number;
}

export interface AppState {
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  city: string;
  favorites: string[];
  isDarkMode: boolean;
}
