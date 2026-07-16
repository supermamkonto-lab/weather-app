// WeatherParticles — animated ambient particles in the hero section
// Rain drops for rain/storm, snowflakes for snow, nothing for clear sky.
// Uses native driver — zero JS thread overhead.

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 420;

export type ParticleType = 'rain' | 'storm' | 'snow' | 'none';

export function getParticleType(description: string): ParticleType {
  const d = description.toLowerCase();
  if (d.includes('burza') || d.includes('storm') || d.includes('thunder') || d.includes('wyładowania')) return 'storm';
  if (d.includes('deszcz') || d.includes('rain') || d.includes('mżawka') || d.includes('drizzle') || d.includes('opady')) return 'rain';
  if (d.includes('śnieg') || d.includes('snow') || d.includes('zamieć') || d.includes('plucha')) return 'snow';
  return 'none';
}

// ─── Single rain drop ─────────────────────────────────────────────────────────

interface RainDropProps {
  x: number;
  delay: number;
  duration: number;
  length: number;
  opacity: number;
  storm: boolean;
}

function RainDrop({ x, delay, duration, length, opacity, storm }: RainDropProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-length, HERO_H + length] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, storm ? 40 : 18] });
  const dropOpacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, opacity, opacity, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: storm ? 2 : 1.5,
        height: length,
        backgroundColor: storm ? 'rgba(160,210,255,0.9)' : 'rgba(180,225,255,0.75)',
        borderRadius: 1,
        opacity: dropOpacity,
        transform: [{ translateY }, { translateX }, { rotate: storm ? '18deg' : '10deg' }],
      }}
    />
  );
}

// ─── Single snowflake ─────────────────────────────────────────────────────────

interface SnowflakeProps {
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

function Snowflake({ x, delay, duration, size, opacity }: SnowflakeProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    const swing = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(sway, { toValue: -1, duration: 1800, useNativeDriver: true }),
      ])
    );
    fall.start();
    swing.start();
    return () => { fall.stop(); swing.stop(); };
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-size * 2, HERO_H + size * 2] });
  const translateX = sway.interpolate({ inputRange: [-1, 1], outputRange: [-14, 14] });
  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-30deg', '30deg'] });
  const flakeOpacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, opacity, opacity, 0] });

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        fontSize: size,
        color: 'rgba(255,255,255,0.85)',
        opacity: flakeOpacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    >
      ❄
    </Animated.Text>
  );
}

// ─── Particle system ──────────────────────────────────────────────────────────

interface Props {
  description: string;
}

export default function WeatherParticles({ description }: Props) {
  const type = getParticleType(description);

  const particles = useMemo(() => {
    if (type === 'none') return [];
    const count = type === 'snow' ? 14 : 22;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * (SCREEN_W - 10),
      delay: Math.random() * 2200,
      duration: type === 'snow'
        ? 4000 + Math.random() * 3000
        : type === 'storm'
        ? 500 + Math.random() * 250
        : 700 + Math.random() * 400,
      sizeOrLength: type === 'snow'
        ? 9 + Math.random() * 8
        : 10 + Math.random() * 12,
      opacity: 0.35 + Math.random() * 0.45,
    }));
  }, [type]);

  if (type === 'none') return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(p =>
        type === 'snow' ? (
          <Snowflake
            key={p.id}
            x={p.x}
            delay={p.delay}
            duration={p.duration}
            size={p.sizeOrLength}
            opacity={p.opacity}
          />
        ) : (
          <RainDrop
            key={p.id}
            x={p.x}
            delay={p.delay}
            duration={p.duration}
            length={p.sizeOrLength}
            opacity={p.opacity}
            storm={type === 'storm'}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H,
    overflow: 'hidden',
  },
});
