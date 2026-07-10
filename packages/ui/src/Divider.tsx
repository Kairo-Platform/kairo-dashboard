"use client";

import React from "react";
import styled from "styled-components";

const DividerWithStyles = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.dividerColor};
  margin: 1rem auto;
`;

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Divider: React.FC<DividerProps> = (props) => {
  return <DividerWithStyles {...props} />;
};

export default Divider;
