"use client";

import styled from "styled-components";
import clsx from "clsx";
import { getInitials } from "@/app/lib/utils";

const InitialsAvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primaryColor};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => props.theme.colors.white};

  &.shape-rounded {
    border-radius: 3px;
  }

  &.shape-square {
    border-radius: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`;

export const InitialsAvatarShape = {
  CIRCLE: "CIRCLE",
  ROUNDED: "ROUNDED",
  SQUARE: "SQUARE",
};

export const InitialsAvatar = ({
  name = "",
  shape = InitialsAvatarShape.CIRCLE,
  avatarUrl = "",
}) => {
  return (
    <InitialsAvatarContainer
      className={clsx({
        "shape-circle": shape === InitialsAvatarShape.CIRCLE,
        "shape-rounded": shape === InitialsAvatarShape.ROUNDED,
        "shape-square": shape === InitialsAvatarShape.SQUARE,
      })}
    >
      {avatarUrl ? <img src={avatarUrl} alt={name} /> : getInitials(name)}
    </InitialsAvatarContainer>
  );
};

export default InitialsAvatar;
