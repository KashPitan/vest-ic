import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EquitiesBreakdownChart from "./EquitiesBreakdownChart";
import {
  PALETTE_1_5,
  PALETTE_6_7,
  PALETTE_8_PLUS,
  OVERLAP_PALETTE,
} from "@/components/ui/chart-colors";

describe("EquitiesBreakdownChart", () => {
  test("should render the PieChart and title", () => {
    const equitiesBreakdownData = [{ label: "A", value: 10 }];
    const assetAllocationData = [{ label: "Z", value: 100 }];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Equities Breakdown (% NAV)",
    );
  });

  test("should color overlaps with the overlap palette and non-overlaps with the base palette (1–5)", () => {
    const assetAllocationData = [{ label: "Equities", value: 50 }];
    const equitiesBreakdownData = [
      { label: "Equities", value: 40 }, // overlap
      { label: "United Kingdom", value: 60 }, // non-overlap
    ];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    const firstSliceColor = screen
      .getByTestId("slice-0")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(firstSliceColor);

    const secondSliceColor = screen
      .getByTestId("slice-1")
      .getAttribute("data-color")!;
    expect(secondSliceColor).toBe(PALETTE_1_5[0]);
  });

  test("should treat overlap matching as case-insensitive and independent of index", () => {
    const assetAllocationData = [
      { label: "x", value: 1 },
      { label: "united states", value: 99 },
    ];
    const equitiesBreakdownData = [{ label: "United States", value: 100 }];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    const onlySliceColor = screen
      .getByTestId("slice-0")
      .getAttribute("data-color");
    expect(OVERLAP_PALETTE).toContain(onlySliceColor);
  });

  test("should choose the 6–7 base palette when non-overlap count is 6", () => {
    // 6 non-overlaps + 1 overlap
    const equitiesBreakdownData = [
      { label: "N1", value: 10 },
      { label: "N2", value: 10 },
      { label: "N3", value: 10 },
      { label: "N4", value: 10 },
      { label: "N5", value: 10 },
      { label: "Overlap", value: 10 }, // overlap
      { label: "N6", value: 40 },
    ];
    const assetAllocationData = [{ label: "Overlap", value: 1 }];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[0],
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[1],
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[2],
    );
    expect(screen.getByTestId("slice-3")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[3],
    );
    expect(screen.getByTestId("slice-4")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[4],
    );

    const overlapSliceColor = screen
      .getByTestId("slice-5")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapSliceColor);

    expect(screen.getByTestId("slice-6")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[5],
    );
  });

  test("should choose the 8+ base palette when non-overlap count is at least 8", () => {
    // 8 non-overlaps + 1 overlap
    const equitiesBreakdownData = [
      { label: "N1", value: 10 },
      { label: "N2", value: 10 },
      { label: "N3", value: 10 },
      { label: "N4", value: 10 },
      { label: "N5", value: 10 },
      { label: "N6", value: 10 },
      { label: "Overlap", value: 5 }, // overlap
      { label: "N7", value: 10 },
      { label: "N8", value: 25 },
    ];
    const assetAllocationData = [{ label: "Overlap", value: 100 }];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[0],
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[1],
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[2],
    );
    expect(screen.getByTestId("slice-3")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[3],
    );
    expect(screen.getByTestId("slice-4")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[4],
    );
    expect(screen.getByTestId("slice-5")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[5],
    );

    const overlapSliceColor = screen
      .getByTestId("slice-6")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapSliceColor);

    expect(screen.getByTestId("slice-7")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[6],
    );
    expect(screen.getByTestId("slice-8")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[7],
    );
  });

  test("should pass values through unchanged (decimals & zeros)", () => {
    const equitiesBreakdownData = [
      { label: "A", value: 33.333 },
      { label: "B", value: 0 },
      { label: "C", value: 66.667 },
    ];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={[]}
      />,
    );

    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-value",
      "33.333",
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "0");
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-value",
      "66.667",
    );
  });

  test("should use 6–7 base palette when 8 total items and exactly 1 overlap (7 non-overlaps)", () => {
    // 8 total slices; 1 is an overlap => 7 non-overlaps → choose PALETTE_6_7
    const assetAllocationData = [{ label: "Overlap", value: 999 }];
    const equitiesBreakdownData = [
      { label: "N1", value: 10 },
      { label: "N2", value: 10 },
      { label: "N3", value: 10 },
      { label: "Overlap", value: 10 }, // overlap
      { label: "N4", value: 10 },
      { label: "N5", value: 10 },
      { label: "N6", value: 10 },
      { label: "N7", value: 30 },
    ];

    render(
      <EquitiesBreakdownChart
        equitiesBreakdown={equitiesBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    // Non-overlaps should consume PALETTE_6_7 in order; overlap uses OVERLAP_PALETTE
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[0],
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[1],
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[2],
    );

    const overlapColor = screen
      .getByTestId("slice-3")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapColor);

    expect(screen.getByTestId("slice-4")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[3],
    );
    expect(screen.getByTestId("slice-5")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[4],
    );
    expect(screen.getByTestId("slice-6")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[5],
    );
    expect(screen.getByTestId("slice-7")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[6],
    );
  });
});
