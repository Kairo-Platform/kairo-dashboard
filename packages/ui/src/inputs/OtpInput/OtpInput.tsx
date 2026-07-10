import {
  useState,
  useCallback,
  ClipboardEvent,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import SingleOtpInput from "./SingleOtpInput";
import styled from "styled-components";

const OtpInputContainer = styled.div`
  display: flex;
  gap: 10px;
  width: auto;
  &.fullWidth {
    width: 100%;
  }

  & > span:first-child input {
    border-radius: 12px 6px 6px 12px;
  }

  & > span:last-child input {
    border-radius: 6px 12px 12px 6px;
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    gap: 8px;
    & > span:first-child input {
      border-radius: 10px 6px 6px 10px;
    }
    & > span:last-child input {
      border-radius: 6px 10px 10px 6px;
    }
  }
`;

type OtpInputProps = React.HTMLAttributes<HTMLDivElement> & {
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  onChangeOTP?: (otp: string) => void;
  maskInput?: boolean;
  fullWidth?: boolean;
};

export const OtpInput = (props: OtpInputProps) => {
  const {
    length = 4,
    autoFocus,
    disabled,
    onChangeOTP = () => {},
    maskInput,
    fullWidth,
    ...rest
  } = props;

  const [activeInput, setActiveInput] = useState<number>(autoFocus ? 0 : -1);
  const [otpValues, setOTPValues] = useState<string[]>(Array(length).fill(""));

  // Helper to return OTP from inputs
  const handleOtpChange = useCallback(
    (otp: string[]) => {
      const otpValue = otp.join("");
      onChangeOTP(otpValue);
    },
    [onChangeOTP]
  );

  // Helper to return value with the right type: 'text' or 'number'
  const getRightValue = (str: string | undefined): string => {
    let changedValue = str;

    if (!changedValue) {
      return "";
    }

    return Number(changedValue) >= 0 ? changedValue : "";
  };

  // Change OTP value at focussing input
  const changeCodeAtFocus = useCallback(
    (str: string) => {
      const updatedOTPValues = [...otpValues];
      updatedOTPValues[activeInput] = str[0] || "";
      setOTPValues(updatedOTPValues);
      handleOtpChange(updatedOTPValues);
    },
    [activeInput, handleOtpChange, otpValues]
  );

  // Focus `inputIndex` input
  const focusInput = useCallback(
    (inputIndex: number) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length]
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index: number) => () => {
      focusInput(index);
    },
    [focusInput]
  );

  // Handle onChange value for each input
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue]
  );

  // Handle onBlur input
  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  // Handle onKeyDown input
  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const pressedKey = e.key;

      switch (pressedKey) {
        case "Backspace":
        case "Delete": {
          e.preventDefault();
          if (otpValues[activeInput]) {
            changeCodeAtFocus("");
          } else {
            focusPrevInput();
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          focusPrevInput();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          focusNextInput();
          break;
        }
        default: {
          if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
            e.preventDefault();
          }

          break;
        }
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, otpValues]
  );

  const handleOnPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text/plain")
        .trim()
        .slice(0, length - activeInput)
        .split("");

      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedOTPValues = [...otpValues];
        updatedOTPValues.forEach((val: string, index: number) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedOTPValues[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        setOTPValues(updatedOTPValues);
        handleOtpChange(updatedOTPValues);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
      }
    },
    [activeInput, getRightValue, length, otpValues]
  );

  const getValue = useCallback(
    (values: string[], index: number): string => {
      if (values[index]) {
        if (maskInput) {
          return "*";
        }
        return values[index];
      }
      return "";
    },
    [maskInput]
  );

  return (
    <OtpInputContainer
      className={fullWidth ? "fullWidth" : undefined}
      {...rest}
    >
      {Array(length)
        .fill("")
        .map((_, index) => (
          <SingleOtpInput
            key={`SingleOtpInput-${index}`}
            inputMode="numeric"
            focus={activeInput === index}
            value={getValue(otpValues, index)}
            autoFocus={autoFocus ? index === 0 : undefined}
            disabled={disabled}
            onFocus={handleOnFocus(index)}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onBlur={onBlur}
            onPaste={handleOnPaste}
            fullWidth={fullWidth}
          />
        ))}
    </OtpInputContainer>
  );
};

// const OtpInput = memo(OtpInputComponent);
