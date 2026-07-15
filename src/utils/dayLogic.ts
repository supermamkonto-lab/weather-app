// WeatherApp V2 — Day logic engine
// Generates DayComment and YourDay data from weather.
// Pure functions — no React, no side effects.
// Extensible: add new activities to ACTIVITY_DEFINITIONS without touching callers.

import { pl } from '../i18n/pl';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeatherInput {
  temp: string;           // "23°" or "23"
  tempC?: number;
  description: string;
  windSpeed: string;      // "12 km/h"
  windKmph?: number;
  humidity: string;       // "62%"
  uvIndex: string;        // "3"
  aqi: string;            // "Dobra"
  pressure: string;       // "1018 hPa"
  visibility: string;     // "25 km"
  sunrise: string;        // "05:24"
  sunset: string;         // "20:45"
  hourly?: Array<{ time: string; temp: string; rainChance?: number }>;
  forecast?: Array<{ maxTemp: string; minTemp: string; description: string }>;
}

export interface DayComment {
  main: string;
  detail: string;
  warning?: string;
}

export interface ActivityResult {
  id: string;
  label: string;
  ok: boolean;
  reason: string;
}

export interface DayScore {
  stars: number;        // 1–5
  label: string;
  factors: string[];    // ["Temp 23° ✔", "UV 3 ✔", "Wiatr 18 ⚠"]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseTempC = (w: WeatherInput): number => {
  if (w.tempC !== undefined) return w.tempC;
  return parseInt(w.temp.replace('°', '')) || 20;
};

const parseWindKmph = (w: WeatherInput): number => {
  if (w.windKmph !== undefined) return w.windKmph;
  return parseInt(w.windSpeed) || 0;
};

const parseUV = (w: WeatherInput): number => parseInt(w.uvIndex) || 0;
const parsePressure = (w: WeatherInput): number => parseInt(w.pressure) || 1013;

const descContains = (w: WeatherInput, ...terms: string[]): boolean => {
  const d = w.description.toLowerCase();
  return terms.some(t => d.includes(t));
};

const isStorm  = (w: WeatherInput) => descContains(w, 'burza', 'storm', 'thunder', 'wyładowania');
const isRain   = (w: WeatherInput) => !isStorm(w) && descContains(w, 'deszcz', 'rain', 'mżawka', 'drizzle', 'opady');
const isSnow   = (w: WeatherInput) => descContains(w, 'śnieg', 'snow', 'zamieć');
const isFog    = (w: WeatherInput) => descContains(w, 'mgła', 'fog', 'mist', 'zamglenie');
const isHeat   = (w: WeatherInput) => parseTempC(w) >= 33;
const isFrost  = (w: WeatherInput) => parseTempC(w) <= -5;
const isBadAir = (w: WeatherInput) => {
  const a = w.aqi.toLowerCase();
  return a.includes('zła') || a.includes('bardzo') || a.includes('niezdrowa') || a.includes('wrażliwych');
};

// ─── DayComment generator ────────────────────────────────────────────────────

export function generateDayComment(w: WeatherInput): DayComment {
  const t = parseTempC(w);
  const wind = parseWindKmph(w);
  const uv = parseUV(w);
  const pressure = parsePressure(w);

  // Priority 1: critical warnings
  if (isStorm(w)) return {
    main: pl.dayComment.stormAlert,
    detail: 'Burza może przynieść silne porywy wiatru i ulewny deszcz. Zostań w bezpiecznym miejscu.',
    warning: wind > 50 ? `Porywy wiatru mogą osiągać ${wind} km/h.` : undefined,
  };

  if (isHeat(w)) return {
    main: pl.dayComment.heatAlert(t),
    detail: 'Upał powyżej 33° jest niebezpieczny. Pij minimum 2 litry wody. Wentylator lub klimatyzacja zalecana.',
    warning: uv > 8 ? `UV ${uv} — ekstremalny. Koniecznie krem SPF 50+ i nakrycie głowy.` : undefined,
  };

  if (isFrost(w)) return {
    main: pl.dayComment.frostAlert(t),
    detail: 'Mróz poniżej -5° wymaga ciepłego ubrania. Uważaj na oblodzone chodniki i drogi.',
  };

  if (isBadAir(w)) return {
    main: pl.dayComment.badAirAlert,
    detail: 'Poziom pyłów PM2.5/PM10 przekracza normy. Zamknij okna, ogranicz czas na dworze. Wentylacja wewnętrzna.',
  };

  // Priority 2: activity recommendations
  if (!isRain(w) && !isSnow(w) && wind < 20 && uv <= 5 && t >= 12 && t <= 28) {
    const extras: string[] = [];
    if (uv <= 2) extras.push('UV nie wymaga ochrony');
    else if (uv <= 5) extras.push('zalecany SPF 30+');
    const visN = parseFloat(w.visibility) || 0;
    if (visN > 15) extras.push('doskonała widoczność');
    return {
      main: pl.dayComment.perfectBike,
      detail: `Wiatr ${wind} km/h, powietrze ${w.aqi.toLowerCase()}${extras.length ? '. ' + extras.join(', ') : ''}. Optymalne warunki do aktywności na zewnątrz.`,
    };
  }

  if (isRain(w) || isSnow(w)) {
    const hourlyRain = findRainHour(w);
    if (hourlyRain > 0 && !isRain(w)) {
      return {
        main: pl.dayComment.rainComing(hourlyRain),
        detail: 'Rano korzystaj ze słońca. Po południu weź parasol lub zostań w domu.',
      };
    }
    return {
      main: isSnow(w) ? pl.dayComment.snowDay : pl.dayComment.rainDay,
      detail: isSnow(w)
        ? 'Zadbaj o ciepłe buty i uważaj na oblodzone powierzchnie.'
        : 'Parasol obowiązkowy. Dobre warunki do pracy zdalnej lub wizyty w kawiarni.',
    };
  }

  if (isFog(w)) return {
    main: pl.dayComment.fogDay,
    detail: `Widoczność może być ograniczona do kilku km. Używaj świateł mijania w samochodzie.`,
  };

  if (wind >= 30) return {
    main: pl.dayComment.windyDay,
    detail: `Porywy wiatru do ${wind} km/h. Ostrożnie z rowerem, parasolem i lekkim narzuceniem.`,
  };

  // Priority 3: interesting facts
  const eveningDelta = findEveningTempDrop(w);
  if (eveningDelta >= 7) {
    return {
      main: pl.dayComment.goodDefault,
      detail: 'Przyjemne warunki w ciągu dnia.',
      warning: pl.dayComment.coolEvening(eveningDelta),
    };
  }

  if (pressure < 1000) return {
    main: pl.dayComment.lowPressure,
    detail: 'Ciśnienie poniżej 1000 hPa. Osoby wrażliwe na zmiany ciśnienia mogą czuć zmęczenie lub bóle głowy.',
  };

  if (pressure > 1020) return {
    main: pl.dayComment.highPressure,
    detail: 'Wysokie ciśnienie sprzyja dobrej pogodzie i dobremu samopoczuciu. Idealne warunki do aktywności.',
  };

  const visN = parseFloat(w.visibility) || 0;
  if (visN > 20) return {
    main: pl.dayComment.photoDay,
    detail: `Widoczność ${w.visibility}. Idealne warunki do fotografii krajobrazowej i portretowej.`,
  };

  return {
    main: pl.dayComment.goodDefault,
    detail: 'Bez ekstremalnych warunków. Dobry dzień do codziennych aktywności.',
  };
}

function findRainHour(w: WeatherInput): number {
  if (!w.hourly) return 0;
  const now = new Date().getHours();
  for (const h of w.hourly) {
    const hH = parseInt(h.time?.split(':')[0] || '0');
    if (hH > now && (h.rainChance ?? 0) > 50) return hH;
  }
  return 0;
}

function findEveningTempDrop(w: WeatherInput): number {
  if (!w.hourly || w.hourly.length < 4) return 0;
  const now = new Date().getHours();
  const current = parseInt(w.hourly.find(h => parseInt(h.time?.split(':')[0] || '0') >= now)?.temp || '0');
  const evening = parseInt(w.hourly.find(h => parseInt(h.time?.split(':')[0] || '0') >= 20)?.temp || '0');
  return current > 0 && evening > 0 ? Math.max(0, current - evening) : 0;
}

// ─── Activity system ─────────────────────────────────────────────────────────

// Extensible activity definition — add new entries here without touching callers.
interface ActivityDefinition {
  id: keyof typeof pl.yourDay.activities;
  evaluate: (w: WeatherInput) => { ok: boolean; reason: string };
}

const ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  {
    id: 'walk',
    evaluate: (w) => {
      if (isStorm(w)) return { ok: false, reason: pl.yourDay.reasons.walk.storm };
      if (isFrost(w)) return { ok: false, reason: pl.yourDay.reasons.walk.frost(parseTempC(w)) };
      return { ok: true, reason: pl.yourDay.reasons.walk.ok };
    },
  },
  {
    id: 'bike',
    evaluate: (w) => {
      const wind = parseWindKmph(w);
      const t = parseTempC(w);
      if (isRain(w) || isSnow(w)) return { ok: false, reason: pl.yourDay.reasons.bike.rain };
      if (wind >= 25) return { ok: false, reason: pl.yourDay.reasons.bike.wind(wind) };
      if (t < 5) return { ok: false, reason: pl.yourDay.reasons.bike.cold(t) };
      return { ok: true, reason: pl.yourDay.reasons.bike.ok };
    },
  },
  {
    id: 'run',
    evaluate: (w) => {
      const t = parseTempC(w);
      if (isBadAir(w)) return { ok: false, reason: pl.yourDay.reasons.run.air };
      if (t >= 33) return { ok: false, reason: pl.yourDay.reasons.run.heat(t) };
      if (isRain(w) || isSnow(w)) return { ok: false, reason: pl.yourDay.reasons.run.rain };
      return { ok: true, reason: pl.yourDay.reasons.run.ok };
    },
  },
  {
    id: 'garden',
    evaluate: (w) => {
      const wind = parseWindKmph(w);
      if (isRain(w) || isSnow(w)) return { ok: false, reason: pl.yourDay.reasons.garden.rain };
      if (wind >= 30) return { ok: false, reason: pl.yourDay.reasons.garden.wind(wind) };
      if (isFrost(w)) return { ok: false, reason: pl.yourDay.reasons.garden.frost };
      return { ok: true, reason: pl.yourDay.reasons.garden.ok };
    },
  },
  {
    id: 'photo',
    evaluate: (w) => {
      if (isFog(w)) return { ok: false, reason: pl.yourDay.reasons.photo.fog };
      if (isRain(w)) return { ok: false, reason: pl.yourDay.reasons.photo.rain };
      const visN = parseFloat(w.visibility) || 0;
      if (visN > 10) return { ok: true, reason: pl.yourDay.reasons.photo.ok };
      return { ok: false, reason: pl.yourDay.reasons.photo.rain };
    },
  },
  {
    id: 'washCar',
    evaluate: (w) => {
      const wind = parseWindKmph(w);
      if (isRain(w) || isSnow(w)) return { ok: false, reason: pl.yourDay.reasons.washCar.rain };
      if (wind >= 25) return { ok: false, reason: pl.yourDay.reasons.washCar.wind(wind) };
      return { ok: true, reason: pl.yourDay.reasons.washCar.ok };
    },
  },
  {
    id: 'bbq',
    evaluate: (w) => {
      const wind = parseWindKmph(w);
      const t = parseTempC(w);
      if (isRain(w) || isSnow(w) || isStorm(w)) return { ok: false, reason: pl.yourDay.reasons.bbq.rain };
      if (wind >= 20) return { ok: false, reason: pl.yourDay.reasons.bbq.wind(wind) };
      if (t < 15) return { ok: false, reason: pl.yourDay.reasons.bbq.cold(t) };
      return { ok: true, reason: pl.yourDay.reasons.bbq.ok };
    },
  },
  {
    id: 'beach',
    evaluate: (w) => {
      const t = parseTempC(w);
      const uv = parseUV(w);
      if (isRain(w) || isStorm(w)) return { ok: false, reason: pl.yourDay.reasons.beach.rain };
      if (t < 22) return { ok: false, reason: pl.yourDay.reasons.beach.cold(t) };
      const cloudy = descContains(w, 'chmur', 'pochmurn', 'overcast', 'cloud');
      if (cloudy && uv < 3) return { ok: false, reason: pl.yourDay.reasons.beach.cloud };
      return { ok: true, reason: pl.yourDay.reasons.beach.ok };
    },
  },
];

export function evaluateActivities(w: WeatherInput): ActivityResult[] {
  return ACTIVITY_DEFINITIONS.map(def => ({
    id: def.id,
    label: pl.yourDay.activities[def.id],
    ...def.evaluate(w),
  }));
}

// ─── Day score ────────────────────────────────────────────────────────────────

export function rateDayScore(w: WeatherInput): DayScore {
  const t = parseTempC(w);
  const wind = parseWindKmph(w);
  const uv = parseUV(w);

  let score = 5;
  const factors: string[] = [];

  // Temperatura
  if (t >= 18 && t <= 26) factors.push(`Temp ${t}° ✔`);
  else if (t >= 10 && t <= 32) { score--; factors.push(`Temp ${t}° ⚠`); }
  else { score -= 2; factors.push(`Temp ${t}° ✗`); }

  // Opady
  if (isStorm(w)) { score -= 3; factors.push('Burza ✗'); }
  else if (isSnow(w)) { score -= 2; factors.push('Śnieg ⚠'); }
  else if (isRain(w)) { score -= 1; factors.push('Deszcz ⚠'); }
  else factors.push('Brak opadów ✔');

  // Wiatr
  if (wind >= 40) { score -= 2; factors.push(`Wiatr ${wind} km/h ✗`); }
  else if (wind >= 25) { score--; factors.push(`Wiatr ${wind} km/h ⚠`); }
  else factors.push(`Wiatr ${wind} km/h ✔`);

  // UV
  if (uv <= 5) factors.push(`UV ${uv} ✔`);
  else if (uv <= 8) { score--; factors.push(`UV ${uv} ⚠`); }
  else { score -= 2; factors.push(`UV ${uv} ✗`); }

  // AQI
  if (isBadAir(w)) { score -= 2; factors.push('AQI ✗'); }
  else factors.push('AQI ✔');

  const stars = Math.max(1, Math.min(5, score)) as 1 | 2 | 3 | 4 | 5;
  return { stars, label: pl.yourDay.ratingLabels[stars], factors };
}
