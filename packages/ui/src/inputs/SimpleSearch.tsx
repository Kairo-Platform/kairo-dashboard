"use client";

import React from "react";
import styled from "styled-components";
import clearIcon from "./icons/search/clear.svg";
import searchIcon from "./icons/search/search.svg";
import Image from "next/image";

const SimpleSearchContainer = styled.div`
  background: ${(props) => props.theme.colors.ui_07};
  border: 1px solid ${(props) => props.theme.colors.inputBorder};
  border-radius: 4px;
  padding: 10px;
  line-height: 20px;
  letter-spacing: 0.25px;
  max-height: 4rem;
  /* transition: 0.5s; */
  position: relative;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primaryColor};
  }

  .SearchInput__action-wrapper {
    position: absolute;
    top: 12px;
    right: 16px;
    display: flex;
    gap: 6px;
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
      background-color: ${(props) => props.theme.colors.gray_02};
    }
  }

  input {
    display: block;
    width: 100%;
    font-size: 1rem;
    border: none;
    outline: none;
    color: ${(props) => props.theme.colors.text_02};
    padding: 0 50px 0 0;

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
  }
`;

export interface SimpleSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  onClear?: () => void;
  onSearch?: () => void;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({
  name,
  value,
  placeholder,
  onChange,
  onKeyUp,
  onClear,
  onSearch,
  ...rest
}) => {
  return (
    <SimpleSearchContainer {...rest}>
      <input
        type="search"
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      <span className="SearchInput__action-wrapper">
        {value && (
          <button
            type="button"
            className="SearchInput__clear"
            onClick={onClear}
            aria-label="clear search"
          >
            <Image
              title="clear"
              src={clearIcon}
              width={10}
              height={10}
              alt="X"
            />
          </button>
        )}
        <button
          type="button"
          className="SearchInput__search"
          onClick={onSearch}
          aria-label="search"
        >
          <Image
            title="search"
            src={searchIcon}
            width={14}
            height={14}
            alt="🔍"
          />
        </button>
      </span>
    </SimpleSearchContainer>
  );
};

export default SimpleSearch;
