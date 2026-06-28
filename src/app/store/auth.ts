import { entity } from "simpler-state";
import AuthUtils from "@/app/lib/utils/AuthUtils";
import { USER_TYPE } from "@/app/lib/shared-constants";
import { users as UserService } from "@/services/UserServiceBackOffice/Users";
import { showErrorNotification } from "@/app/lib/utils";

// Types
export type AuthUser = {
  userType?: string;
  [k: string]: any;
};

const USER_TYPE_FLAGS = {
  isSysAdmin: USER_TYPE.SYS_ADMIN,
  isAdminStaff: USER_TYPE.STAFF,
  isAgency: USER_TYPE.AGENCY,
  isMerchant: USER_TYPE.MERCHANT,
  isDistributionManager: USER_TYPE.DISTRIBUTION_MANAGER,
  isBusinessAggregator: USER_TYPE.BUSINESS_AGGREGATOR,
  isUserStaff: USER_TYPE.USER_STAFF,
  isAgent: USER_TYPE.AGENT,
  isIndividual: USER_TYPE.INDIVIDUAL,
  isBusiness: USER_TYPE.BUSINESS,
  isUser: USER_TYPE.USER,
} as const;

type UserTypeFlags = { [K in keyof typeof USER_TYPE_FLAGS]: boolean };

const computeTypeFlags = (payload: Partial<AuthUser> | null): UserTypeFlags => {
  const userType = payload?.userType || payload?.type;
  return Object.fromEntries(
    Object.entries(USER_TYPE_FLAGS).map(([flag, value]) => [
      flag,
      userType === value,
    ]),
  ) as UserTypeFlags;
};

export interface AuthState extends UserTypeFlags {
  fetchingAuthUser: boolean;
  authUser: AuthUser | null;
  darkModeEnabled: boolean;
}

// initial state
const initialState: AuthState = {
  fetchingAuthUser: true,
  authUser: null,
  darkModeEnabled: false,
  ...computeTypeFlags(null),
};

// entity
export const auth = entity<AuthState>(initialState);

// entity updaters
export const setFetchingAuthUser = (payload: boolean = false): void => {
  void auth.set((value) => ({
    ...value,
    fetchingAuthUser: payload,
  }));
};

export const setAuthUser = (payload: Partial<AuthUser> | null = null): void => {
  void auth.set((value) => ({
    ...value,
    authUser: payload as AuthUser | null,
    ...(payload !== null && computeTypeFlags(payload)),
  }));
};

export const setDarkModeEnabled = (payload: boolean = false): void => {
  AuthUtils.setDarkMode(payload);

  void auth.set((value) => ({
    ...value,
    darkModeEnabled: payload,
  }));
};

// entity actions
export const resetAuthUser = (): void => setAuthUser(null);

export const disableDarkMode = (): void => {
  // Dark mode is now handled entirely by the styled-components ThemeProvider.
  // No third-party library to tear down.
};

export const toggleDarkMode = (): void => {
  const state = auth.get() as AuthState;
  const { darkModeEnabled } = state;
  return setDarkModeEnabled(!darkModeEnabled);
};

export const fetchAuthUser = async () => {
  setFetchingAuthUser(true);
  try {
    const response = await UserService.getAuthUser();
    if (response?.errCode || response?.statusCode !== 200) {
      throw response;
    }
    const data = response?.body?.data ?? response;
    if (data) setAuthUser(data);
    return response;
  } catch (error: any) {
    if (error.statusCode !== 401) {
      const errors = (error as any)?.errors as string[] | undefined;
      showErrorNotification({
        message: errors?.join(", ") || error.message || "Failed to fetch user",
      });
    }
    throw error;
  } finally {
    setFetchingAuthUser(false);
  }
};
