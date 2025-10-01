"use client";

import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses, } from '@mui/x-charts/ChartsAxis';

import { InceptionPerformanceData } from '@/app/(admin)/admin/excel/utils';

interface DualAxisLineChartProps {
  data: InceptionPerformanceData;
  title?: string;
  height?: number;
  width?: number;
  white?: boolean;
}

export function DualAxisLineChart({
  data,
  height,
  white = false,
}: DualAxisLineChartProps) {

  // Transform data for MUI X Charts
  const chartData = data.dates.map((date, index) => ({
    date: new Date(date),
    series1: data.series1[index],
    series2: data.series2[index]
  }));

  // Filter out any invalid data points
  const validData = chartData.filter(item => 
    !isNaN(item.series1) && !isNaN(item.series2) && 
    item.date instanceof Date && !isNaN(item.date.getTime())
  );

  if (validData.length === 0) {
    return (
        <div className={`flex items-center justify-center h-64 text-muted-foreground ${white ? 'text-white' : ''}`}>
        No valid data available for chart
        </div>
    );
  }

  return (
    <div className={`w-full h-full ${white ? 'text-white' : ''}`}>
        <LineChart
        dataset={validData}
        height={height ?? 400}
        xAxis={[
            {
            dataKey: 'date',
            scaleType: 'time',
            valueFormatter: (date: Date) => {
                return date.toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit'
                });
            },
            tickLabelStyle: {
                fontSize: 12,
                fill: white ? '#ffffff' : undefined,
            },
            },
        ]}
        yAxis={[
            {
            id: "series1",
            scaleType: 'linear',
            tickLabelStyle: {
                fontSize: 12,
                fill: white ? '#ffffff' : undefined,
            },
            },
            {
            id: "series2",
            scaleType: 'linear',
            position: "right",
            data: data.series2,
            tickLabelStyle: {
                fontSize: 12,
                fill: white ? '#ffffff' : undefined,
            },
            },
        ]}
        series={[
            {
            dataKey: 'series1',
            yAxisId: "series1",
            label: data.series1Heading,
            color: '#1976d2',
            curve: 'linear',
            showMark: false,
            },
            {
            dataKey: 'series2',
            yAxisId: "series2",
            label: data.series2Heading,
            color: '#dc004e',
            curve: 'linear',
            showMark: false,
            },
        ]}
        slotProps={{
            legend: {
            className: white ? 'text-white' : '',
            direction: 'horizontal',
            position: { vertical: 'bottom', horizontal: 'center' },
            },
        }}
        sx={{
          [`.${axisClasses.root}`]: {
            // axis line and tick colour
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: white ? '#ffffff' : undefined,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: white ? '#ffffff' : undefined
            },
          },
          // legend text colour
          [`.MuiChartsLegend-label`]: {
            color: white ? '#ffffff' : undefined,
          },
        }}
        />
    </div>
  );
}
