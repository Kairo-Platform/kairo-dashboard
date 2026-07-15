"use client";

import { type FC, useMemo } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { DashboardSidebarHeader } from "./DashboardSidebarHeader";
import { InitialsAvatar, Flex, ActionMenu } from "@/app/components/ui";
import { AuthUtils } from "@/lib/auth";
import { URL } from "@/lib/constants/URL";
import { useDashboardContext, getAuthUserDisplayName } from "./DashboardContext";

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

      .DashboardHeader__user_info_flex,
      .DashboardHeader__DropdownArrow {
        display: inline-flex;
        align-items: center;
        padding: 8px 10px;
        background-color: ${(props) => props.theme.colors.gray_02};
        transition: all 0.3s ease-out;
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
      border-radius: 2px;
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

const humanize = (value?: string) => {
  if (!value) return "";
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

type DashboardHeaderProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const router = useRouter();
  const { authUser, darkModeEnabled, toggleDarkMode } = useDashboardContext();

  const gotoLoginPage = () => {
    void router.push(URL.LOGIN_URL);
  };

  const actions = useMemo(
    () => [
      {
        title: darkModeEnabled ? "Light Mode" : "Dark Mode",
        onClick: toggleDarkMode,
        withDivider: true,
      },
      {
        title: "Logout",
        onClick: () => {
          void AuthUtils.logout(gotoLoginPage);
        },
      },
    ],
    [darkModeEnabled, toggleDarkMode],
  );

  const displayName = getAuthUserDisplayName(authUser);
  const authUserRoleName =
    humanize(authUser?.role?.name) ||
    humanize(
      (Array.isArray(authUser?.organizations) &&
        authUser.organizations[0]?.role) ||
      authUser?.type ||
      authUser?.userType,
    ) ||
    "";
  const avatar = authUser?.photo?.url || "";

  return (
    <DashboardHeaderContainer>
      <DashboardSidebarHeader
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        showOnDesktop={false}
      />

      <div className="DashboardSidebar__header">
        <Flex justify="flex-end" align="center" gap="2rem" flexGrow={1}>
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
                    name={displayName}
                    avatarUrl={avatar}
                  />
                  <div className="DashboardHeader__user-role-wrapper">
                    <p className="DashboardHeader__user--text DashboardHeader__user--name">
                      {displayName}
                    </p>
                    <p className="DashboardHeader__user--text DashboardHeader__user--role">
                      {authUserRoleName}
                    </p>
                  </div>
                </Flex>
                <span className="DashboardHeader__DropdownArrow">
                  <Icon icon="ri:arrow-down-s-line" width={28} height={28} color="#949494" />
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
