"use client";

import { DualAxisLineChart } from "@/components/ui/line-chart";
import { InceptionPerformanceData } from "@/app/(admin)/admin/excel/utils";

interface InceptionPerformanceChartProps {
  data: InceptionPerformanceData;
}

export function InceptionPerformanceChart({
  data,
}: InceptionPerformanceChartProps) {
  return <DualAxisLineChart data={data} />;
}
