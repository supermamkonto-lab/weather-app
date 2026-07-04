import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

// Krzywa temperatury godzinowej (yr.no / Apple style).
// Rysuje gładką linię temp z punktami, etykietami i znacznikiem aktualnej godziny.

interface Point {
  label: string;     // godzina, np. "12"
  temp: number;      // wartość °C
  isNow: boolean;
}

const smoothPath = (pts: { x: number; y: number }[]): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    // Bezier z punktami kontrolnymi w połowie odległości — łagodna krzywa
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
};

export const TempCurve = ({ points, width, padX = 22 }: { points: Point[]; width: number; padX?: number }) => {
  if (!points || points.length < 2) return null;

  const H = 150;       // wyższy wykres = wyraźniejsza amplituda (koniec ze spłaszczeniem)
  const padTop = 36;   // miejsce na etykiety temp nad punktami
  const padBottom = 18; // miejsce na godziny pod punktami
  const innerW = width - padX * 2;
  const innerH = H - padTop - padBottom;

  const temps = points.map(p => p.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  const coords = points.map((p, i) => ({
    x: padX + (innerW * i) / (points.length - 1),
    y: padTop + innerH * (1 - (p.temp - minT) / range),
    temp: p.temp,
    label: p.label,
    isNow: p.isNow,
  }));

  const line = smoothPath(coords);
  // Obszar pod krzywą (delikatne wypełnienie)
  const area = `${line} L ${coords[coords.length - 1].x} ${padTop + innerH} L ${coords[0].x} ${padTop + innerH} Z`;

  return (
    <View>
      <Svg width={width} height={H}>
        {/* Wypełnienie pod krzywą */}
        <Path d={area} fill="#1e90ff" opacity={0.08} />
        {/* Krzywa */}
        <Path d={line} stroke="#1e90ff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <React.Fragment key={i}>
            {c.isNow && (
              <Line x1={c.x} y1={padTop - 6} x2={c.x} y2={padTop + innerH} stroke="#1e90ff" strokeWidth={1} opacity={0.3} strokeDasharray="3,3" />
            )}
            <Circle cx={c.x} cy={c.y} r={c.isNow ? 5 : 3.5} fill={c.isNow ? '#1e90ff' : '#fff'} stroke="#1e90ff" strokeWidth={2} />
            <SvgText x={c.x} y={c.y - 16} fontSize={17} fontWeight="700" fill="#ffffff" textAnchor="middle">
              {`${c.temp}°`}
            </SvgText>
            <SvgText x={c.x} y={H - 8} fontSize={11} fill={c.isNow ? '#60b4ff' : 'rgba(255,255,255,0.55)'} fontWeight={c.isNow ? '700' : '400'} textAnchor="middle">
              {c.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

export default TempCurve;
