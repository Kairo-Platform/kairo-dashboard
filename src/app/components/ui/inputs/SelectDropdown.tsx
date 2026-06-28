import React from "react";
import styled from "styled-components";
import caretDownIcon from "./icons/select/caret-down.svg";

const SelectDropDownElement = styled.div`
  select {
    appearance: none;
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 4px;
    color: ${(props) => props.theme.colors.text_02};
    background-color: ${(props) => props.theme.colors.white};
    background-image: url("${caretDownIcon}");
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) center;
    background-size: 10px;
    border-radius: 4px;
    padding: 4px 10px;
    line-height: 20px;
    letter-spacing: 0.25px;
    padding: 4px calc(10px + 1rem) 4px 10px;
    cursor: pointer;
    /* transition: 0.5s; */

    &:focus {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }
  }

  &[data-disabled="true"] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export interface SelectDropDownProps {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
  options?: string[];
  value?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
}

export const SelectDropDown: React.FC<SelectDropDownProps> = ({
  onChange = () => undefined,
  placeholder,
  options = [],
  value,
  disabled,
  required,
  ariaLabel,
}) => (
  <SelectDropDownElement data-disabled={disabled}>
    <select
      onChange={onChange}
      disabled={disabled}
      required={required}
      value={value}
      aria-label={ariaLabel ?? placeholder ?? "Select"}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </SelectDropDownElement>
);

export default SelectDropDown;
