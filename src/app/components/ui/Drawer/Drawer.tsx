"use client";

import styled from "styled-components";
import clsx from "clsx";
import closeIcon from "./icons/close.svg";
import { useEffect } from "react";
import type { ReactNode, CSSProperties, ComponentType } from "react";
import Image from "next/image";

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  padding: 1rem;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .drawer {
    width: 100%;
    height: 100vh;
    height: 100svh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    top: 0;
    right: 0;
    position: fixed;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.07);
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.drawerBorder};
    border-radius: 6px;
    animation-name: fadeIn;
    animation-duration: 0.3s;
    z-index: 2;
  }

  .drawer__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.35;
    cursor: pointer;
    appearance: none;
    outline: none;
    border: 0;
    z-index: -1;
    /* &:focus {
      opacity: 0.45;
    } */
  }

  .drawer__header {
    width: 100%;
    display: none;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.colors.gray_02};
    gap: 1rem;
    & > div:first-child {
      flex-grow: 1;
    }
  }

  .drawer__header--no-border {
    border-bottom: none;
  }

  .showDrawerHeader {
    display: flex;
    padding-inline: 1.5rem;
    padding-block: 1rem;
  }

  .drawer__btn--close {
    appearance: none;
    outline: none;
    border: 0;
    background-color: transparent;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:focus,
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .drawer__title {
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.colors.text_01};
  }

  .drawer__body {
    height: 100%;
    padding-inline: 1.5rem;
    overflow-y: overlay;
  }

  .drawer__footer {
    width: 100%;
    padding-inline: 1.5rem;
    padding-bottom: 1rem;
    padding-top: 0;
  }

  .drawer--large {
    max-width: ${(props) => props.theme.breakpoint.lg};
  }
  .drawer--medium {
    max-width: 40rem;
  }
  .drawer--small {
    max-width: ${(props) => props.theme.breakpoint.sm};
  }
`;

export const DrawerSize = {
  FULL: "",
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
};

export interface DrawerProps {
  title?: string | ReactNode;
  subtitle?: string;
  Heading?: ComponentType | null;
  children?: ReactNode;
  Footer?: ComponentType | null;
  onClose?: () => void;
  showDrawerHeader?: boolean;
  showHeaderBottomBorder?: boolean;
  size?: string;
  style?: CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
  title,
  subtitle,
  Heading,
  children,
  Footer = null,
  onClose,
  showDrawerHeader = true,
  showHeaderBottomBorder = true,
  size = DrawerSize.SMALL,
  style,
}) => {
  Heading = title
    ? () => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {typeof title === "string" ? (
            <h4 className="drawer__title">{title}</h4>
          ) : (
            title
          )}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )
    : Heading;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "overlay";
    };
  }, []);

  return (
    <DrawerContainer>
      <div
        className={clsx("drawer", {
          "drawer--large": size === DrawerSize.LARGE,
          "drawer--medium": size === DrawerSize.MEDIUM,
          "drawer--small": size === DrawerSize.SMALL,
        })}
        style={style}
      >
        <header
          className={clsx("drawer__header", {
            showDrawerHeader,
            "drawer__header--no-border": !showHeaderBottomBorder,
          })}
        >
          <div>{Heading && <Heading />}</div>
          <button
            type="button"
            className="drawer__btn--close"
            onClick={onClose}
            aria-label="close"
          >
            <Image alt="x" src={closeIcon} width={14} height={14} />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {Footer && (
          <footer className={clsx("drawer__footer")}>
            <Footer />
          </footer>
        )}
      </div>
      <button
        title="close drawer"
        type="button"
        tabIndex={-1}
        className="drawer__overlay"
        onClick={onClose}
      />
    </DrawerContainer>
  );
};

export default Drawer;
