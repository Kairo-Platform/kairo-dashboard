"use client";

import styled from "styled-components";
import SecureFormBrand from "./SecureFormBrand";

const Main = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: ${({ theme }) => theme.colors.bgColor};
  color: ${({ theme }) => theme.colors.text_01};
`;

const Content = styled.section`
  width: 100%;
  max-width: 480px;
  padding: 32px 24px;
  border: 1px solid ${({ theme }) => theme.colors.dividerColor};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.ui_07};
  text-align: center;

  .brand {
    margin: 0 0 24px;
  }

  h1 {
    margin: 0 0 12px;
    font-size: 26px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.heading};
    line-height: 1.3;
  }

  .description {
    margin: 0;
    color: ${({ theme }) => theme.colors.text_02};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
  }
`;

export default function SecureFormUnavailable() {
  return (
    <Main>
      <Content aria-labelledby="secure-form-unavailable-title">
        <SecureFormBrand centered className="brand" />
        <h1 id="secure-form-unavailable-title">
          This secure form is not available
        </h1>
        <p className="description">
          Please return to your Kairo conversation and open the secure link sent
          for your current step.
        </p>
      </Content>
    </Main>
  );
}
