"use client";

import { FC, ReactNode, CSSProperties } from "react";
import styled from "styled-components";

const LoadingOverlayContainer = styled.div<{
  opacity: number;
  $bgColor?: string;
  color?: string;
}>`
  position: absolute;
  pointer-events: none;
  background-color: ${(props) => {
    const base = props.$bgColor ?? props.theme.colors.bgColor;
    const opacityHex = Math.round((props.opacity / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    return `${base}${opacityHex}`;
  }};
  color: ${(props) => props.color};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
`;

export interface LoadingOverlayProps {
  children?: ReactNode;
  style?: CSSProperties;
  opacity?: number;
  bgColor?: string;
  color?: string;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  children,
  style,
  opacity = 75,
  bgColor,
  color,
}) => (
  <LoadingOverlayContainer
    className="loading-overlay"
    style={style}
    opacity={opacity}
    $bgColor={bgColor}
    color={color}
  >
    {children}
  </LoadingOverlayContainer>
);

export default LoadingOverlay;
