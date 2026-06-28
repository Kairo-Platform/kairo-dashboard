"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";
import clsx from "clsx";
import closeIcon from "./icons/close.svg";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  padding: 1rem;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translateX(-50%);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.07);
    background-color: ${(props) => props.theme.colors.white};
    // border: 1px solid ${(props) => props.theme.colors.modalBorder};
    border-radius: 24px;
    animation-name: fadeIn;
    animation-duration: 0.3s;
    z-index: 4;
    max-height: calc(100dvh - 18%);
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    .modal {
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 2rem);
      max-height: calc(100vh - 3rem);
      max-height: calc(100svh - 3rem);
    }
  }

  .modal__overlay {
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

  .modal__header {
    width: 100%;
    display: none;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 1.5rem 0;
    & > div:first-child {
      flex-grow: 1;
    }
  }

  .showModalHeader {
    display: flex;
  }

  .modal__btn--close {
    appearance: none;
    outline: none;
    border: 0;
    background-color: transparent;
    width: 24px;
    height: 24px;
    border-radius: 24px;
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

  .modal__title {
    font-weight: bold;
    font-size: 24px;
    line-height: 25px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.colors.text_01};
  }

  .modal__subtitle {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.colors.text_02};
  }

  .modal__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: 0 1.5rem 1.5rem;
    overflow-y: auto;
  }

  .modal__body--with-footer {
    padding: 0 1.5rem;
  }

  .modal__footer {
    width: 100%;
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid ${(props) => props.theme.colors.gray_03};
  }

  .modal--large {
    max-width: ${(props) => props.theme.breakpoint.lg};
  }
  .modal--medium {
    max-width: 40rem;
  }
  .modal--small {
    max-width: 30rem;
  }

  .top-right {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

export const ModalSize = {
  FULL: "",
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
};

export type ModalProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  Heading?: React.ComponentType | null;
  children?: React.ReactNode;
  Footer?: React.ComponentType | null;
  onClose: () => void;
  showModalHeader?: boolean;
  size?: string;
  style?: React.CSSProperties;
  useDefaultTitleLayout?: boolean;
  useDefaultCloseButton?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  Heading = () => null,
  children,
  Footer = null,
  onClose,
  showModalHeader = true,
  size = ModalSize.MEDIUM,
  style,
  useDefaultTitleLayout = true,
  useDefaultCloseButton = true,
}) => {
  Heading = title
    ? () => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h4 className="modal__title">{title}</h4>
          {subtitle && <p className="modal__subtitle">{subtitle}</p>}
        </div>
      )
    : Heading;

  React.useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "overlay";
    };
  }, []);

  return (
    <ModalContainer>
      <div
        className={clsx("modal", {
          "modal--large": size === ModalSize.LARGE,
          "modal--medium": size === ModalSize.MEDIUM,
          "modal--small": size === ModalSize.SMALL,
        })}
        style={style}
      >
        {useDefaultTitleLayout ? (
          <header
            className={clsx("modal__header", {
              showModalHeader,
            })}
          >
            <div>{Heading && <Heading />}</div>
            {useDefaultCloseButton && (
              <button
                type="button"
                className="modal__btn--close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <Image alt="x" src={closeIcon} width={14} height={14} />
              </button>
            )}
          </header>
        ) : useDefaultCloseButton ? (
          <button
            type="button"
            className="modal__btn--close top-right"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Image alt="x" src={closeIcon} width={14} height={14} />
          </button>
        ) : null}
        <div
          className={clsx("modal__body", {
            "modal__body--with-footer": !!Footer,
          })}
        >
          {showModalHeader ? null : <br />}
          {children}
        </div>
        {Footer && (
          <footer className={clsx("modal__footer")}>
            <Footer />
          </footer>
        )}
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="modal__overlay"
        onClick={onClose}
        aria-label="Close modal"
      />
    </ModalContainer>
  );
};

export default Modal;
