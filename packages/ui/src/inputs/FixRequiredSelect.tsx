/* eslint-disable react/no-inline-styles */
// https://codesandbox.io/s/react-select-v2-required-input-3xvvb
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const noop = () => {
  // no operation
};

interface FixRequiredSelectProps {
  SelectComponent: React.ComponentType<any>;
  value?: any;
  onChange?: (value: any, actionMeta?: any) => void;
  required?: boolean;
  isDisabled?: boolean;
  [key: string]: any;
}

interface FixRequiredSelectState {
  value: any;
}

export class FixRequiredSelect extends React.Component<
  FixRequiredSelectProps,
  FixRequiredSelectState
> {
  private selectRef: any = null;
  static defaultProps = { onChange: noop };

  constructor(props: FixRequiredSelectProps) {
    super(props);
    this.state = {
      value: this.props.value || "",
    };

    this.setSelectRef = this.setSelectRef.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  setSelectRef(ref: any) {
    this.selectRef = ref;
  }

  onChange(value: any, actionMeta?: any) {
    if (this.props.onChange) this.props.onChange(value, actionMeta);
    this.setState({ value });
  }

  getValue() {
    if (this.props.value != undefined) return this.props.value;
    return this.state.value || "";
  }

  render() {
    const { SelectComponent, required, ...props } = this.props;
    const { isDisabled } = this.props as any;
    const enableRequired = !isDisabled;

    const Wrapper = styled.div`
      position: relative;
    `;

    const HiddenInput = styled.input`
      opacity: 0;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    `;

    return (
      <Wrapper>
        <SelectComponent
          {...props}
          ref={this.setSelectRef}
          onChange={this.onChange}
        />
        {enableRequired && (
          <HiddenInput
            tabIndex={-1}
            autoComplete="off"
            aria-label="Hidden required select input"
            title="Hidden required select input"
            value={this.getValue()}
            onChange={noop}
            onFocus={() =>
              this.selectRef && this.selectRef.focus && this.selectRef.focus()
            }
            required={required}
          />
        )}
      </Wrapper>
    );
  }
}

// defaultProps set as static property on the class above

FixRequiredSelect.propTypes = {
  // react-select component class (e.g. Select, Creatable, Async)
  SelectComponent: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default FixRequiredSelect;
