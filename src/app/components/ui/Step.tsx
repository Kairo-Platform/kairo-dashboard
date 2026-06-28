"use client";

import type { FC, ReactNode } from "react";
import styled from "styled-components";
import clsx from "clsx";

const StepContainer = styled.li`
  display: flex;
  margin-bottom: -3px;
  /* transition: 0.5s; */
  width: 100%;

  &:not(:last-child) {
    margin-right: 8px;
  }

  span {
    width: 100%;
    height: 4px;
    background-color: ${(props) => props.theme.colors.inputBorder};
    border-radius: 2px;
    border: 0;
  }

  &.active {
    span {
      border-bottom: 0px;
      background-color: ${(props) => props.theme.colors.primaryColor};
    }
  }
`;

export interface StepProps {
  title?: ReactNode;
  isActive?: boolean;
}

export const Step: FC<StepProps> = ({ title, isActive = false }) => {
  return (
    <StepContainer className={clsx("step", { active: isActive })} role="tab">
      <span>{title}</span>
    </StepContainer>
  );
};

export default Step;
