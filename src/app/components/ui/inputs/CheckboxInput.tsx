"use client";

import React from "react";
import styled from "styled-components";
import { formFieldStatusMessageTypes } from "@/app/lib/utils/formFieldStatusMessageTypes";
import { Icon } from "@iconify/react";
import Flex from "../Flex";

const CheckboxContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  label {
    position: relative;
    width: max-content;
    display: flex;
    /* width: 100%; */
    gap: 10px;
    cursor: pointer;
  }

  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    z-index: 2;
    width: 24px;
    height: 24px;
    top: 0;
    left: 4px;
    cursor: pointer;
  }

  input[type="checkbox"] + .input--styled {
    flex-basis: 24px;
    display: inline-block;
    position: relative;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
  }

  input[type="checkbox"]:focus + .input--styled,
  input[type="checkbox"]:hover + .input--styled {
    border: 2px solid ${(props) => props.theme.colors.primaryColor};
  }

  input[type="checkbox"]:checked + .input--styled {
    background: ${(props) => props.theme.colors.primaryColor};
    border: 2px solid ${(props) => props.theme.colors.primaryColor};
    color: ${(props) => props.theme.colors.white};
  }

  .icon--check {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${(props) => props.theme.colors.gray_02};
    transition:
      color 0.15s ease-in-out,
      opacity 0.15s ease-in-out;
    opacity: 1;
    pointer-events: none;
  }

  .input__label {
    line-height: 24px;
  }

  .CheckboxContainer__message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }

  .CheckboxContainer__message--success {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.green.color}
    );
  }
  .CheckboxContainer__message--error {
    color: var(--ff-msg-color, ${(props) => props.theme.colors.tag.red.color});
  }
  .CheckboxContainer__message--warning {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellowDark.color}
    );
  }
  .CheckboxContainer__message--info {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellow.color}
    );
  }

  &[data-disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

type OptionItem =
  | string
  | {
      value: string;
      label?: string | React.ReactNode | (() => React.ReactNode);
    };

type CheckboxInputProps = {
  direction?: React.CSSProperties["flexDirection"];
  options?: OptionItem[];
  name?: string;
  value?: string[];
  required?: boolean;
  disabled?: boolean;
  onChange?: (values: string[]) => void;
  message?: {
    type?: keyof typeof formFieldStatusMessageTypes;
    content: string;
  };
  style?: React.CSSProperties;
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  direction = "column",
  options = [],
  name,
  value = [],
  required,
  disabled,
  onChange = () => null,
  message,
  style,
}) => {
  const messageSpec = message
    ? formFieldStatusMessageTypes[
        (message.type as keyof typeof formFieldStatusMessageTypes) || "info"
      ] || null
    : null;

  const containerStyle = (
    messageSpec
      ? {
          ...(style || {}),
          ["--ff-msg-color" as any]: messageSpec.color,
          ["--ff-msg-bg" as any]: messageSpec.backgroundColor,
        }
      : style
  ) as React.CSSProperties;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value: targetValue } = e.target;
    const valueSet = new Set<string>(value);
    if (checked) valueSet.add(targetValue);
    if (!checked) valueSet.delete(targetValue);
    onChange([...valueSet]);
  };

  return (
    <CheckboxContainer
      className={message ? "has-message" : undefined}
      style={{ ...(containerStyle || {}), flexDirection: direction }}
      data-disabled={disabled ? true : undefined}
    >
      {options.map((option, index) => {
        const isObject = typeof option !== "string";
        const optionValue = isObject ? option.value : option;
        const rawLabel = isObject ? (option.label ?? option.value) : option;
        const optionLabel =
          typeof rawLabel === "function" ? rawLabel() : rawLabel;

        return (
          <label key={index}>
            <Flex align="center" gap="0.5rem">
              <input
                type="checkbox"
                name={name}
                value={optionValue}
                required={required && value.length === 0}
                disabled={disabled}
                onChange={handleChange}
                checked={value.includes(optionValue)}
              />
              <div className="input--styled">
                <span className="icon--check">
                  <Icon
                    icon="material-symbols:check-rounded"
                    width={13}
                    height={13}
                  />
                </span>
              </div>
              <span className="input__label">
                {optionLabel as React.ReactNode}
              </span>
            </Flex>
          </label>
        );
      })}
      {message && (
        <p
          className={`CheckboxContainer__message CheckboxContainer__message--${
            (message.type as string) || "info"
          }`}
          style={{ color: messageSpec ? messageSpec.color : undefined }}
          role="status"
          aria-live="polite"
        >
          <Icon icon="akar-icons:info" width={16} height={16} />
          <span>{message.content}</span>
        </p>
      )}
    </CheckboxContainer>
  );
};

export default CheckboxInput;
