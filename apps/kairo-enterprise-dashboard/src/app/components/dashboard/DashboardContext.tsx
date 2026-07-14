"use client";

import { createContext, useContext } from "react";

export type AuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  userType?: string;
  role?: { name?: string };
  photo?: { url?: string };
  [k: string]: unknown;
};

export type DashboardContextValue = {
  authUser: AuthUser | null;
  darkModeEnabled: boolean;
  toggleDarkMode: () => void;
};

export const DashboardContext = createContext<DashboardContextValue>({
  authUser: null,
  darkModeEnabled: false,
  toggleDarkMode: () => undefined,
});

export const useDashboardContext = () => useContext(DashboardContext);
