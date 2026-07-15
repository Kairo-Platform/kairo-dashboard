"use client";

import { type FC } from "react";
import styled from "styled-components";
import { Flex, HamburgerMenu } from "@/app/components/ui";
import { useDashboardContext } from "./DashboardContext";

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
  background-color: ${(props) => props.theme.colors.white};

  .logo-container {
    .logo {
      width: 8rem;
      height: auto;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    width: 100%;
    height: 4.5rem;
    padding: 8px 32px;

    .logo-container {
      .logo {
        width: 7rem;
        height: auto;
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
};

export const DashboardSidebarHeader: FC<DashboardSidebarHeaderProps> = ({
  isOpen,
  toggleSidebar,
  showOnDesktop = false,
}) => {
  const { darkModeEnabled } = useDashboardContext();

  return (
    <DashboardSidebarHeaderContainer
      className={`DashboardSidebarHeader${showOnDesktop ? " showOnDesktop" : ""}`}
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
      <Flex align="center" gap="1.5rem">
        <HamburgerMenu isOpen={isOpen} onClick={toggleSidebar} />
      </Flex>
    </DashboardSidebarHeaderContainer>
  );
};

export default DashboardSidebarHeader;
