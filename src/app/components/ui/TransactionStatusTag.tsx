"use client";

import { FC } from "react";
import { Tag, TagType } from "./index";
import { Icon } from "@iconify/react";
import { TRANSACTION_STATUS } from "@/app/lib/shared-constants";

interface TransactionStatusTagProps {
  status?: string | null;
}

const iconStyle = { marginRight: "0.2rem" } as const;

export const TransactionStatusTag: FC<TransactionStatusTagProps> = ({
  status,
}) => {
  if (!status) return <Tag>NA</Tag>;

  const normalized = String(status).toUpperCase();

  if (normalized === TRANSACTION_STATUS.pending.label) {
    return (
      <Tag type={TagType.MAGENTA}>
        <Icon
          icon="tabler:clock-filled"
          width={16}
          height={16}
          style={iconStyle}
        />
        {status}
      </Tag>
    );
  }

  if (normalized === TRANSACTION_STATUS.success.label) {
    return (
      <Tag type={TagType.GREEN}>
        <Icon
          icon="material-symbols:check-circle-rounded"
          width={16}
          height={16}
          style={iconStyle}
        />
        {status}
      </Tag>
    );
  }

  if (normalized === TRANSACTION_STATUS.unsettled.label) {
    return (
      <Tag type={TagType.YELLOW_DARK}>
        <Icon
          icon="material-symbols:warning-rounded"
          width={16}
          height={16}
          style={iconStyle}
        />
        {status}
      </Tag>
    );
  }
  if (normalized === TRANSACTION_STATUS.ongoing.label) {
    return (
      <Tag type={TagType.YELLOW}>
        <Icon
          icon="material-symbols:clock-loader-90"
          width={16}
          height={16}
          style={iconStyle}
        />
        {status}
      </Tag>
    );
  }

  if (normalized === TRANSACTION_STATUS.failed.label) {
    return (
      <Tag type={TagType.RED}>
        <Icon
          icon="fluent:flag-20-filled"
          width={16}
          height={16}
          style={iconStyle}
        />
        {status}
      </Tag>
    );
  }

  return <Tag>{status}</Tag>;
};

export default TransactionStatusTag;
