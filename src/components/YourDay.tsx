// WeatherApp V2 — "Twój dzień" section component
// Star rating + 8 activity chips with tap-to-see-reason bottom sheet.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView,
} from 'react-native';
import { rateDayScore, evaluateActivities, WeatherInput, ActivityResult } from '../utils/dayLogic';
import { pl } from '../i18n/pl';

interface Props {
  weather: WeatherInput;
}

export default function YourDay({ weather }: Props) {
  const { stars, label, factors } = rateDayScore(weather);
  const activities = evaluateActivities(weather);
  const [selected, setSelected] = useState<ActivityResult | null>(null);
  const [showFactors, setShowFactors] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.label}>{pl.yourDay.sectionLabel}</Text>

      {/* Star rating row */}
      <TouchableOpacity
        style={styles.ratingRow}
        onPress={() => setShowFactors(true)}
        activeOpacity={0.75}
      >
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Text key={i} style={[styles.star, i < stars ? styles.starOn : styles.starOff]}>
              ★
            </Text>
          ))}
        </View>
        <View style={styles.ratingTextCol}>
          <Text style={styles.ratingLabel}>{label}</Text>
          <Text style={styles.ratingHint}>{pl.yourDay.whyLabel(stars)}</Text>
        </View>
      </TouchableOpacity>

      {/* Activities */}
      <Text style={styles.activitiesLabel}>{pl.yourDay.activitiesLabel}</Text>
      <Text style={styles.tapHint}>{pl.yourDay.tapHint}</Text>
      <View style={styles.activitiesGrid}>
        {activities.map(act => (
          <TouchableOpacity
            key={act.id}
            style={[styles.actChip, act.ok ? styles.chipOk : styles.chipNo]}
            onPress={() => setSelected(act)}
            activeOpacity={0.72}
          >
            <Text style={styles.chipMark}>{act.ok ? pl.yourDay.ok : pl.yourDay.notOk}</Text>
            <Text style={styles.chipLabel} numberOfLines={1}>{act.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity detail modal */}
      {selected && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelected(null)}>
          <TouchableOpacity
            style={styles.modalBg}
            activeOpacity={1}
            onPress={() => setSelected(null)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <View style={styles.sheetHeader}>
                  <Text style={[styles.sheetMark, selected.ok ? styles.markOk : styles.markNo]}>
                    {selected.ok ? '✔' : '✗'}
                  </Text>
                  <Text style={styles.sheetTitle}>{selected.label}</Text>
                </View>
                <Text style={styles.sheetReason}>{selected.reason}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.closeBtnText}>Zamknij</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Factors detail modal */}
      {showFactors && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setShowFactors(false)}>
          <TouchableOpacity
            style={styles.modalBg}
            activeOpacity={1}
            onPress={() => setShowFactors(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>
                  {pl.yourDay.whyLabel(stars)}
                </Text>
                <View style={{ marginTop: 16 }}>
                  {factors.map((f, i) => (
                    <Text key={i} style={styles.factorRow}>{f}</Text>
                  ))}
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowFactors(false)}>
                  <Text style={styles.closeBtnText}>Zamknij</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e3f52',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  star: {
    fontSize: 28,
  },
  starOn: {
    color: '#fbbf24',
  },
  starOff: {
    color: 'rgba(255,255,255,0.18)',
  },
  ratingTextCol: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  ratingHint: {
    fontSize: 12,
    color: '#1E90FF',
    fontWeight: '600',
  },
  activitiesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  tapHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 12,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  chipOk: {
    backgroundColor: 'rgba(52,211,153,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.35)',
  },
  chipNo: {
    backgroundColor: 'rgba(248,113,113,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
  },
  chipMark: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    maxWidth: 90,
  },

  // Modal / sheet
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a2b3c',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 44,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  sheetMark: {
    fontSize: 28,
    fontWeight: '800',
  },
  markOk: { color: '#34d399' },
  markNo: { color: '#f87171' },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  sheetReason: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 23,
  },
  factorRow: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
  },
  closeBtn: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
