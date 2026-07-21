"use client";

import { type FC } from "react";
import styled from "styled-components";
import { Button, ButtonClass, Flex, HamburgerMenu } from "@/app/components/ui";
import { useDashboardContext } from "./DashboardContext";
import { Icon } from "@iconify/react";

const DashboardSidebarHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 5rem;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.44px;
  color: ${(props) => props.theme.colors.text_06};
  padding: 8px 18px;
  background-color: ${(props) => props.theme.colors.ui_07};
  position: relative;

  .logo-container {
    .logo {
      width: 5rem;
      height: auto;
    }
  }

  .DashboardSidebarHeader__collapseButton {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &.isCollapsed {
    justify-content: center;
    padding: 8px;

    .logo-container {
      display: none;
    }

    .DashboardSidebarHeader__collapseButton {
      position: static;
      transform: none;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    width: 100%;
    height: 4.5rem;
    padding: 8px 32px;

    .logo-container {
      .logo {
        width: 4rem;
        height: auto;
      }
    }

    .DashboardSidebarHeader__collapseButton {
      display: none;
    }

    &.isCollapsed {
      justify-content: space-between;
      padding: 8px 32px;

      .logo-container {
        display: block;
      }
    }
  }

  &:not(.showOnDesktop) {
    display: none;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      display: flex;
    }
  }
`;

type DashboardSidebarHeaderProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  showOnDesktop?: boolean;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
};

export const DashboardSidebarHeader: FC<DashboardSidebarHeaderProps> = ({
  isOpen,
  toggleSidebar,
  showOnDesktop = false,
  isCollapsed = false,
  toggleCollapse,
}) => {
  const { darkModeEnabled, isDesktop } = useDashboardContext();
  const showCollapseToggle = showOnDesktop && isDesktop;
  const showMobileMenuToggle = !showOnDesktop || !isDesktop;
  const collapsed = showCollapseToggle && isCollapsed;

  return (
    <DashboardSidebarHeaderContainer
      className={`DashboardSidebarHeader${showOnDesktop ? " showOnDesktop" : ""}${collapsed ? " isCollapsed" : ""
        }`}
    >
      <div className="logo-container">
        <img
          src={
            darkModeEnabled
              ? "/kairo-assets/kairo-logo-white.svg"
              : "/kairo-assets/kairo-logo.svg"
          }
          alt="kairo-logo"
          className="logo"
        />
      </div>

      {showCollapseToggle && (
        <Button
          type="button"
          classes={[ButtonClass.ICON_ONLY]}
          className="DashboardSidebarHeader__collapseButton"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <Icon
            icon="fluent:window-column-one-fourth-left-20-regular"
            width={24}
            height={24}
          />
        </Button>
      )}

      {showMobileMenuToggle && (
        <Flex align="center" gap="1.5rem">
          <HamburgerMenu isOpen={isOpen} onClick={toggleSidebar} />
        </Flex>
      )}
    </DashboardSidebarHeaderContainer>
  );
};

export default DashboardSidebarHeader;
