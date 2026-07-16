// WeatherApp V2 — "Komentarz dnia" — PREMIUM redesign
// Dark frosted glass + dynamic icon + accent color per comment type

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateDayComment, WeatherInput } from '../utils/dayLogic';
import { pl } from '../i18n/pl';

interface Props {
  weather: WeatherInput;
}

function getCommentMeta(main: string): { icon: string; accent: string } {
  const m = main.toLowerCase();
  if (m.includes('burza'))             return { icon: '⛈', accent: '#a78bfa' };
  if (m.includes('upał'))              return { icon: '🔥', accent: '#f97316' };
  if (m.includes('mróz'))              return { icon: '🥶', accent: '#60a5fa' };
  if (m.includes('powietrze'))         return { icon: '😷', accent: '#f87171' };
  if (m.includes('rower'))             return { icon: '🚴', accent: '#34d399' };
  if (m.includes('biegani'))           return { icon: '🏃', accent: '#34d399' };
  if (m.includes('deszcz'))            return { icon: '🌧', accent: '#60a5fa' };
  if (m.includes('śnieg'))             return { icon: '❄️', accent: '#bae6fd' };
  if (m.includes('mgła'))              return { icon: '🌫', accent: '#94a3b8' };
  if (m.includes('wiatr'))             return { icon: '💨', accent: '#7dd3fc' };
  if (m.includes('fotografi'))         return { icon: '📷', accent: '#fcd34d' };
  if (m.includes('ciśnienie') && m.includes('niskie')) return { icon: '🌡', accent: '#fb923c' };
  if (m.includes('ciśnienie') && m.includes('wysok'))  return { icon: '✨', accent: '#a3e635' };
  if (m.includes('idealny') || m.includes('doskonał')) return { icon: '🌟', accent: '#fbbf24' };
  return { icon: '🌤', accent: '#38bdf8' };
}

export default function DayComment({ weather }: Props) {
  const { main, detail, warning } = generateDayComment(weather);
  const { icon, accent } = getCommentMeta(main);

  return (
    <View style={[styles.container, { borderLeftColor: accent }]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: accent }]}>{pl.dayComment.sectionLabel}</Text>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Main message */}
      <Text style={styles.main}>{main}</Text>

      {/* Detail */}
      <Text style={styles.detail}>{detail}</Text>

      {/* Warning */}
      {warning ? (
        <View style={styles.warningRow}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningText}>{warning}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(8, 20, 42, 0.82)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderLeftWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  icon: {
    fontSize: 26,
  },
  main: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 25,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  detail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 20,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
    gap: 8,
  },
  warningIcon: {
    fontSize: 14,
    color: '#fbbf24',
    marginTop: 1,
  },
  warningText: {
    fontSize: 12,
    color: '#fef9c3',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
});
