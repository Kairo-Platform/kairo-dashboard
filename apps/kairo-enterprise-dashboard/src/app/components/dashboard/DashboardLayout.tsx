"use client";

import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Loading, LoadingOverlay } from "@kairo/ui";
import { showErrorNotification } from "@kairo/utils";
import { URL } from "@/lib/constants/URL";
import { AuthUtils } from "@/lib/auth";
import { getApiData, isApiError } from "@/lib/utils";
import { xApiUser } from "@/services/xApi/User";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import {
  AuthUser,
  DashboardContext,
  hasAuthUserProfile,
  normalizeAuthUser,
} from "./DashboardContext";
import { Breadcrumbs, Flex, type BreadcrumbItem } from "@/app/components/ui";
import { useDarkMode } from "@/app/providers/DarkModeProvider";

const SIDEBAR_COLLAPSED_KEY = "kairo-enterprise-sidebar-collapsed";
const DESKTOP_MEDIA_QUERY = "(min-width: 769px)";

const DashboardLayoutElement = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;

  .DashboardLayout__wrapper {
    width: 100%;
    padding-left: 15rem;
    transition: padding-left 0.25s ease;

    &.isSidebarCollapsed {
      padding-left: 4.5rem;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      padding-left: 0;

      &.isSidebarCollapsed {
        padding-left: 0;
      }
    }
  }

  .Breadcrumb_mobile-only {
    display: none !important;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      display: initial !important;
    }
  }

  .DashboardLayout__header_wrapper {
    padding-left: 3rem;

    .DashboardLayout__header {
      margin-left: auto;
      display: flex;
      align-items: center;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      padding-left: 0;

      .Breadcrumb_desktop-only {
        display: none !important;
      }

      .DashboardLayout__header {
        width: 100%;
        margin-left: initial;
        display: initial;
      }
    }
  }

  .DashboardLayout__content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 3rem;
    height: calc(100vh - 80px);
    height: calc(100svh - 80px);
    overflow-y: auto;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      padding: 1rem 2rem;
    }
  }

  .DashboardLayout__pageHeading--title {
    color: ${(props) => props.theme.colors.text_01};
    font-size: 28px;
    font-weight: medium;
    line-height: 36px;
    letter-spacing: -3%;
  }

  .DashboardLayout__pageHeading--subTitle {
    color: ${(props) => props.theme.colors.text_02};
    font-weight: 500;
  }

  .DashboardLayout__titleRow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .DashboardLayout__editButton {
    background: none;
    border: 2px solid ${(props) => props.theme.colors.gray_02};
    padding: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${(props) => props.theme.colors.text_01};
    border-radius: 50%;
    transition: all 0.3s ease-out;

    &:hover {
      border-color: ${(props) => props.theme.colors.primaryColor};
      color: ${(props) => props.theme.colors.primaryColor};
    }
  }
`;

type PageTitleObject = {
  title: ReactNode;
  isEditable?: boolean;
  onClick?: () => void;
  onClicked?: () => void;
};

type DashboardLayoutProps = {
  pageTitle?: string | PageTitleObject;
  subTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  appendElementToHeading?: ReactNode | null;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  pageTitle = "Dashboard",
  subTitle,
  breadcrumbs = [],
  children,
  appendElementToHeading = null,
}) => {
  const appName = process.env.APP_NAME ?? "Kairo Dashboard";
  const titleText = typeof pageTitle === "string" ? pageTitle : "Dashboard";

  const router = useRouter();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [fetchingAuthUser, setFetchingAuthUser] = useState(true);
  const { darkModeEnabled, toggleDarkMode } = useDarkMode();
  const fetchedAuthUser = useRef(false);

  const toggleSidebar = useCallback(() => {
    setSidebarIsOpen((open) => !open);
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
      setSidebarIsCollapsed(false);
      window.localStorage.removeItem(SIDEBAR_COLLAPSED_KEY);
      return;
    }

    setSidebarIsCollapsed((collapsed) => {
      const next = !collapsed;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    setSidebarIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const syncSidebarMode = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);

      if (!desktop) {
        setSidebarIsCollapsed(false);
        window.localStorage.removeItem(SIDEBAR_COLLAPSED_KEY);
        return;
      }

      setSidebarIsCollapsed(
        window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true",
      );
    };

    syncSidebarMode();
    mediaQuery.addEventListener("change", syncSidebarMode);

    return () => {
      mediaQuery.removeEventListener("change", syncSidebarMode);
    };
  }, []);

  useEffect(() => {
    document.title = `${appName} - ${titleText}`;
  }, [appName, titleText]);

  const fetchLoggedInUser = useCallback(async () => {
    if (fetchedAuthUser.current) return;
    fetchedAuthUser.current = true;
    setFetchingAuthUser(true);

    try {
      const response = await xApiUser.me();
      if (isApiError(response)) {
        throw response;
      }
      const data = getApiData<AuthUser>(response);
      const user = normalizeAuthUser(data ?? (response as AuthUser));
      if (user) setAuthUser(user);
    } catch (error: unknown) {
      const err = error as { statusCode?: number; status?: number };
      router.replace(URL.LOGIN_URL);
      if (err.statusCode === 401 || err.status === 401) {
        showErrorNotification({
          message: "Session expired. Please log in again.",
        });
        void AuthUtils.logout();
      }
    } finally {
      setFetchingAuthUser(false);
    }
  }, [router]);

  useEffect(() => {
    void (async () => {
      const loggedIn = await AuthUtils.isLoggedIn();
      if (!loggedIn) {
        setFetchingAuthUser(false);
        router.replace(URL.LOGIN_URL);
        return;
      }

      if (!hasAuthUserProfile(authUser)) {
        await fetchLoggedInUser();
      } else {
        setFetchingAuthUser(false);
      }
    })();
  }, [authUser, fetchLoggedInUser, router]);

  const shouldCollapseSidebar = isDesktop && sidebarIsCollapsed;

  const contextValue = useMemo(
    () => ({ authUser, darkModeEnabled, toggleDarkMode, isDesktop }),
    [authUser, darkModeEnabled, toggleDarkMode, isDesktop],
  );

  if (fetchingAuthUser && !hasAuthUserProfile(authUser)) {
    return (
      <LoadingOverlay>
        <Loading />
      </LoadingOverlay>
    );
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <DashboardLayoutElement>
        <DashboardSidebar
          isOpen={sidebarIsOpen}
          toggleSidebar={toggleSidebar}
          isCollapsed={shouldCollapseSidebar}
          toggleCollapse={toggleSidebarCollapse}
        />
        <div
          className={`DashboardLayout__wrapper${shouldCollapseSidebar ? " isSidebarCollapsed" : ""}`}
        >
          <Flex
            justify="space-between"
            gap="4rem"
            className="DashboardLayout__header_wrapper"
          >
            {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
              <Flex align="center" className="Breadcrumb_desktop-only">
                <Breadcrumbs breadcrumbs={breadcrumbs} separator="/" />
              </Flex>
            )}

            <div className="DashboardLayout__header">
              <DashboardHeader
                isOpen={sidebarIsOpen}
                toggleSidebar={toggleSidebar}
              />
            </div>
          </Flex>

          <div className="DashboardLayout__content-wrapper">
            <div className="DashboardLayout__pageHeading">
              <Flex justify="space-between" wrap="wrap" align="center">
                <Flex direction="column" gap="0.5rem">
                  <div className="DashboardLayout__titleRow">
                    <h2 className="DashboardLayout__pageHeading--title">
                      {typeof pageTitle === "string"
                        ? pageTitle
                        : pageTitle.title}
                    </h2>
                    {typeof pageTitle !== "string" && pageTitle.isEditable && (
                      <button
                        type="button"
                        className="DashboardLayout__editButton"
                        onClick={pageTitle.onClick ?? pageTitle.onClicked}
                        aria-label="Edit title"
                      >
                        <Icon icon="bx:pencil" width={16} height={16} />
                      </button>
                    )}
                  </div>
                  {subTitle && <p className="DashboardLayout__pageHeading--subTitle">{subTitle}</p>}
                </Flex>
                {appendElementToHeading && <div>{appendElementToHeading}</div>}
              </Flex>
            </div>

            {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
              <Flex align="center" className="Breadcrumb_mobile-only">
                <Breadcrumbs breadcrumbs={breadcrumbs} separator="/" />
              </Flex>
            )}

            <main
              className="DashboardLayout__content"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {children}
            </main>
          </div>
        </div>
      </DashboardLayoutElement>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
