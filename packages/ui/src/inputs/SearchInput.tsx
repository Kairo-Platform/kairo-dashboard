"use client";

import React from "react";
import styled from "styled-components";
import Flex from "../Flex";
import { Icon } from "@iconify/react";

const SearchInputContainer = styled.div`
  line-height: 20px;
  letter-spacing: 0.25px;
  max-height: 4rem;
  position: relative;
  transition: all 0.3s ease-out;

  .SearchInput__control {
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 1.5rem;
    padding: 13px;
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
  }

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

  .SearchInput__clear,
  .SearchInput__search {
    width: 20px;
    height: 20px;
    background: transparent;
    border-radius: 2px;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* transition: 0.5s; */

    &:hover {
      background-color: rgba(0, 0, 0, 0.055);
    }
  }

  input {
    display: block;
    width: 100%;
    font-size: 1rem;
    border: none;
    outline: none;
    color: ${(props) => props.theme.colors.text_02};
    background: transparent;
    height: 20px;

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
  }
`;

export interface SearchInputProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  name?: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  onClear?: () => void;
  onSearch?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  name,
  value,
  required,
  placeholder,
  onChange,
  onKeyUp,
  onClear,
  onSearch,
  ...rest
}) => {
  return (
    <SearchInputContainer {...rest}>
      {label ? (
        <label>
          {label} {required && <span className="required-mark">*</span>}
        </label>
      ) : (
        <div className="spacer" />
      )}
      <div className="SearchInput__control">
        <Flex gap="0.5rem" align="center" style={{ width: "100%" }}>
          <button
            type="button"
            className="SearchInput__search"
            onClick={onSearch}
            aria-label="search"
          >
            <Icon icon="iconamoon:search-bold" width="14" height="14" />
          </button>
          <input
            type="search"
            value={value}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onKeyUp={onKeyUp}
          />
          {value && (
            <button
              type="button"
              className="SearchInput__clear"
              onClick={onClear}
              aria-label="clear"
            >
              <Icon icon="ic:round-clear" width="14" height="14" />
            </button>
          )}
        </Flex>
      </div>
    </SearchInputContainer>
  );
};

export default SearchInput;
