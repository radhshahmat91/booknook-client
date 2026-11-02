"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Mode = "light" | "dark";

type ThemeContextType = {
  mode: Mode;
  toggle: () => void;
};

const Ctx = createContext<ThemeContextType>({
  mode: "light",
  toggle: () => {},
});

export const useThemeMode = () => useContext(Ctx);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("light");

  // Apply the saved theme after hydration.
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("booknook-theme");

      let selectedTheme: Mode;

      if (
        savedTheme === "booknook" ||
        savedTheme === "booknook-dark"
      ) {
        selectedTheme =
          savedTheme === "booknook-dark" ? "dark" : "light";
      } else {
        selectedTheme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";
      }

      document.documentElement.setAttribute(
        "data-theme",
        selectedTheme === "dark"
          ? "booknook-dark"
          : "booknook"
      );

      setMode(selectedTheme);
    } catch {
      document.documentElement.setAttribute(
        "data-theme",
        "booknook"
      );
    }
  }, []);

  const toggle = () => {
    const nextMode: Mode =
      mode === "dark" ? "light" : "dark";

    const themeName =
      nextMode === "dark"
        ? "booknook-dark"
        : "booknook";

    document.documentElement.setAttribute(
      "data-theme",
      themeName
    );

    try {
      localStorage.setItem(
        "booknook-theme",
        themeName
      );
    } catch {
      // Continue even if localStorage is unavailable.
    }

    setMode(nextMode);
  };

  return (
    <Ctx.Provider value={{ mode, toggle }}>
      {children}
    </Ctx.Provider>
  );
}
