"use client";

import clsx from "clsx";
import { Icon } from "@iconify/react";
import styled, { useTheme } from "styled-components";

const HamburgerMenuContainer = styled.div`
  display: none;

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    display: block;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    min-width: 32px;
    background-color: ${(props) => props.theme.colors.transparent};
    border: none;
    position: relative;
    color: ${(props) => props.theme.colors.primaryColor};

    &:hover {
      cursor: pointer;
    }
  }

  &.always-visible {
    display: block;
  }
`;

type HamburgerMenuProps = {
  onClick?: () => void;
  isOpen?: boolean;
  alwaysVisible?: boolean;
};

export const HamburgerMenu = ({
  onClick,
  isOpen = false,
  alwaysVisible = false,
}: HamburgerMenuProps) => {
  const theme = useTheme();
  const showCloseIcon = isOpen;
  const iconColor = theme.colors.primaryColor;

  return (
    <HamburgerMenuContainer
      className={clsx("hamburger-menu", { "always-visible": alwaysVisible })}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={showCloseIcon}
        aria-label={showCloseIcon ? "Close menu" : "Open menu"}
      >
        {showCloseIcon ? (
          <Icon
            key="close"
            icon="material-symbols:close-rounded"
            width={28}
            height={28}
            color={iconColor}
            aria-hidden
          />
        ) : (
          <Icon
            key="menu"
            icon="material-symbols:menu-rounded"
            width={32}
            height={32}
            color={iconColor}
            aria-hidden
          />
        )}
      </button>
    </HamburgerMenuContainer>
  );
};

export default HamburgerMenu;
