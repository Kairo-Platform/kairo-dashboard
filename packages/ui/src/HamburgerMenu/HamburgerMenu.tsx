"use client";

import clsx from "clsx";
import styled from "styled-components";
import closeIcon from "./icons/close.svg";
import menuIcon from "./icons/menu.svg";
import Image from "next/image";

const HamburgerMenuContainer = styled.div`
  display: none;

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    display: block;
  }

  button {
    display: flex;
    align-items: center;
    min-height: 32px;
    background-color: ${(props) => props.theme.colors.transparent};
    border: none;
    position: relative;

    img.menu-icon {
      filter: ${(props) => {
    const primary = props.theme.colors.primaryColor.toLowerCase();
    if (primary === "#ff6b1a") {
      return "brightness(0) saturate(100%) invert(48%) sepia(97%) saturate(2465%) hue-rotate(346deg) brightness(101%) contrast(101%)";
    }
    if (primary === "#0d65cc") {
      return "brightness(0) invert(33%) sepia(93%) saturate(1891%) hue-rotate(203deg) brightness(96%) contrast(92%)";
    }
    return "brightness(0) saturate(100%) invert(75%) sepia(58%) saturate(5269%) hue-rotate(165deg) brightness(87%) contrast(88%)";
  }};
    }

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
  isOpen,
  alwaysVisible = false,
}: HamburgerMenuProps) => {
  return (
    <HamburgerMenuContainer
      className={clsx("hamburger-menu", { "always-visible": alwaysVisible })}
    >
      <button type="button" onClick={onClick}>
        {isOpen === true ? (
          <Image
            className="menu-icon"
            src={closeIcon}
            width={28}
            height={28}
            alt="X"
          />
        ) : (
          <Image
            className="menu-icon"
            src={menuIcon}
            width={32}
            height={32}
            alt="open"
          />
        )}
      </button>
    </HamburgerMenuContainer>
  );
};

export default HamburgerMenu;
