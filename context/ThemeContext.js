import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const STORAGE_KEY = '@ruskibites_theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setThemeState(saved);
    } catch (e) {}
    setLoading(false);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {}
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const lightColors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  primary: '#8B4513',
  secondary: '#D2691E',
  text: '#2C1810',
  textSecondary: '#8B7355',
  border: '#F0F0F0',
  card: '#FFFFFF',
};

const darkColors = {
  background: '#1A1A1A',
  surface: '#2D2D2D',
  primary: '#CD853F',
  secondary: '#D2691E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#3D3D3D',
  card: '#2D2D2D',
};