import React from 'react';
import Svg, { Circle, Path, Line, G } from 'react-native-svg';

// Spójny zestaw ikon pogody (filled, premium) — zastępuje emoji.
// Jeden styl, jedna paleta, skalowalny do dowolnego rozmiaru.

type IconType =
  | 'clear-day' | 'clear-night'
  | 'partly-day' | 'partly-night'
  | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';

const PALETTE = {
  sun: '#FFC83D',
  sunRay: '#FFB300',
  moon: '#FFE9A8',
  cloud: '#EEF3F8',
  cloudEdge: '#CFD9E4',
  cloudDark: '#AFBDCB',
  rain: '#4FA3F7',
  snow: '#FFFFFF',
  bolt: '#FFC83D',
  fog: '#C2CCD6',
};

const classify = (desc: string, isNight: boolean): IconType => {
  const d = (desc || '').toLowerCase();
  const isClear = d.includes('bezchmur') || d.includes('sunny') || d.includes('clear') || d.includes('słonecz') || d.includes('pogodnie') || d.includes('czyste');
  const isStorm = d.includes('burz') || d.includes('storm') || d.includes('thunder');
  const isRain = d.includes('deszcz') || d.includes('rain') || d.includes('mżaw') || d.includes('drizzle') || d.includes('ulewa') || d.includes('opady');
  const isSnow = d.includes('śnieg') || d.includes('snow') || d.includes('zamieć') || d.includes('śnieżyc');
  const isFog = d.includes('mgł') || d.includes('fog') || d.includes('mist') || d.includes('zamgl');
  const isPartly = d.includes('częśc') || d.includes('partly');
  const isCloud = d.includes('chmur') || d.includes('cloud') || d.includes('zachmurz') || d.includes('overcast') || d.includes('pochmurn');
  if (isStorm) return 'storm';
  if (isSnow) return 'snow';
  if (isRain) return 'rain';
  if (isFog) return 'fog';
  if (isClear) return isNight ? 'clear-night' : 'clear-day';
  if (isPartly) return isNight ? 'partly-night' : 'partly-day';
  if (isCloud) return 'cloudy';
  return isNight ? 'clear-night' : 'partly-day';
};

// Chmura jako wypełniona ścieżka (viewBox 64x64), pozycjonowana niżej
const Cloud = ({ fill = PALETTE.cloud, stroke = PALETTE.cloudEdge, y = 0 }: { fill?: string; stroke?: string; y?: number }) => (
  <Path
    d={`M16,${44 + y} C9,${44 + y} 4,${39 + y} 4,${32 + y} C4,${26 + y} 9,${21 + y} 15,${21 + y} C17,${13 + y} 24,${8 + y} 32,${8 + y} C42,${8 + y} 49,${15 + y} 50,${24 + y} C56,${24 + y} 60,${29 + y} 60,${35 + y} C60,${40 + y} 56,${44 + y} 50,${44 + y} Z`}
    fill={fill}
    stroke={stroke}
    strokeWidth={1.5}
  />
);

const SunRays = () => (
  <G stroke={PALETTE.sunRay} strokeWidth={4.5} strokeLinecap="round">
    <Line x1={32} y1={4} x2={32} y2={12} />
    <Line x1={32} y1={52} x2={32} y2={60} />
    <Line x1={4} y1={32} x2={12} y2={32} />
    <Line x1={52} y1={32} x2={60} y2={32} />
    <Line x1={12} y1={12} x2={17} y2={17} />
    <Line x1={47} y1={47} x2={52} y2={52} />
    <Line x1={52} y1={12} x2={47} y2={17} />
    <Line x1={17} y1={47} x2={12} y2={52} />
  </G>
);

export const WeatherIcon = ({ desc, night = false, size = 48 }: { desc: string; night?: boolean; size?: number }) => {
  const type = classify(desc, night);

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {type === 'clear-day' && (
        <G>
          <SunRays />
          <Circle cx={32} cy={32} r={14} fill={PALETTE.sun} />
        </G>
      )}

      {type === 'clear-night' && (
        <Path
          d="M44 40 A20 20 0 1 1 26 14 A16 16 0 0 0 44 40 Z"
          fill={PALETTE.moon}
        />
      )}

      {type === 'partly-day' && (
        <G>
          <G>
            <G stroke={PALETTE.sunRay} strokeWidth={4} strokeLinecap="round">
              <Line x1={42} y1={6} x2={42} y2={12} />
              <Line x1={60} y1={20} x2={54} y2={20} />
              <Line x1={55} y1={9} x2={51} y2={13} />
            </G>
            <Circle cx={42} cy={20} r={10} fill={PALETTE.sun} />
          </G>
          <Cloud y={8} />
        </G>
      )}

      {type === 'partly-night' && (
        <G>
          <Path d="M52 22 A12 12 0 1 1 41 6 A9 9 0 0 0 52 22 Z" fill={PALETTE.moon} />
          <Cloud y={8} />
        </G>
      )}

      {type === 'cloudy' && (
        <G>
          <Cloud y={6} fill={PALETTE.cloudDark} stroke={PALETTE.cloudDark} />
          <Cloud y={-2} />
        </G>
      )}

      {type === 'rain' && (
        <G>
          <Cloud y={-4} />
          <G stroke={PALETTE.rain} strokeWidth={5} strokeLinecap="round">
            <Line x1={22} y1={48} x2={18} y2={58} />
            <Line x1={34} y1={48} x2={30} y2={58} />
            <Line x1={46} y1={48} x2={42} y2={58} />
          </G>
        </G>
      )}

      {type === 'snow' && (
        <G>
          <Cloud y={-4} />
          <G fill={PALETTE.snow}>
            <Circle cx={20} cy={52} r={3} />
            <Circle cx={32} cy={56} r={3} />
            <Circle cx={44} cy={52} r={3} />
          </G>
        </G>
      )}

      {type === 'storm' && (
        <G>
          <Cloud y={-4} fill={PALETTE.cloudDark} stroke={PALETTE.cloudDark} />
          <Path d="M34 44 L24 58 L31 58 L27 64 L40 50 L33 50 Z" fill={PALETTE.bolt} />
        </G>
      )}

      {type === 'fog' && (
        <G>
          <Cloud y={-10} />
          <G stroke={PALETTE.fog} strokeWidth={5} strokeLinecap="round">
            <Line x1={14} y1={50} x2={50} y2={50} />
            <Line x1={18} y1={58} x2={46} y2={58} />
          </G>
        </G>
      )}
    </Svg>
  );
};

export default WeatherIcon;
