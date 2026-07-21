"use client";

import { FC, ReactNode } from "react";
import styled from "styled-components";
import clsx from "clsx";

const TabContainer = styled.li`
  display: flex;
  margin-bottom: -1.5px;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  button {
    appearance: none;
    width: 100%;
    padding: 0.375rem 1rem 0.625rem;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3125rem;
    color: ${(props) => props.theme.colors.text_02};
    letter-spacing: -0.3px;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease;
  }

  &.active {
    button {
      color: ${(props) => props.theme.colors.orange};
      border-bottom-color: ${(props) => props.theme.colors.orange};
    }
  }

  &.tab-button {
    &:not(:last-child) {
      margin-right: 0;
    }

    button {
      border: 2px solid ${(props) => props.theme.colors.tabContentBorder};
      background-color: ${(props) => props.theme.colors.white};
      padding: 10px 1rem;
    }

    &:not(:last-child) {
      button {
        border-right: 0;
      }
    }

    &:first-child {
      button {
        border-radius: 4px 0 0 4px;
      }
    }

    &:last-child {
      button {
        border-radius: 0 4px 4px 0;
      }
    }

    &.active {
      button {
        border: 2px solid ${(props) => props.theme.colors.primaryColor};
        background-color: ${(props) => props.theme.colors.primaryColor}15;
      }

      & + li {
        button {
          border-left: 0;
        }
      }
    }
  }

  &.tab-pill {
    margin-right: 0;

    button {
      padding: 16px 22px;
    }

    &:first-child {
      button {
        padding-left: 0;
      }
    }

    &.active {
      button {
        border: 2px solid ${(props) => props.theme.colors.tabContentBorder};
        border-bottom: 0;
        background-color: ${(props) => props.theme.colors.white};
        padding: 0 1rem;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-weight: 500;
      }
    }
  }
`;

export interface TabProps {
  title?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  tabClassName?: string;
}

export const Tab: FC<TabProps> = ({
  title,
  isActive = false,
  onClick,
  tabClassName = "tab",
}) => {
  return (
    <TabContainer
      className={clsx(tabClassName, { active: isActive })}
      role="tab"
    >
      <button type="button" onClick={onClick}>
        {title}
      </button>
    </TabContainer>
  );
};

export default Tab;
