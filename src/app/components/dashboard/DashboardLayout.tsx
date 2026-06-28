"use client";

import { FC, ReactNode, useEffect, useRef } from "react";
import Head from "next/head";
import { Icon } from "@iconify/react";
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components";
import { DashboardHeader, DashboardSidebar } from "@/app/components/dashboard";
import { dashboard, toggleSidebar, closeSidebar } from "@/app/store/dashboard";
import {
  Breadcrumbs,
  Flex,
  Loading,
  LoadingOverlay,
} from "@/app/components/ui";
import { auth, setAuthUser, setDarkModeEnabled } from "@/app/store/auth";
import AuthUtils, { getDarkMode } from "@/app/lib/utils/AuthUtils";
import { URL } from "@/app/lib/constants";
import { useEntity } from "simpler-state";
import { fetchAuthUser } from "@/app/store/auth";
import { USER_STATUS, USER_TYPE } from "@/app/lib/shared-constants";
import { showErrorNotification } from "@/app/lib/utils/notifications/showErrorNotification";

const DashboardLayoutElement = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  // background-color: ${(props) => props.theme.colors.white};

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

  .modal-lower {
    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 1.5rem;
    margin: -1.5rem;
    background-color: ${(props) => props.theme.colors.offWhite};
    border-top: 1px solid ${(props) => props.theme.colors.dividerColor};
  }
`;

type PageTitleObject = {
  title: ReactNode;
  isEditable?: boolean;
  onClick?: () => void;
  onClicked?: () => void;
};

type DashboardLayoutProps = {
  pageTitle: string | PageTitleObject;
  subTitle?: string;
  breadcrumbs?: any[];
  children?: ReactNode;
  appendElementToHeading?: ReactNode | null;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  pageTitle,
  subTitle,
  breadcrumbs = [],
  children,
  appendElementToHeading = null,
}) => {
  const appName = process.env.APP_NAME ?? "Kairo Dashboard";
  const headPageTitle = `${appName} - ${pageTitle}`;

  const router = useRouter();
  const pathname = usePathname();
  const { sidebarIsOpen } = useEntity(dashboard);
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  const { fetchingAuthUser, authUser, isAdminStaff } = useEntity(auth);
  const containsFirstName = Boolean(authUser && "firstName" in authUser);

  const fetchedAuthUser = useRef(false);
  const fetchLoggedInUser = () => {
    if (fetchedAuthUser.current) return Promise.resolve(null);
    fetchedAuthUser.current = true;

    return fetchAuthUser()
      .then((response) => {
        if (response?.data?.type === USER_TYPE.MERCHANT) {
          router.replace(URL.MERCHANT_DASHBOARD_URL);
        }
        if (response?.data?.type === USER_TYPE.AGENCY) {
          router.replace(URL.AGENCY_DASHBOARD_URL);
        }
        if (response?.data?.type === USER_TYPE.BUSINESS_AGGREGATOR) {
          router.replace(URL.BUSINESS_AGGREGATOR_DASHBOARD_URL);
        }
        setAuthUser(response?.data);
        return response;
      })
      .catch((error) => {
        AuthUtils.getUserType() === USER_TYPE.STAFF || isAdminStaff
          ? router.push(URL.ADMIN_STAFF_LOGIN_URL)
          : router.replace(URL.LOGIN_URL);
        if (error.statusCode === 401) {
          showErrorNotification({
            message: "Session expired. Please log in again.",
          });
          AuthUtils.logout();
        }
        throw error;
      });
  };

  // useEffect(() => {
  //   if (!AuthUtils.isLoggedIn() && authUser?.status === USER_STATUS.SUSPENDED) {
  //     router.push(URL.LOGIN_URL);
  //     return;
  //   }

  //   if (!containsFirstName) {
  //     fetchLoggedInUser();
  //   }
  // }, [containsFirstName, authUser, AuthUtils.isLoggedIn()]);

  // useEffect(() => {
  //   setDarkModeEnabled(getDarkMode());
  // }, []);

  // useEffect(() => {
  //   if (
  //     !fetchingAuthUser &&
  //     authUser &&
  //     authUser?.status !== USER_STATUS.SUSPENDED
  //   ) {
  //     setAuthUser(authUser);
  //   }
  // }, [authUser, fetchingAuthUser]);

  // if (fetchingAuthUser && !containsFirstName) {
  //   return (
  //     <LoadingOverlay>
  //       <Loading>loading ...</Loading>
  //     </LoadingOverlay>
  //   );
  // }

  return (
    <DashboardLayoutElement>
      <Head>
        <title>{headPageTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
              <Flex direction="column" gap={"1rem"}>
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
                {subTitle && <p>{subTitle}</p>}
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
  );
};

export default DashboardLayout;
