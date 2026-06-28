import React from "react";
import styled from "styled-components";

const RadioContainer = styled.div<{ $direction?: string; $justify?: string }>`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: ${(p) => p.$direction || "column"};
  justify-content: ${(p) => p.$justify || "flex-start"};

  &[data-disabled="true"] {
    opacity: 0.55;
    pointer-events: none;
  }

  label {
    position: relative;
    width: max-content;
    display: flex;
    gap: 8px;
    cursor: pointer;
    align-items: center;
  }

  .radio--styled {
    position: relative;
    border: 2px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 100%;
    width: 24px;
    height: 24px;
    transition: border 0.25s linear;
  }

  .radio--styled .radio--inner {
    display: block;
    position: absolute;
    border-radius: 100%;
    height: 12px;
    width: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition:
      background 0.15s linear,
      opacity 0.15s linear;
    opacity: 0;
    background: transparent;
  }

  input[type="radio"] {
    opacity: 0;
    position: absolute;
    z-index: 6;
    width: 24px;
    height: 24px;
    top: 0;
    left: 4px;
    cursor: pointer;
  }

  input[type="radio"]:checked ~ .radio--styled .radio--inner {
    background: ${(props) => props.theme.colors.primaryColor};
    opacity: 1;
  }

  input[type="radio"]:checked ~ .radio--styled {
    border: 2px solid ${(props) => props.theme.colors.primaryColor};
  }

  &[data-disabled="true"] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export type RadioOption =
  | string
  | {
      label: string;
      value: string;
      color?: string;
    };

export interface RadioInputProps {
  direction?: "row" | "column" | string;
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | string;
  options?: RadioOption[];
  name?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioInput: React.FC<RadioInputProps> = ({
  direction = "column",
  justify = "flex-start",
  options = [],
  name,
  required,
  disabled,
  value: radioValue = "",
  onChange = () => undefined,
}) => {
  // const [radioValue, setRadioValue] = useState(defaultValue)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // setRadioValue(() => {
    //   onChange(e.target.value)
    //   return e.target.value
    // })
  };

  // useEffect(() => {
  //   setRadioValue(defaultValue)
  // }, [defaultValue])

  const dynamicCss = React.useMemo(() => {
    return options
      .map((opt) => {
        const { value, color } =
          typeof opt === "string"
            ? { value: opt, color: undefined as string | undefined }
            : opt;
        if (!color) return "";
        const safeValue = value.replace(/"/g, '\\"');
        const slug = `rdi-${value.replace(/[^a-z0-9_-]/gi, "-").slice(0, 40)}`;
        return `input[type="radio"][value="${safeValue}"]:checked ~ .radio--styled .radio--inner.${slug} { background: ${color}; opacity: 1; }`;
      })
      .filter(Boolean)
      .join("\n");
  }, [options]);

  return (
    <RadioContainer
      $direction={direction}
      $justify={justify}
      data-disabled={disabled}
    >
      {dynamicCss ? <style>{dynamicCss}</style> : null}
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;

        const slug = `rdi-${value.replace(/[^a-z0-9_-]/gi, "-").slice(0, 40)}`;
        const isChecked = radioValue === value;

        return (
          <label key={value}>
            <input
              type="radio"
              name={name}
              value={value}
              required={required && radioValue === ""}
              disabled={disabled}
              onChange={handleChange}
              checked={isChecked}
            />
            <div className="radio--styled">
              <span className={`radio--inner ${slug}`} />
            </div>
            <span className="input__label">{label}</span>
          </label>
        );
      })}
    </RadioContainer>
  );
};

export default RadioInput;
