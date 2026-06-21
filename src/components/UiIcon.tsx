import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';

// Monochromatyczne ikony UI (line-style) do guzikow akcji — zastepuja emoji.
// Jeden kolor, jedna grubosc linii = spojny, premium wyglad.

type UiIconName = 'calendar' | 'chart' | 'bike' | 'compare' | 'history' | 'share';

export const UiIcon = ({ name, size = 22, color = '#fff' }: { name: UiIconName; size?: number; color?: string }) => {
  const sw = 2.4;
  const common = { stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'calendar' && (
        <>
          <Rect x={3} y={5} width={18} height={16} rx={3} {...common} />
          <Line x1={3} y1={9.5} x2={21} y2={9.5} {...common} />
          <Line x1={8} y1={3} x2={8} y2={6.5} {...common} />
          <Line x1={16} y1={3} x2={16} y2={6.5} {...common} />
        </>
      )}

      {name === 'chart' && (
        // meteogram / wykres — krzywa z punktami
        <>
          <Polyline points="3,15 8,10 13,13 21,5" {...common} />
          <Circle cx={8} cy={10} r={1.4} fill={color} />
          <Circle cx={13} cy={13} r={1.4} fill={color} />
          <Line x1={3} y1={20} x2={21} y2={20} {...common} />
        </>
      )}

      {name === 'bike' && (
        <>
          <Circle cx={5.5} cy={17} r={3.5} {...common} />
          <Circle cx={18.5} cy={17} r={3.5} {...common} />
          <Path d="M5.5 17 L10 8 L15 8 M10 8 L18.5 17 M9 8 L12 8" {...common} />
          <Circle cx={14.5} cy={5} r={1.3} fill={color} />
        </>
      )}

      {name === 'compare' && (
        // slupki o roznej wysokosci
        <>
          <Line x1={6} y1={20} x2={6} y2={12} {...common} />
          <Line x1={12} y1={20} x2={12} y2={5} {...common} />
          <Line x1={18} y1={20} x2={18} y2={9} {...common} />
        </>
      )}

      {name === 'history' && (
        <>
          <Circle cx={12} cy={12} r={8.5} {...common} />
          <Polyline points="12,7.5 12,12 15.5,14" {...common} />
        </>
      )}

      {name === 'share' && (
        <>
          <Circle cx={6} cy={12} r={2.6} {...common} />
          <Circle cx={17.5} cy={6} r={2.6} {...common} />
          <Circle cx={17.5} cy={18} r={2.6} {...common} />
          <Line x1={8.3} y1={10.8} x2={15.2} y2={7.2} {...common} />
          <Line x1={8.3} y1={13.2} x2={15.2} y2={16.8} {...common} />
        </>
      )}
    </Svg>
  );
};

export default UiIcon;
