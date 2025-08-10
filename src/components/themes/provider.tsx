"use client";

import type * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorTheme = "default" | "red" | "white" | "yellow";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
  colorStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "default",
  setTheme: () => null,
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "default",
  storageKey = "ui-theme",
  colorStorageKey = "ui-color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme);

  // Initialize from localStorage once the component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    const storedColorTheme = localStorage.getItem(
      colorStorageKey
    ) as ColorTheme | null;

    if (storedTheme) {
      setTheme(storedTheme);
    }

    if (storedColorTheme) {
      setColorTheme(storedColorTheme);
    }
  }, [storageKey, colorStorageKey]);

  // Detect system theme changes dynamically
  useEffect(() => {
    const root = window.document.documentElement;

    // Helper function to apply theme
    const applyTheme = (themeToApply: Theme) => {
      // Remove all theme classes
      root.classList.remove("light", "dark");

      if (themeToApply === "system") {
        // Detect the system theme using matchMedia
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(themeToApply);
      }
    };

    // Apply the initial theme
    applyTheme(theme);

    // Listen for system theme changes
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        // If the theme is set to system, dynamically adjust to the system theme change
        const systemTheme = e.matches ? "dark" : "light";
        applyTheme(systemTheme);
      }
    };

    // Add event listener for system theme changes
    mediaQueryList.addEventListener("change", handleSystemThemeChange);

    // Cleanup the event listener on component unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  // Apply color theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-red", "theme-white", "theme-yellow");
    if (colorTheme !== "default") {
      root.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme]);

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setColorTheme: (colorTheme: ColorTheme) => {
      localStorage.setItem(colorStorageKey, colorTheme);
      setColorTheme(colorTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};