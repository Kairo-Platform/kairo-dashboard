"use client";

import React from "react";
import { useBoolean } from "@kairo/hooks";
import { Popover } from "react-tiny-popover";
import MoreLineIcon from "remixicon-react-redux/MoreLineIcon";
import MoreFillIcon from "remixicon-react-redux/MoreFillIcon";
import CheckLineIcon from "remixicon-react-redux/CheckLineIcon";
import CheckFillIcon from "remixicon-react-redux/CheckFillIcon";
import styled from "styled-components";
import { Icon } from "@iconify/react";

const ActionMenuListContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 15px 15px 80px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  li {
    display: block;

    &[data-with-divider="true"] {
      border-bottom: 1px solid #eaeaea;
    }

    button {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: inherit;
      color: ${(props) => props.theme.colors.text_03};

      &:focus,
      &:hover {
        background-color: ${(props) => props.theme.colors.gray_02};
        cursor: pointer;
      }

      &.delete-action {
        color: ${(props) => props.theme.colors.red_01};

        span {
          color: ${(props) => props.theme.colors.red_01};
        }
      }

      span {
        width: 100%;
        display: block;
        text-align: left;
        height: 2.25rem;
        line-height: 1.25rem;
        padding: 0.5rem 1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.875rem;
      }

      svg {
        margin-right: 0.75rem;
        margin-bottom: 1px;
        color: ${(props) => props.theme.colors.primaryColor};
      }
    }

    &:first-child {
      button {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }
    }

    &:last-child {
      button {
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
`;

const ActionMenuTriggerButtonEl = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  border-radius: 4rem;
  transition: background-color 0.5s ease-out;
  overflow: hidden;
  color: ${(props) => props.theme.colors.text_02};

  &:focus,
  &:hover {
    // background-color: ${(props) => props.theme.colors.ui_04};
    cursor: pointer;
  }
`;

const ActionMenuItemButton = styled.button<{ $width?: string }>`
  width: ${(p) => p.$width || "10rem"};
`;

export interface ActionMenuAction {
  title?: string;
  onClick?: () => void;
  hidden?: boolean;
  withDivider?: boolean;
  classes?: string;
  selected?: boolean;
  checkColor?: string;
}

export type PopoverPosition = "top" | "bottom" | "left" | "right";

export interface ActionMenuProps {
  actions?: ActionMenuAction[];
  padding?: number;
  positions?: PopoverPosition[];
  children?: React.ReactNode | null;
  actionItemWidth?: string;
  disabled?: boolean;
  iconType?: "line" | "fill";
  triggerStyle?: React.CSSProperties;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  actions = [],
  padding = 8,
  positions = ["right", "left", "bottom", "top"],
  children = null,
  actionItemWidth = "10rem",
  disabled = false,
  iconType = "line",
  triggerStyle = {},
}) => {
  const {
    value: isOpen,
    setTrue: openAction,
    setFalse: closeAction,
  } = useBoolean(false);

  const MoreIcon: React.ComponentType<{
    color?: string;
    size?: string | number;
  }> = iconType === "line" ? MoreLineIcon : MoreFillIcon;
  const CheckIcon: React.ComponentType<{
    color?: string;
    size?: string | number;
  }> = iconType === "line" ? CheckLineIcon : CheckFillIcon;

  const visibleActions = actions.filter((action) => !action.hidden);

  return (
    <Popover
      isOpen={isOpen}
      padding={padding}
      positions={positions}
      containerStyle={{ zIndex: "3" }}
      content={
        <ActionMenuListContainer tabIndex={-1}>
          <ul>
            {visibleActions.map((action: ActionMenuAction, index: number) => (
              <li key={index} data-with-divider={action.withDivider}>
                <ActionMenuItemButton
                  type="button"
                  $width={actionItemWidth}
                  className={action.classes || ""}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    if (action.onClick) action.onClick();
                    closeAction();
                  }}
                >
                  <span>{action.title || "Untitled"}</span>
                  {action.selected && (
                    <CheckIcon size={"2rem"} color={action.checkColor} />
                  )}
                </ActionMenuItemButton>
              </li>
            ))}
          </ul>
        </ActionMenuListContainer>
      }
      onClickOutside={closeAction}
    >
      <ActionMenuTriggerButtonEl
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          const enabled = !disabled;
          if (enabled) openAction();
        }}
        style={triggerStyle}
      >
        {children ? (
          children
        ) : (
          <Icon icon="mdi:dots-vertical" width={20} height={20} />
        )}
      </ActionMenuTriggerButtonEl>
    </Popover>
  );
};

export default ActionMenu;
