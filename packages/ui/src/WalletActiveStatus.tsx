"use client";

import type { FC } from "react";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import Tag, { TagType } from "./Tag";
import humanize from "underscore.string/humanize";

const WalletActiveStatusContainer = styled.span`
  font-size: 14px;
  display: inline-flex;
  align-items: center;
`;

const iconStyle = { verticalAlign: "middle", marginRight: 4 };

interface WalletActiveStatusProps {
  status: "ACTIVE" | "SUSPENDED";
}

export const WalletActiveStatus: FC<WalletActiveStatusProps> = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <WalletActiveStatusContainer>
      <Tag type={isActive ? TagType.GREEN : TagType.YELLOW_DARK}>
        {isActive ? (
          <Icon
            icon="material-symbols:check-circle-rounded"
            width={16}
            height={16}
            style={iconStyle}
          />
        ) : (
          <Icon
            icon="material-symbols:warning-rounded"
            width={16}
            height={16}
            style={iconStyle}
          />
        )}
        {humanize(status)}
      </Tag>
    </WalletActiveStatusContainer>
  );
};

export default WalletActiveStatus;
