
import React, { createContext, useContext, useState, useEffect } from "react";
import { THEMES } from "./themeConfig"; 

type Theme = {
  id: string;
  name: string;
  price?: number;
  description?: string;
  colors: Record<string, string>;
};

type ThemeContextType = {
  activeTheme: Theme;
  applyTheme: (theme: Theme) => void;
};

const stored = (() => {
  try {
    return JSON.parse(localStorage.getItem("active_theme") || "null");
  } catch {
    return null;
  }
})();

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultTheme = stored ?? THEMES[0];
  const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);

  const applyTheme = (theme: Theme) => {
    if (!theme) return;
  
    setActiveTheme(theme);
  
    // apply text & accent colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  
  
    localStorage.setItem("active_theme", JSON.stringify(theme));
  };
  

  useEffect(() => {
    if (stored && stored.colors) {
      applyTheme(stored);
    } else {
      // ensure default theme variables are applied
      applyTheme(THEMES[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ThemeContext.Provider value={{ activeTheme, applyTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
