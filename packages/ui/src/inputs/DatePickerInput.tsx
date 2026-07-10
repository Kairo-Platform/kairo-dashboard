"use client";

import React from "react";
import { DatePicker } from "rsuite";
import "rsuite/DatePicker/styles/index.css";
import styled from "styled-components";
import { formFieldStatusMessageTypes } from "@kairo/utils";
import { Icon } from "@iconify/react";

const DatePickerInputContainer = styled.div`
  flex-grow: 1;
  line-height: 20px;
  letter-spacing: 0.25px;
  max-height: 4rem;
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
  }

  .FormInput__message {
    position: absolute;
    left: 0;
    bottom: -1.7rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    padding: 0;
    height: 20px;
    border: none !important;

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

  .rs-picker-label {
    display: none !important;
  }

  .FormInput__control .rs-picker,
  .FormInput__control .rs-picker-input,
  .FormInput__control .rs-picker-input-group,
  .FormInput__control .rs-picker-toggle,
  .FormInput__control .rs-input,
  .FormInput__control .rs-input-group {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    padding: 0 !important;
  }

  .FormInput__control .rs-picker {
    width: 100% !important;
  }

  .FormInput__control .rs-input {
    padding: 0 !important;
    height: auto !important;
    font-size: 1rem;
    color: inherit;
    background: transparent !important;
  }

  .FormInput__control .rs-picker-toggle {
    padding: 0 !important;
    background: transparent !important;
  }

  .FormInput__control .rs-picker-toggle .rs-picker-toggle-icon {
    display: none !important;
  }

  .FormInput__control .rs-picker:hover,
  .FormInput__control .rs-picker:focus,
  .FormInput__control .rs-picker:focus-within,
  .FormInput__control .rs-picker-input:focus,
  .FormInput__control .rs-input:focus,
  .FormInput__control .rs-picker-toggle:hover,
  .FormInput__control .rs-picker-toggle:focus,
  .FormInput__control .rs-picker-input-group:hover,
  .FormInput__control .rs-picker-input-group:focus {
    box-shadow: none !important;
    outline: none !important;
    border: none !important;
    background: transparent !important;
    transition: none !important;
  }

  .FormInput__control .rs-picker *:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export interface DatePickerInputProps {
  label?: React.ReactNode;
  value?: Date | null;
  required?: boolean;
  placeholder?: string;
  width?: string | number;
  disabled?: boolean;
  startDate?: Date | null | string;
  endDate?: Date | null | string;
  dateFormat?: string;
  placement?:
    | "bottomStart"
    | "bottomEnd"
    | "topStart"
    | "topEnd"
    | "auto"
    | "autoVerticalStart"
    | "autoVerticalEnd"
    | "autoHorizontalStart"
    | "autoHorizontalEnd";
  onChange?: (date: Date | null, event?: any) => void;
  message?: {
    type?: keyof typeof formFieldStatusMessageTypes;
    content: string;
  } | null;
  [key: string]: any;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = (props) => {
  const {
    label,
    value,
    required,
    onChange,
    placeholder,
    width,
    disabled,
    dateFormat = "dd MMM yyyy",
    placement = "autoVerticalEnd",
    message = null,
  } = props as DatePickerInputProps;

  const messageSpec = message
    ? formFieldStatusMessageTypes[
        (message.type as keyof typeof formFieldStatusMessageTypes) || "info"
      ] || null
    : null;

  const containerStyle = (
    messageSpec
      ? {
          ...(props.style || {}),
          ["--ff-msg-color" as any]: messageSpec.color,
          ["--ff-msg-bg" as any]: messageSpec.backgroundColor,
        }
      : props.style
  ) as React.CSSProperties | undefined;
  const adjustForTimezone = (date: any): Date | null => {
    if (!date) return null;
    date = new Date(date);
    if (date === "Invalid Date") return null;
    if (date.getTimezoneOffset() > 0) {
      const dateWithTimezoneOffset = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return dateWithTimezoneOffset;
    }
    if (date.getTimezoneOffset() < 0) {
      const dateWithTimezoneOffset = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return dateWithTimezoneOffset;
    }
    return date;
  };

  const selectedDate = adjustForTimezone(value as any);

  return (
    <DatePickerInputContainer
      style={{ ...(containerStyle || {}), width }}
      data-disabled={disabled}
      {...(disabled ? ({ disabled: true } as any) : ({} as any))}
    >
      {label ? (
        <label>
          {label} {required && <span className="required-mark">*</span>}
        </label>
      ) : (
        <div className="spacer" />
      )}

      <div className={`FormInput__control ${message ? "has-message" : ""}`}>
        <DatePicker
          value={selectedDate}
          onChange={(d: any) => onChange && onChange(d)}
          placeholder={placeholder}
          disabled={disabled}
          format={dateFormat}
          placement={placement as any}
          style={{ width: "100%" }}
          {...(props as any)}
        />
      </div>

      {message && (
        <p
          className={`FormInput__message FormInput__message--${
            (message.type as string) || "info"
          }`}
        >
          <Icon icon="akar-icons:info" width={16} height={16} />
          <span>{message.content}</span>
        </p>
      )}
    </DatePickerInputContainer>
  );
};

export default DatePickerInput;
