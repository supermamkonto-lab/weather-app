// WhatToWear — "Co założyć?" clothing recommendation card
// Gives instant wardrobe advice based on temperature, wind, rain, UV.
// Premium dark glass, emoji-rich, tappable for detail modal.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { WeatherInput } from '../utils/dayLogic';

interface ClothingProfile {
  title: string;
  emoji: string;
  items: string[];
  tip: string;
  accent: string;
}

function getProfile(w: WeatherInput): ClothingProfile {
  const t = w.tempC ?? parseInt(w.temp) ?? 20;
  const wind = w.windKmph ?? parseInt(w.windSpeed) ?? 0;
  const desc = (w.description || '').toLowerCase();
  const uv = parseInt(w.uvIndex) || 0;
  const isRain = desc.includes('deszcz') || desc.includes('rain') || desc.includes('mżawka') || desc.includes('opady');
  const isStorm = desc.includes('burza') || desc.includes('storm');
  const isSnow = desc.includes('śnieg') || desc.includes('snow');

  if (isSnow || t <= -5) return {
    title: 'Zima pełna gębą',
    emoji: '🧥',
    items: ['❄️ Kurtka puchowa', '🧤 Rękawiczki', '🧣 Szalik + czapka', '🥾 Buty zimowe', '🧦 Grube skarpety'],
    tip: 'Ubierz się w warstwy. Unikaj bawełny — szybko chłonie wilgoć.',
    accent: '#60a5fa',
  };

  if (t <= 5) return {
    title: 'Chłodny dzień',
    emoji: '🧤',
    items: ['🧥 Kurtka lub płaszcz', '🧣 Szalik polecany', '🧢 Czapka opcjonalna', '👖 Długie spodnie', '👟 Ciepłe buty'],
    tip: isRain ? 'Weź parasol lub kurtkę przeciwdeszczową.' : 'Wiatr może potęgować chłód — okryj szyję.',
    accent: '#7dd3fc',
  };

  if (t <= 12) return {
    title: 'Przejściowa pogoda',
    emoji: '🧢',
    items: ['🧥 Bluza lub lekka kurtka', ...(isRain ? ['☂️ Parasol obowiązkowy'] : []), '👖 Długie spodnie', '👟 Zamknięte obuwie'],
    tip: 'Typowa wiosna/jesień — bluza i lekka kurtka wystarczą.',
    accent: '#34d399',
  };

  if (t <= 20) return {
    title: 'Komfortowa temperatura',
    emoji: '👕',
    items: ['👕 T-shirt + bluza', ...(isRain ? ['☂️ Mały parasol'] : []), ...(wind > 20 ? ['🧥 Wiatrówka'] : []), '👖 Długie spodnie lub jeansy', '👟 Casualowe obuwie'],
    tip: uv > 5 ? 'Krem SPF 30+. Słońce jest aktywne.' : 'Idealna temperatura do spaceru.',
    accent: '#4ade80',
  };

  if (t <= 26) return {
    title: 'Letni dzień',
    emoji: '☀️',
    items: ['👕 T-shirt lub koszula', '🩳 Szorty lub lekkie spodnie', ...(uv > 5 ? ['🧴 Krem SPF 30+', '🕶️ Okulary przeciwsłoneczne'] : []), ...(isRain ? ['☂️ Lekki parasol'] : [])],
    tip: 'Wybierz jasne, przewiewne materiały. Pij dużo wody.',
    accent: '#fbbf24',
  };

  if (t <= 33) return {
    title: 'Gorący dzień',
    emoji: '🌡️',
    items: ['👕 Przewiewna koszulka', '🩳 Lekkie szorty', '🧴 Krem SPF 50+', '🕶️ Okulary przeciwsłoneczne', '🎩 Nakrycie głowy', '💧 Bidon z wodą'],
    tip: 'Odzież z naturalnych tkanin (lniana, bawełna). Unikaj syntetyków.',
    accent: '#fb923c',
  };

  // t > 33
  return {
    title: 'Fala upałów',
    emoji: '🔥',
    items: ['👕 Minimalistyczny ubiór', '🧴 Krem SPF 50+ — obowiązkowo', '🕶️ Okulary UV400', '🎩 Kapelusz z rondem', '💧 Dużo płynów', '🏠 Ogranicz wychodzenie 12-16'],
    tip: 'Upał powyżej 33° jest niebezpieczny. Klimatyzacja lub wentylator.',
    accent: '#f87171',
  };
}

interface Props {
  weather: WeatherInput;
}

export default function WhatToWear({ weather }: Props) {
  const [open, setOpen] = useState(false);
  const profile = getProfile(weather);

  return (
    <>
      <TouchableOpacity style={[styles.card, { borderLeftColor: profile.accent }]} onPress={() => setOpen(true)} activeOpacity={0.82}>
        <View style={styles.row}>
          <Text style={styles.emoji}>{profile.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CO ZAŁOŻYĆ?</Text>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={[styles.preview]}>{profile.items[0]}  {profile.items[1] || ''}</Text>
          </View>
          <View style={[styles.pill, { borderColor: profile.accent + '66' }]}>
            <Text style={[styles.pillText, { color: profile.accent }]}>Szczegóły →</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetEmoji}>{profile.emoji}</Text>
                <Text style={styles.sheetTitle}>{profile.title}</Text>
              </View>
              <Text style={[styles.sheetAccent, { color: profile.accent }]}>CO ZAŁOŻYĆ DZIŚ</Text>
              <View style={{ gap: 8, marginTop: 10 }}>
                {profile.items.map((item, i) => (
                  <View key={i} style={[styles.itemRow, { borderLeftColor: profile.accent }]}>
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
              {profile.tip ? (
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>{profile.tip}</Text>
                </View>
              ) : null}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
                <Text style={styles.closeBtnText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(8, 20, 42, 0.82)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderLeftWidth: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 36,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
  },
  preview: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  pill: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0d1f35',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 52,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  sheetEmoji: {
    fontSize: 40,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  sheetAccent: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemRow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  tipBox: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#fef9c3',
    lineHeight: 20,
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: 22,
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
