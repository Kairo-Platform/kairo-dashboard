"use client";

import { type FC, type PropsWithChildren } from "react";
import { useEntity } from "simpler-state";
import { KairoTheme } from "@kairo/theme";
import { auth } from "@/app/store/auth";

export {
  darkTheme,
  lightTheme,
  theme,
  type ThemeType,
} from "@kairo/theme";

const Theme: FC<PropsWithChildren> = ({ children }) => {
  const { darkModeEnabled } = useEntity(auth);

  return (
    <KairoTheme darkModeEnabled={darkModeEnabled}>{children}</KairoTheme>
  );
};

export default Theme;
