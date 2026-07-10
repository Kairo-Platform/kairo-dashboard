"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Button from "./Button";
import Flex from "./Flex";
import styled from "styled-components";

const ToggleShowAmountAndFormatCurrencyContainer = styled.div`
  .ToggleShowAmountBtn {
    color: ${(prop) => prop.theme.colors.white};
    background: transparent;
    border: none;
    cursor: pointer;
    margin-right: 0.2rem;
  }
`;

export interface ToggleShowAmountAndFormatCurrencyProps {
  amount?: number | string;
  symbol?: string;
  decimalPlaces?: number;
  toggleShowAmount?: boolean;
  defaultShowAmount?: boolean;
  className?: string;
}

export const ToggleShowAmountAndFormatCurrency: React.FC<
  ToggleShowAmountAndFormatCurrencyProps
> = ({
  amount = 0,
  symbol = "",
  decimalPlaces = 0,
  toggleShowAmount = false,
  defaultShowAmount = false,
  className = "",
}) => {
  const [showAmount, setShowAmount] = useState(defaultShowAmount);
  const formattedAmount = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces || 2,
  });
  return (
    <ToggleShowAmountAndFormatCurrencyContainer>
      <Flex
        align="center"
        gap="0.5rem"
        justify="space-between"
        className={className}
      >
        {toggleShowAmount ? (
          <>
            {symbol}
            {showAmount ? formattedAmount : "********"}
            <div>
              <button
                type="button"
                aria-label="toggle-show-amount"
                className="ToggleShowAmountBtn"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setShowAmount((prev) => !prev);
                }}
              >
                {showAmount ? (
                  <Icon icon="lucide:eye" width={20} height={20} />
                ) : (
                  <Icon icon="octicon:eye-closed-16" width={20} height={20} />
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {symbol}
            {formattedAmount}
          </>
        )}
      </Flex>
    </ToggleShowAmountAndFormatCurrencyContainer>
  );
};

export default ToggleShowAmountAndFormatCurrency;
