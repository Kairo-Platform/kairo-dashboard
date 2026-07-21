import React from "react";
import styled from "styled-components";
import clsx from "clsx";
import { Flex } from "../Flex";

const SwitchContainer = styled.div`
  --switch-width: 54px;
  --switch-height: 24px;
  --switch-track-border: 2px;
  --switch-track-radius: 24px;
  --switch-knob-width: 32px;
  --switch-knob-height: 16px;
  --switch-knob-radius: 16px;
  --switch-knob-top: 2px;
  --switch-knob-left: 2px;
  --switch-checked-translate: 14px;

  --switch-small-width: 32px;
  --switch-small-height: 16px;
  --switch-small-knob: 10px;
  --switch-small-knob-top: 1px;
  --switch-small-knob-radius: 16px;
  --switch-small-checked-translate: 14px;

  label {
    position: relative;
    width: max-content;
    display: flex;
    width: 100%;
    gap: 10px;
    cursor: pointer;
    // margin-bottom: 10px;
  }

  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    z-index: 2;
    width: 24px;
    height: 24px;
    top: 0;
    left: 0;
    cursor: pointer;
  }

  input[type="checkbox"] + .input--styled {
    display: inline-block;
    position: relative;
    width: var(--switch-width);
    height: var(--switch-height);
    min-width: var(--switch-width);
    min-height: var(--switch-height);
    background: ${(props) => props.theme.colors.ui_07};
    border-radius: var(--switch-track-radius);
    border: var(--switch-track-border) solid
      ${(props) => props.theme.colors.gray_02};

    &:hover {
      background-color: ${(props) => props.theme.colors.gray_02};
    }
  }

  input[type="checkbox"]:checked + .input--styled {
    background-color: ${(props) => props.theme.colors.orange};
    border-color: ${(props) => props.theme.colors.orange};
  }

  .icon-switch {
    position: absolute;
    top: var(--switch-knob-top);
    left: var(--switch-knob-left);
    width: var(--switch-knob-width);
    height: var(--switch-knob-height);
    min-width: var(--switch-knob-width);
    min-height: var(--switch-knob-height);
    border-radius: var(--switch-knob-radius);
    background-color: ${(props) => props.theme.colors.gray_04};
    transition: transform 0.25s ease-out;
  }

  input[type="checkbox"]:checked + .input--styled > .icon-switch {
    transform: translateX(var(--switch-checked-translate));
    background-color: ${(props) => props.theme.colors.white};
    transition: all 0.3s ease-out;

    &:hover {
      background-color: ${(props) => props.theme.colors.orangeDark};
    }
  }

  .input__label {
    line-height: 24px;
    color: ${(props) => props.theme.colors.text_06};
  }

  &[data-disabled="true"] {
    opacity: 0.55;
    pointer-events: none;
  }

  .switch--small {
    margin-bottom: 0;

    input[type="checkbox"] {
      width: var(--switch-small-height);
      height: var(--switch-small-height);
    }

    input[type="checkbox"] + .input--styled {
      width: var(--switch-small-width);
      height: var(--switch-small-height);
      min-width: var(--switch-small-width);
      min-height: var(--switch-small-height);
    }

    .icon-switch {
      width: var(--switch-small-knob);
      height: var(--switch-small-knob);
      min-width: var(--switch-small-knob);
      min-height: var(--switch-small-knob);
      border-radius: var(--switch-small-knob-radius);
      top: var(--switch-small-knob-top);
    }

    input[type="checkbox"]:checked + .input--styled > .icon-switch {
      transform: translateX(var(--switch-small-checked-translate));
    }
  }

  .switch--greenon {
    input[type="checkbox"]:checked + .input--styled {
      background-color: ${(props) => props.theme.colors.tag.green.color};
      border-color: ${(props) => props.theme.colors.tag.green.color};
    }
  }

  .switch--yellowoff {
    input[type="checkbox"] + .input--styled {
      background-color: ${(props) => props.theme.colors.tag.yellow.color};
      border-color: ${(props) => props.theme.colors.tag.yellow.color};
    }
  }
`;
export const SwitchInputSize = {
  SMALL: "small",
};

export const SwitchInputTheme = {
  GREENON: "greenon",
  YELLOWOFF: "yellowoff",
};

export interface SwitchInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: React.ReactNode;
  size?: string;
  theme?: string[];
  name?: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  label = "",
  size,
  theme = [],
  name,
  value = false,
  disabled = false,
  onChange = () => null,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <SwitchContainer data-disabled={disabled}>
      <label
        className={clsx({
          "switch--small": size === SwitchInputSize.SMALL,
          "switch--greenon": theme.includes(SwitchInputTheme.GREENON),
          "switch--yellowoff": theme.includes(SwitchInputTheme.YELLOWOFF),
        })}
      >
        <Flex gap={10} align="center">
          <input
            type="checkbox"
            name={name}
            disabled={disabled}
            onChange={handleChange}
            checked={value}
            id="switch"
          />
          <div className="input--styled">
            <span className="icon-switch" />
          </div>
          {label && <span className="input__label">{label}</span>}
        </Flex>
      </label>
    </SwitchContainer>
  );
};

export default SwitchInput;
