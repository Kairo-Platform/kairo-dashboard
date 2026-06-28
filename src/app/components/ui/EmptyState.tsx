"use client";

import styled from "styled-components";
import type { ReactNode, HTMLAttributes } from "react";

const EmptyStateElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 20rem;
  min-height: 10rem;
  // background-color: ${(props) => props.theme.colors.ui_01};
  border-radius: 1rem;
  margin: 3rem auto;
  padding: 1.5rem;
  gap: 0.5rem;
  letter-spacing: 0.44px;

  .icon {
    margin-bottom: 0.5rem;
    background-color: ${(props) => props.theme.colors.emptyState.iconBgColor};
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h5 {
    font-size: 1.2rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.emptyState.textColor};
  }

  div {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.emptyState.textColor_02};
    margin-bottom: 0.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoint.sm}) {
    width: 100%;
    margin: 2rem 0;

    h5 {
      font-size: 0.875rem;
    }
  }
`;

export const EmptyState = ({
  title = "Nothing to show",
  message = "",
  icon = null,
  children = null,
  ...rest
}: {
  title?: ReactNode;
  message?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <EmptyStateElement {...rest}>
      {icon && <span className="icon">{icon}</span>}
      <h5>{title}</h5>
      <div>{message}</div>
      {children}
    </EmptyStateElement>
  );
};

export default EmptyState;
