import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@ruskibites_favorites';
const THEME_KEY = '@ruskibites_theme';

export const storage = {
  // Favorites
  getFavorites: async () => {
    try {
      const json = await AsyncStorage.getItem(FAVORITES_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  },
  
  addFavorite: async (item) => {
    try {
      const favorites = await storage.getFavorites();
      if (!favorites.find(f => f.id === item.id)) {
        favorites.push(item);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
      return favorites;
    } catch (e) {
      return [];
    }
  },
  
  removeFavorite: async (itemId) => {
    try {
      const favorites = await storage.getFavorites();
      const filtered = favorites.filter(f => f.id !== itemId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (e) {
      return [];
    }
  },

  // Theme
  getTheme: async () => {
    try {
      return await AsyncStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  },
  
  setTheme: async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  },
};