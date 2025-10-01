"use client";

import { DualAxisLineChart } from "@/components/ui/line-chart";
import { InceptionPerformanceData } from "@/app/(admin)/admin/excel/utils";

interface InceptionPerformanceChartProps {
  data: InceptionPerformanceData;
  height?: number;
  white?: boolean;
}

export function InceptionPerformanceChart({
  data,
  height,
  white,
}: InceptionPerformanceChartProps) {
  return <DualAxisLineChart data={data} height={height} white={white} />;
}
