"use client";

import { FC, ReactNode, ComponentType } from "react";
import styled from "styled-components";
import clsx from "clsx";
import InformationFillIcon from "remixicon-react-redux/InformationFillIcon";
import InformationLineIcon from "remixicon-react-redux/InformationLineIcon";
import { theme } from "@kairo/theme";

const ToolTipContainer = styled.button.attrs({ type: "button" })`
  position: relative;
  display: flex;

  &:focus .tooltiptext,
  &:hover .tooltiptext {
    visibility: visible;
  }

  .tooltiptext {
    visibility: hidden;
    min-width: 160px;
    width: auto;
    background-color: ${(props) => props.theme.colors.text_02};
    color: ${(props) => props.theme.colors.white};
    text-align: center;
    border-radius: 6px;
    padding: 10px 6px;
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 50%;
    margin-top: 5px;
    transform: translateX(-50%);
  }
  .tooltiptext--right {
    right: -3px;
    left: auto;
    transform: translate(100%, -50%);
  }
  .tooltiptext--left {
    left: auto;
    right: 0;
    transform: translate(-12%, -50%);
  }
  .tooltiptext--top {
    top: -24%;
    transform: translate(-50%, -100%);
  }
`;

export const ToolTipPosition = {
  RIGHT: "right",
  LEFT: "left",
  TOP: "top",
};
export type ToolTipPositionValue =
  (typeof ToolTipPosition)[keyof typeof ToolTipPosition];

export interface ToolTipProps {
  text?: ReactNode;
  position?: ToolTipPositionValue;
  children?: ReactNode;
  iconType?: "line" | "fill";
  className?: string;
}

export const ToolTip: FC<ToolTipProps> = ({
  text,
  position = ToolTipPosition.RIGHT,
  children,
  iconType = "line",
  className,
}) => {
  const Icon: ComponentType<any> =
    iconType === "line" ? InformationLineIcon : InformationFillIcon;

  return (
    <ToolTipContainer className={className}>
      {children ? (
        children
      ) : (
        <Icon color={theme.colors.primaryColor} size="20px" />
      )}
      <span
        className={clsx(`tooltiptext`, {
          "tooltiptext--right": position === ToolTipPosition.RIGHT,
          "tooltiptext--left": position === ToolTipPosition.LEFT,
          "tooltiptext--top": position === ToolTipPosition.TOP,
        })}
      >
        {text}
      </span>
    </ToolTipContainer>
  );
};

export default ToolTip;
