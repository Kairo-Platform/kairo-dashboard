"use client";

import { type FC, type PropsWithChildren, useEffect } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useEntity } from "simpler-state";
import { auth } from "@/app/store/auth";
import { createDarkTheme } from "@/app/lib/utils/createDarkTheme";

export const theme = {
  colors: {
    primary: "#FF6B1A",
    buttonGradientTo: "#FF6B1A",
    bgColor: "#fbfbfb",
    bgColor_01: "#f8f8f8",
    btnHover: "#BF5014",
    btnHover_02: "#f4f4f4",
    black: "#000000",
    blue: "#107EFF",
    blue_01: "#0D65CC",
    blue_02: "#B7D8FF",
    blue_03: "#0D65CC",
    blueDark: "#031933",
    bg_yellow: "#FEF8E9",
    buttonRed: "#E40C0C",
    darkBlue: "#2188D3",
    darkBlue_02: "#031933",
    skyBlue: "#B7D8FF",
    linkText: "#666666",
    gold: "#DB9D24",
    green: "#149856",
    green_01: "#46AE70",
    inputBorder: "#EBEBEB",
    lightBlue: "#B7D8FF",
    drawerBorder: "#EBEBEB",
    modalBorder: "#dcdcdc",
    orange: "#FF6B1A",
    orangeDark: "#BF5014",
    primaryColor: "#FF6B1A",
    offWhite: "#FCFCFC",
    purple: "#343f79",
    purpleCool: "#573ACB",
    tableRowHover: "#F9F9F9",
    red: "#E40C0C",
    red_01: "#D14949",
    red_02: "#FFEFEF",
    red_03: "#F54E4E",
    red_04: "#B60A0A",
    gray_01: "#F5F5F5",
    gray_02: "#F5F5F5",
    gray_03: "#CBCBCB",
    gray_04: "#D1D1D1",
    gray_05: "#F9F9F9",
    gray_06: "#F0F0F0",
    magenta: "#9A16C0",
    grayButtonBg: "#E5E5E5",
    grayButtonBorder: "#D2D2D2",
    tabContentBorder: "#EBEBEB",
    tabListBorder: "#EBEBEB",
    tabListColor: "#6B6B6B",
    dividerColor: "#EAEAEA",
    text_01: "#0A0A0A",
    text_02: "#797979",
    text_03: "#A2A2A2",
    text_04: "#828282",
    text_05: "#969696",
    text_06: "#B2B2B2",
    text_07: "#D1D1D1",
    text_08: "#E0E0E0",
    text_09: "#F0F0F0",
    transparent: "transparent",
    secondaryColor: "#BF5014",
    ui_01: "#ffffff",
    ui_04: "#f4f4f2",
    ui_05: "#00b493",
    ui_06: "#fdfdff",
    ui_07: "#fdfdfd",
    white: "#ffffff",
    yellow: "#DE972C",

    breadcrumbs: {
      textColor: "#8A8A8A",
    },

    card: {
      borderColor: "#DDDADA",
    },

    tag: {
      blue: {
        bg_color: "#EBF2FB",
        color: "#337DD6",
      },
      grey: {
        bg_color: "#F9F9F9",
        color: "#6B6B6B",
      },
      red: {
        bg_color: "#FCE7E7",
        color: "#E40C0C",
      },
      green: {
        bg_color: "#E8F8F0",
        color: "#149856",
      },
      yellow: {
        bg_color: "#FFF5E0",
        color: "#DB9D24",
      },
      yellowDark: {
        bg_color: "#FFF5E0",
        color: "#FF9739",
      },
      purpleCool: {
        bg_color: "#EEEBFA",
        color: "#573ACB",
      },
      magenta: {
        bg_color: "#F5E8F9",
        color: "#9A16C0",
      },
    },

    emptyState: {
      textColor: "#2A2A2A",
      textColor_02: "#6B6B6B",
      iconBgColor: "#F0F0F0",
    },
  },
  projectListCard: {
    borderColor: "#D0D0D0",
  },
  breakpoint: {
    xl: "1280px",
    lg: "1024px",
    md: "768px",
    sm: "425px",
  },
};

export type ThemeType = typeof theme;

export const lightTheme = theme;

// Auto-generate the dark counterpart by inverting every color value, with
// apply manual overrides
const _autoDark = createDarkTheme(lightTheme);
export const darkTheme: ThemeType = {
  ..._autoDark,
  colors: {
    ..._autoDark.colors,
    // Backgrounds
    bgColor: "#121212",
    bgColor_01: "#121212",
    offWhite: "#1e293b",
    ui_01: "#121212",
    ui_04: "#0f172a",
    ui_06: "#1a2538",
    ui_07: "#1a2538",
    skyBlue: "#B7D8FF",

    // Text
    text_01: "#f1f5f9",
    text_02: "#cbd5e1",
    text_03: "#94a3b8",
    text_04: "#94a3b8",
    text_05: "#64748b",
    text_06: "#e2e8f0",
    text_07: "#64748b",
    text_08: "#64748b",
    text_09: "#475569",
    linkText: "#94a3b8",
    // Borders & dividers
    dividerColor: "#1e3a5f",
    inputBorder: "#1e3a5f",
    drawerBorder: "#1e3a5f",
    modalBorder: "#1e3a5f",
    tabContentBorder: "#1e3a5f",
    tabListBorder: "#1e3a5f",
    tabListColor: "#94a3b8",
    // Grays
    gray_01: "#1e293b",
    gray_02: "#1e293b",
    gray_03: "#1e3a5f",
    gray_04: "#334155",
    gray_05: "#1e293b",
    gray_06: "#1e293b",
    grayButtonBg: "#334155",
    grayButtonBorder: "#475569",
    tableRowHover: "#1e293b",
  },
};

const GlobalStyle = createGlobalStyle`
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
input,
button {
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}

body {
  overflow: overlay;
  scroll-behavior: smooth;
  font-family: inherit;
}

input, textarea, button {
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  border: 0;
  background-color: transparent;
}

ul {
  padding: 0;
  margin: 0 0 0 1.1rem;
  list-style-type: disc;
  list-style-position: outside;
}

table {
  width: 100%;
}

details > summary::marker, /* Latest Chrome, Edge, Firefox */
details > summary::-webkit-details-marker /* Safari */ {
  display: none;
}

.link {
  color: ${(props) => props.theme.colors.primaryColor};

  &:focus,
  &:hover {
    text-decoration: underline;
    transition: 0.3s;
    cursor: pointer;
  }
}

/* custom scrollbar-color */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb:hover,
:hover ::-webkit-scrollbar-thumb {
  background-color: ${(props) => props.theme.colors.primaryColor};
}

/* Colors */
.color-red {
  color: ${(props) => props.theme.colors.red};
}
.color-green {
  color: ${(props) => props.theme.colors.green};
}
.color-primary {
  color: ${(props) => props.theme.colors.primaryColor};
}

/* text align */
.text-align-center {
  text-align: center;
}

/* text utils */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* font weight */
.font-weight-medium {
  font-weight: 500;
}
.font-weight-bold {
  font-weight: 700;
}

/* font size */
.font-size-xxs {
  font-size: xx-small;
}
.font-size-xs {
  font-size: x-small;
}
.font-size-sm {
  font-size: small;
}
.font-size-lg {
  font-size: large;
}
.font-size-xl {
  font-size: x-large;
}
.font-size-xxl {
  font-size: xx-large;
}

/* position */
.p-relative {
  position: relative;
}

.p-absolute {
  position: absolute;
}
`;

export const Theme: FC<PropsWithChildren> = ({ children }) => {
  const { darkModeEnabled } = useEntity(auth);
  const activeTheme = darkModeEnabled ? darkTheme : lightTheme;

  // Keep the CSS custom properties in globals.css (and any native browser
  // background/color) in sync with the programmatic toggle.
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkModeEnabled ? "dark" : "light",
    );
  }, [darkModeEnabled]);

  return (
    <ThemeProvider theme={activeTheme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
};

export default Theme;
