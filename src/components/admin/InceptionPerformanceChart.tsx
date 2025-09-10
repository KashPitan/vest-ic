"use client";

import { DualAxisLineChart } from "@/components/ui/line-chart";
import { InceptionPerformanceData } from "@/app/(admin)/admin/excel/utils";

interface InceptionPerformanceChartProps {
  data: InceptionPerformanceData;
  height?: number;
}

export function InceptionPerformanceChart({
  data,
  height,
}: InceptionPerformanceChartProps) {
  return <DualAxisLineChart data={data} height={height} />;
}
