"use client";

import React, { Fragment, useRef, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { formFieldStatusMessageTypes } from "@kairo/utils";

const SelectWrapper = styled.div`
  position: relative;
  width: 100% !important;

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

  .spacer {
    height: 4px;
  }

  .required-mark {
    color: ${(props) => props.theme.colors.red};
  }

  .dropDownIcon {
    color: ${(props) => props.theme.colors.text_04};
  }

  .main-control {
    position: relative;
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 8px;
    transition: all 0.3s ease-out;
  }

  .main-control:hover,
  .main-control:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
    box-shadow:
      0 0 0 4px rgba(0, 0, 0, 0.03),
      0 0 0 3px ${(props) => props.theme.colors.primaryColor}22;
  }

  .main-control.has-message {
    border-color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.inputBorder}
    );
  }

  .listbox-btn {
    width: 100%;
    background: ${(props) => props.theme.colors.white};
    font-size: 1rem;
    border: 0;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    text-align: left;
    color: ${(props) => props.theme.colors.text_02};

    .listbox-btn-label {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .listbox-btn.placeholder {
    color: ${(props) => props.theme.colors.text_07};
  }

  .options-container {
    position: absolute;
    width: 100%;
    margin-top: 0.5rem;
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.gray_02};
    border-radius: 1rem;
    max-height: 10rem;
    overflow-y: auto;
    z-index: 9999;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option {
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    cursor: pointer;
  }

  .option.selected {
    background: ${(props) => props.theme.colors.gray_02};
  }

  .message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
    position: absolute;
    bottom: -1.25rem;
    left: 0;
  }

  .message--success {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.green.color}
    );
  }

  .message--error {
    color: var(--ff-msg-color, ${(props) => props.theme.colors.tag.red.color});
  }

  .message--warning {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellowDark.color}
    );
  }

  .message--info {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellow.color}
    );
  }

  .clearBtn {
    background: none;
    border: 0;
    padding: 0;
    height: 1.3rem;
    cursor: pointer;
  }

  .search-input-wrapper {
    padding: 0.25rem 0.25rem 0.5rem;
    position: sticky;
    top: 0;
    background: ${(props) => props.theme.colors.white};
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.4rem 0.75rem;
    border: 1px solid ${(props) => props.theme.colors.gray_02};
    border-radius: 8px;
    font-size: 0.875rem;
    outline: none;
    color: ${(props) => props.theme.colors.text_02};
    background: ${(props) => props.theme.colors.white};
    box-sizing: border-box;

    &::placeholder {
      color: ${(props) => props.theme.colors.text_07};
    }

    &:focus {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }
  }

  .no-options {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text_07};
    text-align: center;
  }
`;

export interface SelectInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: Array<{ label: string; value: any }>;
  name?: string;
  label?: React.ReactNode;
  value?: any;
  onChange?:
    | React.ChangeEventHandler<HTMLSelectElement>
    | ((value: any) => void);
  placeholder?: string;
  required?: boolean;
  message?: {
    type?: keyof typeof formFieldStatusMessageTypes;
    content: string;
  };
  defaultMessage?: {
    content: string;
    color?: string;
  };
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  isLoading?: boolean;
  searchable?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  required,
  message,
  defaultMessage,
  disabled,
  width,
  height,
  isLoading,
  searchable,
  ...rest
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;
  const selected =
    value && typeof value === "object" && "value" in value
      ? (options.find((opt) => String(opt.value) === String(value.value)) ??
        null)
      : (options.find((opt) => String(opt.value) === String(value)) ?? null);

  const displayMessage =
    message ||
    (defaultMessage
      ? { type: "info" as const, content: defaultMessage.content }
      : null);

  const messageSpec = displayMessage
    ? formFieldStatusMessageTypes[
        (displayMessage.type as keyof typeof formFieldStatusMessageTypes) ||
          "info"
      ]
    : null;

  const isDefaultMessage = !message && defaultMessage;
  const customColor = isDefaultMessage ? defaultMessage?.color : undefined;
  const finalColor = message ? messageSpec?.color : customColor || "#B2B2B2";

  const containerProps =
    displayMessage && finalColor
      ? { style: { ["--ff-msg-color" as any]: finalColor } }
      : {};

  const handleChange = (val: any) => {
    if (searchable) setSearchQuery("");
    if (!onChange) return;
    if (typeof onChange === "function" && onChange.length > 0) {
      if (onChange.length === 1 && String(onChange).includes("target")) {
        (onChange as any)({ target: { name: name ?? "", value: val ?? "" } });
      } else if (onChange.length === 1) {
        (onChange as any)(val);
      } else if (onChange.length > 1) {
        const option = options.find((opt) => opt.value === val) ?? null;
        (onChange as any)(option, val);
      }
    }
  };

  const mainControlRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);

  useEffect(() => {
    function updateWidth() {
      if (mainControlRef.current) {
        setParentWidth(mainControlRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const sizeStyle: React.CSSProperties = {};
  if (width) sizeStyle.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    sizeStyle.height = typeof height === "number" ? `${height}px` : height;
  const mergedStyle = { ...(containerProps.style || {}), ...sizeStyle };
  const wrapperProps = { ...containerProps, style: mergedStyle, ...rest };

  return (
    <SelectWrapper {...wrapperProps}>
      {label ? (
        <label>
          {label} {required && <span className="required-mark">*</span>}
        </label>
      ) : (
        <div className="spacer" />
      )}

      <div
        className={`main-control ${message ? "has-message" : ""}`}
        ref={mainControlRef}
      >
        <Listbox
          value={selected?.value ?? null}
          onChange={handleChange}
          disabled={disabled}
        >
          <>
            <Listbox.Button
              className={`listbox-btn${selected ? "" : " placeholder"}`}
              disabled={disabled || isLoading}
            >
              <span
                className="listbox-btn-label"
                style={parentWidth ? { maxWidth: parentWidth - 52 } : {}}
              >
                {selected ? selected.label : placeholder}
              </span>
              {selected ? (
                <button
                  type="button"
                  aria-label="clear"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled && !isLoading) handleChange(null);
                  }}
                  className="clearBtn"
                  disabled={disabled || isLoading}
                >
                  <Icon
                    icon="ic:round-clear"
                    width={20}
                    height={20}
                    className="dropDownIcon"
                  />
                </button>
              ) : (
                <Icon
                  icon="majesticons:chevron-down"
                  width={20}
                  height={20}
                  className="dropDownIcon"
                />
              )}
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="options-container">
                {searchable && (
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search..."
                      value={searchQuery}
                      autoFocus
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <Listbox.Option
                      key={opt.value}
                      value={opt.value}
                      className={({ active, selected }) =>
                        `option ${active || selected ? "selected" : ""}`
                      }
                    >
                      <span>{opt.label}</span>
                    </Listbox.Option>
                  ))
                ) : (
                  <p className="no-options">
                    {searchable && searchQuery
                      ? "No results found"
                      : "No options available"}
                  </p>
                )}
              </Listbox.Options>
            </Transition>
          </>
        </Listbox>

        {displayMessage && (
          <p
            className={`message message--${
              (displayMessage.type as string) || "info"
            }`}
          >
            <Icon icon="akar-icons:info" width={14} height={14} />
            <span>{displayMessage.content}</span>
          </p>
        )}
      </div>
    </SelectWrapper>
  );
};

export default SelectInput;
