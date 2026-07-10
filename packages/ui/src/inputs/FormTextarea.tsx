import React from "react";
import styled from "styled-components";

const FormTextareaContainer = styled.div`
  flex-grow: 1;
  position: relative;
  label {
    display: inline-block;
    font-size: small;
    color: ${(props) => props.theme.colors.text_07};
    margin: 2px 0 6px 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .required-mark {
    color: ${(props) => props.theme.colors.red};
  }
  .FormTextarea__append {
    position: absolute;
    top: 30px;
    right: 14px;
    z-index: 1;
  }
  .FormTextarea__password--toggle {
    cursor: pointer;
  }
  .FormTextarea__control {
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 8px;
    padding: 10px 14px 10px 14px;
    transition: all 0.3s ease-out;
    display: flex;
    align-items: flex-start;
    &:focus-within {
      border-color: ${(props) => props.theme.colors.primaryColor};
      box-shadow:
        0 0 0 4px rgba(0, 0, 0, 0.03),
        0 0 0 3px ${(props) => props.theme.colors.primaryColor}22;
    }
  }
  .FormTextarea__message {
    position: absolute;
    left: 0;
    bottom: -1.5rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .FormTextarea__message--success {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.green.color}
    );
  }
  .FormTextarea__message--error {
    color: var(--ff-msg-color, ${(props) => props.theme.colors.tag.red.color});
  }
  .FormTextarea__message--warning {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellowDark.color}
    );
  }
  .FormTextarea__message--info {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellow.color}
    );
  }
  textarea {
    display: block;
    width: 100%;
    font-size: 1rem;
    border: none;
    outline: none;
    color: ${(props) => props.theme.colors.text_01};
    padding: 0;
    min-height: 20px;
    resize: none;
    font-family: inherit;
    background: transparent;
    &::placeholder {
      color: ${(props) => props.theme.colors.text_07};
    }
  }
  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  message?: {
    type?: "success" | "error" | "warning" | "info";
    content: string;
  };
  defaultMessage?: {
    content: string;
    color?: string;
  };
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>((props, ref) => {
  const {
    label,
    className,
    required,
    disabled,
    onChange,
    style,
    rows = 3,
    message,
    defaultMessage,
    ...rest
  } = props;

  const displayMessage =
    message ||
    (defaultMessage
      ? { type: "info" as const, content: defaultMessage.content }
      : null);

  const finalColor =
    message || !defaultMessage
      ? undefined
      : (defaultMessage.color ?? "#B2B2B2");

  const containerStyle = (
    displayMessage && finalColor
      ? {
          ...(style || {}),
          ["--ff-msg-color" as any]: finalColor,
        }
      : style
  ) as React.CSSProperties;

  return (
    <FormTextareaContainer
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
      <div className="FormTextarea__control">
        <textarea
          {...rest}
          ref={ref}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
        />
      </div>
      {displayMessage && (
        <p
          className={`FormTextarea__message FormTextarea__message--${displayMessage.type || "info"}`}
        >
          <span>{displayMessage.content}</span>
        </p>
      )}
    </FormTextareaContainer>
  );
});

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
