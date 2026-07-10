"use client";

import { useEffect, useRef, FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  type Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

type LineChartDataItem = {
  label: string;
  value: number;
};

type LineDataset = {
  label?: string;
  data?: number[];
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  fill?: boolean;
};

interface LineChartProps {
  title?: string;
  showTitle?: boolean;
  data?: LineChartDataItem[];
  datasets?: LineDataset[];
  labels?: string[];
  width?: number | string;
  height?: number | string;
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  options?: ChartOptions<"line">;
  showTooltip?: boolean;
  showLegend?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  showHorizontalLines?: boolean;
  showVerticalLines?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showYAxisLabels?: boolean;
  enableAreaGradient?: boolean;
  gradientStartColor?: string;
  gradientEndColor?: string;
}

export const LineChart: FC<LineChartProps> = ({
  title,
  showTitle = false,
  data = [],
  datasets = [],
  labels = [],
  width = 400,
  height = 200,
  backgroundColor = ["#107EFF", "#B7D8FF", "#F0F0F0"],
  borderColor = ["#107EFF", "#B7D8FF", "#F0F0F0"],
  borderWidth = 2,
  options = {},
  showTooltip = true,
  showLegend = false,
  tension = 0.1,
  pointRadius = 3,
  pointHoverRadius = 5,
  showHorizontalLines = true,
  showVerticalLines = true,
  showXAxis = true,
  showYAxis = true,
  showYAxisLabels = true,
  enableAreaGradient = false,
  gradientStartColor = "#E7F2FF",
  gradientEndColor = "rgba(195, 228, 253, 0)",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);

  useEffect(() => {
    if (!canvasRef.current || (!data.length && !datasets.length)) return;

    if (chartRef.current) {
      try {
        chartRef.current.destroy();
      } catch (e) {
        // ignore
      }
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let chartLabels: string[] = [];
    let chartDatasets: ChartDataset<"line", number[]>[] = [];

    const areaGradientFn = (context: any) => {
      const chart = context.chart;
      const { ctx: c, chartArea } = chart || {};
      if (!chartArea) {
        return gradientStartColor;
      }
      const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      g.addColorStop(0, gradientStartColor);
      g.addColorStop(1, gradientEndColor);
      return g;
    };

    if (datasets && datasets.length > 0) {
      chartLabels = labels;
      chartDatasets = datasets.map(
        (dataset, index) =>
          ({
            label: dataset.label || `Dataset ${index + 1}`,
            data: dataset.data || [],
            borderColor:
              dataset.borderColor || borderColor[index % borderColor.length],
            backgroundColor: enableAreaGradient
              ? areaGradientFn
              : dataset.backgroundColor ||
                backgroundColor[index % backgroundColor.length],
            borderWidth: dataset.borderWidth || borderWidth,
            tension: dataset.tension !== undefined ? dataset.tension : tension,
            pointRadius:
              dataset.pointRadius !== undefined
                ? dataset.pointRadius
                : pointRadius,
            pointHoverRadius:
              dataset.pointHoverRadius !== undefined
                ? dataset.pointHoverRadius
                : pointHoverRadius,
            fill:
              dataset.fill !== undefined
                ? dataset.fill
                : enableAreaGradient
                  ? ("start" as any)
                  : false,
          }) as ChartDataset<"line", number[]>
      );
    } else if (data && data.length > 0) {
      chartLabels = data.map((item) => item.label);
      chartDatasets.push({
        label: title || "Data",
        data: data.map((item) => item.value),
        borderColor: borderColor[0],
        backgroundColor: enableAreaGradient
          ? areaGradientFn
          : backgroundColor[0],
        borderWidth,
        tension,
        pointRadius,
        pointHoverRadius,
        fill: enableAreaGradient ? ("start" as any) : false,
      } as ChartDataset<"line", number[]>);
    }

    const chartData: ChartData<"line", number[], string | unknown> = {
      labels: chartLabels,
      datasets: chartDatasets,
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: showXAxis,
          title: { display: false },
          grid: { display: showVerticalLines && showXAxis },
          ticks: { display: showXAxis },
        },
        y: {
          display: showYAxis,
          title: { display: false },
          grid: { display: showHorizontalLines && showYAxis },
          ticks: { display: showYAxis && showYAxisLabels },
        },
      },
      plugins: {
        legend: {
          display: showLegend,
          position: "bottom",
        } as any,
        tooltip: {
          enabled: showTooltip,
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${value}`;
            },
          },
        } as any,
      },
      ...options,
    };

    chartRef.current = new ChartJS(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    }) as Chart<"line", number[], string>;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [
    data,
    datasets,
    labels,
    backgroundColor,
    borderColor,
    borderWidth,
    tension,
    pointRadius,
    pointHoverRadius,
    options,
    showTooltip,
    showLegend,
    showHorizontalLines,
    showVerticalLines,
    showXAxis,
    showYAxis,
    showYAxisLabels,
    title,
    enableAreaGradient,
    gradientStartColor,
    gradientEndColor,
  ]);

  return (
    <div style={{ width, height, position: "relative" }}>
      {title && showTitle && (
        <h4 style={{ textAlign: "center", marginBottom: "0.3rem" }}>{title}</h4>
      )}
      <canvas
        ref={canvasRef}
        aria-label={title ? title : "Line chart"}
        style={{ width: "100%", height: "100%" }}
      >
        <p>{title ? title : "Line chart placeholder"}</p>
      </canvas>
    </div>
  );
};

export default LineChart;
