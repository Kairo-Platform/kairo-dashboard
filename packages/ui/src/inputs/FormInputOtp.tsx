import type { FC, InputHTMLAttributes } from "react";
import styled from "styled-components";

const FormInputOtpContainer = styled.span`
  input {
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 4px;
    width: 100%;
    height: 50px;
    text-align: center;
    font-size: 25px;
    outline: none;
    color: ${(props) => props.theme.colors.text_01};
    letter-spacing: 2px;

    &:focus {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }

    &:disabled {
      opacity: 0.55;
      pointer-events: none;
    }
  }
`;

export interface FormInputOtpProps
  extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const FormInputOtp: FC<FormInputOtpProps> = ({ className, ...rest }) => {
  return (
    <FormInputOtpContainer className={className}>
      <input {...rest} type="text" />
    </FormInputOtpContainer>
  );
};

export default FormInputOtp;
