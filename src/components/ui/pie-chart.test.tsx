import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PieChart from "./pie-chart";
import React from "react";

jest.mock("@mui/x-charts/PieChart", () => {
  type Formatter = (item: { value: number }) => string;

  type Series = {
    data?: Array<{ id?: number; value?: number; label?: string; color?: string }>;
    valueFormatter?: Formatter;
    arcLabel?: Formatter;
    startAngle?: number;
    endAngle?: number;
  };

  type LegendProps = {
    direction?: "vertical" | "horizontal";
    position?: {
      horizontal?: "start" | "center" | "end";
      vertical?: "top" | "middle" | "bottom";
    };
    labelStyle?: { textAlign?: "left" | "right" | "center" };
  };

  type MockProps = {
    series?: Series[];
    slotProps?: { legend?: LegendProps };
  };

  return {
    PieChart: ({ series, slotProps }: MockProps) => {
      const data = series?.[0]?.data ?? [];
      const vf = series?.[0]?.valueFormatter;
      const al = series?.[0]?.arcLabel;

      return (
        <div
          data-testid="mui-pie"
          data-count={data.length}
          data-start={series?.[0]?.startAngle}
          data-end={series?.[0]?.endAngle}
          data-legend-direction={slotProps?.legend?.direction}
          data-legend-h={slotProps?.legend?.position?.horizontal}
          data-legend-v={slotProps?.legend?.position?.vertical}
          data-legend-align={slotProps?.legend?.labelStyle?.textAlign}
        >
          <div data-testid="vf-tiny">{vf ? vf({ value: 0.0000001 }) : ""}</div>
          <div data-testid="vf-whole">{vf ? vf({ value: 12 }) : ""}</div>
          <div data-testid="al-whole">{al ? al({ value: 12 }) : ""}</div>
        </div>
      );
    },
    pieArcLabelClasses: { root: "mui-arc-label" },
  };
});

describe("PieChart wrapper", () => {
  test("should filter true zeros but keeps tiny >0 values", () => {
    render(
      <PieChart
        title="Test"
        data={[
          { label: "A", value: 10 },
          { label: "Zero", value: 0 }, // should be removed
          { label: "Tiny", value: 0.0000001 }, // should remain
        ]}
      />
    );

    expect(screen.getByTestId("mui-pie")).toHaveAttribute("data-count", "2");
  });

  test("should render nothing if everything was zero", () => {
    const { container } = render(
      <PieChart title="All zero" data={[{ label: "Z", value: 0 }]} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("should format arc labels and values to exactly 1dp", () => {
    render(<PieChart title="Fmt" data={[{ label: "A", value: 1 }]} />);

    expect(screen.getByTestId("vf-tiny")).toHaveTextContent("0.0%");
    expect(screen.getByTestId("vf-whole")).toHaveTextContent("12.0%");
    expect(screen.getByTestId("al-whole")).toHaveTextContent("12.0%");
  });
});
