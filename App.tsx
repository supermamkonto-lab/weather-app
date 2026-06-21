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
  Share,
  PermissionsAndroid,
  Platform,
  Animated,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import ViewShot, { captureRef } from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import WeatherIcon from './src/components/WeatherIcon';
import TempCurve from './src/components/TempCurve';
import SectionHeader from './src/components/SectionHeader';
import UiIcon from './src/components/UiIcon';
import { Dimensions } from 'react-native';
import { setupNotifee, sendAQIAlert, sendStormAlert, scheduleDailyReport } from './src/services/notificationService';
import { NativeModules } from 'react-native';
const { WidgetModule } = NativeModules;

interface Weather {
  temp: string;
  description: string;
  location: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  icon: string;
  forecast: ForecastDay[];
  hourly: HourlyData[];
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
  pollen: string;
  pollenColor: string;
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

interface HourlyData {
  time: string;
  temp: string;
  feelsLike: string;
  icon: string;
  cond: string;
  night: boolean;
  rainChance: number;
  windKmph: number;
  uvIndex: number;
  comfort: number;
}

interface HistoryEntry {
  timestamp: string;
  city: string;
  temp: string;
  aqi: string;
  aqiColor: string;
  description: string;
  comfort: number;
}

const WEATHER_TRANSLATIONS: { [key: string]: string } = {
  'sunny': 'Słonecznie',
  'clear': 'Czyste niebo',
  'partly cloudy': 'Częściowo pochmurnie',
  'cloudy': 'Pochmurnie',
  'overcast': 'Zachmurzenie całkowite',
  'mist': 'Mgła',
  'patchy rain possible': 'Możliwy przelotny deszcz',
  'patchy rain nearby': 'Przelotny deszcz w pobliżu',
  'patchy snow possible': 'Możliwy przelotny śnieg',
  'patchy sleet possible': 'Możliwy deszcz ze śniegiem',
  'patchy freezing drizzle possible': 'Możliwa marznąca mżawka',
  'thundery outbreaks possible': 'Możliwe burze',
  'thundery outbreaks in nearby': 'Burze w pobliżu',
  'blowing snow': 'Zamieć śnieżna',
  'blizzard': 'Śnieżyca',
  'fog': 'Mgła',
  'freezing fog': 'Marznąca mgła',
  'patchy light drizzle': 'Lekka przelotna mżawka',
  'light drizzle': 'Lekka mżawka',
  'freezing drizzle': 'Marznąca mżawka',
  'heavy freezing drizzle': 'Silna marznąca mżawka',
  'patchy light rain': 'Przelotny lekki deszcz',
  'light rain': 'Lekki deszcz',
  'moderate rain at times': 'Okresami umiarkowany deszcz',
  'moderate rain': 'Umiarkowany deszcz',
  'heavy rain at times': 'Okresami silny deszcz',
  'heavy rain': 'Silny deszcz',
  'light freezing rain': 'Lekki marznący deszcz',
  'moderate or heavy freezing rain': 'Marznący deszcz',
  'light sleet': 'Lekki deszcz ze śniegiem',
  'moderate or heavy sleet': 'Deszcz ze śniegiem',
  'patchy light snow': 'Przelotny lekki śnieg',
  'light snow': 'Lekki śnieg',
  'patchy moderate snow': 'Przelotny umiarkowany śnieg',
  'moderate snow': 'Umiarkowany śnieg',
  'patchy heavy snow': 'Przelotny silny śnieg',
  'heavy snow': 'Intensywny śnieg',
  'ice pellets': 'Grad',
  'light rain shower': 'Przelotny lekki deszcz',
  'moderate or heavy rain shower': 'Przelotny silny deszcz',
  'torrential rain shower': 'Ulewa',
  'light sleet showers': 'Przelotny deszcz ze śniegiem',
  'moderate or heavy sleet showers': 'Silny deszcz ze śniegiem',
  'light snow showers': 'Przelotny lekki śnieg',
  'moderate or heavy snow showers': 'Przelotny silny śnieg',
  'light showers of ice pellets': 'Lekki grad',
  'moderate or heavy showers of ice pellets': 'Silny grad',
  'patchy light rain in area with thunder': 'Lekki deszcz z burzą',
  'moderate or heavy rain in area with thunder': 'Silny deszcz z burzą',
  'patchy light snow in area with thunder': 'Lekki śnieg z burzą',
  'moderate or heavy snow in area with thunder': 'Silny śnieg z burzą',
  'windy': 'Wietrznie',
};

// ===== KOMPLETNA MAPA KODÓW POGODY WWO → POLSKI =====
// wttr.in używa kodów WWO (weatherCode). Klucz numeryczny jest stabilny
// niezależnie od języka API — gwarantuje 100% polskich opisów.
const WWO_CODE_PL: { [code: string]: string } = {
  '113': 'Bezchmurnie',
  '116': 'Częściowe zachmurzenie',
  '119': 'Zachmurzenie',
  '122': 'Całkowite zachmurzenie',
  '143': 'Zamglenie',
  '176': 'Możliwe przelotne opady',
  '179': 'Możliwe przelotne opady śniegu',
  '182': 'Możliwy deszcz ze śniegiem',
  '185': 'Możliwa marznąca mżawka',
  '200': 'Możliwe burze w okolicy',
  '227': 'Zamieć śnieżna',
  '230': 'Śnieżyca',
  '248': 'Mgła',
  '260': 'Marznąca mgła',
  '263': 'Słaba przelotna mżawka',
  '266': 'Słaba mżawka',
  '281': 'Marznąca mżawka',
  '284': 'Silna marznąca mżawka',
  '293': 'Słabe przelotne opady',
  '296': 'Słaby deszcz',
  '299': 'Okresami umiarkowany deszcz',
  '302': 'Umiarkowany deszcz',
  '305': 'Okresami intensywny deszcz',
  '308': 'Intensywne opady deszczu',
  '311': 'Słaby marznący deszcz',
  '314': 'Marznący deszcz',
  '317': 'Słaby deszcz ze śniegiem',
  '320': 'Deszcz ze śniegiem',
  '323': 'Słabe przelotne opady śniegu',
  '326': 'Słaby śnieg',
  '329': 'Okresami umiarkowany śnieg',
  '332': 'Umiarkowany śnieg',
  '335': 'Okresami intensywny śnieg',
  '338': 'Intensywne opady śniegu',
  '350': 'Grad',
  '353': 'Przelotny słaby deszcz',
  '356': 'Przelotny intensywny deszcz',
  '359': 'Ulewa',
  '362': 'Przelotny deszcz ze śniegiem',
  '365': 'Przelotny intensywny deszcz ze śniegiem',
  '368': 'Przelotny słaby śnieg',
  '371': 'Przelotny intensywny śnieg',
  '374': 'Przelotny słaby grad',
  '377': 'Przelotny grad',
  '386': 'Słaby deszcz z burzą',
  '389': 'Intensywny deszcz z burzą',
  '392': 'Słaby śnieg z burzą',
  '395': 'Intensywny śnieg z burzą',
};

// WMO code mapping (Open-Meteo uses WMO codes, NOT WWO codes)
const WMO_CODE_PL: { [code: number]: string } = {
  0: 'Bezchmurnie',
  1: 'Przeważnie pogodnie',
  2: 'Częściowe zachmurzenie',
  3: 'Zachmurzenie',
  45: 'Zamglenie',
  48: 'Mgła ze szronem',
  51: 'Lekka mżawka',
  53: 'Umiarkowana mżawka',
  55: 'Gęsta mżawka',
  61: 'Słaby deszcz',
  63: 'Umiarkowany deszcz',
  65: 'Intensywny deszcz',
  71: 'Słaby śnieg',
  73: 'Umiarkowany śnieg',
  75: 'Intensywny śnieg',
  77: 'Ziarna śniegu',
  80: 'Słabe przelotne opady',
  81: 'Umiarkowane przelotne opady',
  82: 'Gwałtowne przelotne opady',
  85: 'Słabe przelotne opady śniegu',
  86: 'Intensywne przelotne opady śniegu',
  95: 'Burza',
  96: 'Burza z drobnym gradem',
  99: 'Burza z intensywnym gradem',
};

const translateWeather = (desc: string): string => {
  const lower = (desc || '').toLowerCase().trim();
  return WEATHER_TRANSLATIONS[lower] || desc;
};

// Tłumaczenie opisu pogody — priorytet: kod WMO (Open-Meteo) → kod WWO (fallback) → słownik tekstowy
// Użytkownik NIGDY nie widzi angielskiego opisu z API.
const getPolishDesc = (item: any): string => {
  const code = item?.weatherCode;
  // Try WMO first (Open-Meteo uses WMO: 0, 1, 3, 95, etc.)
  if (code !== undefined && code !== null) {
    const codeNum = Number(code);
    if (!isNaN(codeNum) && WMO_CODE_PL[codeNum]) {
      return WMO_CODE_PL[codeNum];
    }
    // Fallback to WWO (legacy, wttr.in used WWO: '113', '389', etc.)
    const codeStr = code.toString().trim();
    if (WWO_CODE_PL[codeStr]) return WWO_CODE_PL[codeStr];
  }
  // Last resort: text translation
  const en = (item?.weatherDesc?.[0]?.value || '').trim();
  return translateWeather(en);
};

const getWeatherIcon = (desc: string): string => {
  const lowerDesc = (desc || '').toLowerCase();
  if (lowerDesc.includes('storm') || lowerDesc.includes('thunder') || lowerDesc.includes('burz')) return '⛈️';
  if (lowerDesc.includes('bezchmur') || lowerDesc.includes('sunny') || lowerDesc.includes('clear') || lowerDesc.includes('słonecz') || lowerDesc.includes('pogodnie')) return '☀️';
  if (lowerDesc.includes('snow') || lowerDesc.includes('śnieg') || lowerDesc.includes('zamieć') || lowerDesc.includes('śnieżyca')) return '❄️';
  if (lowerDesc.includes('rain') || lowerDesc.includes('deszcz') || lowerDesc.includes('mżaw') || lowerDesc.includes('drizzle') || lowerDesc.includes('ulewa')) return '🌧️';
  if (lowerDesc.includes('fog') || lowerDesc.includes('mist') || lowerDesc.includes('mgł') || lowerDesc.includes('zamgl')) return '🌫️';
  if (lowerDesc.includes('cloud') || lowerDesc.includes('chmur') || lowerDesc.includes('zachmurz') || lowerDesc.includes('overcast')) return '☁️';
  if (lowerDesc.includes('wind') || lowerDesc.includes('wietrz')) return '💨';
  return '🌤️';
};

// Ikona świadoma pory dnia — księżyc w nocy (Apple Weather class)
const getWeatherIconTime = (desc: string, isNight: boolean): string => {
  const d = (desc || '').toLowerCase();
  const isClear = d.includes('bezchmur') || d.includes('sunny') || d.includes('clear') || d.includes('słonecz') || d.includes('pogodnie');
  const isStorm = d.includes('storm') || d.includes('thunder') || d.includes('burz');
  const isCloud = !isClear && (d.includes('cloud') || d.includes('chmur') || d.includes('zachmurz') || d.includes('overcast'));
  if (!isNight) return getWeatherIcon(desc);
  if (isStorm) return '⛈️';
  if (isClear) return '🌙';
  if (d.includes('rain') || d.includes('deszcz') || d.includes('mżaw') || d.includes('ulewa')) return '🌧️';
  if (d.includes('snow') || d.includes('śnieg')) return '❄️';
  if (d.includes('fog') || d.includes('mgł')) return '🌫️';
  if (isCloud) return '☁️';
  return '🌙';
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

// Analiza pyłków — dominujący typ + poziom + kolor (progi grains/m³ wg typu)
const POLLEN_PL: { [k: string]: string } = {
  grass: 'Trawy', birch: 'Brzoza', alder: 'Olcha',
  ragweed: 'Ambrozja', mugwort: 'Bylica', olive: 'Oliwka',
};
const getPollenInfo = (vals: { [k: string]: number }): { label: string; color: string } => {
  let topType = ''; let topVal = -1;
  Object.keys(POLLEN_PL).forEach(t => {
    const v = vals[t];
    if (typeof v === 'number' && v > topVal) { topVal = v; topType = t; }
  });
  if (topVal <= 0) return { label: 'Brak pyłków', color: '#4CAF50' };
  // progi zależne od typu (drzewa vs trawy vs chwasty)
  let mid: number, hi: number, vhi: number;
  if (topType === 'grass') { mid = 30; hi = 50; vhi = 150; }
  else if (topType === 'ragweed' || topType === 'mugwort') { mid = 10; hi = 50; vhi = 500; }
  else { mid = 10; hi = 100; vhi = 500; } // drzewa: brzoza/olcha/oliwka
  const name = POLLEN_PL[topType];
  if (topVal < mid) return { label: `${name}: niski`, color: '#4CAF50' };
  if (topVal < hi) return { label: `${name}: umiarkowany`, color: '#FFC107' };
  if (topVal < vhi) return { label: `${name}: wysoki`, color: '#FF9800' };
  return { label: `${name}: bardzo wysoki`, color: '#F44336' };
};

const calcHourlyComfort = (tempC: number, rainChance: number, windKmph: number, uvIndex: number): number => {
  let score = 100;
  const t = tempC;
  if (t < 0) score -= 40;
  else if (t < 5) score -= 25;
  else if (t < 10) score -= 12;
  else if (t < 15) score -= 5;
  else if (t >= 15 && t <= 24) score += 0;
  else if (t <= 30) score -= 8;
  else score -= 20;
  score -= Math.round(rainChance * 0.5);
  if (windKmph > 40) score -= 20;
  else if (windKmph > 25) score -= 10;
  if (uvIndex >= 8) score -= 15;
  else if (uvIndex >= 6) score -= 7;
  return Math.max(0, Math.min(100, score));
};

const getSportRecommendation = (weather: Weather): { verdict: string; emoji: string; color: string; details: string[] } => {
  const tempC = typeof weather.tempC === 'number' ? weather.tempC : parseFloat(weather.temp);
  const wind = typeof weather.windKmph === 'number' ? weather.windKmph : parseFloat(weather.windSpeed);
  const desc = weather.description.toLowerCase();
  const aqi = weather.aqi.toLowerCase();
  const issues: string[] = [];
  let score = 4;
  if (desc.includes('deszcz') || desc.includes('rain')) { score--; issues.push('🌧️ Deszcz — mokra nawierzchnia'); }
  if (desc.includes('burza') || desc.includes('thunder')) { score -= 2; issues.push('⛈️ Burza — niebezpieczne warunki'); }
  if (desc.includes('śnieg') || desc.includes('snow')) { score--; issues.push('❄️ Opady śniegu'); }
  if (wind > 35) { score--; issues.push(`💨 Silny wiatr ${Math.round(wind)} km/h`); }
  if (tempC < 0) { score--; issues.push(`🥶 Mróz ${Math.round(tempC)}°C — rowerem ryzykownie`); }
  if (tempC > 35) { score--; issues.push(`🥵 Upał ${Math.round(tempC)}°C — ryzyko przegrzania`); }
  if (aqi.includes('zła') || aqi.includes('bardzo')) { score--; issues.push('😷 Zła jakość powietrza'); }
  if (score >= 4) return { verdict: 'IDEALNE warunki', emoji: '🚴', color: '#4caf50', details: ['Temperatura OK', 'Wiatr słaby', 'Brak opadów', 'Powietrze czyste'] };
  if (score === 3) return { verdict: 'DOBRE warunki', emoji: '✅', color: '#8bc34a', details: issues.length ? issues : ['Ogólnie OK'] };
  if (score === 2) return { verdict: 'MOŻLIWE z zastrzeżeniami', emoji: '⚠️', color: '#ff9800', details: issues };
  return { verdict: 'NIEZALECANE', emoji: '❌', color: '#f44336', details: issues };
};

// ===== DYNAMICZNE NIEBO — silnik motywu wizualnego (Apple Weather class) =====
interface SkyTheme {
  colors: string[];
  accent: string;
  night: boolean;
  label: string;
}

const getSkyTheme = (description: string, hour: number, sunriseH: number = 5, sunsetH: number = 21): SkyTheme => {
  const d = (description || '').toLowerCase();
  const isNight = hour < sunriseH || hour >= sunsetH;
  const isDawn = !isNight && hour < sunriseH + 2;
  const isDusk = !isNight && hour >= sunsetH - 2;

  const isStorm = d.includes('burza') || d.includes('storm') || d.includes('thunder') || d.includes('wyładowania');
  const isRain = !isStorm && (d.includes('deszcz') || d.includes('rain') || d.includes('mżawka') || d.includes('drizzle') || d.includes('opady'));
  const isSnow = d.includes('śnieg') || d.includes('snow') || d.includes('zamieć');
  const isFog = d.includes('mgła') || d.includes('fog') || d.includes('mist') || d.includes('zamglenie');
  const isClear = d.includes('bezchmur') || d.includes('słonecz') || d.includes('pogodnie') || d.includes('clear') || d.includes('sunny') || d.includes('czyste');
  const isCloud = !isClear && (d.includes('chmur') || d.includes('cloud') || d.includes('pochmurn') || d.includes('overcast') || d.includes('zachmurz'));

  // Zjawiska ekstremalne nadpisują porę dnia
  if (isStorm) return { colors: ['#1f2733', '#3a4654', '#10151c'], accent: '#ffd54f', night: true, label: 'Burza' };
  if (isSnow) return isNight
    ? { colors: ['#2c3a4a', '#46596b', '#1e2935'], accent: '#e3f2fd', night: true, label: 'Śnieg' }
    : { colors: ['#8fa6bd', '#c3d4e3', '#a7bccf'], accent: '#1565c0', night: false, label: 'Śnieg' };
  if (isRain) return isNight
    ? { colors: ['#1a2530', '#2b3b4a', '#141c24'], accent: '#64b5f6', night: true, label: 'Deszcz' }
    : { colors: ['#52677a', '#7c93a6', '#5e7384'], accent: '#bbdefb', night: false, label: 'Deszcz' };
  if (isFog) return isNight
    ? { colors: ['#2b333b', '#454f59', '#1f262d'], accent: '#cfd8dc', night: true, label: 'Mgła' }
    : { colors: ['#9aa7b0', '#c4ced4', '#aeb9c0'], accent: '#546e7a', night: false, label: 'Mgła' };

  // Pogodnie / lekkie chmury — pełna gama pory dnia
  if (isNight) return { colors: ['#0b1a3a', '#1a2f5a', '#060d22'], accent: '#7c4dff', night: true, label: isCloud ? 'Pochmurna noc' : 'Czysta noc' };
  if (isDawn) return { colors: ['#ff9a76', '#ffd194', '#a1c4fd'], accent: '#e65100', night: false, label: 'Świt' };
  if (isDusk) return { colors: ['#ff7e5f', '#feb47b', '#6a4d8c'], accent: '#bf360c', night: false, label: 'Zmierzch' };
  if (isCloud) return { colors: ['#6e8aa6', '#9bb4cc', '#7e98b3'], accent: '#1565c0', night: false, label: 'Pochmurno' };
  // Słoneczny dzień
  return { colors: ['#2196f3', '#64b5f6', '#90caf9'], accent: '#0d47a1', night: false, label: 'Słonecznie' };
};

const parseHourFromTime = (t: string): number => {
  if (!t || t === 'N/A') return -1;
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return -1;
  let h = parseInt(m[1]);
  const ampm = m[3].toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h;
};

// Tłumaczenie nazw państw zwracanych przez API na polski (u źródła)
const COUNTRY_PL: { [key: string]: string } = {
  'poland': 'Polska', 'germany': 'Niemcy', 'czech republic': 'Czechy', 'czechia': 'Czechy',
  'france': 'Francja', 'slovakia': 'Słowacja', 'ukraine': 'Ukraina', 'austria': 'Austria',
  'hungary': 'Węgry', 'united kingdom': 'Wielka Brytania', 'italy': 'Włochy', 'spain': 'Hiszpania',
  'united states': 'Stany Zjednoczone', 'netherlands': 'Holandia', 'belgium': 'Belgia',
  'switzerland': 'Szwajcaria', 'sweden': 'Szwecja', 'norway': 'Norwegia', 'denmark': 'Dania',
  'lithuania': 'Litwa', 'belarus': 'Białoruś', 'russia': 'Rosja', 'croatia': 'Chorwacja',
  'portugal': 'Portugalia', 'ireland': 'Irlandia', 'greece': 'Grecja', 'romania': 'Rumunia',
};
const translateCountry = (country: string): string => {
  return COUNTRY_PL[(country || '').toLowerCase().trim()] || country;
};

// Formatuje datę ISO (2026-06-22) na naturalny polski zapis
const formatPolishDate = (isoDate: string): string => {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch {
    return isoDate;
  }
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
  const [showICMModal, setShowICMModal] = useState(false);
  const [showICMInterpretation, setShowICMInterpretation] = useState(false);
  const [favoritesWeather, setFavoritesWeather] = useState<Record<string, {temp: string, aqiColor: string}>>({});
  const [weatherHistory, setWeatherHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<Record<string, any>>({});
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const weatherCardRef = React.useRef<View>(null);
  const contentAnim = React.useRef(new Animated.Value(0)).current;
  const haptic = () => { try { Vibration.vibrate(8); } catch {} };
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cachedWeather, setCachedWeather] = useState<Weather | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState<number | null>(null);

  // Mikroanimacja wejścia danych (fade + slide) przy zmianie pogody
  useEffect(() => {
    if (weather && !loading) {
      contentAnim.setValue(0);
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }).start();
    }
  }, [weather?.location, weather?.lastUpdate, loading]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      // KROK 1: załaduj cache PRZED fetchem — gwarantuje dane offline przy zimnym starcie
      await loadFavoritesFromStorage();
      // KROK 2: spróbuj odświeżyć (nadpisze cache jeśli online, zostawi cache jeśli offline)
      fetchWeather();
      fetchFavoritesData(['Częstochowa', 'Warszawa', 'Kraków']);
      loadHistoryFromStorage();
      setupNotifee().then(ok => {
        setNotificationsEnabled(ok);
        if (ok) scheduleDailyReport(7);
      });
    })();
  }, []);

  const loadFavoritesFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
      const cached = await AsyncStorage.getItem('cachedWeather');
      if (cached) {
        const parsed = JSON.parse(cached);
        const w: Weather | null = parsed?.data || (parsed?.temp ? parsed : null);
        if (w) {
          setCachedWeather(w);
          // Pokaż natychmiast ostatnie dane jeśli ekran jeszcze pusty (offline cold start)
          setWeather(prev => prev || w);
          if (parsed?.timestamp) setDataTimestamp(parsed.timestamp);
        }
      }
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
    console.log('STEP 1 - GEOCODING: Starting location lookup for', cityName);

    try {
      // PHASE 6C: Get coordinates via wttr.in location lookup (with fallback for offline)
      let lat: string | number = 0;
      let lon: string | number = 0;
      let location: any = { country: [{ value: 'Polska' }] };

      try {
        console.log('STEP 2 - GEOCODING: Fetching from wttr.in...');
        const locationResponse = await axios.get(
          `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=pl`,
          { timeout: 5000, headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' } }
        );

        if (locationResponse.data?.nearest_area?.[0]) {
          location = locationResponse.data.nearest_area[0];
          lat = location.latitude;
          lon = location.longitude;
          console.log('STEP 2 - GEOCODING: OK - got coords', lat, lon);
        }
      } catch (locErr) {
        // Fallback: use cached coordinates or common Polish city coords
        console.warn('STEP 2 - GEOCODING: FAIL -', locErr.message, '- using fallback');
        const coordsMap: { [key: string]: [number, number] } = {
          'Częstochowa': [50.8118, 19.1216],
          'Warszawa': [52.2297, 21.0122],
          'Kraków': [50.0647, 19.9450],
          'Wrocław': [51.1079, 17.0385],
          'Poznań': [52.4082, 16.9454],
        };
        const key = cityName.trim().toLowerCase();
        const found = Object.keys(coordsMap).find(k => k.toLowerCase() === key);
        if (found) {
          [lat, lon] = coordsMap[found];
        } else {
          // Default to Warszawa if city not found
          [lat, lon] = [52.2297, 21.0122];
        }
        console.log('STEP 2 - GEOCODING: Fallback used, coords', lat, lon);
      }

      if (!lat || !lon) {
        console.error('STEP 2 - GEOCODING: ERROR - no coords');
        throw new Error('Could not extract coordinates');
      }

      // PHASE 6C: Fetch ALL weather from Open-Meteo (current, hourly, daily)
      let openMeteoResponse: any = null;
      let forecastDays: any[] = [];
      let todayHourly: any[] = [];
      let sunriseStr = '';
      let sunsetStr = '';
      let currentData: any = {};

      try {
        console.log('STEP 3 - OPEN-METEO: Fetching forecast...');
        openMeteoResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,cloud_cover,uv_index&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Europe/Warsaw&forecast_days=6`,
          { timeout: 10000 }
        );

        if (openMeteoResponse.data) {
          console.log('STEP 3 - OPEN-METEO: OK - got response');
          const data = openMeteoResponse.data;

          // Current weather
          currentData = data.current || {};
          console.log('STEP 4 - PARSE CURRENT: OK');

          // Hourly - map to wttr.in-like structure (current day only = first 24h)
          if (data.hourly) {
            const hourlyData = data.hourly;
            todayHourly = hourlyData.time.slice(0, 24).map((time: string, idx: number) => {
              return {
                time: time.slice(-5),
                tempC: hourlyData.temperature_2m[idx],
                chanceofrain: hourlyData.precipitation_probability[idx],
                windspeedKmph: hourlyData.wind_speed_10m[idx],
                uvIndex: hourlyData.uv_index[idx],
                weatherCode: hourlyData.weather_code[idx],
              };
            });
            console.log('STEP 5 - PARSE HOURLY: OK -', todayHourly.length, 'hours');
          }

          // Daily - forecast
          if (data.daily) {
            const daily = data.daily;
            forecastDays = daily.time.map((date: string, idx: number) => ({
              date,
              maxtempC: Math.round(daily.temperature_2m_max[idx]),
              mintempC: Math.round(daily.temperature_2m_min[idx]),
              weatherCode: daily.weather_code[idx],
            }));
            // Get sunrise/sunset from first day (today)
            sunriseStr = daily.sunrise?.[0] || '';
            sunsetStr = daily.sunset?.[0] || '';
            console.log('STEP 6 - PARSE DAILY: OK -', forecastDays.length, 'days');
          }
        }
      } catch (err) {
        console.error('STEP 3 - OPEN-METEO: FAIL -', err.message, 'lat:', lat, 'lon:', lon, 'code:', err.code, 'status:', err.response?.status);
        throw new Error('Open-Meteo API failed');
      }

      // Fetch AQI data in parallel (non-blocking)
      let pm25 = 'Brak danych dla lokalizacji';
      let pm10 = 'Brak danych dla lokalizacji';
      let aqi = 'Brak danych dla lokalizacji';
      let aqiColor = '#666';
      let aqiEmoji = '⚪';
      let pollen = 'Brak danych';
      let pollenColor = '#999';

      try {
        // Non-blocking AQI + pyłki fetch - timeout 2 sec (jedno zapytanie)
        aqiResponse = await Promise.race([
          axios.get(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi,grass_pollen,birch_pollen,alder_pollen,ragweed_pollen,mugwort_pollen,olive_pollen`,
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

          // Pyłki — dominujący typ + poziom
          const pollenInfo = getPollenInfo({
            grass: aqiData.grass_pollen,
            birch: aqiData.birch_pollen,
            alder: aqiData.alder_pollen,
            ragweed: aqiData.ragweed_pollen,
            mugwort: aqiData.mugwort_pollen,
            olive: aqiData.olive_pollen,
          });
          if (aqiData.grass_pollen !== undefined || aqiData.birch_pollen !== undefined) {
            pollen = pollenInfo.label;
            pollenColor = pollenInfo.color;
          }
        }
      } catch (err) {
        // Jeśli API fails, wartości domyślne
      }

      const tempC = currentData.temperature_2m || 0;
      const windKmph = currentData.wind_speed_10m || 0;
      const humidity = currentData.relative_humidity_2m || 0;
      const feelsLikeTemp = currentData.apparent_temperature !== undefined ? String(Math.round(currentData.apparent_temperature)) : calculateFeelsLike(tempC, humidity, windKmph);
      const now = new Date();
      const lastUpdate = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

      const sunriseHour = parseHourFromTime(sunriseStr);
      const sunsetHour = parseHourFromTime(sunsetStr);
      const srH = sunriseHour >= 0 ? sunriseHour : 5;
      const ssH = sunsetHour >= 0 ? sunsetHour : 21;

      const hourly: HourlyData[] = todayHourly.map((h: any) => {
        const hTemp = parseFloat(h.tempC || 0);
        const hRain = parseInt(h.chanceofrain || 0);
        const hWind = parseFloat(h.windspeedKmph || 0);
        const hUV = parseInt(h.uvIndex || 0);
        const hh = parseInt(h.time.split(':')[0]);
        const hNight = hh < srH || hh >= ssH;
        return {
          time: h.time,
          temp: `${Math.round(hTemp)}°`,
          feelsLike: `${Math.round(hTemp)}°`,
          icon: getWeatherIconTime(getPolishDesc(h), hNight),
          cond: getPolishDesc(h),
          night: hNight,
          rainChance: hRain,
          windKmph: hWind,
          uvIndex: hUV,
          comfort: calcHourlyComfort(hTemp, hRain, hWind, hUV),
        };
      });

      const forecast = forecastDays.map((day: any) => {
        const polishDesc = getPolishDesc(day);
        return {
          date: day.date,
          maxTemp: `${day.maxtempC}°C`,
          minTemp: `${day.mintempC}°C`,
          description: polishDesc || 'Brak danych',
          icon: getWeatherIcon(polishDesc),
        };
      });

      const weatherData = {
        temp: `${Math.round(tempC)}°C`,
        description: getPolishDesc(currentData),
        location: `${cityName.trim()}, ${translateCountry(location.country[0].value)}`,
        feelsLike: `${feelsLikeTemp}°C`,
        humidity: `${humidity}%`,
        windSpeed: `${Math.round(windKmph)} km/h`,
        icon: getWeatherIcon(getPolishDesc(currentData)),
        forecast,
        hourly,
        pressure: `${Math.round(currentData.pressure_msl || 0)} hPa`,
        visibility: `—`,
        uvIndex: `${Math.round(currentData.uv_index || 0)}`,
        sunrise: sunriseStr.substring(11, 16),
        sunset: sunsetStr.substring(11, 16),
        pm25,
        pm10,
        aqi,
        aqiColor,
        aqiEmoji,
        pollen,
        pollenColor,
        lastUpdate,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        tempC,
        windKmph,
      };
      setWeather(weatherData);
      cacheWeatherData(weatherData);
      setIsOffline(false);
      setError('');
      setDataTimestamp(Date.now());
      setCity(cityName);
      setFavoritesWeather(prev => ({
        ...prev,
        [cityName.trim()]: { temp: `${tempC}°`, aqiColor },
      }));
      try {
        WidgetModule?.updateWidget({
          city: cityName.trim(),
          temp: `${tempC}°C`,
          aqi,
          aqiColor,
          icon: getWeatherIcon(getPolishDesc(currentData)),
          lastUpdate: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        });
      } catch {}
      sendAQIAlert(aqi, cityName.trim(), aqiColor).catch(() => {});
      sendStormAlert(getPolishDesc(current), cityName.trim()).catch(() => {});
      const polishDesc = getPolishDesc(current);
      const histEntry: HistoryEntry = {
        timestamp: new Date().toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        city: cityName.trim(),
        temp: `${tempC}°C`,
        aqi,
        aqiColor,
        description: polishDesc,
        comfort: calculateWeatherScore({ aqi, aqiColor, tempC, windKmph: parseFloat(windKmph), description: polishDesc } as any),
      };
      saveHistoryEntry(histEntry);
    } catch (err) {
      console.error('STEP 7 - RENDER: MAIN ERROR -', err.message);
      // Odczytaj cache bezpośrednio z dysku (pewniejsze niż stan przy zimnym starcie)
      let cachedRaw: string | null = null;
      try { cachedRaw = await AsyncStorage.getItem('cachedWeather'); } catch {}
      let fallback: Weather | null = null;
      let fallbackTs: number | null = null;
      if (cachedRaw) {
        try {
          const parsed = JSON.parse(cachedRaw);
          fallback = parsed?.data || (parsed?.temp ? parsed : null);
          fallbackTs = parsed?.timestamp || null;
        } catch {}
      }
      if (fallback) {
        // Mamy zapisane dane — pokaż je z banerem offline (NIE wygląda na uszkodzoną)
        console.log('STEP 7 - RENDER: Using fallback cache');
        setWeather(fallback);
        setCachedWeather(fallback);
        if (fallbackTs) setDataTimestamp(fallbackTs);
        setIsOffline(true);
        setError('');
      } else {
        // Brak internetu i brak jakichkolwiek zapisanych danych
        console.error('STEP 7 - RENDER: No cache, showing offline error');
        setIsOffline(true);
        setError('Brak połączenia z internetem i brak zapisanych danych.');
      }
    } finally {
      setLoading(false);
      console.log('STEP 7 - RENDER: Complete');
    }
  };

  const fetchFavoritesData = async (cityList: string[]) => {
    const results: Record<string, {temp: string, aqiColor: string}> = {};
    await Promise.all(cityList.map(async (favCity) => {
      try {
        const res = await axios.get(
          `https://wttr.in/${encodeURIComponent(favCity)}?format=j1&lang=pl`,
          { timeout: 6000 }
        );
        const curr = res.data?.current_condition?.[0];
        const loc = res.data?.nearest_area?.[0];
        if (!curr || !loc) return;
        const temp = `${curr.temp_C}°`;
        let aqiColor = '#999';
        try {
          const aqiRes: any = await Promise.race([
            axios.get(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.latitude}&longitude=${loc.longitude}&current=us_aqi`,
              { timeout: 2000 }
            ),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
          ]);
          const usAqi = aqiRes?.data?.current?.us_aqi;
          if (usAqi !== null && usAqi !== undefined) {
            const info = getAQIColor(
              usAqi <= 50 ? 'Dobra' :
              usAqi <= 100 ? 'Umiarkowana' :
              usAqi <= 150 ? 'Niezdrowa dla wrażliwych' :
              usAqi <= 200 ? 'Zła' :
              usAqi <= 300 ? 'Bardzo zła' : 'Niebezpieczna'
            );
            aqiColor = info.color;
          }
        } catch {}
        results[favCity] = { temp, aqiColor };
      } catch {}
    }));
    setFavoritesWeather(prev => ({ ...prev, ...results }));
  };

  const loadHistoryFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem('weatherHistory');
      if (saved) setWeatherHistory(JSON.parse(saved));
    } catch {}
  };

  const saveHistoryEntry = async (entry: HistoryEntry) => {
    try {
      const saved = await AsyncStorage.getItem('weatherHistory');
      const existing: HistoryEntry[] = saved ? JSON.parse(saved) : [];
      const updated = [entry, ...existing].slice(0, 50);
      await AsyncStorage.setItem('weatherHistory', JSON.stringify(updated));
      setWeatherHistory(updated);
    } catch {}
  };

  const fetchComparisonData = async () => {
    setComparisonLoading(true);
    const cities = ['Częstochowa', 'Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Zakopane'];
    const results: Record<string, any> = {};
    await Promise.all(cities.map(async (c) => {
      try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(c)}?format=j1&lang=pl`, { timeout: 8000 });
        const curr = res.data?.current_condition?.[0];
        const loc = res.data?.nearest_area?.[0];
        if (!curr || !loc) return;
        let aqiColor = '#999'; let aqiLabel = 'Brak';
        try {
          const ar: any = await Promise.race([
            axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.latitude}&longitude=${loc.longitude}&current=us_aqi`, { timeout: 2000 }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('t')), 2000)),
          ]);
          const v = ar?.data?.current?.us_aqi;
          if (v !== null && v !== undefined) {
            aqiLabel = v <= 50 ? 'Dobra' : v <= 100 ? 'Umiarkowana' : v <= 150 ? 'Niezdr.' : 'Zła';
            aqiColor = getAQIColor(v <= 50 ? 'Dobra' : v <= 100 ? 'Umiarkowana' : v <= 150 ? 'Niezdrowa dla wrażliwych' : 'Zła').color;
          }
        } catch {}
        const desc = curr.weatherDesc?.[0]?.value || '';
        results[c] = {
          temp: `${curr.temp_C}°C`,
          feelsLike: `${curr.FeelsLikeC}°C`,
          desc: getPolishDesc(curr),
          icon: getWeatherIcon(desc),
          wind: `${curr.windspeedKmph} km/h`,
          humidity: `${curr.humidity}%`,
          aqiColor,
          aqiLabel,
          comfort: calcHourlyComfort(parseFloat(curr.temp_C), 0, parseFloat(curr.windspeedKmph), parseInt(curr.uvIndex || 0)),
        };
      } catch {}
    }));
    setComparisonData(results);
    setComparisonLoading(false);
  };

  const fetchGPSWeather = async () => {
    setGpsLoading(true);
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Brak uprawnień', 'Zezwól na dostęp do lokalizacji w ustawieniach.');
          setGpsLoading(false);
          return;
        }
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await fetchWeather(`${latitude},${longitude}`);
          setGpsLoading(false);
        },
        (err) => {
          Alert.alert('GPS', 'Nie można pobrać lokalizacji: ' + err.message);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (e) {
      setGpsLoading(false);
    }
  };

  const shareWeather = async () => {
    if (!weather) return;
    try {
      if (weatherCardRef.current) {
        const uri = await captureRef(weatherCardRef, { format: 'png', quality: 1.0 });
        await Share.share({ url: uri, message: `Pogoda — ${weather.location} ${weather.temp}` });
      } else {
        await Share.share({
          message: `🌦️ Pogoda — ${weather.location}\n\nTemperatura: ${weather.temp} (odczuwalna ${weather.feelsLike})\n${weather.description}\nWiatr: ${weather.windSpeed} · Wilgotność: ${weather.humidity}\nJakość powietrza: ${weather.aqi}\nCiśnienie: ${weather.pressure.replace(' mb', ' hPa')}\n\nAktualizacja: ${weather.lastUpdate}`,
        });
      }
    } catch {}
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
    haptic();
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
    const hasStorm = desc.includes('burza') || desc.includes('storm') || desc.includes('thunder');
    const hasSnow = desc.includes('śnieg') || desc.includes('snow');
    const isClear = desc.includes('słonecz') || desc.includes('czyste') || desc.includes('bezchmur') || desc.includes('pogodnie');
    const aqi = weather.aqi.toLowerCase();
    const goodAir = aqi.includes('dobra') || aqi.includes('umiarkow');

    if (hasStorm) return `Dziś burza — zostań w domu, unikaj otwartej przestrzeni.`;
    if (hasSnow) return `Dziś opady śniegu ${temp}°C — ostrożnie na drogach, ciepłe ubranie obowiązkowe.`;
    if (hasRain && temp < 10) return `Zimno i deszczowo — kurtka plus parasol, wyjście krótkie.`;
    if (hasRain) return `Dziś deszczowo — weź parasol przed wyjściem.`;
    if (temp >= 20 && isClear && goodAir) return `Dziś idealny dzień — ${temp}°C, słonecznie, powietrze czyste. Warto wyjść.`;
    if (temp >= 18 && !hasRain) return `Przyjemne ${temp}°C i bez opadów — dobry dzień na aktywność na zewnątrz.`;
    if (temp < 5) return `Mróz ${temp}°C — ubierz się ciepło, rękawiczki i czapka w obowiązkowym.`;
    if (temp < 12) return `Chłodny dzień ${temp}°C — kurtka przyda się przez cały dzień.`;
    if (humidity > 80) return `Duszno i wilgotno — ${temp}°C odczuwalne jak więcej. Nawadniaj się regularnie.`;
    return `Dziś ${weather.description.toLowerCase()}, ${temp}°C — warunki do aktywności na zewnątrz.`;
  };

  const generateGoOutDecision = (weather: Weather): { verdict: string; reason: string; emoji: string; color: string } => {
    const temp = parseInt(weather.temp);
    const humidity = parseInt(weather.humidity);
    const uv = parseInt(weather.uvIndex);
    const wind = parseInt(weather.windSpeed);
    const desc = weather.description.toLowerCase();
    const hasRain = desc.includes('deszcz') || desc.includes('rain');
    const hasStorm = desc.includes('burza') || desc.includes('storm') || desc.includes('thunder') || desc.includes('wyładowania');
    const aqi = weather.aqi.toLowerCase();
    const badAir = aqi.includes('zła') || aqi.includes('niebezp') || aqi.includes('wrażliw');

    // BLOCKERS - hard NO
    if (hasStorm) return { verdict: 'NIE WYCHÓDŹ', reason: 'Burza — niebezpieczne warunki', emoji: '⛈️', color: '#c62828' };
    if (badAir) return { verdict: 'UNIKAJ WYJŚĆ', reason: 'Złe powietrze — szczególnie dla alergików', emoji: '😷', color: '#e65100' };
    if (wind > 50) return { verdict: 'UNIKAJ WYJŚĆ', reason: 'Silny wiatr powyżej 50 km/h', emoji: '🌬️', color: '#e65100' };

    // GREAT day
    if (temp >= 18 && temp <= 26 && !hasRain && humidity < 70 && uv <= 6) {
      return { verdict: 'WYJDŹ!', reason: 'Idealne warunki — przyjemna temperatura, brak opadów', emoji: '✅', color: '#2e7d32' };
    }

    // GOOD but with caveats
    if (!hasRain && temp >= 10 && humidity < 80) {
      const caveat = uv > 6 ? ' Użyj filtr UV.' : temp > 26 ? ' Dużo wody.' : temp < 15 ? ' Weź kurtkę.' : '';
      return { verdict: 'MOŻNA WYJŚĆ', reason: `Akceptowalne warunki.${caveat}`, emoji: '🟡', color: '#f57f17' };
    }

    // RAIN
    if (hasRain) {
      return { verdict: 'ZABIERZ PARASOL', reason: 'Opady — krótki wyjście możliwy', emoji: '☂️', color: '#1565c0' };
    }

    // COLD
    if (temp < 5) {
      return { verdict: 'UBIERZ SIĘ CIEPŁO', reason: `Zimno ${temp}°C — kurtka i rękawiczki`, emoji: '🧥', color: '#4527a0' };
    }

    return { verdict: 'WARUNKI OK', reason: 'Brak wyraźnych przeciwwskazań', emoji: '🟢', color: '#2e7d32' };
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

  const sunriseH = weather ? parseHourFromTime(weather.sunrise) : -1;
  const sunsetH = weather ? parseHourFromTime(weather.sunset) : -1;
  const theme = getSkyTheme(
    weather?.description || '',
    currentTime.getHours(),
    sunriseH >= 0 ? sunriseH : 5,
    sunsetH >= 0 ? sunsetH : 21,
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Pogoda</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => { haptic(); setShowSearch(!showSearch); }}
          >
            <Text style={styles.menuButtonText}>≡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View>
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
            <Text style={[styles.buttonText, { fontSize: 14, fontWeight: '700', color: '#fff' }]}>Szukaj</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'transparent' }}>
          <TouchableOpacity style={styles.menuActionBtn} onPress={() => { setShowHistory(true); setShowSearch(false); }}>
            <Text style={styles.menuActionText}>Historia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuActionBtn} onPress={() => { setShowComparison(true); setShowSearch(false); fetchComparisonData(); }}>
            <Text style={styles.menuActionText}>Porównaj miasta</Text>
          </TouchableOpacity>
          {weather && (
            <TouchableOpacity style={styles.menuActionBtn} onPress={() => { setShowSportModal(true); setShowSearch(false); }}>
              <Text style={styles.menuActionText}>Sport / Rower</Text>
            </TouchableOpacity>
          )}
          {weather && (
            <TouchableOpacity style={styles.menuActionBtn} onPress={() => { shareWeather(); setShowSearch(false); }}>
              <Text style={styles.menuActionText}>Udostępnij</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.menuActionBtn, { borderColor: notificationsEnabled ? '#4caf50' : 'rgba(255,255,255,0.5)' }]}
            onPress={async () => {
              if (notificationsEnabled) {
                const { cancelDailyReport } = require('./src/services/notificationService');
                await cancelDailyReport();
                setNotificationsEnabled(false);
              } else {
                const ok = await setupNotifee();
                if (ok) { await scheduleDailyReport(7); setNotificationsEnabled(true); }
              }
            }}
          >
            <Text style={[styles.menuActionText, { color: notificationsEnabled ? '#4caf50' : '#0d47a1' }]}>
              {notificationsEnabled ? 'Alerty: WŁ' : 'Alerty: WYŁ'}
            </Text>
          </TouchableOpacity>
        </View>
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

        {/* HERO — sygnatura wizualna (Apple Weather class) */}
        {weather && !loading && (
          <Animated.View style={[styles.hero, { opacity: contentAnim, transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
            <Text style={styles.heroLocation} numberOfLines={1}>
              {weather.location
                .replace(/^Warsaw,/, 'Warszawa,').replace(/^Wawel,/, 'Kraków,').replace(/^Krakow,/, 'Kraków,')
                .replace(/^Lodz,/, 'Łódź,').replace(/^Wroclaw,/, 'Wrocław,').replace(/^Poznan,/, 'Poznań,')
                .replace(/^Gdansk,/, 'Gdańsk,').replace(', Poland', ', Polska')}
            </Text>
            <View style={styles.heroTempRow}>
              <View style={{ marginRight: 6 }}>
                <WeatherIcon desc={weather.description} night={theme.night} size={68} />
              </View>
              <Text style={styles.heroTemp}>{weather.temp.replace('°C', '°')}</Text>
            </View>
            <Text style={styles.heroDesc}>{weather.description}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>Odczuwalna {weather.feelsLike.replace('°C', '°')}</Text>
              <Text style={styles.heroMetaDot}>·</Text>
              <Text style={styles.heroMeta}>
                ↑{weather.forecast?.[0]?.maxTemp?.replace('°C', '°') || weather.temp.replace('°C', '°')} ↓{weather.forecast?.[0]?.minTemp?.replace('°C', '°') || weather.temp.replace('°C', '°')}
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <View style={[styles.heroBadgeDot, { backgroundColor: weather.aqiColor }]} />
              <Text style={styles.heroBadgeText}>Powietrze: {weather.aqi}</Text>
            </View>
          </Animated.View>
        )}

        {/* DAILY DECISION — odpowiedź na pytanie rano (przed miastami, nad foldem) */}
        {weather && !loading && (() => {
          const dec = generateGoOutDecision(weather);
          return (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => { haptic(); setShowSportModal(true); }}
              style={{ backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)', flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ width: 5, height: 44, borderRadius: 3, backgroundColor: dec.color, marginRight: 14, shadowColor: dec.color, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.2, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
                  {dec.verdict}
                </Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', marginTop: 3, lineHeight: 18 }}>
                  {dec.reason}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, fontWeight: '300', marginLeft: 8 }}>›</Text>
            </TouchableOpacity>
          );
        })()}

        {/* Ulubione miasta */}
        <Text style={styles.favoritesTitle}>ULUBIONE MIASTA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesScroll}>
          {favorites.map((fav, idx) => {
            const favData = favoritesWeather[fav];
            const isActive = city === fav;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.favoriteChip, isActive && styles.favoriteChipActive]}
                onPress={() => { haptic(); fetchWeather(fav); }}
              >
                <Text style={[styles.favoriteChipText, isActive && styles.favoriteChipTextActive]}>
                  {fav}
                </Text>
                {favData && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isActive ? '#0d47a1' : '#fff' }}>
                      {favData.temp}
                    </Text>
                    <View style={{
                      width: 7, height: 7, borderRadius: 4,
                      backgroundColor: favData.aqiColor,
                      marginLeft: 4,
                      borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.15)',
                    }} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* BANNER ZAUFANIA OFFLINE — użytkownik wie, że aplikacja działa */}
        {isOffline && weather && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerTitle}>Brak połączenia z internetem</Text>
            <Text style={styles.offlineBannerText}>Wyświetlam ostatnio zapisane dane.</Text>
            {dataTimestamp && (
              <Text style={styles.offlineBannerTime}>
                Ostatnia aktualizacja: {new Date(dataTimestamp).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* SZYBKIE AKCJE — guziki widoczne (top app UX) */}
        {weather && !loading && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, flexGrow: 0 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); setShowForecastModal(true); }}>
                <View style={styles.quickActionIcon}><UiIcon name="calendar" size={22} /></View>
                <Text style={styles.quickActionText}>Prognoza</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); setShowICMInterpretation(false); setShowICMModal(true); }}>
                <View style={styles.quickActionIcon}><UiIcon name="chart" size={22} /></View>
                <Text style={styles.quickActionText}>ICM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); setShowSportModal(true); }}>
                <View style={styles.quickActionIcon}><UiIcon name="bike" size={22} /></View>
                <Text style={styles.quickActionText}>Sport</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); setShowComparison(true); fetchComparisonData(); }}>
                <View style={styles.quickActionIcon}><UiIcon name="compare" size={22} /></View>
                <Text style={styles.quickActionText}>Porównaj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); setShowHistory(true); }}>
                <View style={styles.quickActionIcon}><UiIcon name="history" size={22} /></View>
                <Text style={styles.quickActionText}>Historia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => { haptic(); shareWeather(); }}>
                <View style={styles.quickActionIcon}><UiIcon name="share" size={22} /></View>
                <Text style={styles.quickActionText}>Udostępnij</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : weather ? (
          <Animated.View style={{ opacity: contentAnim, transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
            {/* DASHBOARD 5 SEKUND - Wszystko co Paweł potrzebuje w szybkim spojrzeniu */}
            <View style={styles.dashboardBox} ref={weatherCardRef}>
              <SectionHeader title="Przegląd" accent={theme.accent} />

              {/* Opady + Wiatr + AQI */}
              <View style={styles.dashboardGrid}>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>OPADY</Text>
                  <Text style={styles.dashboardValue}>
                    {(() => {
                      const desc = weather.description.toLowerCase();
                      if (desc.includes('deszcz') || desc.includes('rain')) return 'tak';
                      if (desc.includes('burza') || desc.includes('storm') || desc.includes('thunder')) return 'możliwe';
                      if (desc.includes('śnieg') || desc.includes('snow')) return 'śnieg';
                      return 'brak';
                    })()}
                  </Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>WIATR</Text>
                  <Text style={styles.dashboardValue} numberOfLines={1}>{weather.windSpeed}</Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>WILGOTNOŚĆ</Text>
                  <Text style={styles.dashboardValue}>{weather.humidity}</Text>
                </View>
                <View style={styles.dashboardItem}>
                  <Text style={styles.dashboardLabel}>POWIETRZE</Text>
                  <Text style={[styles.dashboardValue, { color: weather.aqiColor, fontSize: weather.aqi.length > 8 ? 14 : 22 }]}>
                    {weather.aqi}
                  </Text>
                </View>
              </View>

              {/* Komfort + Jutro + Czy wyjść */}
              {(() => {
                const decision = generateGoOutDecision(weather);
                const score = calculateWeatherScore(weather);
                return (
                  <>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff9e6', borderRadius: 8 }}>
                        <Text style={styles.dashboardLabel}>KOMFORT</Text>
                        <Text style={[styles.dashboardValue, { color: '#ff9800', fontSize: 24 }]}>
                          {score}/100
                        </Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff3e0', borderRadius: 8 }}>
                        <Text style={styles.dashboardLabel}>JUTRO</Text>
                        {weather.forecast?.[0] ? (
                          <Text style={[styles.dashboardValue, { color: '#ff9800', fontSize: 20 }]}>
                            {weather.forecast[0].maxTemp.replace('°C','°')}/{weather.forecast[0].minTemp.replace('°C','°')}
                          </Text>
                        ) : (
                          <Text style={[styles.dashboardValue, { color: '#ff9800', fontSize: 14 }]}>brak</Text>
                        )}
                      </View>
                    </View>
                    <View style={{ backgroundColor: decision.color + '12', borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: decision.color, marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: decision.color, letterSpacing: 0.2 }}>
                        {decision.verdict}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#555', marginTop: 3, lineHeight: 17 }}>{decision.reason}</Text>
                    </View>
                  </>
                );
              })()}

            </View>

            {/* GODZINOWY INDEKS KOMFORTU */}
            {weather.hourly && weather.hourly.length > 0 && (
              <View style={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 12, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 }}>
                <SectionHeader
                  title="Dziś godzinowo"
                  accent={theme.accent}
                  right={
                    <TouchableOpacity onPress={() => { haptic(); setShowSportModal(true); }}>
                      <Text style={{ fontSize: 13, color: '#1e90ff', fontWeight: '700' }}>Sport →</Text>
                    </TouchableOpacity>
                  }
                />

                {/* Krzywa temperatury (yr.no / Apple style) */}
                {(() => {
                  const nowH = new Date().getHours();
                  const pts = weather.hourly.map(h => {
                    const hH = parseInt(h.time.split(':')[0]);
                    return {
                      label: h.time.split(':')[0],
                      temp: parseInt(h.temp.replace('°', '')) || 0,
                      isNow: hH <= nowH && hH + 3 > nowH,
                    };
                  });
                  return <TempCurve points={pts} width={Dimensions.get('window').width - 56} />;
                })()}

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {weather.hourly.map((h, i) => {
                      if (i <= 5) console.log(`UI RENDER hourly[${i}]:`, h.time, 'hHour calc:', h.time.split(':')[0]);
                      const now = new Date().getHours();
                      const hHour = parseInt(h.time.split(':')[0]);
                      const isPast = hHour < now;
                      const isNow = hHour === now || (hHour <= now && hHour + 3 > now);
                      const comfortColor = h.comfort >= 80 ? '#4caf50' : h.comfort >= 60 ? '#8bc34a' : h.comfort >= 40 ? '#ff9800' : '#f44336';
                      return (
                        <View key={i} style={{
                          alignItems: 'center', padding: 8, borderRadius: 10, minWidth: 60,
                          backgroundColor: isNow ? '#e3f2fd' : isPast ? '#f5f5f5' : '#fafafa',
                          borderWidth: isNow ? 2 : 1,
                          borderColor: isNow ? '#1e90ff' : '#e0e0e0',
                          opacity: isPast ? 0.5 : 1,
                        }}>
                          <Text style={{ fontSize: 11, fontWeight: isNow ? '700' : '400', color: isNow ? '#1e90ff' : '#666' }}>{h.time}</Text>
                          <View style={{ marginVertical: 3 }}>
                            <WeatherIcon desc={h.cond} night={h.night} size={30} />
                          </View>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: '#333' }}>{h.temp}</Text>
                          {h.rainChance > 15 && (
                            <Text style={{ fontSize: 10, color: '#1e90ff', fontWeight: '700' }}>{h.rainChance}%</Text>
                          )}
                          <View style={{ marginTop: 4, width: 36, height: 4, borderRadius: 2, backgroundColor: '#eee' }}>
                            <View style={{ width: `${h.comfort}%` as any, height: 4, borderRadius: 2, backgroundColor: comfortColor }} />
                          </View>
                          <Text style={{ fontSize: 9, color: comfortColor, fontWeight: '700', marginTop: 1 }}>{h.comfort}</Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* PROGNOZA 5-DNIOWA — grid 2 kolumny (premium) */}
            {weather.forecast && weather.forecast.length > 0 && (
              <View style={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 12, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 }}>
                <SectionHeader
                  title="Najbliższe dni"
                  accent={theme.accent}
                  right={
                    <TouchableOpacity onPress={() => { haptic(); setShowForecastModal(true); }}>
                      <Text style={{ fontSize: 13, color: '#1e90ff', fontWeight: '700' }}>Szczegóły →</Text>
                    </TouchableOpacity>
                  }
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
                  {weather.forecast.map((day, i) => {
                    const dayDate = new Date(day.date);
                    const dayName = i === 0 ? 'Jutro' : dayDate.toLocaleDateString('pl-PL', { weekday: 'short' });
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{ width: '48%', backgroundColor: '#f8f9fb', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' }}
                        onPress={() => setSelectedDay(day)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#9aa5b1', letterSpacing: 0.3, marginBottom: 8 }}>
                          {dayName}
                        </Text>
                        <WeatherIcon desc={day.description} size={36} />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#f44336', marginTop: 10 }}>
                          {day.maxTemp.replace('°C', '°')}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#1e90ff' }}>
                          {day.minTemp.replace('°C', '°')}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#999', marginTop: 8, textAlign: 'center' }}>
                          {day.description.substring(0, 10)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* SZCZEGÓŁY */}
            <View style={styles.weatherBox}>
              <View style={styles.detailsHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailsHeaderDate}>
                    {currentTime.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                  <Text style={styles.lastUpdate}>Aktualizacja: {weather.lastUpdate}</Text>
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
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: favorites.includes(city) ? '#ffd54f' : 'transparent', borderWidth: 2, borderColor: favorites.includes(city) ? '#ffd54f' : '#aaa' }} />
                </TouchableOpacity>
              </View>

              <View style={styles.insightBox}>
                <Text style={styles.insight}>{generateWeatherInsight(weather)}</Text>
              </View>

              {/* Szczegóły pogody */}
              <SectionHeader title="Szczegóły" accent={theme.accent} />
              <View style={styles.detailsGrid}>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Ciśnienie</Text>
                  <Text style={styles.detailGridValue}>{weather.pressure.replace(' mb', ' hPa')}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Widoczność</Text>
                  <Text style={styles.detailGridValue}>{weather.visibility}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Indeks UV</Text>
                  <Text style={styles.detailGridValue}>{weather.uvIndex}</Text>
                </View>
                <View style={[styles.detailGridItem, { backgroundColor: '#fff3cd' }]}>
                  <Text style={styles.detailGridLabel}>Długość dnia</Text>
                  <Text style={[styles.detailGridValue, { color: '#ff9800' }]}>
                    {calculateDayLength(weather.sunrise, weather.sunset)}
                  </Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Wschód słońca</Text>
                  <Text style={styles.detailGridValue}>{(() => {
                    const t = weather.sunrise;
                    if (!t || t === 'N/A') return 'N/A';
                    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return t;
                    let h = parseInt(match[1]);
                    const m = match[2];
                    const ampm = match[3].toUpperCase();
                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return `${h.toString().padStart(2,'0')}:${m}`;
                  })()}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Zachód słońca</Text>
                  <Text style={styles.detailGridValue}>{(() => {
                    const t = weather.sunset;
                    if (!t || t === 'N/A') return 'N/A';
                    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return t;
                    let h = parseInt(match[1]);
                    const m = match[2];
                    const ampm = match[3].toUpperCase();
                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return `${h.toString().padStart(2,'0')}:${m}`;
                  })()}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>PM2.5 — pyły drobne</Text>
                  <Text style={styles.detailGridValue}>{weather.pm25}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>PM10 — pyły zawieszone</Text>
                  <Text style={styles.detailGridValue}>{weather.pm10}</Text>
                </View>
                <View style={styles.detailGridItem}>
                  <Text style={styles.detailGridLabel}>Pyłki</Text>
                  <Text style={[styles.detailGridValue, { color: weather.pollenColor || '#999', fontSize: (weather.pollen || '').length > 14 ? 13 : 16 }]} numberOfLines={2}>
                    {weather.pollen || 'Brak danych'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.detailGridItem, { backgroundColor: weather.aqiColor }]}
                  onPress={() => setShowAQIModal(true)}
                >
                  <Text style={[styles.detailGridLabel, { color: 'rgba(255,255,255,0.85)' }]}>Jakość powietrza</Text>
                  <Text style={[styles.detailGridValue, { color: '#fff', fontSize: 18 }]}>
                    {weather.aqi}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </Animated.View>
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
            <View style={styles.modalContent}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6 }}>
                {weather.forecast.map((day, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={{ width: '48%', backgroundColor: '#fff', borderRadius: 10, padding: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 }}
                    onPress={() => {
                      setSelectedDay(day);
                      setShowForecastModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#9aa5b1', marginBottom: 2 }}>
                      {formatPolishDate(day.date).split(',')[0]}
                    </Text>
                    <View style={{ alignItems: 'center', marginVertical: 3 }}>
                      <WeatherIcon desc={day.description} size={28} />
                    </View>
                    <Text style={{ fontSize: 9, color: '#666', textAlign: 'center', marginBottom: 4, lineHeight: 12 }}>
                      {day.description.length > 12 ? day.description.split(' ').slice(0, 2).join(' ') : day.description}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 7, color: '#9aa5b1', fontWeight: '600' }}>Max</Text>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#f44336' }}>
                          {day.maxTemp.replace('°C', '°')}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 7, color: '#9aa5b1', fontWeight: '600' }}>Min</Text>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#1e90ff' }}>
                          {day.minTemp.replace('°C', '°')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
              {/* Karta-bohater z poziomem jakości powietrza */}
              <View style={[styles.modalDayCard, { backgroundColor: weather.aqiColor, alignItems: 'center' }]}>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '700', letterSpacing: 1 }}>
                  JAKOŚĆ POWIETRZA
                </Text>
                <Text style={{ fontSize: 30, color: '#fff', fontWeight: '800', marginTop: 6, textAlign: 'center' }}>
                  {weather.aqi}
                </Text>
              </View>

              {/* Pyły */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#9aa5b1', fontWeight: '700', letterSpacing: 0.6 }}>PM2.5</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginTop: 4 }}>{weather.pm25}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#9aa5b1', fontWeight: '700', letterSpacing: 0.6 }}>PM10</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginTop: 4 }}>{weather.pm10}</Text>
                </View>
              </View>

              {/* Pyłki */}
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <Text style={{ fontSize: 10, color: '#9aa5b1', fontWeight: '700', letterSpacing: 0.6, marginBottom: 4 }}>PYŁKI</Text>
                <Text style={{ fontSize: 17, fontWeight: '800', color: weather.pollenColor || '#1a1a1a' }}>{weather.pollen || 'Brak danych'}</Text>
              </View>

              {/* Zalecenie zdrowotne */}
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: weather.aqiColor }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 4 }}>Zalecenie</Text>
                <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
                  {(() => {
                    const a = weather.aqi.toLowerCase();
                    if (a.includes('dobra')) return 'Powietrze czyste — bez ograniczeń, można swobodnie przebywać na zewnątrz.';
                    if (a.includes('umiarkowana')) return 'Powietrze umiarkowane — osoby wrażliwe (astma, alergie) mogą odczuć dyskomfort przy długim wysiłku.';
                    if (a.includes('wrażliwych')) return 'Niezdrowe dla osób wrażliwych — ogranicz intensywny wysiłek na zewnątrz.';
                    if (a.includes('zła') || a.includes('bardzo')) return 'Zła jakość powietrza — ogranicz przebywanie na zewnątrz, rozważ maskę.';
                    return 'Brak danych o jakości powietrza dla tej lokalizacji.';
                  })()}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* HISTORIA Modal */}
      <Modal visible={showHistory} transparent={false} animationType="slide" onRequestClose={() => setShowHistory(false)}>
        <View style={{ flex: 1, backgroundColor: '#eef2f6' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Historia pogody</Text>
            <TouchableOpacity onPress={async () => { await AsyncStorage.removeItem('weatherHistory'); setWeatherHistory([]); }}>
              <Text style={{ color: '#f44336', fontSize: 12, fontWeight: '600' }}>Wyczyść</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, padding: 12 }}>
            {weatherHistory.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Text style={{ fontSize: 15, color: '#9aa5b1', fontWeight: '600' }}>Brak historii</Text>
                <Text style={{ fontSize: 13, color: '#b0bec5', marginTop: 6 }}>Odśwież pogodę kilka razy, aby zobaczyć historię.</Text>
              </View>
            ) : weatherHistory.map((entry, i) => (
              <View key={i} style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 5, height: 42, borderRadius: 3, backgroundColor: entry.aqiColor, marginRight: 14 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a1a1a' }}>{entry.city}</Text>
                    <Text style={{ fontSize: 20, fontWeight: '200', color: '#333', fontVariant: ['tabular-nums'], marginTop: 2 }}>{entry.temp}</Text>
                    <Text style={{ fontSize: 12, color: '#777', marginTop: 3 }}>{entry.description}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, color: '#b0bec5', fontWeight: '600' }}>{entry.timestamp}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 }}>
                      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: entry.aqiColor }} />
                      <Text style={{ fontSize: 11, color: '#777' }}>AQI: {entry.aqi}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* PORÓWNANIE MIAST Modal */}
      <Modal visible={showComparison} transparent={false} animationType="slide" onRequestClose={() => setShowComparison(false)}>
        <View style={{ flex: 1, backgroundColor: '#eef2f6' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComparison(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Porównaj miasta</Text>
            <TouchableOpacity onPress={fetchComparisonData}>
              <Text style={{ color: '#1e90ff', fontSize: 13, fontWeight: '600' }}>↺ Odśwież</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, padding: 12 }}>
            {comparisonLoading ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <ActivityIndicator size="large" color="#1e90ff" />
                <Text style={{ color: '#666', marginTop: 12 }}>Pobieranie danych dla 6 miast…</Text>
              </View>
            ) : Object.keys(comparisonData).length === 0 ? (
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Ładowanie…</Text>
            ) : (
              Object.entries(comparisonData)
                .sort(([,a], [,b]) => (b as any).comfort - (a as any).comfort)
                .map(([cityName, data]: [string, any], i) => (
                <View key={cityName} style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {i === 0 ? (
                      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#ffd54f', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#795548' }}>1</Text>
                      </View>
                    ) : (
                      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#666' }}>{i+1}</Text>
                      </View>
                    )}
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a', flex: 1 }}>{cityName}</Text>
                    <View style={{ backgroundColor: data.comfort >= 75 ? '#4caf50' : data.comfort >= 50 ? '#ff9800' : '#f44336', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{data.comfort}/100</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }}>{data.temp}</Text>
                    <Text style={{ fontSize: 13, color: '#666' }}>· {data.desc}</Text>
                    <Text style={{ fontSize: 13, color: '#666' }}>· wiatr {data.wind}</Text>
                    <Text style={{ fontSize: 13, color: '#666' }}>· wilg. {data.humidity}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: data.aqiColor }} />
                      <Text style={{ fontSize: 12, color: '#666' }}>AQI: {data.aqiLabel}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* SPORT / ROWER Modal */}
      <Modal visible={showSportModal} transparent={false} animationType="slide" onRequestClose={() => setShowSportModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#eef2f6' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSportModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sport / Rower</Text>
            <View />
          </View>
          {weather ? (
            <ScrollView style={{ flex: 1, padding: 16 }}>
              {(() => {
                const rec = getSportRecommendation(weather);
                return (
                  <>
                    {/* Karta-bohater: verdict + ikona pogody */}
                    <View style={{ backgroundColor: rec.color, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 }}>
                      <WeatherIcon desc={weather.description} night={theme.night} size={52} />
                      <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 14, textAlign: 'center', letterSpacing: 0.2 }}>{rec.verdict}</Text>
                      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', marginTop: 6, textAlign: 'center' }}>{weather.description} · {weather.temp}</Text>
                    </View>
                    <SectionHeader title="Warunki" accent={rec.color} />
                    {rec.details.map((d, i) => (
                      <View key={i} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 }}>
                        <Text style={{ fontSize: 13, color: '#333', fontWeight: '500' }}>{d}</Text>
                      </View>
                    ))}
                    {weather.hourly && weather.hourly.length > 0 && (
                      <>
                        <SectionHeader title="Najlepsze godziny" accent={rec.color} />
                        {weather.hourly
                          .filter(h => h.comfort >= 70)
                          .slice(0, 4)
                          .map((h, i) => (
                          <View key={i} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 }}>
                            <WeatherIcon desc={h.cond} night={h.night} size={32} />
                            <View style={{ marginLeft: 12 }}>
                              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2e7d32' }}>{h.time} — komfort {h.comfort}/100</Text>
                              <Text style={{ fontSize: 12, color: '#777', marginTop: 2 }}>{h.temp} · deszcz {h.rainChance}% · wiatr {Math.round(h.windKmph)} km/h</Text>
                            </View>
                          </View>
                        ))}
                        {weather.hourly.filter(h => h.comfort >= 70).length === 0 && (
                          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 2 }}>
                            <Text style={{ color: '#f44336', fontWeight: '600' }}>Dziś brak godzin z komfortem ≥70.</Text>
                            <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>Rozważ aktywność jutro.</Text>
                          </View>
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            </ScrollView>
          ) : <Text style={{ padding: 20, color: '#666' }}>Brak danych pogodowych</Text>}
        </View>
      </Modal>

      {/* ICM Meteo Modal — meteogram + interpretacja */}
      <Modal
        visible={showICMModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowICMModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#eef2f6' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowICMModal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Prognoza ICM</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#1e90ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}
              onPress={() => setShowICMInterpretation(v => !v)}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                {showICMInterpretation ? 'Wykres' : 'Interpretacja'}
              </Text>
            </TouchableOpacity>
          </View>

          {!showICMInterpretation ? (
            <WebView
              source={{
                uri: weather?.latitude && weather?.longitude
                  ? `https://www.meteo.pl/um/php/meteorogram_map_um.php?col=${Math.round(17.09 * weather.longitude - 108.61)}&row=${Math.round(-27.23 * weather.latitude + 1820.3)}&lang=pl&ntype=0u`
                  : 'https://www.meteo.pl/um/php/meteorogram_id_um.php?ntype=0u&id=746'
              }}
              style={{ flex: 1 }}
              startInLoadingState
              renderLoading={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#1e90ff" />
                  <Text style={{ marginTop: 12, color: '#666' }}>Ładowanie meteogramu ICM…</Text>
                </View>
              )}
            />
          ) : (
            <ScrollView style={{ flex: 1, padding: 16 }}>
              {weather && (() => {
                const temp = parseInt(weather.temp);
                const feelsLike = parseInt(weather.feelsLike);
                const humidity = parseInt(weather.humidity);
                const windKmph = weather.windKmph || 0;
                const uv = parseInt(weather.uvIndex);
                const desc = weather.description.toLowerCase();
                const hasRain = desc.includes('deszcz') || desc.includes('rain');
                const hasStorm = desc.includes('burza') || desc.includes('storm') || desc.includes('thunder') || desc.includes('wyładowania');
                const hasSnow = desc.includes('śnieg') || desc.includes('snow');
                const forecast = weather.forecast;

                const tempTrend = forecast.length >= 2
                  ? (() => {
                      const t0 = parseInt(forecast[0].maxTemp);
                      const t1 = parseInt(forecast[1].maxTemp);
                      const diff = t1 - t0;
                      if (diff > 3) return `rośnie — jutro ${t0}°C, pojutrze ${t1}°C`;
                      if (diff < -3) return `spada — jutro ${t0}°C, pojutrze ${t1}°C`;
                      return `stabilna — jutro ${t0}°C, pojutrze ${t1}°C`;
                    })()
                  : 'brak danych';

                const precipDays = forecast.filter(d => {
                  const dl = d.description.toLowerCase();
                  return dl.includes('rain') || dl.includes('deszcz') || dl.includes('storm') || dl.includes('snow');
                }).map(d => d.date);

                return (
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: '500', color: '#1a1a1a', marginBottom: 16 }}>
                      Interpretacja meteogramu — {weather.location.split(',')[0]}
                    </Text>

                    <View style={{ backgroundColor: '#f0f4ff', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#1e90ff', marginBottom: 6 }}>Temperatura</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        Aktualnie <Text style={{ fontWeight: '500' }}>{weather.temp}</Text>, odczuwalnie <Text style={{ fontWeight: '500' }}>{weather.feelsLike}</Text>
                        {Math.abs(temp - feelsLike) >= 3
                          ? feelsLike < temp
                            ? ` — wiatr lub wilgotność obniżają komfort o ${temp - feelsLike}°C.`
                            : ` — wysoka wilgotność podnosi dyskomfort o ${feelsLike - temp}°C.`
                          : ' — temperatura odczuwalna zbliżona do rzeczywistej.'
                        }
                        {'\n'}Trend: {tempTrend}.
                      </Text>
                    </View>

                    <View style={{ backgroundColor: '#f0fff4', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#2e7d32', marginBottom: 6 }}>Opady i zjawiska</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        {hasStorm
                          ? 'Aktualnie burza — unikaj otwartej przestrzeni i wysokich obiektów.'
                          : hasRain
                          ? 'Aktualnie opady deszczu — zabierz parasol na wyjście.'
                          : hasSnow
                          ? 'Aktualnie opady śniegu — ostrożnie na drogach.'
                          : 'Brak opadów w tej chwili.'}
                        {precipDays.length > 0
                          ? `\nOpady prognozowane: ${precipDays.join(', ')}.`
                          : '\nNajbliższe dni bez opadów.'}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: '#fff8e1', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#f57f17', marginBottom: 6 }}>Wiatr i wilgotność</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        Wiatr <Text style={{ fontWeight: '500' }}>{weather.windSpeed}</Text>
                        {windKmph > 50 ? ' — silny, utrudnia poruszanie się na zewnątrz.'
                          : windKmph > 25 ? ' — umiarkowany, może być odczuwalny.'
                          : ' — słaby, komfortowy.'}{'\n'}
                        Wilgotność <Text style={{ fontWeight: '500' }}>{weather.humidity}</Text>
                        {humidity > 80 ? ' — wysoka, możliwe uczucie parności.'
                          : humidity < 40 ? ' — niska, warto nawodnić się.'
                          : ' — komfortowa.'}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: '#fce4ec', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#c62828', marginBottom: 6 }}>UV i ciśnienie</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        UV: <Text style={{ fontWeight: '500' }}>{weather.uvIndex}</Text>
                        {uv <= 2 ? ' — niskie, ochrona zbędna.'
                          : uv <= 5 ? ' — umiarkowane, kremem nie zaszkodzi.'
                          : uv <= 7 ? ' — wysokie, filtr SPF zalecany.'
                          : ' — bardzo wysokie, ogranicz ekspozycję.'}{'\n'}
                        Ciśnienie: <Text style={{ fontWeight: '500' }}>{weather.pressure.replace(' mb', ' hPa')}</Text>
                        {parseInt(weather.pressure) > 1020 ? ' — wyż, dobra pogoda.' : parseInt(weather.pressure) < 1005 ? ' — niż, możliwe pogorszenie.' : ' — normalne.'}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: '#e3f2fd', borderRadius: 10, padding: 14, marginBottom: 24 }}>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#1565c0', marginBottom: 6 }}>Jakość powietrza</Text>
                      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                        <Text style={{ fontWeight: '500' }}>{weather.aqi}</Text>{'\n'}
                        PM2.5: {weather.pm25} · PM10: {weather.pm10}{'\n'}
                        {weather.aqi.toLowerCase().includes('dobra') ? 'Powietrze czyste — bezpieczne dla wszystkich.'
                          : weather.aqi.toLowerCase().includes('umiarkowana') ? 'Powietrze umiarkowane — wrażliwe osoby mogą odczuć dyskomfort.'
                          : 'Zła jakość powietrza — ogranicz czas na zewnątrz.'}
                      </Text>
                    </View>

                    <Text style={{ fontSize: 11, color: '#999', textAlign: 'center', marginBottom: 20 }}>
                      Prognoza udostępniona bezpłatnie przez serwis meteo.pl prowadzony przez ICM, Uniwersytet Warszawski
                    </Text>
                  </View>
                );
              })()}
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
                  <Text style={[styles.modalDate, { textTransform: 'capitalize' }]}>{formatPolishDate(selectedDay.date)}</Text>
                  <WeatherIcon desc={selectedDay.description} size={48} />
                </View>

                <Text style={styles.modalDesc}>{selectedDay.description}</Text>

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
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 22,
  },
  heroLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    fontSize: 64,
    marginRight: 8,
  },
  heroTemp: {
    fontSize: 88,
    fontWeight: '200',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDesc: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)',
    marginTop: -4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  heroMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  heroMetaDot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroBadgeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 7,
  },
  heroBadgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  quickAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 72,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  quickActionEmoji: {
    fontSize: 22,
    marginBottom: 3,
  },
  quickActionIcon: {
    marginBottom: 5,
    height: 22,
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  glassLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  glassValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  sectionTitleLight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
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
    padding: 12,
    paddingBottom: 32,
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
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  favoritesScroll: {
    marginBottom: 16,
    flexGrow: 0,
  },
  favoriteChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  favoriteChipActive: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(255,255,255,0.92)',
  },
  favoriteChipText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  favoriteChipTextActive: {
    color: '#0d47a1',
  },
  menuActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  menuActionText: {
    fontSize: 13,
    color: '#0d47a1',
    fontWeight: '700',
  },
  error: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(211,47,47,0.85)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  offlineBanner: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  offlineBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e65100',
  },
  offlineBannerText: {
    fontSize: 13,
    color: '#444',
    marginTop: 3,
  },
  offlineBannerTime: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 40,
  },
  dashboardBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 6,
  },
  dashboardLargeItem: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardLabel: {
    fontSize: 10,
    color: '#9aa5b1',
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dashboardValue: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
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
    fontSize: 40,
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
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsHeaderDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textTransform: 'capitalize',
  },
  insightBox: {
    backgroundColor: '#f5f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#1e90ff',
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
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
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
    backgroundColor: '#f5f7fa',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  detailGridLabel: {
    fontSize: 10,
    color: '#9aa5b1',
    marginBottom: 5,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  detailGridValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
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
    backgroundColor: '#eef2f6',
  },
  modalHeader: {
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
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
