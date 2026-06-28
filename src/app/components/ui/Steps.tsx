"use client";

import { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { Step } from "./Step";
import { FadeCSSTransition } from "./transitions";

const StepsContainer = styled.div`
  .steps {
    margin-top: 16px;
  }

  .step-list {
    display: flex;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export interface StepItem {
  title?: ReactNode;
  content?:
    | ReactNode
    | ((props: {
        currentStepNo: number;
        gotoStep: (stepNo: number) => void;
      }) => ReactNode);
}

export interface StepsProps {
  steps?: StepItem[];
  activeStepNo?: number;
}

export const Steps: FC<StepsProps> = (props) => {
  const { steps = [], activeStepNo = 1 } = props;
  const [activeStepIndex, setActiveStepIndex] = useState<number>(
    activeStepNo ? activeStepNo - 1 : 0,
  );

  const gotoStep = (stepNo: number) => {
    if (stepNo > 0) {
      setActiveStepIndex(stepNo - 1);
      // scroll to the top of the steps
      setTimeout(() => {
        const el = document.querySelector(".steps");
        if (el && typeof (el as Element).scrollIntoView === "function") {
          (el as Element).scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      });
    }
  };

  const mappedSteps = steps.map((step, index) => {
    return (
      <Step
        key={index}
        title={step.title}
        isActive={activeStepIndex >= index}
      />
    );
  });

  const mappedStepsContent = steps.map((step, index) => {
    const { content } = step;
    const isActive = activeStepIndex === index;
    const contentStyle = { display: `${isActive ? "block" : "none"}` };
    const injectedProps = {
      currentStepNo: activeStepIndex + 1,
      gotoStep: (stepNo: number) => gotoStep(stepNo),
    };

    return (
      <FadeCSSTransition key={index} in={isActive}>
        <div style={contentStyle}>
          {typeof content === "function"
            ? content(injectedProps)
            : content || null}
        </div>
      </FadeCSSTransition>
    );
  });

  return (
    <StepsContainer>
      <div className="steps">
        <ul className="step-list">{mappedSteps}</ul>
        <div className="step-content">{mappedStepsContent}</div>
      </div>
    </StepsContainer>
  );
};

export default Steps;
