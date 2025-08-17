import { useState, useEffect, createContext, useContext } from 'react';
import { Theme } from '../types';
import { THEMES } from '../constants';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeName: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(THEMES.light);

  useEffect(() => {
    const savedTheme = localStorage.getItem('calculator-theme') as 'light' | 'dark';
    if (savedTheme && THEMES[savedTheme]) {
      setThemeState(THEMES[savedTheme]);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const setTheme = (themeName: 'light' | 'dark') => {
    const newTheme = THEMES[themeName];
    setThemeState(newTheme);
    localStorage.setItem('calculator-theme', themeName);
  };

  const toggleTheme = () => {
    const newThemeName = theme.name === 'light' ? 'dark' : 'light';
    setTheme(newThemeName);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
