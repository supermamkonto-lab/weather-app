import {
  calculateDayLength,
  calculateWeatherScore,
  generateComfortRecommendations,
  generateWeatherChange,
  generateHourlyRain,
  generateWeatherInsight
} from '../src/utils/weatherCalculations';

describe('Weather Calculations', () => {
  const mockWeather = {
    temp: '21°C',
    description: 'Przelotne lekkie deszczu',
    location: 'Czestochowa, Poland',
    feelsLike: '21°C',
    humidity: '83%',
    windSpeed: '8 km/h',
    icon: '🌧️',
    forecast: [],
    pressure: '1021 mb',
    visibility: '10 km',
    uvIndex: '0',
    sunrise: '04:30 AM',
    sunset: '09:01 PM',
    pm25: '13 μg/m³',
    pm10: '16 μg/m³',
    aqi: 'Dobra',
    aqiColor: '#4CAF50',
    aqiEmoji: '🟢',
    lastUpdate: '03:51',
    tempC: 21,
    windKmph: 8
  };

  describe('calculateDayLength', () => {
    it('should calculate day length correctly', () => {
      const result = calculateDayLength('04:30 AM', '09:01 PM');
      expect(result).toBe('16h 31m');
    });

    it('should return N/A for invalid input', () => {
      const result = calculateDayLength('invalid', 'invalid');
      expect(result).toBe('N/A');
    });
  });

  describe('calculateWeatherScore', () => {
    it('should return score between 0 and 100', () => {
      const score = calculateWeatherScore(mockWeather);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give high score for optimal weather', () => {
      const optimalWeather = { ...mockWeather, temp: '22°C', humidity: '50%', uvIndex: '2' };
      const score = calculateWeatherScore(optimalWeather);
      expect(score).toBeGreaterThan(75);
    });

    it('should give low score for poor weather', () => {
      const poorWeather = { ...mockWeather, temp: '5°C', humidity: '95%', uvIndex: '10' };
      const score = calculateWeatherScore(poorWeather);
      expect(score).toBeLessThan(50);
    });
  });

  describe('generateComfortRecommendations', () => {
    it('should return array of recommendations', () => {
      const result = generateComfortRecommendations(mockWeather);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should recommend parasol for rain', () => {
      const rainyWeather = { ...mockWeather, description: 'Deszcz' };
      const result = generateComfortRecommendations(rainyWeather);
      expect(result.recommendations.some(r => r.includes('parasol'))).toBe(true);
    });

    it('should recommend jacket for cold', () => {
      const coldWeather = { ...mockWeather, temp: '5°C', tempC: 5 };
      const result = generateComfortRecommendations(coldWeather);
      expect(result.recommendations.some(r => r.includes('kurtkę'))).toBe(true);
    });
  });

  describe('generateWeatherChange', () => {
    it('should return weather change data', () => {
      const result = generateWeatherChange(mockWeather);
      expect(result).toHaveProperty('tempChange');
      expect(result).toHaveProperty('windChange');
      expect(result).toHaveProperty('rainChange');
    });
  });

  describe('generateHourlyRain', () => {
    it('should return 6 hourly forecasts', () => {
      const result = generateHourlyRain();
      expect(result).toHaveLength(6);
    });

    it('should have valid hourly data', () => {
      const result = generateHourlyRain();
      result.forEach(item => {
        expect(item).toHaveProperty('hour');
        expect(item).toHaveProperty('emoji');
        expect(item).toHaveProperty('percent');
        expect(item.percent).toBeGreaterThanOrEqual(0);
        expect(item.percent).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('generateWeatherInsight', () => {
    it('should return a string insight', () => {
      const result = generateWeatherInsight(mockWeather);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include "deszczu" for rainy weather', () => {
      const result = generateWeatherInsight(mockWeather);
      expect(result).toContain('deszczu');
    });
  });
});
