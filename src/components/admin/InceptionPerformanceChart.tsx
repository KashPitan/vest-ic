"use client";

import { useEffect, useState } from "react";
import { DualAxisLineChart } from "@/components/ui/line-chart";
import {
  getInceptionPerformanceData,
  InceptionPerformanceData,
} from "@/app/(admin)/admin/excel/utils";
import * as XLSX from "xlsx";

interface InceptionPerformanceChartProps {
  workbook?: XLSX.WorkBook;
  title?: string;
  series1Label?: string;
  series2Label?: string;
}

export function InceptionPerformanceChart({
  workbook,
  title = "Inception Performance",
  series1Label = "RTM 5",
  series2Label = "12m. Rolling Vol (RHS)",
}: InceptionPerformanceChartProps) {
  const [chartData, setChartData] = useState<InceptionPerformanceData>({
    dates: [],
    series1: [],
    series2: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workbook) {
      setError("No workbook provided");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = getInceptionPerformanceData(workbook);

      if (data.dates.length === 0) {
        setError("No data found in the 12.InceptionPerfData sheet");
        return;
      }

      setChartData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load chart data",
      );
    } finally {
      setIsLoading(false);
    }
  }, [workbook]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <DualAxisLineChart
      data={chartData}
      title={title}
      series1Label={series1Label}
      series2Label={series2Label}
      height={500}
      width={1000}
    />
  );
}
