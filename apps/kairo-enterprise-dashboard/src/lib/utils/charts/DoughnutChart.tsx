"use client";

import { useEffect, useRef, useMemo, FC, ReactNode } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

type DoughnutChartDataItem = {
  label: string;
  value: number;
  color?: string;
};

type PercentageLabelStyle = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  padding?: number;
  borderRadius?: number;
};

interface DoughnutChartProps {
  title?: string;
  showTitle?: boolean;
  data?: DoughnutChartDataItem[];
  width?: number | string;
  height?: number | string;
  cutout?: string | number;
  backgroundColor?: string[];
  borderWidth?: number;
  options?: ChartOptions<"doughnut">;
  showTooltip?: boolean;
  showLegend?: boolean;
  showPercentageLabels?: boolean;
  percentagePlacement?: "arc" | "legend" | "both" | "none";
  percentageLabelStyle?: PercentageLabelStyle;
  centerContent?: ReactNode;
}

export const DoughnutChart: FC<DoughnutChartProps> = ({
  title,
  showTitle = false,
  data = [],
  width = 150,
  height = 150,
  cutout = "60%",
  backgroundColor = ["#0D65CC", "#107EFF", "#B7D8FF"],
  borderWidth = 0,
  options = {},
  showTooltip = true,
  showLegend = false,
  showPercentageLabels = false,
  percentagePlacement = "arc",
  percentageLabelStyle = {
    backgroundColor: "white",
    textColor: "#333",
    fontSize: 12,
    padding: 4,
    borderRadius: 8,
  },
  centerContent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<null | ChartJS | null>(null);

  useEffect(() => {
    const total = data.reduce((a, b) => a + (b.value || 0), 0);
    if (!canvasRef.current || !data.length || total === 0) return;

    if (chartRef.current) {
      try {
        (chartRef.current as any).destroy?.();
      } catch (e) {
        // ignore
      }
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Custom plugin to draw percentage labels on each section
    const percentageLabelPlugin = {
      id: "percentageLabels",
      afterDraw: (chart: any) => {
        const showOnArc =
          showPercentageLabels &&
          (percentagePlacement === "arc" || percentagePlacement === "both");
        if (!showOnArc) return;

        const ctx2: CanvasRenderingContext2D = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const total2 = chart.data.datasets[0].data.reduce(
          (a: number, b: number) => a + b,
          0
        );

        meta.data.forEach((arc: any, index: number) => {
          const value = chart.data.datasets[0].data[index];
          const percentage = total2 ? Math.round((value / total2) * 100) : 0;

          if (!total2 || percentage === 0) return;

          const startAngle = arc.startAngle;
          const endAngle = arc.endAngle;
          const middleAngle = (startAngle + endAngle) / 2;

          const outerRadius = arc.outerRadius;
          const labelRadius = outerRadius;

          const x = arc.x + Math.cos(middleAngle) * labelRadius;
          const y = arc.y + Math.sin(middleAngle) * labelRadius;

          ctx2.font = `${percentageLabelStyle.fontSize}px Arial`;
          ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";

          const text = `${percentage}%`;
          const textMetrics = ctx2.measureText(text);
          const textWidth = textMetrics.width;
          const textHeight = percentageLabelStyle.fontSize || 12;

          const circleRadius =
            Math.max(textWidth, textHeight) / 2 +
            (percentageLabelStyle.padding || 0);

          ctx2.fillStyle = percentageLabelStyle.backgroundColor as string;
          ctx2.beginPath();
          ctx2.arc(x, y, circleRadius, 0, 2 * Math.PI);
          ctx2.fill();

          ctx2.fillStyle = percentageLabelStyle.textColor as string;
          ctx2.fillText(text, x, y);
        });
      },
    };

    const chartData: ChartData<"doughnut", number[], string | unknown> = {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map(
            (item, index) =>
              item.color || backgroundColor[index % backgroundColor.length]
          ),
          borderWidth,
          hoverBorderWidth: borderWidth + 1,
        } as any,
      ],
    };

    const chartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout,
      plugins: {
        legend: {
          display: showLegend,
          position: "right",
          labels: ((): any => {
            const base = {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 12,
            } as any;
            const showInLegend =
              showPercentageLabels &&
              (percentagePlacement === "legend" ||
                percentagePlacement === "both");
            if (!showInLegend) return base;
            return {
              ...base,
              generateLabels: (chart: any) => {
                const dataset = chart.data.datasets[0];
                const dataArr: number[] = dataset.data as number[];
                const total = dataArr.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const colors: string[] = dataset.backgroundColor as string[];
                const labels: (string | unknown)[] = chart.data.labels || [];

                return labels.map((lbl: any, i: number) => {
                  const value = dataArr[i] || 0;
                  const pct = total ? Math.round((value / total) * 100) : 0;
                  return {
                    text: `${String(lbl)} (${pct}%)`,
                    fillStyle: colors?.[i] ?? "#ccc",
                    strokeStyle: colors?.[i] ?? "#ccc",
                    lineWidth: 0,
                    hidden: !chart.getDatasetMeta(0).data[i],
                    index: i,
                  };
                });
              },
            } as any;
          })(),
        } as any,
      },
      ...options,
    };

    // create chart instance
    // ChartJS's constructor accepts the canvas context
    chartRef.current = new ChartJS(ctx, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
      plugins: showPercentageLabels ? [percentageLabelPlugin] : [],
    }) as any;

    return () => {
      try {
        (chartRef.current as any)?.destroy?.();
      } catch (e) {
        // ignore
      }
    };
  }, [
    data,
    backgroundColor,
    borderWidth,
    cutout,
    options,
    showTooltip,
    showLegend,
    showPercentageLabels,
    percentageLabelStyle,
  ]);

  const total = useMemo(
    () => data.reduce((a, b) => a + (b.value || 0), 0),
    [data]
  );

  if (!data.length || total === 0) {
    return (
      <div
        style={{
          width,
          height,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {title && showTitle && (
          <h4
            style={{
              position: "absolute",
              top: 8,
              textAlign: "center",
              width: "100%",
            }}
          >
            {title}
          </h4>
        )}
        <div style={{ textAlign: "center", color: "#666" }}>
          Nothing to show
        </div>
      </div>
    );
  }

  return (
    <div style={{ width, height, position: "relative" }}>
      {title && showTitle && (
        <h4 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{title}</h4>
      )}
      {centerContent != null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            zIndex: 0,
          }}
        >
          {typeof centerContent === "string" ? (
            <span>{centerContent}</span>
          ) : (
            centerContent
          )}
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={title ? title : "Doughnut chart"}
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
      >
        <p>{title ? title : "Doughnut chart placeholder"}</p>
      </canvas>
    </div>
  );
};

export default DoughnutChart;
