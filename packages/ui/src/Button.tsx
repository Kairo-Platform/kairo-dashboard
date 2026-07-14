"use client";

import React from "react";
import styled from "styled-components";
import clsx from "clsx";

const ButtonContainer = styled.div`
  // flex: 1;
  white-space: nowrap;

  .btn {
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-out;
    font-size: 15px;
    font-weight: 500;
    border-radius: 4rem;
    height: 48px;
    padding: 0 14px;
    line-height: 24px;
  }

  .btn--w-140 {
    width: 140px;
  }

  .btn--lg {
    padding: 0 20px;
  }

  .btn--sm {
    padding: 0 10px;
    height: 26px;
  }

  .btn--full {
    width: 100%;
  }

  .btn--padding-0 {
    padding: 0;
  }

  .btn--padding-20 {
    padding: 0 20px;
  }

  .btn--padding-30 {
    padding: 0 30px;
  }

  .btn--quick-action-button {
    background-color: white;
    border: 1px solid white;
    color: ${(props) => props.theme.colors.primaryColor};
    border-radius: 0.5rem;
    padding: 0.75rem 0.5rem;
    cursor: pointer;
    text-align: center;
    transition: 0.5s;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-width: 5rem;
    font-size: 0.75rem;
  }

  .btn--quick-action-button:hover {
    background-color: ${(props) => props.theme.colors.primaryColor}10;
    border: 1px solid ${(props) => props.theme.colors.primaryColor};
  }

  .btn--gradient {
    background: linear-gradient(
      90deg,
      ${(props) => props.theme.colors.buttonGradientFrom} 0%,
      ${(props) => props.theme.colors.buttonGradientTo} 100%
    );
    border: ${(props) => props.theme.colors.primaryColor};
    color: ${(props) => props.theme.colors.white};
    &:focus,
    &:hover {
      background: linear-gradient(
        90deg,
        ${(props) => props.theme.colors.btnHover} 0%,
        ${(props) => props.theme.colors.btnHover} 100%
      );
    }
  }

  .btn--solid {
    background-color: ${(props) => props.theme.colors.primaryColor};
    border: ${(props) => props.theme.colors.primaryColor};
    color: ${(props) => props.theme.colors.white};
    &:focus,
    &:hover {
      background-color: ${(props) => props.theme.colors.btnHover};
    }
  }

  .btn--solid-secondary {
    background-color: ${(props) => props.theme.colors.secondaryColor};
    border: ${(props: any) => props.theme.colors.secondaryColor};
    color: ${(props) => props.theme.colors.white};
    &:focus,
    &:hover {
      box-shadow:
        rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
        rgba(0, 0, 0, 0.14) 0px 5px 8px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 14px 0px;
    }
  }

  .btn--solid-grey {
    background-color: ${(props) => props.theme.colors.gray_01};
    // color: ${(props) => props.theme.colors.text_02};
    // font-weight: bold;
    &:focus,
    &:hover {
      color: ${(props) => props.theme.colors.text_02};
      background-color: ${(props) => props.theme.colors.gray_02};
    }
  }

  .btn--solid-red {
    background-color: ${(props) => props.theme.colors.red};
    color: ${(props) => props.theme.colors.white};
    font-weight: bold;
    border: 1px solid ${(props) => props.theme.colors.red};

    &:focus,
    &:hover {
      border-color: ${(props) => props.theme.colors.red_04};
      background-color: ${(props) => props.theme.colors.red_04};
    }
  }

  .btn--solid-yellow {
    background-color: ${(props) => props.theme.colors.yellow};
    color: ${(props) => props.theme.colors.white};
    font-weight: bold;
    border: 1px solid ${(props) => props.theme.colors.yellow};

    &:focus,
    &:hover {
      border-color: ${(props) => props.theme.colors.yellow}DD;
      background-color: ${(props) => props.theme.colors.yellow}DD;
    }
  }

  .btn--outlined {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.gray_02} !important;
    color: ${(props) => props.theme.colors.text_01};
    border-radius: 4rem;
    &:focus,
    &:hover {
      color: ${(props) => props.theme.colors.text_01};
      background-color: ${(props) => props.theme.colors.btnHover_02};
      border: 1px solid ${(props) => props.theme.colors.btnHover_02};
    }
  }

  .btn--outlined-red {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.buttonRed};
    color: ${(props) => props.theme.colors.buttonRed};
    font-weight: bold;
    &:focus,
    &:hover {
      background-color: ${(props) => props.theme.colors.buttonRed}10;
    }
  }

  .btn--outlined-reddish {
    background-color: ${(props) => props.theme.colors.buttonRed}10;
    border: 1px solid ${(props) => props.theme.colors.buttonRed};
    color: ${(props) => props.theme.colors.buttonRed};
    font-weight: bold;
    &:focus,
    &:hover {
      background-color: ${(props) => props.theme.colors.buttonRed}20;
    }
  }

  .btn--outlined-grey-to-primary {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.gray_03};
    color: ${(props) => props.theme.colors.text_01};
    font-weight: 500;

    svg {
      color: ${(props) => props.theme.colors.text_01};
    }

    &:focus,
    &:hover {
      background-color: ${(props) => props.theme.colors.primaryColor}10;
      border: 1px solid ${(props) => props.theme.colors.primaryColor};
    }
  }

  .btn--with-icon {
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
  }

  .btn--no-bg {
    background-color: ${(props) => props.theme.colors.transparent};
    text-align: left;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .btn--text-only {
    height: auto;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primaryColor};
    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }

  .btn--text-only-red {
    height: auto;
    font-weight: 500;
    color: ${(props) => props.theme.colors.buttonRed};
    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }

  .btn--icon-only {
    height: auto;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text_02};
    padding: 1px;
    &:focus,
    &:hover {
      opacity: 0.7;
    }
  }

  .btn--font-bold {
    font-weight: bold;
  }

  .btn[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  @keyframes button-loading {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(2turn);
    }
  }

  .btn--loading {
    pointer-events: none;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border: 2px solid transparent;
      border-color: white white white transparent;
      border-radius: 50%;
      animation: button-loading 1s ease infinite;
    }

    &.btn--icon-only,
    &.btn--text-only,
    &.btn--outlined {
      &::after {
        border-top-color: ${(props) => props.theme.colors.primaryColor};
        border-right-color: ${(props) => props.theme.colors.primaryColor};
        border-bottom-color: ${(props) => props.theme.colors.primaryColor};
      }
    }

    &.btn--outlined-reddish,
    &.btn--text-only-red,
    &.btn--outlined-red {
      &::after {
        border-top-color: ${(props) => props.theme.colors.buttonRed};
        border-right-color: ${(props) => props.theme.colors.buttonRed};
        border-bottom-color: ${(props) => props.theme.colors.buttonRed};
      }
    }
  }
`;

export const ButtonClass = {
  SOLID: "SOLID",
  GRADIENT: "GRADIENT",
  SOLID_SECONDARY: "SOLID_SECONDARY",
  SOLID_GREY: "SOLID_GREY",
  SOLID_RED: "SOLID_RED",
  SOLID_YELLOW: "SOLID_YELLOW",
  OUTLINED: "OUTLINED",
  OUTLINED_RED: "OUTLINED_RED",
  OUTLINED_REDDISH: "OUTLINED_REDDISH",
  OUTLINED_GREY_TO_PRIMARY: "OUTLINED_GREY_TO_PRIMARY",
  WITH_ICON: "WITH_ICON",
  NO_BG: "NO_BG",
  TEXT_ONLY: "TEXT_ONLY",
  TEXT_ONLY_RED: "TEXT_ONLY_RED",
  ICON_ONLY: "ICON_ONLY",
  FONT_BOLD: "FONT_BOLD",
  PADDING_0: "PADDING_0",
  PADDING_20: "PADDING_20",
  PADDING_30: "PADDING_30",
  QUICK_ACTION_BUTTON: "QUICK_ACTION_BUTTON",
};

export const ButtonSize = {
  SMALL: "small",
  LARGE: "large",
  FULL: "full",
  WIDTH_140: "140px",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  classes?: string[];
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  classes = [],
  className,
  type = "button",
  size,
  disabled = false,
  loading = false,
  onClick = () => null,
  containerStyle,
  style,
  ...rest
}) => {
  const mergedContainerStyle = Object.assign({}, containerStyle || {});

  return (
    <ButtonContainer style={mergedContainerStyle}>
      <button
        type={type}
        className={clsx(`btn`, classes, className, {
          "btn--solid": classes.includes(ButtonClass.SOLID),
          "btn--gradient": classes.includes(ButtonClass.GRADIENT),
          "btn--solid-secondary": classes.includes(ButtonClass.SOLID_SECONDARY),
          "btn--solid-grey": classes.includes(ButtonClass.SOLID_GREY),
          "btn--solid-red": classes.includes(ButtonClass.SOLID_RED),
          "btn--solid-yellow": classes.includes(ButtonClass.SOLID_YELLOW),
          "btn--outlined": classes.includes(ButtonClass.OUTLINED),
          "btn--outlined-red": classes.includes(ButtonClass.OUTLINED_RED),
          "btn--outlined-reddish": classes.includes(
            ButtonClass.OUTLINED_REDDISH,
          ),
          "btn--outlined-grey-to-primary": classes.includes(
            ButtonClass.OUTLINED_GREY_TO_PRIMARY,
          ),
          "btn--with-icon": classes.includes(ButtonClass.WITH_ICON),
          "btn--no-bg": classes.includes(ButtonClass.NO_BG),
          "btn--text-only": classes.includes(ButtonClass.TEXT_ONLY),
          "btn--text-only-red": classes.includes(ButtonClass.TEXT_ONLY_RED),
          "btn--icon-only": classes.includes(ButtonClass.ICON_ONLY),
          "btn--font-bold": classes.includes(ButtonClass.FONT_BOLD),
          "btn--padding-0": classes.includes(ButtonClass.PADDING_0),
          "btn--padding-20": classes.includes(ButtonClass.PADDING_20),
          "btn--padding-30": classes.includes(ButtonClass.PADDING_30),
          "btn--quick-action-button": classes.includes(
            ButtonClass.QUICK_ACTION_BUTTON,
          ),
          "btn--sm": size === ButtonSize.SMALL,
          "btn--lg": size === ButtonSize.LARGE,
          "btn--full": size === ButtonSize.FULL,
          "btn--w-140": size === ButtonSize.WIDTH_140,
          "btn--loading": loading,
        })}
        onClick={onClick}
        disabled={disabled}
        style={style || {}}
        {...rest}
      >
        {loading ? "" : children}
      </button>
    </ButtonContainer>
  );
};

export default Button;
