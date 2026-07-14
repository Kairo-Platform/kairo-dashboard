"use client";

import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
// TODO: re-enable when backend auth is ready
// import { useRouter } from "next/navigation";
// import { useRef } from "react";
// import { Loading, LoadingOverlay } from "@kairo/ui";
// import { showErrorNotification } from "@kairo/utils";
// import { URL } from "@/lib/constants/URL";
// import { AuthUtils } from "@/lib/auth";
// import { getApiData, isApiError } from "@/lib/utils";
// import { xApiUser } from "@/services/xApi/User";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import {
  AuthUser,
  DashboardContext,
} from "./DashboardContext";
import { Breadcrumbs, Flex, type BreadcrumbItem } from "@/app/components/ui";

const DARK_MODE_KEY = "kairo-enterprise-dark-mode";

const DashboardLayoutElement = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;

  .DashboardLayout__wrapper {
    width: 100%;
    padding-left: 15rem;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      padding-left: 0;
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
    font-size: 22px;
    font-weight: bold;
    line-height: 24px;
    letter-spacing: 0.44px;
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

  // TODO: re-enable when backend auth is ready
  // const router = useRouter();
  const pathname = usePathname();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const [authUser] = useState<AuthUser | null>(null);
  // const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  // const [fetchingAuthUser, setFetchingAuthUser] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  // const fetchedAuthUser = useRef(false);

  const toggleSidebar = useCallback(() => {
    setSidebarIsOpen((open) => !open);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeEnabled((enabled) => {
      const next = !enabled;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(DARK_MODE_KEY, String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setSidebarIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDarkModeEnabled(window.localStorage.getItem(DARK_MODE_KEY) === "true");
  }, []);

  useEffect(() => {
    document.title = `${appName} - ${titleText}`;
  }, [appName, titleText]);

  // TODO: re-enable auth gate when backend is ready
  // const fetchLoggedInUser = useCallback(async () => {
  //   if (fetchedAuthUser.current) return;
  //   fetchedAuthUser.current = true;
  //   setFetchingAuthUser(true);
  //
  //   try {
  //     const response = await xApiUser.me();
  //     if (isApiError(response)) {
  //       throw response;
  //     }
  //     const data = getApiData<AuthUser>(response);
  //     if (data) setAuthUser(data);
  //   } catch (error: unknown) {
  //     const err = error as { statusCode?: number };
  //     router.replace(URL.LOGIN_URL);
  //     if (err.statusCode === 401) {
  //       showErrorNotification({
  //         message: "Session expired. Please log in again.",
  //       });
  //       void AuthUtils.logout();
  //     }
  //   } finally {
  //     setFetchingAuthUser(false);
  //   }
  // }, [router]);
  //
  // useEffect(() => {
  //   void (async () => {
  //     const loggedIn = await AuthUtils.isLoggedIn();
  //     if (!loggedIn) {
  //       setFetchingAuthUser(false);
  //       router.replace(URL.LOGIN_URL);
  //       return;
  //     }
  //
  //     if (!authUser?.firstName) {
  //       await fetchLoggedInUser();
  //     } else {
  //       setFetchingAuthUser(false);
  //     }
  //   })();
  // }, [authUser?.firstName, fetchLoggedInUser, router]);

  const contextValue = useMemo(
    () => ({ authUser, darkModeEnabled, toggleDarkMode }),
    [authUser, darkModeEnabled, toggleDarkMode],
  );

  // TODO: re-enable when backend auth is ready
  // if (fetchingAuthUser && !authUser?.firstName) {
  //   return (
  //     <LoadingOverlay>
  //       <Loading />
  //     </LoadingOverlay>
  //   );
  // }

  return (
    <DashboardContext.Provider value={contextValue}>
      <DashboardLayoutElement>
        <DashboardSidebar isOpen={sidebarIsOpen} toggleSidebar={toggleSidebar} />
        <div className="DashboardLayout__wrapper">
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
                <Flex direction="column" gap="1rem">
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
