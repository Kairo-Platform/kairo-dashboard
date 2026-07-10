import React, { useRef, useEffect } from "react";
import { usePrevious } from "@kairo/hooks";
import styled from "styled-components";

const SingleOtpInputContainer = styled.span<{ fullWidth?: boolean }>`
  flex: ${(props) => (props.fullWidth ? "1 1 0" : "unset")};
  input {
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 8px;
    width: ${(props) => (props.fullWidth ? "100%" : "50px")};
    height: 50px;
    text-align: center;
    font-size: 25px;
    outline: none;
    color: ${(props) => props.theme.colors.text_01};

    &:focus {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }

    &:disabled {
      opacity: 0.55;
      pointer-events: none;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      width: ${(props) => (props.fullWidth ? "100%" : "40px")};
      height: 40px;
      font-size: 20px;
    }

    @media (max-width: 380px) {
      width: ${(props) => (props.fullWidth ? "100%" : "36px")};
      height: 36px;
      font-size: 18px;
    }
  }
`;

type SingleOtpInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  focus?: boolean;
  fullWidth?: boolean;
};

export const SingleOtpInput = (props: SingleOtpInputProps) => {
  const { focus, fullWidth, ...rest } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevFocus = usePrevious(!!focus);
  useEffect(() => {
    if (inputRef.current) {
      if (focus) {
        inputRef.current.focus();
      }
      if (focus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [focus, prevFocus]);

  return (
    <SingleOtpInputContainer fullWidth={fullWidth}>
      <input ref={inputRef} {...rest} />
    </SingleOtpInputContainer>
  );
};

export default SingleOtpInput;
