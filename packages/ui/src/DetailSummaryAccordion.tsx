"use client";

import React from "react";
import styled from "styled-components";
import ArrowRightSLineIcon from "remixicon-react-redux/ArrowRightSLineIcon";

const DetailSummaryAccordionContainer = styled.div`
  summary {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 5px;

    & > svg {
      color: ${(props) => props.theme.colors.primaryColor};
      transition: 0.5s;
    }
  }

  details {
    flex: 1;
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 5px;
    font-weight: 500;
    padding: 12px;
    width: 100%;

    &[open] summary {
      margin-bottom: 10px;

      & > svg {
        transform: rotate(90deg);
      }
    }
  }
`;

export interface DetailSummaryAccordionProps {
  summary?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLDetailsElement>) => void;
}

export const DetailSummaryAccordion: React.FC<DetailSummaryAccordionProps> = ({
  summary,
  children,
  onClick = () => null,
}) => {
  return (
    <DetailSummaryAccordionContainer>
      <details className="price-model" onClick={onClick}>
        <summary>
          <ArrowRightSLineIcon size={24} />
          {summary}
        </summary>
        {children}
      </details>
    </DetailSummaryAccordionContainer>
  );
};

export default DetailSummaryAccordion;
