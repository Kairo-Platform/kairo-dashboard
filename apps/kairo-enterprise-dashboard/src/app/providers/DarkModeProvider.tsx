"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

export const DARK_MODE_KEY = "kairo-enterprise-dark-mode";

type DarkModeContextValue = {
  darkModeEnabled: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextValue>({
  darkModeEnabled: false,
  toggleDarkMode: () => undefined,
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    setDarkModeEnabled(window.localStorage.getItem(DARK_MODE_KEY) === "true");
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeEnabled((enabled) => {
      const next = !enabled;
      window.localStorage.setItem(DARK_MODE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ darkModeEnabled, toggleDarkMode }),
    [darkModeEnabled, toggleDarkMode],
  );

  return (
    <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>
  );
};
