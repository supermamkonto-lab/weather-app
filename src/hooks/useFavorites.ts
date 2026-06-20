import { useState, useCallback, useEffect } from 'react';
import { cacheFavorites, getCachedFavorites } from '../services/cacheService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const cached = await getCachedFavorites();
      if (cached) {
        setFavorites(cached);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }, []);

  const addFavorite = useCallback(
    async (city: string) => {
      if (favorites.includes(city)) {
        return;
      }
      const updated = [...favorites, city];
      setFavorites(updated);
      await cacheFavorites(updated);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (city: string) => {
      const updated = favorites.filter(f => f !== city);
      setFavorites(updated);
      await cacheFavorites(updated);
    },
    [favorites]
  );

  const isFavorite = useCallback((city: string) => favorites.includes(city), [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loadFavorites,
  };
};
