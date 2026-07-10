import React from "react";
import styled from "styled-components";
import { ErrorMessage } from "@hookform/error-message";
import humanize from "underscore.string/humanize";

const FormInputWithErrorContainer = styled.div`
  flex: 1;
  .form-error {
    color: ${(props) => props.theme.colors.red};
    font-size: small;
    margin-top: 5px;
  }
`;

interface FormInputWithErrorProps {
  children?: React.ReactNode;
  render?: (name?: string) => React.ReactNode;
  name?: string;
  errors?: any;
  style?: React.CSSProperties;
}

export const FormInputWithError: React.FC<FormInputWithErrorProps> = ({
  children,
  render = (name?: string) => name,
  name,
  errors,
  style,
}) => {
  return (
    <FormInputWithErrorContainer style={style}>
      {children ? children : render(name)}
      {name && errors && (
        <ErrorMessage
          name={name}
          errors={errors}
          render={({ message }: { message: any }) => (
            <div className="form-error">{humanize(message)}</div>
          )}
        />
      )}
    </FormInputWithErrorContainer>
  );
};

export default FormInputWithError;
