import { entity } from "simpler-state";

// Types
export interface DashboardState {
  sidebarIsOpen: boolean;
}

// initial state
const initialState: DashboardState = {
  sidebarIsOpen: true,
};

// entity

export const dashboard = entity<DashboardState>(initialState);

// entity updaters

export const setSidebarIsOpen = (payload: boolean = true): void => {
  void dashboard.set((currentState) => ({
    ...currentState,
    sidebarIsOpen: payload,
  }));
};

export const toggleSidebar = (): void => {
  void dashboard.set((currentState) => ({
    ...currentState,
    sidebarIsOpen: !currentState.sidebarIsOpen,
  }));
};

export const openSidebar = (): void => setSidebarIsOpen();

export const closeSidebar = (): void => setSidebarIsOpen(false);

export const resetDashboard = (): void => {
  void dashboard.set(() => ({ ...initialState }));
};
