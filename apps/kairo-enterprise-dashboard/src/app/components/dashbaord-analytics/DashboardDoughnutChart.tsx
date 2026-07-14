"use client";

import Link from "next/link";
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
}

const DashboardDoughnutChartContainer = styled.div`
  width: 100%;
  height: 100%;

  .chart_card {
    border-radius: 1.5rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_03};
    padding: 1.5rem;
    width: 100%;
    height: 100%;
  }

  .title {
    font-size: 1rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
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
    justify-content: center;
    align-items: center;
  }

  .chart_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
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
  cutout = "60%",
  showLegend = true,
  chartOptions = {},
  legendBoxWidth = 15,
  legendBoxHeight = 15,
  legendTextColor,
  showPercentageLabels = true,
  percentagePlacement = "legend",
}: DashboardDoughnutChartProps) => {
  const theme = useTheme();

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
              showPercentageLabels={showPercentageLabels}
              percentagePlacement={percentagePlacement}
              showLegend={showLegend}
              options={{
                plugins: {
                  legend: {
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
              }}
            />
          </div>
        </div>
      </div>
    </DashboardDoughnutChartContainer>
  );
};

export default DashboardDoughnutChart;
