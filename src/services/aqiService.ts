import axios from 'axios';

const AQI_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const TIMEOUT = 2000;

export interface AQIData {
  pm25: string;
  pm10: string;
  aqi: string;
  aqiColor: string;
  aqiEmoji: string;
}

export const fetchAQIData = async (latitude: number, longitude: number): Promise<AQIData> => {
  const defaultAQI: AQIData = {
    pm25: 'Brak danych dla lokalizacji',
    pm10: 'Brak danych dla lokalizacji',
    aqi: 'Brak danych dla lokalizacji',
    aqiColor: '#666',
    aqiEmoji: '⚪',
  };

  try {
    const response = await Promise.race([
      axios.get(
        `${AQI_API}?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,us_aqi`,
        { timeout: TIMEOUT }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('AQI timeout')), TIMEOUT)),
    ]) as any;

    if (!response?.data?.current) {
      return defaultAQI;
    }

    const aqiData = response.data.current as any;

    // Validate each field
    const hasPM25 = aqiData.pm2_5 !== null && aqiData.pm2_5 !== undefined && typeof aqiData.pm2_5 === 'number';
    const hasPM10 = aqiData.pm10 !== null && aqiData.pm10 !== undefined && typeof aqiData.pm10 === 'number';
    const hasAQI = aqiData.us_aqi !== null && aqiData.us_aqi !== undefined && typeof aqiData.us_aqi === 'number';

    let pm25 = defaultAQI.pm25;
    let pm10 = defaultAQI.pm10;
    let aqi = defaultAQI.aqi;
    let aqiColor = defaultAQI.aqiColor;
    let aqiEmoji = defaultAQI.aqiEmoji;

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

    return { pm25, pm10, aqi, aqiColor, aqiEmoji };
  } catch (error) {
    console.warn('AQI fetch failed, using defaults:', error);
    return defaultAQI;
  }
};

const getAQIColor = (aqi: string): { color: string; emoji: string } => {
  const lower = aqi.toLowerCase();
  if (lower.includes('dobra')) return { color: '#4CAF50', emoji: '🟢' };
  if (lower.includes('umiarkowana')) return { color: '#FFC107', emoji: '🟡' };
  if (lower.includes('wrażliwych')) return { color: '#FF9800', emoji: '🟠' };
  if (lower.includes('zła') || lower.includes('niezdrowa')) return { color: '#F44336', emoji: '🔴' };
  if (lower.includes('bardzo')) return { color: '#1a1a1a', emoji: '⚫' };
  return { color: '#666', emoji: '⚪' };
};
