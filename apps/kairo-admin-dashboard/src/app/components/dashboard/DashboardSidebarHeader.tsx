"use client";

import { type FC } from "react";
import styled from "styled-components";
import { Flex, HamburgerMenu } from "@/app/components/ui";
import clsx from "clsx";
import { auth } from "@/app/store/auth";
import { useEntity } from "simpler-state";
import { NotificationBell } from "@/app/components/notifications";

const DashboardSidebarHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 5.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.44px;
  color: ${(props) => props.theme.colors.text_06};
  padding: 8px 18px;
  background-color: ${(props) => props.theme.colors.white};
  // border-bottom: 1px solid #eaeaea;

  .logo-container {
    .logo {
      width: 10rem;
      height: auto;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    width: 100%;
    height: 4.5rem;
    padding: 8px 32px;
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
  showNotificationBell?: boolean;
  forEntity?: boolean;
};

export const DashboardSidebarHeader: FC<DashboardSidebarHeaderProps> = ({
  isOpen,
  toggleSidebar,
  showOnDesktop = false,
  showNotificationBell = false,
  forEntity = false,
}) => {
  // const pathname = usePathname() ?? "";
  // const isMerchantPath = pathname.startsWith("/merchant");
  // ToDo: change name based on entity
  // const showName = isMerchantPath;

  const { darkModeEnabled } = useEntity(auth);
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <DashboardSidebarHeaderContainer
      className={clsx("DashboardSidebarHeader", { showOnDesktop })}
    >
      <div className="logo-container">
        {
          <img
            src={
              darkModeEnabled
                ? "/kairo-logo-white.svg"
                : "/kairo-logo-black.svg"
            }
            alt="kairo-logo"
            className="logo"
          />
        }
      </div>
      <Flex align="center" gap="1.5rem">
        {/* {showNotificationBell && !isProduction && (
          <NotificationBell forEntity={forEntity} />
        )} */}
        <HamburgerMenu isOpen={isOpen} onClick={toggleSidebar} />
      </Flex>
    </DashboardSidebarHeaderContainer>
  );
};

export default DashboardSidebarHeader;
