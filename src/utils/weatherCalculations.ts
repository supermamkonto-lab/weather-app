import { Weather, WeatherChangeData, HourlyRainData, ComfortData } from '../types';

export const calculateDayLength = (sunrise: string, sunset: string): string => {
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

export const calculateWeatherScore = (weather: Weather): number => {
  let score = 70;
  const temp = parseInt(weather.temp);
  const humidity = parseInt(weather.humidity);
  const uv = parseInt(weather.uvIndex);
  const desc = weather.description.toLowerCase();
  const hasRain = desc.includes('deszcz') || desc.includes('rain');

  if (temp >= 18 && temp <= 24) score += 15;
  else if (temp >= 15 && temp <= 27) score += 10;
  else score -= 10;

  if (!hasRain) score += 10;
  else score -= 15;

  if (humidity >= 40 && humidity <= 60) score += 5;
  else if (humidity > 80) score -= 10;

  if (uv <= 3) score += 5;
  else if (uv > 8) score -= 10;

  return Math.max(0, Math.min(100, score));
};

export const generateComfortRecommendations = (weather: Weather): ComfortData => {
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

  return {
    recommendations: recommendations.length > 0 ? recommendations : ['✅ Warunki neutralne'],
    score: calculateWeatherScore(weather),
  };
};

export const generateWeatherChange = (weather: Weather): WeatherChangeData => {
  const tempC = weather.tempC || 21;
  const windKmph = weather.windKmph || 8;
  const desc = weather.description.toLowerCase();
  const hasRain = desc.includes('deszcz') || desc.includes('rain');

  const tempChange = tempC > 20 ? `+${Math.round(tempC - 18)}°C cieplej` : `${Math.round(tempC - 18)}°C chłodniej`;
  const windChange = windKmph > 10 ? `+${Math.round(windKmph - 8)} km/h więcej wiatru` : `${Math.round(windKmph - 8)} km/h mniej wiatru`;
  const rainChange = hasRain ? 'większe opady' : 'bez opadów';

  return { tempChange, windChange, rainChange };
};

export const generateHourlyRain = (): HourlyRainData[] => {
  const hours: HourlyRainData[] = [];
  const basePercent = Math.random() > 0.6 ? 70 : 0;

  for (let i = 0; i < 6; i++) {
    const hour = (new Date().getHours() + i) % 24;
    const percent = basePercent > 0 ? basePercent + Math.random() * 20 : 0;
    const emoji = percent > 40 ? '🌧️' : '☀️';
    hours.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      emoji,
      percent: Math.round(percent)
    });
  }
  return hours;
};

export const generateWeatherInsight = (weather: Weather): string => {
  const desc = weather.description.toLowerCase();
  const temp = parseInt(weather.temp);
  const humidity = parseInt(weather.humidity);

  let insight = 'Dzień ';

  if (temp > 25) insight += 'będzie ciepły';
  else if (temp > 15) insight += 'będzie przyjemny';
  else insight += 'będzie chłodny';

  if (desc.includes('deszcz')) insight += ' z opadami. Weź parasol.';
  else if (desc.includes('słonecznie')) insight += ' i słoneczny.';
  else insight += '.';

  if (humidity > 80) insight += ' Wilgoć wysoka.';

  return insight;
};
