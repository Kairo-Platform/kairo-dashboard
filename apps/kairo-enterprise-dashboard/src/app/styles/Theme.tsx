"use client";

import { type FC, type PropsWithChildren } from "react";
import { KairoTheme } from "@kairo/theme";

export {
  darkTheme,
  lightTheme,
  theme,
  type ThemeType,
} from "@kairo/theme";

const Theme: FC<PropsWithChildren> = ({ children }) => {
  return <KairoTheme>{children}</KairoTheme>;
};

export default Theme;
