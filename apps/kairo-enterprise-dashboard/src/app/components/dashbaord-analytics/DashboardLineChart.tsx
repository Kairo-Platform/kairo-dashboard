"use client";

import Link from "next/link";
import React, { isValidElement } from "react";
import styled, { useTheme } from "styled-components";
import { Icon } from "@iconify/react";
import { Flex } from "@/app/components/ui";
import { LineChart } from "@/lib/utils";

type ChartValue = {
  label: string;
  value: number;
  color?: string;
};

interface DashboardLineChartProps {
  title?: string | React.ReactNode;
  titleIcon?: string;
  subTitle?: string | React.ReactNode;
  subTitleAmount?: string | number;
  chartValues?: ChartValue[];
  link?: string;
  chartWidth?: string | number;
  chartHeight?: string | number;
  showLegend?: boolean;
  chartOptions?: Record<string, unknown>;
  legendBoxWidth?: number;
  legendBoxHeight?: number;
  legendTextColor?: string;
  showYAxisLabels?: boolean;
  borderColor?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
}

const DashboardLineChartContainer = styled.div`
  width: 100%;
  height: 100%;

  .chart_card {
    border-radius: 1.5rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_03};
    background-color: ${(props) => props.theme.colors.ui_07};
    padding: 1.5rem;
    width: 100%;
    height: 100%;
  }

  .title {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.75rem;
    letter-spacing: -0.03375rem;
    color: ${(props) => props.theme.colors.tabListColor};
    width: 100%;
  }

  .title_icon {
    display: inline-flex;
    color: ${(props) => props.theme.colors.orange};
    flex-shrink: 0;
  }

  .sub_title {
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
    margin: 0.5rem 0 0.75rem 0;
  }

  .sub_title__amount {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 2rem;
    letter-spacing: -0.045rem;
    color: ${(props) => props.theme.colors.text_01};
  }

  .sub_title__label {
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01875rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .view_all_link {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    color: ${(props) => props.theme.colors.text_02};

    &:hover {
      text-decoration: underline;
    }
  }

  .line_chart_container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chart_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 220px;
  }
`;

export const DashboardLineChart = ({
  title = "Chart Title",
  titleIcon = "mdi:message",
  subTitle,
  subTitleAmount,
  chartValues = [],
  link,
  chartWidth = "100%",
  chartHeight = 260,
  showLegend = false,
  chartOptions = {},
  legendBoxWidth = 15,
  legendBoxHeight = 15,
  legendTextColor,
  showYAxisLabels = true,
  borderColor = "#FF6B1A",
  gradientStartColor = "rgba(255, 107, 26, 0.25)",
  gradientEndColor = "rgba(255, 107, 26, 0)",
}: DashboardLineChartProps) => {
  const theme = useTheme();

  const renderTitle = (): React.ReactNode => {
    if (typeof title === "string") {
      return (
        <h4 className="title">
          {titleIcon ? (
            <span className="title_icon">
              <Icon icon={titleIcon} width={20} height={20} />
            </span>
          ) : null}
          {title}
        </h4>
      );
    }
    if (isValidElement(title)) {
      return <div className="title">{title}</div>;
    }
    return <div className="title">{title}</div>;
  };

  const renderSubTitle = (): React.ReactNode => {
    if (subTitleAmount != null || typeof subTitle === "string") {
      return (
        <p className="sub_title">
          {subTitleAmount != null && (
            <span className="sub_title__amount">{subTitleAmount}</span>
          )}
          <span className="sub_title__label">
            {typeof subTitle === "string" ? subTitle : "today"}
          </span>
        </p>
      );
    }
    if (!subTitle) return null;
    if (isValidElement(subTitle)) {
      return <div className="sub_title">{subTitle}</div>;
    }
    return <div className="sub_title">{subTitle as React.ReactNode}</div>;
  };

  const titleString = typeof title === "string" ? title : undefined;

  return (
    <DashboardLineChartContainer>
      <div className="chart_card">
        {typeof title === "string" ? (
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: "2rem" }}
          >
            <Flex direction="column" gap="0.2rem">
              {renderTitle()}
              {renderSubTitle()}
            </Flex>
            {link && (
              <Link href={link} className="view_all_link">
                <span>See All</span>
              </Link>
            )}
          </Flex>
        ) : (
          <div style={{ marginBottom: "2rem" }}>
            {renderTitle()}
            {renderSubTitle()}
          </div>
        )}
        <div className="line_chart_container">
          <div className="chart_wrapper">
            <LineChart
              title={titleString}
              data={chartValues}
              width={chartWidth}
              height={chartHeight}
              showLegend={showLegend}
              showYAxisLabels={showYAxisLabels}
              showHorizontalLines={false}
              showVerticalLines={true}
              pointRadius={0}
              pointHoverRadius={0}
              tension={0.4}
              enableAreaGradient={true}
              borderColor={[borderColor]}
              backgroundColor={[borderColor]}
              gradientStartColor={gradientStartColor}
              gradientEndColor={gradientEndColor}
              options={{
                plugins: {
                  legend: {
                    display: showLegend,
                    position: "bottom",
                    align: "center",
                    labels: {
                      padding: 15,
                      boxWidth: legendBoxWidth,
                      boxHeight: legendBoxHeight,
                      usePointStyle: true,
                      pointStyle: "circle",
                      color: legendTextColor || theme.colors.text_02,
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
                layout: {
                  padding: {
                    bottom: 0,
                    top: 10,
                  },
                },
                ...chartOptions,
                scales: {
                  x: {
                    ticks: { color: theme.colors.text_02 },
                    grid: { color: theme.colors.gray_03 },
                  },
                  y: {
                    ticks: { color: theme.colors.text_02 },
                    grid: { color: theme.colors.gray_03 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLineChartContainer>
  );
};

export default DashboardLineChart;
