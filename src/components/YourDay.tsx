// WeatherApp V2 — "Twój dzień" — PREMIUM redesign
// Dark frosted glass + 2-column activity grid + green/red chips + golden star glow

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
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

  // Split activities into 2 columns
  const col1 = activities.filter((_, i) => i % 2 === 0);
  const col2 = activities.filter((_, i) => i % 2 === 1);

  // Star color based on rating
  const starColor = stars >= 4 ? '#fbbf24' : stars === 3 ? '#fb923c' : '#f87171';

  return (
    <View style={styles.container}>

      {/* Rating row — tappable */}
      <TouchableOpacity style={styles.ratingCard} onPress={() => setShowFactors(true)} activeOpacity={0.8}>
        <View>
          <Text style={styles.ratingTopLabel}>{pl.yourDay.sectionLabel}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }, (_, i) => (
              <Text
                key={i}
                style={[styles.star, { color: i < stars ? starColor : 'rgba(255,255,255,0.18)' }]}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.ratingLabel}>{label}</Text>
        </View>
        <View style={styles.whyPill}>
          <Text style={styles.whyPillText}>Dlaczego? →</Text>
        </View>
      </TouchableOpacity>

      {/* Activities — 2-column grid */}
      <Text style={styles.activitiesLabel}>{pl.yourDay.activitiesLabel}</Text>

      <View style={styles.actGrid}>
        <View style={styles.actCol}>
          {col1.map(act => (
            <ActivityChip key={act.id} act={act} onPress={() => setSelected(act)} />
          ))}
        </View>
        <View style={styles.actCol}>
          {col2.map(act => (
            <ActivityChip key={act.id} act={act} onPress={() => setSelected(act)} />
          ))}
        </View>
      </View>

      {/* Activity detail bottom sheet */}
      {selected && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelected(null)}>
          <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setSelected(null)}>
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

      {/* Factors bottom sheet */}
      {showFactors && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setShowFactors(false)}>
          <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowFactors(false)}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Ocena dnia — czynniki</Text>
                <View style={{ marginTop: 16, gap: 8 }}>
                  {factors.map((f, i) => (
                    <View key={i} style={styles.factorRow}>
                      <Text style={[
                        styles.factorText,
                        f.includes('✔') ? { color: '#34d399' } : f.includes('✗') ? { color: '#f87171' } : { color: '#fbbf24' }
                      ]}>{f}</Text>
                    </View>
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

function ActivityChip({ act, onPress }: { act: ActivityResult; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, act.ok ? styles.chipOk : styles.chipNo]}
      onPress={onPress}
      activeOpacity={0.72}
    >
      <Text style={[styles.chipMark, act.ok ? styles.markOk : styles.markNo]}>
        {act.ok ? '✔' : '✗'}
      </Text>
      <Text style={styles.chipLabel} numberOfLines={1}>{act.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(8, 20, 42, 0.82)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  // Rating card
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ratingTopLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  star: {
    fontSize: 30,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  whyPill: {
    backgroundColor: 'rgba(30,144,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.4)',
  },
  whyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60b4ff',
  },

  // Activities
  activitiesLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  actGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actCol: {
    flex: 1,
    gap: 7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
    borderWidth: 1.5,
  },
  chipOk: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.4)',
  },
  chipNo: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  chipMark: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  markOk: { color: '#34d399' },
  markNo: { color: '#f87171' },

  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0d1f35',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  sheetMark: {
    fontSize: 32,
    fontWeight: '800',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  sheetReason: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 24,
  },
  factorRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  factorText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeBtn: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
