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
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  main: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
    marginBottom: 8,
  },
  detail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 19,
    marginBottom: 8,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    backgroundColor: 'rgba(255,187,51,0.15)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
    gap: 8,
  },
  warningIcon: {
    fontSize: 14,
    color: '#fbbf24',
    marginTop: 2,
  },
  warningText: {
    fontSize: 12,
    color: '#fef9c3',
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
});
