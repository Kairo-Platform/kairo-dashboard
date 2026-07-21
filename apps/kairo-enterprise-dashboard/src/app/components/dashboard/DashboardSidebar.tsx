"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { DashboardSidebarHeader } from "./DashboardSidebarHeader";
import { URL } from "@/lib/constants/URL";
import { AuthUtils } from "@/lib/auth";

const DashboardSidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  max-width: 15rem;
  height: 100vh;
  height: 100svh;
  background: ${(props) => props.theme.colors.white};
  border-right: 1px solid ${(props) => props.theme.colors.dividerColor};
  z-index: 3;
  padding-inline: 1rem;
  transition: max-width 0.25s ease, padding-inline 0.25s ease;

  &.isCollapsed {
    max-width: 4.5rem;
    padding-inline: 0.5rem;

    .DashboardSidebar__nav {
      ul {
        li {
          & summary,
          & > .DashboardSidebar__nav__link {
            justify-content: center;
            padding: 0.5rem;
            gap: 0;

            & > span:first-child {
              gap: 0;
              justify-content: center;
            }
          }

          .DashboardSidebar__navLabel {
            display: none;
          }

          .ArrowDropDownIcon {
            display: none;
          }

          .DashboardSideBar__subLink_ul {
            display: none;
          }
        }
      }

      .DashboardSidebar__admin_navLinks .title {
        display: none;
      }
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    display: none;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    padding-inline: 0;

    &.isOpen {
      display: initial;
    }

    &.isCollapsed {
      max-width: 100%;
      padding-inline: 0;
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
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
            color: ${(props) => props.theme.colors.text_08};
            font-weight: semibold;

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
        }
      }
    }

    .DashboardSidebar__admin_navLinks {
      margin-block: 2rem;

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
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
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
  isCollapsed = false,
  toggleCollapse,
}) => {
  const pathname = usePathname();

  const mapSidebarNav = (nav: NavItem, index: number) => {
    const { subLinks = [], show = true } = nav || {};
    if (!show) return null;
    const isActiveNav =
      Boolean(pathname?.startsWith(nav.url)) ||
      subLinks.some((subnav) => pathname?.startsWith(subnav.url));

    if (subLinks.length && !isCollapsed) {
      return (
        <li key={index} className={isActiveNav ? "isActiveNav" : undefined}>
          <details open={isActiveNav}>
            <summary>
              <span>
                {nav.icon}
                <span className="DashboardSidebar__navLabel">{nav.text}</span>
              </span>
              <Icon
                icon="iconamoon:arrow-down-2"
                className="ArrowDropDownIcon"
                style={{ marginRight: -8 }}
              />
            </summary>

            <ul className="DashboardSideBar__subLink_ul">
              {subLinks.map((subnav) => {
                const { show: showSub = true } = subnav || {};
                if (!showSub) return null;
                const isActiveSubNav = Boolean(pathname?.startsWith(subnav.url));
                return (
                  <li
                    key={subnav.text}
                    className={isActiveSubNav ? "isActiveSubNav" : undefined}
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
      <li
        key={index}
        className={isActiveNav ? "isActiveNav" : undefined}
        onClick={nav.onClick}
      >
        <Link
          href={nav.url}
          className="DashboardSidebar__nav__link"
          title={isCollapsed ? nav.text : undefined}
          aria-label={isCollapsed ? nav.text : undefined}
        >
          <span>
            {nav.icon}
            <span className="DashboardSidebar__navLabel">{nav.text}</span>
          </span>
        </Link>
      </li>
    );
  };

  const menu: NavItem[] = [
    {
      text: "Dashboard",
      url: URL.DASHBOARD_URL,
      icon: (
        <Icon icon="hugeicons:dashboard-square-02" width={16} height={16} />
      ),
    },
    {
      text: "Agents",
      url: URL.AGENTS_URL,
      icon: <Icon icon="ri:ai-agent-line" width={16} height={16} />,
    },
    {
      text: "Users",
      url: URL.USERS_URL,
      icon: <Icon icon="ph:users" width={16} height={16} />,
    },
    {
      text: "Staff",
      url: URL.STAFF_URL,
      icon: <Icon icon="ph:users-three" width={16} height={16} />,
    },
    {
      text: "Logout",
      url: URL.LOGIN_URL,
      icon: (
        <Icon
          icon="material-symbols:logout-rounded"
          width={16}
          height={16}
        />
      ),
      onClick: () => {
        void AuthUtils.logout();
      },
      adminGroup: true,
    },
  ];

  const primaryMenu = menu.filter((item) => !item.adminGroup);
  const adminMenu = menu.filter((item) => item.adminGroup);

  return (
    <DashboardSidebarContainer
      className={[isOpen ? "isOpen" : "", isCollapsed ? "isCollapsed" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <DashboardSidebarHeader
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        showOnDesktop
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      <nav className="DashboardSidebar__nav">
        <ul>{primaryMenu.map(mapSidebarNav)}</ul>

        {adminMenu.length > 0 && (
          <div className="DashboardSidebar__admin_navLinks">
            <ul>{adminMenu.map(mapSidebarNav)}</ul>
          </div>
        )}
      </nav>
    </DashboardSidebarContainer>
  );
};

export default DashboardSidebar;
