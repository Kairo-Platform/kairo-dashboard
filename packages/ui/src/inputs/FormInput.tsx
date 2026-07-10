import React, { useState } from "react";
import styled from "styled-components";
import { formFieldStatusMessageTypes } from "@kairo/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { cleanNumericInput, isIOS } from "@kairo/utils";
import invisibleIcon from "./icons/form-input/invisible.svg";
import visibleIcon from "./icons/form-input/visible.svg";

const FormInputContainer = styled.div`
  flex-grow: 1;
  line-height: 20px;
  letter-spacing: 0.25px;
  // max-height: 4rem;
  position: relative;
  transition: all 0.3s ease-out;

  label {
    display: inline-block;
    font-size: ${(props) => props.theme.typography.fontSize.base};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.text_07};
    margin: 2px 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .required-mark {
    color: ${(props) => props.theme.colors.red};
  }

  .FormInput__control {
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 8px;
    padding: 10px 14px 10px 14px;
    box-sizing: border-box;
    position: relative;
    transition: all 0.3s ease-out;
    display: flex;
    align-items: center;

    &:hover,
    &:focus-within {
      border-color: ${(props) => props.theme.colors.primaryColor};
      box-shadow:
        0 0 0 4px rgba(0, 0, 0, 0.03),
        0 0 0 3px ${(props) => props.theme.colors.primaryColor}22;
    }

    &.has-message {
      border-color: var(
        --ff-msg-color,
        ${(props) => props.theme.colors.inputBorder}
      );
      box-shadow: 0 0 0 4px var(--ff-msg-bg, transparent);
    }

    .FormInput__append {
      position: absolute;
      right: 14px;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  .FormInput__FlagContainer {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin-right: 0.3rem;
    padding-right: 0.3rem;
    border-right: 1px solid ${(props) => props.theme.colors.gray_03};
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors.text_05};
    cursor: pointer;
  }

  .FormInput__message {
    position: absolute;
    left: 0;
    bottom: -1.3rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
  }

  .FormInput__message--success {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.green.color}
    );
  }
  .FormInput__message--error {
    color: var(--ff-msg-color, ${(props) => props.theme.colors.tag.red.color});
  }
  .FormInput__message--warning {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellowDark.color}
    );
  }
  .FormInput__message--info {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellow.color}
    );
  }

  .FormInput__password--toggle {
    cursor: pointer;
  }

  input {
    display: block;
    width: 100%;
    font-size: 1rem;
    border: none;
    outline: none;
    color: ${(props) => props.theme.colors.text_01};
    background: transparent;
    padding: 0;
    height: 20px;
    &.has-append {
      padding-right: 40px;
    }

    &::placeholder {
      color: ${(props) => props.theme.colors.text_07};
    }
  }

  .spacer {
    height: 4px;
  }

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  appendElement?: (() => React.ReactNode) | null;
  message?: {
    type?: keyof typeof formFieldStatusMessageTypes;
    content: string;
  };
  defaultMessage?: {
    content: string;
    color?: string;
  };
  showFlag?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (props, ref) => {
    const {
      label,
      className,
      required,
      disabled,
      onChange,
      onFocus,
      onBlur,
      onInput,
      style,
      appendElement = null,
      message,
      defaultMessage,
      showFlag,
      ...rest
    } = props;
    let { type } = props as FormInputProps & { type?: string };
    type = type || "text";

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    let finalType = showPassword ? "text" : type;

    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isIOS()) {
        if (type === "date") (e.target as HTMLInputElement).type = "date";
      }
      if (onFocus) return onFocus(e as any);
    };
    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isIOS()) {
        if (type === "date" && (e.target as HTMLInputElement).value)
          (e.target as HTMLInputElement).type = "text";
      }
      if (onBlur) return onBlur(e as any);
    };
    const onInputInput = (e: React.FormEvent<HTMLInputElement>) => {
      const current = e.currentTarget as HTMLInputElement;
      if (type === "tel") {
        current.value = current.value.replace(/[^0-9]/g, "");
      }
      if (onInput) return onInput(e as any);
    };

    const formInputAppendElement = React.useMemo(() => {
      if (appendElement) {
        return appendElement();
      }

      if (type === "password") {
        return (
          <span className="FormInput__password--toggle">
            <Image
              title={showPassword ? "hide password" : "show password"}
              alt={showPassword ? "hide password" : "show password"}
              onClick={togglePasswordVisibility}
              src={showPassword ? visibleIcon : invisibleIcon}
              width={24}
              height={24}
            />
          </span>
        );
      }

      return null;
    }, [appendElement, type, showPassword]);

    const displayMessage =
      message ||
      (defaultMessage
        ? { type: "info" as const, content: defaultMessage.content }
        : null);

    const messageSpec = displayMessage
      ? formFieldStatusMessageTypes[
          (displayMessage.type as keyof typeof formFieldStatusMessageTypes) ||
            "info"
        ] || null
      : null;

    const isDefaultMessage = !message && defaultMessage;
    const customColor = isDefaultMessage ? defaultMessage.color : undefined;
    const finalColor = message ? messageSpec?.color : customColor || "#B2B2B2";

    const containerStyle = (
      displayMessage && finalColor
        ? {
            ...(style || {}),
            ["--ff-msg-color" as any]: finalColor,
          }
        : style
    ) as React.CSSProperties;

    return (
      <FormInputContainer
        className={className}
        data-disabled={disabled}
        style={containerStyle}
      >
        {label ? (
          <label>
            {label} {required && <span className="required-mark">*</span>}
          </label>
        ) : (
          <div className="spacer" />
        )}

        <div className={`FormInput__control ${message ? "has-message" : ""}`}>
          {showFlag && (
            <div className="FormInput__FlagContainer">
              <Icon icon="emojione:flag-for-nigeria" width={20} height={20} />
              <span>{type === "tel" ? "+234" : "NGN"}</span>
              <Icon icon="majesticons:chevron-down" width={20} height={20} />
            </div>
          )}
          <input
            {...rest}
            ref={ref}
            type={finalType}
            onChange={(e) => {
              const { inputMode } = rest || {};
              if (type === "tel" || inputMode === "numeric") {
                e.target.value = cleanNumericInput(e.target.value);
              }
              if (onChange) return onChange(e);
            }}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onInput={onInputInput}
            data-has-append={!!formInputAppendElement}
            required={required}
            disabled={disabled}
          />
          {formInputAppendElement && (
            <span className="FormInput__append">{formInputAppendElement}</span>
          )}
        </div>
        {displayMessage && (
          <p
            className={`FormInput__message FormInput__message--${
              (displayMessage.type as string) || "info"
            }`}
          >
            <Icon icon="akar-icons:info" width={16} height={16} />
            <span>{displayMessage.content}</span>
          </p>
        )}
      </FormInputContainer>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
