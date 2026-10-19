"use client";

import { Icon } from "@iconify/react";
import styled from "styled-components";

const PercentageChangeContainer = styled.span<{
  $direction: "up" | "down" | null;
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.125rem;
  color: ${({ theme, $direction }) =>
    $direction === "up"
      ? theme.colors.green
      : $direction === "down"
        ? theme.colors.red
        : theme.colors.text_02};
`;

export function DashboardPercentageChange({
  value,
  className = "percentage-change",
}: {
  value?: number | null;
  className?: string;
}) {
  const available = value != null && Number.isFinite(value);
  const direction =
    available && value !== 0 ? (value > 0 ? "up" : "down") : null;
  const label = available
    ? `${value > 0 ? "+" : value < 0 ? "-" : ""}${Math.abs(value).toLocaleString("en-NG", { maximumFractionDigits: 2 })}%`
    : "N/A";

  return (
    <PercentageChangeContainer
      className={`${className}${direction ? ` ${className}--${direction}` : ""}`}
      $direction={direction}
      title={
        available
          ? "Change from previous period"
          : "Comparison data is not available"
      }
    >
      {direction && (
        <Icon
          icon={
            direction === "up"
              ? "iconamoon:arrow-up-2-fill"
              : "iconamoon:arrow-down-2-fill"
          }
          width={16}
          height={16}
        />
      )}
      <span>{label}</span>
    </PercentageChangeContainer>
  );
}
