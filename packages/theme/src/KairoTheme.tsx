"use client";

import { type FC, type PropsWithChildren, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./globalStyle";
import { darkTheme, lightTheme } from "./tokens";

export type KairoThemeProps = PropsWithChildren<{
  darkModeEnabled?: boolean;
}>;

export const KairoTheme: FC<KairoThemeProps> = ({
  children,
  darkModeEnabled = false,
}) => {
  const activeTheme = darkModeEnabled ? darkTheme : lightTheme;

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkModeEnabled ? "dark" : "light",
    );
  }, [darkModeEnabled]);

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default KairoTheme;
