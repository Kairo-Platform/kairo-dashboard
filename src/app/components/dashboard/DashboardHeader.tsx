"use client";

import { type FC, useMemo } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { DashboardSidebarHeader } from "@/app/components/dashboard";
import { NotificationBell } from "@/app/components/notifications";
import { InitialsAvatar, Flex, ActionMenu } from "@/app/components/ui";
import AuthUtils from "@/app/lib/utils/AuthUtils";
import { URL } from "@/app/lib/constants";
import { auth, toggleDarkMode } from "@/app/store/auth";
import { RiArrowDownSLine } from "@remixicon/react";
import humanize from "underscore.string/humanize";
import { USER_TYPE } from "@/app/lib/shared-constants";
import { useEntity } from "simpler-state";

const DashboardHeaderContainer = styled.header`
  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    width: 100%;
  }

  .DashboardSidebar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: max-content;
    height: 5rem;
    padding: 0.5rem 3rem;
    z-index: 1;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      padding: 1rem 2rem;
      width: 100%;
    }

    .DashboardHeader__user {
      display: block;
      max-width: 15rem;
      // border-radius: 3px;

      .DashboardHeader__user_info_flex,
      .DashboardHeader__DropdownArrow {
        display: inline-flex;
        align-items: center;
        padding: 8px 10px;
        background-color: ${(props) => props.theme.colors.gray_02};
        transition: all 0.3s ease-out;
        /* explicit height to guarantee identical sizing */
        height: 44px;
      }

      .DashboardHeader__user_info_flex {
        border-radius: 4rem 4px 4px 4rem;
      }

      .DashboardHeader__DropdownArrow {
        border-radius: 4px 4rem 4rem 4px;
        justify-content: center;
      }

      :hover,
      :focus {
        .DashboardHeader__user_info_flex,
        .DashboardHeader__DropdownArrow {
          background-color: ${(props) => props.theme.colors.gray_03};
        }
      }
    }

    .DashboardHeader__user-role-wrapper {
      max-width: 8rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5px;
      text-align: left;
    }

    .DashboardHeader__user--text {
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      line-height: 19px;
      color: ${(props) => props.theme.colors.text_01};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .DashboardHeader__user--role {
      color: ${(props) => props.theme.colors.text_04};
      font-size: 10px;
      // background-color: ${(props) => props.theme.colors.tabListBorder};
      border-radius: 2px;
      // padding: 0 8px;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      display: none;

      .DashboardHeader__content {
        margin-left: 0;
        padding: 30px;
        width: 100%;
      }
    }
  }
`;

type DashboardHeaderProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  forEntity?: boolean;
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  isOpen,
  toggleSidebar,
  forEntity = false,
}) => {
  const router = useRouter();
  const { authUser, darkModeEnabled } = useEntity(auth);

  const isProduction = process.env.NODE_ENV === "production";

  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isMerchantRoute = path.includes("merchant");
  const userType =
    authUser?.userType?.toUpperCase() ||
    authUser?.type?.toUpperCase() ||
    AuthUtils.getUserType();

  const gotoAccountSettingsPage = () => {
    if (userType === USER_TYPE.MERCHANT && isMerchantRoute) {
      void router.push(URL.MERCHANT_PROFILE_AND_SECURITY_URL);
      return;
    }
    if (userType === USER_TYPE.AGENCY && !isMerchantRoute) {
      void router.push(URL.AGENCY_PROFILE_AND_SECURITY_URL);
      return;
    }
    if (userType === USER_TYPE.SYS_ADMIN || userType === USER_TYPE.STAFF) {
      void router.push(URL.PROFILE_AND_SECURITY_SETTINGS_URL);
      return;
    }
  };

  const gotoLoginPage = () => {
    if (userType === USER_TYPE.MERCHANT && isMerchantRoute) {
      void router.push(URL.MERCHANT_LOGIN_URL);
      return;
    }
    if (userType === USER_TYPE.AGENCY && !isMerchantRoute) {
      void router.push(URL.AGENCY_LOGIN_URL);
      return;
    }
    if (userType === USER_TYPE.SYS_ADMIN) {
      void router.push(URL.LOGIN_URL);
      return;
    }
    if (userType === USER_TYPE.STAFF) {
      void router.push(URL.ADMIN_STAFF_LOGIN_URL);
      return;
    }
    if (!userType && !isMerchantRoute) {
      void router.push(URL.LOGIN_URL);
      return;
    }
    if (!userType && isMerchantRoute) {
      void router.push(URL.MERCHANT_LOGIN_URL);
      return;
    }
    void router.push(URL.LOGIN_URL);
  };
  const actions = useMemo(() => {
    return [
      {
        title: "My Account",
        onClick: gotoAccountSettingsPage,
      },
      {
        title: darkModeEnabled ? "Light Mode" : "Dark Mode",
        onClick: toggleDarkMode,
        withDivider: true,
      },
      {
        title: "Logout",
        onClick: () => AuthUtils.logout(gotoLoginPage),
      },
    ];
  }, [darkModeEnabled, gotoAccountSettingsPage, toggleDarkMode]);

  const firstName = authUser?.firstName || "";
  const lastName = authUser?.lastName || "";
  const authUserRoleName =
    authUser?.role?.name || humanize(authUser?.type) || "";
  const avatar = authUser?.photo?.url || "";

  return (
    <DashboardHeaderContainer>
      <DashboardSidebarHeader
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        showOnDesktop={false}
        showNotificationBell
        forEntity={forEntity}
      />

      <div className="DashboardSidebar__header">
        <Flex justify="flex-end" align="center" gap="2rem" flexGrow={1}>
          {/* {!isProduction && <NotificationBell forEntity={forEntity} />} */}
          <ActionMenu
            padding={4}
            positions={["bottom", "left"]}
            actions={actions}
          >
            <div className="DashboardHeader__user">
              <Flex align="center" gap="7px">
                <Flex
                  justify="flex-end"
                  gap="10px"
                  align="center"
                  className="DashboardHeader__user_info_flex"
                >
                  <InitialsAvatar
                    name={`${firstName} ${lastName}`}
                    avatarUrl={avatar}
                  />
                  <div className="DashboardHeader__user-role-wrapper">
                    <p className="DashboardHeader__user--text DashboardHeader__user--name">
                      {`${firstName} ${lastName}`}
                    </p>
                    <p className="DashboardHeader__user--text DashboardHeader__user--role">
                      {authUserRoleName}
                    </p>
                  </div>
                </Flex>
                <span className="DashboardHeader__DropdownArrow">
                  <RiArrowDownSLine color="#949494" size={28} />
                </span>
              </Flex>
            </div>
          </ActionMenu>
        </Flex>
      </div>
    </DashboardHeaderContainer>
  );
};

export default DashboardHeader;
