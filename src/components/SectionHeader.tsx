import React from 'react';
import { View, Text } from 'react-native';

// Spójny nagłówek sekcji (premium): pionowy akcent + czysta typografia,
// bez emoji. Opcjonalny element po prawej (np. link "Sport →").
export const SectionHeader = ({
  title,
  accent = '#1e90ff',
  right,
  dark = false,
}: {
  title: string;
  accent?: string;
  right?: React.ReactNode;
  dark?: boolean;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
    <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: accent, marginRight: 9 }} />
    <Text style={{ fontSize: 16, fontWeight: '800', color: dark ? 'rgba(255,255,255,0.95)' : '#1a1a1a', letterSpacing: 0.2, flex: 1 }}>
      {title}
    </Text>
    {right}
  </View>
);

export default SectionHeader;
