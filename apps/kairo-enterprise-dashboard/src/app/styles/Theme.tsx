"use client";

import { type FC, type PropsWithChildren } from "react";
import { KairoTheme } from "@kairo/theme";
import { useDarkMode } from "@/app/providers/DarkModeProvider";

export {
  darkTheme,
  lightTheme,
  theme,
  type ThemeType,
} from "@kairo/theme";

const Theme: FC<PropsWithChildren> = ({ children }) => {
  const { darkModeEnabled } = useDarkMode();

  return (
    <KairoTheme darkModeEnabled={darkModeEnabled}>{children}</KairoTheme>
  );
};

export default Theme;
