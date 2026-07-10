"use client";

import React from "react";
import styled from "styled-components";

const IsSuspendedStatusContainer = styled.span`
  font-size: 14px;

  &[data-status*="true"] {
    color: ${(props) => props.theme.colors.red};
    &:before {
      background: ${(props) => props.theme.colors.red};
    }
  }

  &[data-status*="false"] {
    color: ${(props) => props.theme.colors.text_01};
    &:before {
      background: ${(props) => props.theme.colors.text_01};
    }
  }
`;

export interface IsSuspendedStatusProps {
  status?: boolean | string | null;
}

export const IsSuspendedStatus: React.FC<IsSuspendedStatusProps> = ({
  status,
}) => {
  return (
    <IsSuspendedStatusContainer data-status={status}>
      {status ? "Suspended" : "Not Suspended"}
    </IsSuspendedStatusContainer>
  );
};

export default IsSuspendedStatus;
