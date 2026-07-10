import React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

const FadeTransitionContainer = styled.div`
  .fade-appear,
  .fade-enter {
    opacity: 0;
  }

  .fade-appear-done,
  .fade-enter-done {
    opacity: 1;
    transition:
      transform 500ms,
      opacity 500ms;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit-active {
    opacity: 0;
    transition:
      transform 500ms,
      opacity 500ms;
  }
`;

export interface FadeCSSTransitionProps {
  in?: boolean;
  children?: React.ReactNode;
  appear?: number;
  enter?: number;
  exit?: number;
}

export const FadeCSSTransition: React.FC<FadeCSSTransitionProps> = (props) => {
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const { in: inProp, children, appear = 0, enter = 0, exit = 0 } = props;
  return (
    <FadeTransitionContainer>
      <CSSTransition
        in={inProp}
        classNames="fade"
        timeout={{
          appear: appear || 0,
          enter: enter || 0,
          exit: exit || 0,
        }}
        unmountOnExit
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
      >
        <div ref={nodeRef}>{children}</div>
      </CSSTransition>
    </FadeTransitionContainer>
  );
};

export default FadeCSSTransition;
