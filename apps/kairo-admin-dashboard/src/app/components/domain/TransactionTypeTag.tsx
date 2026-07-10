"use client";

import { FC } from "react";
import { Tag, TagType } from "@kairo/ui";
import { WALLET_TRANSACTION_TYPE } from "@/app/lib/shared-constants";

interface TransactionTypeTagProps {
  status?: string | null;
}

const iconStyle = { marginRight: "0.2rem" } as const;

export const TransactionTypeTag: FC<TransactionTypeTagProps> = ({ status }) => {
  if (!status) return <Tag>NA</Tag>;

  const normalized = String(status).toUpperCase();

  if (normalized === WALLET_TRANSACTION_TYPE.CREDIT.label) {
    return (
      <Tag type={TagType.GREEN}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.33331 8.00065C1.33331 4.31875 4.31808 1.33398 7.99998 1.33398C11.6819 1.33398 14.6666 4.31875 14.6666 8.00065C14.6666 11.6825 11.6819 14.6673 7.99998 14.6673C4.31808 14.6673 1.33331 11.6825 1.33331 8.00065ZM8.49998 5.17253C8.49998 4.89638 8.27612 4.67253 7.99998 4.67253C7.72384 4.67253 7.49998 4.89638 7.49998 5.17253V7.50095H5.17155C4.89541 7.50095 4.67155 7.72481 4.67155 8.00095C4.67155 8.27709 4.89541 8.50095 5.17155 8.50095H7.49998V10.8294C7.49998 11.1055 7.72384 11.3294 7.99998 11.3294C8.27612 11.3294 8.49998 11.1055 8.49998 10.8294V8.50095H10.8284C11.1045 8.50095 11.3284 8.27709 11.3284 8.00095C11.3284 7.72481 11.1045 7.50095 10.8284 7.50095H8.49998V5.17253Z"
            fill="currentColor"
          />
        </svg>
        {status}
      </Tag>
    );
  }

  if (normalized === WALLET_TRANSACTION_TYPE.DEBIT.label) {
    return (
      <Tag type={TagType.RED}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.33331 7.99967C1.33331 4.31778 4.31808 1.33301 7.99998 1.33301C11.6819 1.33301 14.6666 4.31778 14.6666 7.99967C14.6666 11.6816 11.6819 14.6663 7.99998 14.6663C4.31808 14.6663 1.33331 11.6816 1.33331 7.99967ZM10.8284 8.49998C11.1045 8.49998 11.3284 8.27612 11.3284 7.99998C11.3284 7.72383 11.1045 7.49998 10.8284 7.49998H5.17155C4.89541 7.49998 4.67155 7.72383 4.67155 7.99998C4.67155 8.27612 4.89541 8.49998 5.17155 8.49998H10.8284Z"
            fill="currentColor"
          />
        </svg>
        {status}
      </Tag>
    );
  }

  if (normalized === WALLET_TRANSACTION_TYPE.CHARGE.label) {
    return (
      <Tag type={TagType.GREY}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.33331 7.99967C1.33331 4.31778 4.31808 1.33301 7.99998 1.33301C11.6819 1.33301 14.6666 4.31778 14.6666 7.99967C14.6666 11.6816 11.6819 14.6663 7.99998 14.6663C4.31808 14.6663 1.33331 11.6816 1.33331 7.99967ZM10.8284 8.49998C11.1045 8.49998 11.3284 8.27612 11.3284 7.99998C11.3284 7.72383 11.1045 7.49998 10.8284 7.49998H5.17155C4.89541 7.49998 4.67155 7.72383 4.67155 7.99998C4.67155 8.27612 4.89541 8.49998 5.17155 8.49998H10.8284Z"
            fill="currentColor"
          />
        </svg>
        {status}
      </Tag>
    );
  }

  if (normalized === WALLET_TRANSACTION_TYPE.COMMISSION.label) {
    return (
      <Tag type={TagType.MAGENTA}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.33331 8.00065C1.33331 4.31875 4.31808 1.33398 7.99998 1.33398C11.6819 1.33398 14.6666 4.31875 14.6666 8.00065C14.6666 11.6825 11.6819 14.6673 7.99998 14.6673C4.31808 14.6673 1.33331 11.6825 1.33331 8.00065ZM8.49998 5.17253C8.49998 4.89638 8.27612 4.67253 7.99998 4.67253C7.72384 4.67253 7.49998 4.89638 7.49998 5.17253V7.50095H5.17155C4.89541 7.50095 4.67155 7.72481 4.67155 8.00095C4.67155 8.27709 4.89541 8.50095 5.17155 8.50095H7.49998V10.8294C7.49998 11.1055 7.72384 11.3294 7.99998 11.3294C8.27612 11.3294 8.49998 11.1055 8.49998 10.8294V8.50095H10.8284C11.1045 8.50095 11.3284 8.27709 11.3284 8.00095C11.3284 7.72481 11.1045 7.50095 10.8284 7.50095H8.49998V5.17253Z"
            fill="currentColor"
          />
        </svg>
        {status}
      </Tag>
    );
  }

  return <Tag>{status}</Tag>;
};

export default TransactionTypeTag;
