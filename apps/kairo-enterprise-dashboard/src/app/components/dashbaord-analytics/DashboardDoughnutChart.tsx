"use client";

import Link from "next/link";
import { ReactNode } from "react";
import styled, { useTheme } from "styled-components";
import { Flex } from "@/app/components/ui";
import { DoughnutChart } from "@/lib/utils";

type ChartValue = {
  label: string;
  value: number;
  color: string;
};

interface DashboardDoughnutChartProps {
  title?: string;
  subTitle?: string;
  chartValues?: ChartValue[];
  link?: string;
  chartWidth?: string | number;
  chartHeight?: string | number;
  cutout?: string | number;
  showLegend?: boolean;
  chartOptions?: Record<string, unknown>;
  legendBoxWidth?: number;
  legendBoxHeight?: number;
  legendTextColor?: string;
  showPercentageLabels?: boolean;
  percentagePlacement?: "arc" | "legend" | "both" | "none";
  centerContent?: ReactNode;
  /** When true, renders a custom legend with label/value space-between. */
  useCustomLegend?: boolean;
}

const DashboardDoughnutChartContainer = styled.div`
  width: 100%;
  height: 100%;

  .chart_card {
    border-radius: 1.5rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_03};
    padding: 1.75rem 1.875rem 2.5rem;
    width: 100%;
    height: 100%;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.75rem;
    letter-spacing: -0.03375rem;
    color: ${(props) => props.theme.colors.tabListColor};
  }

  .sub_title {
    font-size: 0.95rem;
    color: ${(props) => props.theme.colors.text_02};
    margin: 0.25rem 0 0.75rem 0;
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

  .doughnut_chart_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.875rem;
  }

  .chart_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .custom_legend {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 20rem;
    // padding: 0 1.625rem;
  }

  .custom_legend__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
  }

  .custom_legend__label {
    display: inline-flex;
    align-items: center;
    gap: 0.5625rem;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01875rem;
    color: ${(props) => props.theme.colors.tabListColor};
  }

  .custom_legend__swatch {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .custom_legend__value {
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01875rem;
    color: ${(props) => props.theme.colors.tabListColor};
  }

  .center_intent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.125rem;
  }

  .center_intent__value {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 3rem;
    color: ${(props) => props.theme.colors.text_08};
  }

  .center_intent__label {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: ${(props) => props.theme.colors.text_02};
  }
`;

export const DashboardDoughnutChart = ({
  title = "Chart Title",
  subTitle,
  chartValues = [
    { label: "Resolved", value: 40, color: "#FF6B1A" },
    { label: "Escalated", value: 30, color: "#FF8C4A" },
    { label: "Pending", value: 20, color: "#BF5014" },
    { label: "Other", value: 10, color: "#F0F0F0" },
  ],
  link,
  chartWidth = 250,
  chartHeight = 250,
  cutout = "68%",
  showLegend = true,
  chartOptions = {},
  legendBoxWidth = 15,
  legendBoxHeight = 15,
  legendTextColor,
  showPercentageLabels = true,
  percentagePlacement = "legend",
  centerContent,
  useCustomLegend = false,
}: DashboardDoughnutChartProps) => {
  const theme = useTheme();
  const total = chartValues.reduce((sum, item) => sum + item.value, 0);
  const shouldUseCustomLegend = useCustomLegend || Boolean(centerContent);

  return (
    <DashboardDoughnutChartContainer>
      <div className="chart_card">
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "2rem" }}
        >
          <Flex direction="column" gap="0.2rem">
            <h4 className="title">{title}</h4>
            {subTitle && <p className="sub_title">{subTitle}</p>}
          </Flex>
          {link && (
            <Link href={link} className="view_all_link">
              <span>See All</span>
            </Link>
          )}
        </Flex>
        <div className="doughnut_chart_container">
          <div className="chart_wrapper">
            <DoughnutChart
              title={title}
              data={chartValues}
              width={chartWidth}
              height={chartHeight}
              cutout={cutout}
              showPercentageLabels={
                shouldUseCustomLegend ? false : showPercentageLabels
              }
              percentagePlacement={
                shouldUseCustomLegend ? "none" : percentagePlacement
              }
              showLegend={shouldUseCustomLegend ? false : showLegend}
              centerContent={centerContent}
              options={{
                // plugins: {
                //   legend: {
                //     position: "bottom",
                //     align: "center",
                //     labels: {
                //       padding: 15,
                //       boxWidth: legendBoxWidth,
                //       boxHeight: legendBoxHeight,
                //       usePointStyle: true,
                //       pointStyle: "circle",
                //       color: legendTextColor || theme.colors.text_02,
                //       font: {
                //         size: 12,
                //       },
                //     },
                //   },
                // },
                layout: {
                  padding: {
                    bottom: 0,
                    top: 10,
                  },
                },
                ...chartOptions,
              }}
            />
          </div>

          {shouldUseCustomLegend && (
            <div className="custom_legend">
              {chartValues.map((item) => {
                const percentage = total
                  ? Math.round((item.value / total) * 100)
                  : 0;

                return (
                  <div key={item.label} className="custom_legend__row">
                    <span className="custom_legend__label">
                      <span
                        className="custom_legend__swatch"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                    <span className="custom_legend__value">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardDoughnutChartContainer>
  );
};

export default DashboardDoughnutChart;
