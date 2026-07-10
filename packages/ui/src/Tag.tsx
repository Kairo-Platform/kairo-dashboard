"use client";

import { FC, ReactNode } from "react";
import styled from "styled-components";
import clsx from "clsx";

const Wrapper = styled.span`
  color: ${(props) => props.theme.colors.tag.blue.color};
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
  background-color: ${(props) => props.theme.colors.tag.blue.bg_color};
  border-radius: 100px;
  padding: 4px 10px 4px 8px;
  height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  /* margin: -1px 0; */

  &.tag--grey {
    background-color: ${(props) => props.theme.colors.tag.grey.bg_color};
    color: ${(props) => props.theme.colors.tag.grey.color};
    border: 1px solid ${(props) => props.theme.colors.tag.grey.color}10;
  }

  &.tag--green {
    background-color: ${(props) => props.theme.colors.tag.green.bg_color};
    color: ${(props) => props.theme.colors.tag.green.color};
    border: 1px solid ${(props) => props.theme.colors.tag.green.color}10;
  }

  &.tag--yellow {
    background-color: ${(props) => props.theme.colors.tag.yellow.bg_color};
    color: ${(props) => props.theme.colors.tag.yellow.color};
    border: 1px solid ${(props) => props.theme.colors.tag.yellow.color}10;
  }

  &.tag--yellow-dark {
    background-color: ${(props) => props.theme.colors.tag.yellowDark.bg_color};
    color: ${(props) => props.theme.colors.tag.yellowDark.color};
    border: 1px solid ${(props) => props.theme.colors.tag.yellowDark.color}10;
  }

  &.tag--red {
    background-color: ${(props) => props.theme.colors.tag.red.bg_color};
    color: ${(props) => props.theme.colors.tag.red.color};
    border: 1px solid ${(props) => props.theme.colors.tag.red.color}10;
  }

  &.tag--purple-cool {
    background-color: ${(props) => props.theme.colors.tag.purpleCool.bg_color};
    color: ${(props) => props.theme.colors.tag.purpleCool.color};
    border: 1px solid ${(props) => props.theme.colors.tag.purpleCool.color}10;
  }

  &.tag--blue {
    background-color: ${(props) => props.theme.colors.tag.blue.bg_color};
    color: ${(props) => props.theme.colors.tag.blue.color};
    border: 1px solid ${(props) => props.theme.colors.tag.blue.color}10;
  }

  &.tag--magenta {
    background-color: ${(props) => props.theme.colors.tag.magenta.bg_color};
    color: ${(props) => props.theme.colors.tag.magenta.color};
    border: 1px solid ${(props) => props.theme.colors.tag.magenta.color}10;
  }
`;

export const TagType = {
  DEFAULT: "", // BLUE
  BLUE: "BLUE",
  GREY: "GREY",
  RED: "RED",
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  YELLOW_DARK: "YELLOW_DARK",
  PURPLE_COOL: "PURPLE_COOL",
  MAGENTA: "MAGENTA",
} as const;

export type TagTypeValue = (typeof TagType)[keyof typeof TagType];

export interface TagProps {
  children?: ReactNode;
  type?: TagTypeValue;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

export const Tag: FC<TagProps> = ({
  children,
  type,
  style,
  onClick,
  className,
}) => {
  return (
    <Wrapper
      style={style}
      onClick={onClick}
      className={clsx(className, {
        "tag--blue": type === TagType.BLUE,
        "tag--grey": type === TagType.GREY,
        "tag--red": type === TagType.RED,
        "tag--green": type === TagType.GREEN,
        "tag--yellow": type === TagType.YELLOW,
        "tag--yellow-dark": type === TagType.YELLOW_DARK,
        "tag--purple-cool": type === TagType.PURPLE_COOL,
        "tag--magenta": type === TagType.MAGENTA,
      })}
    >
      {children}
    </Wrapper>
  );
};

export default Tag;
