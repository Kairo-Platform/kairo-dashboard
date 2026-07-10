import type { FC, ReactNode } from "react";
import styled from "styled-components";

const FormGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

interface FormGroupProps {
  children?: ReactNode;
}

export const FormGroup: FC<FormGroupProps> = ({ children }) => {
  return (
    <FormGroupContainer className="form-group">{children}</FormGroupContainer>
  );
};

export default FormGroup;
