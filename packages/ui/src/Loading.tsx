"use client";

import React from "react";
import styled from "styled-components";
import clsx from "clsx";

const LoadingContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @keyframes loading {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(2turn);
    }
  }

  .loading {
    min-width: 16px;
    min-height: 16px;
    pointer-events: none;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      width: 11px;
      height: 11px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid transparent;
      border-top-color: ${(props) => props.theme.colors.primaryColor};
      border-right-color: ${(props) => props.theme.colors.primaryColor};
      border-bottom-color: ${(props) => props.theme.colors.primaryColor};
      border-left-color: transparent;
      border-radius: 50%;
      animation: loading 1s ease infinite;
    }

    &.loading--lg {
      min-width: 24px;
      min-height: 24px;

      &::after {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

export const LoadingSize = {
  LARGE: "large",
} as const;

export interface LoadingProps {
  children?: React.ReactNode;
  size?: (typeof LoadingSize)[keyof typeof LoadingSize] | string;
}

export const Loading: React.FC<LoadingProps> = ({ children, size }) => (
  <LoadingContainer>
    <span
      className={clsx(`loading`, {
        "loading--lg": size === LoadingSize.LARGE,
      })}
    />
    {children && <span>{children}</span>}
  </LoadingContainer>
);

export default Loading;
