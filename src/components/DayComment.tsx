// WeatherApp V2 — "Komentarz dnia" section component
// Standalone, receives WeatherInput, uses dayLogic + pl.ts
// Zero state — pure display.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateDayComment, WeatherInput } from '../utils/dayLogic';
import { pl } from '../i18n/pl';

interface Props {
  weather: WeatherInput;
}

export default function DayComment({ weather }: Props) {
  const { main, detail, warning } = generateDayComment(weather);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{pl.dayComment.sectionLabel}</Text>
      <Text style={styles.main}>{main}</Text>
      <Text style={styles.detail}>{detail}</Text>
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
    backgroundColor: '#2e3f52',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1E90FF',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  main: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 21,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  warningIcon: {
    fontSize: 14,
    color: '#fbbf24',
  },
  warningText: {
    fontSize: 13,
    color: '#fbbf24',
    fontWeight: '600',
    flex: 1,
    lineHeight: 19,
  },
});
