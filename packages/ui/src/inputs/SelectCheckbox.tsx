"use client";

import React, { useState } from "react";
import styled from "styled-components";
import checkIcon from "./icons/checkbox-input/check.svg";
import caretDownIcon from "./icons/select/caret-down.svg";
import Image from "next/image";

const SelectCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: fit-content;
  min-width: 200px;

  .checkboxes {
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 4px;
    padding: 10px;
    background: ${(props) => props.theme.colors.ui_07};
  }

  .select {
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
    background-color: ${(props) => props.theme.colors.ui_07};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    background-image: url("${caretDownIcon}");
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) center;
    background-size: 10px;
    &[data-disabled="true"] {
      opacity: 0.55;
      pointer-events: none;
    }
  }

  .picked__value {
    text-transform: capitalize;
    :last-child {
      margin-right: 20px;
    }
  }

  label {
    position: relative;
    width: max-content;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 6px;
    }
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
    background: ${(props) => props.theme.colors.ui_07};
    border: 2px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 2px;
  }

  input[type="checkbox"]:focus + .input--styled {
    border: 2px solid ${(props) => props.theme.colors.primaryColor};
  }

  input[type="checkbox"]:checked + .input--styled {
    background: ${(props) => props.theme.colors.primaryColor};
    border: 2px solid ${(props) => props.theme.colors.primaryColor};
  }

  .icon--check {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .input__label {
    line-height: 24px;
  }
`;

export type SelectOption =
  | string
  | {
      label?: string;
      value?: string;
    };

export interface SelectCheckboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options?: SelectOption[];
  name?: string;
  value?: string[];
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export const SelectCheckbox: React.FC<SelectCheckboxProps> = ({
  options = [],
  name,
  value = [],
  required,
  disabled,
  onChange = () => null,
  placeholder,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value: targetValue } = e.target;
    const valueSet = new Set(value);
    if (checked) valueSet.add(targetValue);
    if (!checked) valueSet.delete(targetValue);
    onChange([...valueSet]);
  };

  return (
    <SelectCheckboxContainer>
      <div
        onClick={() => setExpanded(!expanded)}
        data-disabled={disabled}
        className="select"
      >
        {value.length
          ? value.map((name, index) => (
              <span key={name} className="picked__value">
                {index ? ", " : null}
                {name}
              </span>
            ))
          : placeholder || "Select..."}
      </div>
      {expanded && (
        <div className="checkboxes" data-disabled={disabled}>
          {options.map((option, index) => {
            const optionValue =
              typeof option === "string"
                ? option
                : (option.value ?? option.label ?? "");
            const optionLabel =
              typeof option === "string"
                ? option
                : (option.label ?? option.value ?? "");

            return (
              <label key={optionValue || index}>
                <span className="input__label">{optionLabel}</span>
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
                  {option && (
                    <span className="icon--check">
                      <Image
                        alt="check"
                        src={checkIcon}
                        width={10}
                        height={10}
                      />
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </SelectCheckboxContainer>
  );
};

export default SelectCheckbox;
