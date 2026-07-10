"use client";

import { FC } from "react";
import styled from "styled-components";
import ErrorWarningLineIcon from "remixicon-react-redux/ErrorWarningLineIcon";
import CheckboxCircleLineIcon from "remixicon-react-redux/CheckboxCircleLineIcon";
import Color from "color";
import clsx from "clsx";
import Flex from "./Flex";

const VerificationStatusIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg[data-icon-name="ErrorWarningLineIcon"] {
    color: ${(props) => props.theme.colors.yellow};
  }

  svg[data-icon-name="CheckboxCircleLineIcon"] {
    color: ${(props) => props.theme.colors.green_01};
  }

  &.asButton:hover {
    svg[data-icon-name="ErrorWarningLineIcon"] {
      color: ${(props) => {
        return new Color(props.theme.colors.yellow).darken(0.1).hex();
      }};
    }
  }
`;

type IconProps = Partial<
  React.ComponentProps<typeof CheckboxCircleLineIcon> &
    React.ComponentProps<typeof ErrorWarningLineIcon>
>;

export interface VerificationStatusIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status?: boolean;
  asButton?: boolean;
  [key: string]: any;
}

export const VerificationStatusIcon: FC<VerificationStatusIconProps> = ({
  status = false,
  asButton = false,
  style,
  ...props
}) => {
  return (
    <VerificationStatusIconContainer
      style={style}
      className={clsx({ asButton })}
      title={status ? "VERIFIED" : "NOT VERIFIED"}
    >
      {status ? (
        <CheckboxCircleLineIcon size={18} {...(props as any)} />
      ) : (
        <ErrorWarningLineIcon size={18} {...(props as any)} />
      )}
    </VerificationStatusIconContainer>
  );
};

export interface PhoneNumber {
  countryCode?: string;
  number?: string;
  isVerified?: boolean;
}

export const renderPhoneNumber = ({
  phoneNumber = {},
  flexProps = { gap: 5 },
  iconProps = {},
}: {
  phoneNumber?: PhoneNumber;
  flexProps?: any;
  iconProps?: IconProps;
}) => {
  const { countryCode, number, isVerified } = phoneNumber ?? {};
  if (number) {
    return (
      <Flex {...flexProps}>
        <span>
          {countryCode} {number}
        </span>
        <VerificationStatusIcon status={isVerified} {...(iconProps as any)} />
      </Flex>
    );
  }
  return null;
};

export interface EmailItem {
  address?: string;
  isVerified?: boolean;
}

export const renderEmail = ({
  email = {},
  flexProps = { gap: 5 },
  iconProps = {},
}: {
  email?: EmailItem;
  flexProps?: any;
  iconProps?: IconProps;
}) => {
  const { address, isVerified } = email ?? {};
  if (address) {
    return (
      <Flex {...flexProps}>
        <span>{address}</span>
        <VerificationStatusIcon status={isVerified} {...(iconProps as any)} />
      </Flex>
    );
  }
  return null;
};

export default VerificationStatusIcon;
