"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { DashboardSidebarHeader } from "@/app/components/dashboard";
import clsx from "clsx";
import { URL } from "@/app/lib/constants";
import { AuthUtils } from "@/app/lib/utils";
import {
  RiSettings3Line,
} from "@remixicon/react";
import { Icon } from "@iconify/react";
import { useEntity } from "simpler-state";
import { auth } from "@/app/store/auth";
import { USER_TYPE } from "@/app/lib/shared-constants";

const DashboardSidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  /* transition: all 0.3s ease-in; */
  width: 100%;
  max-width: 15rem;
  height: 100vh;
  height: 100svh;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0px 15px 15px 0px;
  z-index: 3;
  padding-inline: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    display: none;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    padding-inline: 0;

    &.isOpen {
      display: initial;
    }

    .DashboardSidebar__nav {
      padding-inline: 1.7rem;
    }
  }

  .DashboardSidebar__nav {
    position: relative;
    transition: all 0.5s ease-out;
    overflow-y: overlay;
    height: calc(100vh - 5.5rem);
    height: calc(100svh - 5.5rem);

    /* custom scrollbar-color */
    & ::-webkit-scrollbar {
      width: 5px;
    }
    & ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    & ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${(props) => props.theme.colors.primaryColor};
    }

    ul {
      margin: 0;
      padding: 0;
      gap: 4px;
      display: flex;
      flex-direction: column;

      li {
        list-style: none;

        & summary,
        & > .DashboardSidebar__nav__link {
          display: flex;
          gap: 16px;
          width: 100%;
          height: 2.5rem;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px 8px 16px;
          border-radius: 8px;
          // border-bottom: 1px solid #eaeaea;
          transition: all 0.5s ease-out;
          font-weight: bold;

          &:hover {
            background-color: ${(props) => props.theme.colors.primaryColor}10;
          }

          & > span:first-child {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          svg {
            min-width: 20px;
            width: 20px;
            height: 20px;
          }

          span {
            color: ${(props) => props.theme.colors.text_05};
            font-size: 14px;
            line-height: 24px;
            letter-spacing: 0.44px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &.isActiveNav,
        &:hover {
          & summary,
          & > .DashboardSidebar__nav__link {
            background-color: ${(props) => props.theme.colors.primaryColor}10;
            // border-color: ${(props) => props.theme.colors.primaryColor};
            color: ${(props) => props.theme.colors.black};
            font-weight: bold;

            svg {
              color: ${(props) => props.theme.colors.primaryColor};
            }

            span {
              color: inherit;
            }
          }
        }

        .DashboardSideBar__subLink_ul {
          margin-top: 4px;
        }

        & > details {
          margin: 0;
          padding: 0;

          summary {
            list-style: none;
            cursor: pointer;

            .ArrowDropDownIcon {
              transition: transform 0.3s ease;
              color: ${(props) => props.theme.colors.text_04};
            }
          }

          &[open] summary .ArrowDropDownIcon {
            transform: rotate(180deg);
            color: ${(props) => props.theme.colors.text_01};
          }

          li {
            .DashboardSidebar__subnav__link {
              display: flex;
              gap: 16px;
              width: 100%;
              height: 2rem;
              line-height: 14px;
              align-items: center;
              padding: 8px 24px 8px 30px;
              font-size: small;
              border-radius: 8px;
              font-weight: 500;
              color: ${(props) => props.theme.colors.text_05};

              svg {
                min-width: 20px;
                width: 20px;
                height: 20px;
              }
            }

            &:hover {
              background-color: ${(props) => props.theme.colors.gray_02};
              border-radius: 8px;
            }

            &.isActiveSubNav,
            &:hover {
              .DashboardSidebar__subnav__link {
                color: ${(props) => props.theme.colors.black};
              }
              svg {
                color: ${(props) => props.theme.colors.primaryColor};
              }
            }
          }

          // &[open] {
          //   ul {
          //     border-bottom: 1px solid #eaeaea;
          //   }
          // }
        }
      }
    }

    .DashboardSidebar__admin_navLinks {
      margin-top: 1.5rem;

      .title {
        display: block;
        padding-left: 16px;
        font-size: 0.75rem;
        font-weight: bold;
        color: ${(props) => props.theme.colors.text_01};
        margin-bottom: 0.5rem;
      }
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      height: calc(100vh - 4.5rem);
      height: calc(100svh - 4.5rem);
    }
  }
`;

type DashboardSidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

type NavItem = {
  text: string;
  url: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  subLinks?: NavItem[];
  show?: boolean;
  adminGroup?: boolean;
};

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const pathname = usePathname();
  const { authUser } = useEntity(auth);
  const userType =
    authUser?.userType?.toUpperCase() || authUser?.type?.toUpperCase();

  const mapSidebarNav = (nav: NavItem, index: number) => {
    const { subLinks = [], show = true } = nav || {};
    if (!show) return null;
    const isActiveNav =
      pathname?.startsWith(nav.url) ||
      subLinks.some((subnav) => pathname?.startsWith(subnav.url));

    if (subLinks.length) {
      return (
        <li key={index} className={clsx({ isActiveNav })}>
          <details open={isActiveNav}>
            <summary>
              <span>
                {nav.icon}
                <span>{nav.text}</span>
              </span>
              <Icon
                icon="iconamoon:arrow-down-2"
                className="ArrowDropDownIcon"
                style={{ marginRight: -8 }}
              />
            </summary>

            <ul className="DashboardSideBar__subLink_ul">
              {subLinks.map((subnav) => {
                const { show = true } = subnav || {};
                if (!show) return null;
                const isActiveSubNav = pathname?.startsWith(subnav.url);
                return (
                  <li
                    key={subnav.text}
                    className={clsx({ isActiveSubNav })}
                    onClick={subnav.onClick}
                  >
                    <Link
                      href={subnav.url}
                      className="DashboardSidebar__subnav__link"
                    >
                      {subnav.icon}
                      <span>{subnav.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={index} className={clsx({ isActiveNav })} onClick={nav.onClick}>
        <Link href={nav.url} className="DashboardSidebar__nav__link">
          <span>
            {nav.icon}
            <span>{nav.text}</span>
          </span>
        </Link>
      </li>
    );
  };

  const dashboardSidebarMenu = (): NavItem[] => {
    const sidebarData: NavItem[] = [
      {
        text: "Dashboard",
        url: URL.DASHBOARD_URL,
        icon: <Icon icon="hugeicons:dashboard-square-02" width={16} height={16} />,
      },
      {
        text: "Agents",
        url: URL.ADMIN_AI_AGENTS_URL,
        icon: <Icon icon="ri:ai-agent-line" width={16} height={16} />,
      },


      {
        text: "Settings",
        url: URL.SETTINGS_URL,
        icon: <RiSettings3Line />,
        adminGroup: true,
      },

      {
        text: "Logout",
        url:
          userType === USER_TYPE.STAFF
            ? URL.ADMIN_STAFF_LOGIN_URL
            : URL.LOGIN_URL,
        icon: <Icon icon="material-symbols:logout-rounded" width={16} height={16} />,
        onClick: () => AuthUtils.logout(),
        adminGroup: true,
      },
    ];

    return sidebarData;
  };

  const menu = dashboardSidebarMenu();
  const primaryMenu = menu.filter((item) => !item.adminGroup);
  const adminMenu = menu.filter((item) => item.adminGroup);

  return (
    <DashboardSidebarContainer className={clsx({ isOpen })}>
      <DashboardSidebarHeader
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        showOnDesktop
      />

      <nav className="DashboardSidebar__nav">
        <ul>{primaryMenu.map(mapSidebarNav)}</ul>

        {adminMenu.length > 0 && (
          <div className="DashboardSidebar__admin_navLinks">
            <span className="title">Admin</span>
            <ul>{adminMenu.map(mapSidebarNav)}</ul>
          </div>
        )}
      </nav>
    </DashboardSidebarContainer>
  );
};

export default DashboardSidebar;
