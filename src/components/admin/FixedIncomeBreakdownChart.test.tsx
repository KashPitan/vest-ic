import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FixedIncomeBreakdownChart from "./FixedIncomeBreakdownChart";
import { BASE_PALETTE, OVERRIDES } from "@/components/ui/chart-colors";

describe("FixedIncomeBreakdownChart (single-palette push-down rules)", () => {
  test("should render the PieChart component and title", () => {
    const fib = [{ label: "Sovereign", value: 40 }];
    const aa = [{ label: "Equities", value: 100 }];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fib}
        assetAllocation={aa}
      />,
    );
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Fixed Income Breakdown (% NAV)",
    );
  });

  test("should handle same-index overlap -> grey, and push-down (next item uses palette[0])", () => {
    // AA[0] = "Equities"
    const aa = [
      { label: "Equities", value: 40 },
      { label: "Fixed Income", value: 60 },
    ];
    // FIB[0] = "Equities" -> same-index overlap => grey (no palette consumed)
    // FIB[1] gets BASE_PALETTE[0], FIB[2] gets BASE_PALETTE[1]
    const fib = [
      { label: "Equities", value: 10 },
      { label: "Sovereign", value: 45 },
      { label: "Investment Grade", value: 45 },
    ];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fib}
        assetAllocation={aa}
      />,
    );

    const c0 = screen.getByTestId("slice-0").getAttribute("data-color");
    expect(OVERRIDES.includes(c0!)).toBe(true);

    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      BASE_PALETTE[0],
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      BASE_PALETTE[1],
    );
  });

  test("should handle overlap at different index -> NOT grey (uses next palette colour)", () => {
    // AA[1] = "Sovereign"
    const aa = [
      { label: "X", value: 10 },
      { label: "Sovereign", value: 90 },
    ];
    // FIB[0] = "Sovereign" => overlap but at index 0 vs AA index 1 => NOT grey
    const fib = [{ label: "Sovereign", value: 100 }];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fib}
        assetAllocation={aa}
      />,
    );

    const c0 = screen.getByTestId("slice-0").getAttribute("data-color");
    expect(OVERRIDES.includes(c0!)).toBe(false);
    expect(c0).toBe(BASE_PALETTE[0]); // first palette colour
  });

  test("should handle case-insensitive label matching for same-index overlap", () => {
    const aa = [{ label: "equities", value: 100 }];
    const fib = [{ label: "EQUITIES", value: 100 }]; // same index, different case

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fib}
        assetAllocation={aa}
      />,
    );

    const c0 = screen.getByTestId("slice-0").getAttribute("data-color");
    expect(OVERRIDES.includes(c0!)).toBe(true);
  });

  test("should handle values pass through unchanged (decimals & zeros)", () => {
    // PieChart itself filters true zeros, but this component passes values through.
    const fib = [
      { label: "Short-term", value: 0 },
      { label: "Long-term", value: 100.0 },
    ];

    render(
      <FixedIncomeBreakdownChart
        fixedIncomeBreakdown={fib}
        assetAllocation={[]}
      />,
    );

    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-value", "0");
    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "100");
  });
});
