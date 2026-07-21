"use client";

import { createContext, useContext } from "react";

export type AuthUserOrganization = {
  orgId?: string;
  name?: string;
  role?: string;
};

export type AuthUser = {
  id?: string;
  userId?: string;
  email?: string;
  /** Full display name from xApi `/v1/me` when first/last are not split. */
  name?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  userType?: string;
  role?: { name?: string };
  photo?: { url?: string };
  organizations?: AuthUserOrganization[];
  [k: string]: unknown;
};

type MeApiUser = {
  userId?: string;
  id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  userType?: string;
  role?: { name?: string } | string;
  photo?: { url?: string };
  organizations?: AuthUserOrganization[];
  [k: string]: unknown;
};

/**
 * Normalizes `/v1/me` payload into the AuthUser shape used by the dashboard.
 * Prefers a single `name` string; maps `organizations[0].role` → `role.name`.
 */
export function normalizeAuthUser(raw: MeApiUser | null | undefined): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;

  const primaryOrg = Array.isArray(raw.organizations)
    ? raw.organizations[0]
    : undefined;

  const roleName =
    (typeof raw.role === "string" ? raw.role : raw.role?.name) ||
    primaryOrg?.role;

  const fullName =
    (typeof raw.name === "string" && raw.name.trim()) ||
    [raw.firstName, raw.lastName].filter(Boolean).join(" ").trim() ||
    undefined;

  return {
    ...raw,
    id: raw.id ?? raw.userId,
    userId: raw.userId ?? raw.id,
    email: raw.email,
    name: fullName,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: roleName ? { name: roleName } : raw.role && typeof raw.role === "object" ? raw.role : undefined,
    organizations: raw.organizations,
  };
}

/** True when we have enough profile data to leave the loading gate. */
export function hasAuthUserProfile(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.name || user?.firstName || user?.userId || user?.id);
}

export function getAuthUserDisplayName(user: AuthUser | null | undefined): string {
  if (!user) return "User";
  if (user.name?.trim()) return user.name.trim();
  const combined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return combined || "User";
}

export type DashboardContextValue = {
  authUser: AuthUser | null;
  darkModeEnabled: boolean;
  toggleDarkMode: () => void;
  isDesktop: boolean;
};

export const DashboardContext = createContext<DashboardContextValue>({
  authUser: null,
  darkModeEnabled: false,
  toggleDarkMode: () => undefined,
  isDesktop: false,
});

export const useDashboardContext = () => useContext(DashboardContext);
