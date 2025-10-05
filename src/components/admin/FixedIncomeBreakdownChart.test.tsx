import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FixedIncomeBreakdownChart from "./FixedIncomeBreakdownChart";
import {
  PALETTE_1_5,
  PALETTE_6_7,
  PALETTE_8_PLUS,
  OVERLAP_PALETTE,
} from "@/components/ui/chart-colors";

describe("FixedIncomeBreakdownChart", () => {
  test("should render the PieChart component and title", () => {
    const fixedIncomeBreakdownData = [{ label: "Sovereign", value: 40 }];
    const assetAllocationData = [{ label: "Equities", value: 100 }];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Fixed Income Breakdown (% NAV)",
    );
  });

  test("should color overlaps with the overlap palette and non-overlaps with the 1–5 base palette", () => {
    const assetAllocationData = [
      { label: "Equities", value: 40 },
      { label: "Fixed Income", value: 60 },
    ];
    const fixedIncomeBreakdownData = [
      { label: "Equities", value: 10 }, // overlap (AA contains Equities)
      { label: "Sovereign", value: 45 }, // non-overlap
      { label: "Investment Grade", value: 45 }, // non-overlap
    ];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    // Overlap slice coloured from overlap palette
    const overlapColor = screen
      .getByTestId("slice-0")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapColor);

    // Non-overlaps coloured from the 1–5 base palette in order
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      PALETTE_1_5[0],
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      PALETTE_1_5[1],
    );
  });

  test("should not use the overlap palette when label does not exist in Asset Allocation", () => {
    const assetAllocationData = [
      { label: "X", value: 10 },
      { label: "Y", value: 90 },
    ];
    const fixedIncomeBreakdownData = [{ label: "Sovereign", value: 100 }];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    const color = screen.getByTestId("slice-0").getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).not.toContain(color);
    expect(color).toBe(PALETTE_1_5[0]);
  });

  test("should treat overlap matching as case-insensitive", () => {
    const assetAllocationData = [{ label: "equities", value: 100 }];
    const fixedIncomeBreakdownData = [{ label: "EQUITIES", value: 100 }];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    const color = screen.getByTestId("slice-0").getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(color);
  });

  test("should choose the 6–7 base palette when non-overlap count is 6", () => {
    // 6 non-overlaps + 1 overlap (total 7 items)
    const fixedIncomeBreakdownData = [
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
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    // Non-overlaps (first 5) consume PALETTE_6_7[0..4]
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

    // Overlap uses overlap palette
    const overlapSliceColor = screen
      .getByTestId("slice-5")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapSliceColor);

    // Next non-overlap continues with PALETTE_6_7[5]
    expect(screen.getByTestId("slice-6")).toHaveAttribute(
      "data-color",
      PALETTE_6_7[5],
    );
  });

  test("should choose the 8+ base palette when non-overlap count is at least 8", () => {
    // 8 non-overlaps + 1 overlap
    const fixedIncomeBreakdownData = [
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
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={assetAllocationData}
      />,
    );

    // First six non-overlaps consume PALETTE_8_PLUS[0..5]
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

    // Overlap slice uses overlap palette
    const overlapSliceColor = screen
      .getByTestId("slice-6")
      .getAttribute("data-color")!;
    expect(OVERLAP_PALETTE).toContain(overlapSliceColor);

    // Next two non-overlaps continue with PALETTE_8_PLUS[6] and [7]
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
    const fixedIncomeBreakdownData = [
      { label: "Short-term", value: 0 },
      { label: "Long-term", value: 100.0 },
    ];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fixedIncomeBreakdownData}
        assetAllocation={[]}
      />,
    );

    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-value", "0");
    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "100");
  });
});
