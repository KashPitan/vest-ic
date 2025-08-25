"use client";

import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { InceptionPerformanceData } from '@/app/(admin)/admin/excel/utils';

interface DualAxisLineChartProps {
  data: InceptionPerformanceData;
  title?: string;
  series1Label?: string;
  series2Label?: string;
  height?: number;
  width?: number;
}

export function DualAxisLineChart({
  data,
  title = "Performance Chart",
  series1Label = "Series 1",
  series2Label = "Series 2",
  height = 400,
  width = 800
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
  console.log(validData)

  if (validData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No valid data available for chart
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <LineChart
            width={width}
            height={height}
            dataset={validData}
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
                },
              },
            ]}
            yAxis={[
              {
                scaleType: 'linear',
                tickLabelStyle: {
                  fontSize: 12,
                },
              },
              {
                scaleType: 'linear',
                position: "right",
                tickLabelStyle: {
                  fontSize: 12,
                },
              },
            ]}
            series={[
              {
                dataKey: 'series1',
                label: series1Label,
                color: '#1976d2',
                curve: 'linear',
                showMark: false,
              },
              {
                dataKey: 'series2',
                label: series2Label,
                color: '#dc004e',
                curve: 'linear',
                showMark: false,
              },
            ]}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'top', horizontal: 'center' },
              },
            }}
            margin={{
              left: 60,
              right: 60,
              top: 80,
              bottom: 40,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
