import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EquitiesBreakdownChart from "./EquitiesBreakdownChart";
import { BASE_PALETTE, OVERRIDES } from "@/components/ui/chart-colors";

describe("EquitiesBreakdownChart (single-palette push-down rules)", () => {
  test("should render the PieChart and title", () => {
    const eb = [{ label: "A", value: 10 }];
    const aa = [{ label: "Z", value: 100 }];

    render(
      <EquitiesBreakdownChart equitiesBreakdown={eb} assetAllocation={aa} />,
    );
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Equities Breakdown (% NAV)",
    );
  });

  test("should handle same-index overlap -> override, and push-down (next item uses palette[0])", () => {
    // AA[0] = "Equities"
    const aa = [
      { label: "Equities", value: 50 },
      { label: "Fixed Income", value: 50 },
    ];
    // EB[0] matches AA[0] (same index) -> override (no palette consumed)
    // EB[1] gets BASE_PALETTE[0]
    const eb = [
      { label: "Equities", value: 40 },
      { label: "United Kingdom", value: 60 },
    ];

    render(
      <EquitiesBreakdownChart equitiesBreakdown={eb} assetAllocation={aa} />,
    );

    const isGrey0 = OVERRIDES.includes(
      screen.getByTestId("slice-0").getAttribute("data-color")!,
    );
    expect(isGrey0).toBe(true);

    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      BASE_PALETTE[0],
    );
  });

  test("should handle overlap at different index -> NOT override (uses next palette colour)", () => {
    // AA[1] = "United States"
    const aa = [
      { label: "X", value: 10 },
      { label: "United States", value: 90 },
    ];
    // EB[0] = "United States" -> overlap but at index 0 vs AA index 1 => NOT grey
    const eb = [{ label: "United States", value: 100 }];

    render(
      <EquitiesBreakdownChart equitiesBreakdown={eb} assetAllocation={aa} />,
    );

    const c0 = screen.getByTestId("slice-0").getAttribute("data-color");
    expect(OVERRIDES.includes(c0!)).toBe(false);
    expect(c0).toBe(BASE_PALETTE[0]); // first palette colour
  });

  test("should handle case-insensitive label matching for same-index overlap", () => {
    const aa = [{ label: "usa", value: 100 }];
    const eb = [{ label: "USA", value: 100 }]; // same index, different case

    render(
      <EquitiesBreakdownChart equitiesBreakdown={eb} assetAllocation={aa} />,
    );

    const isGrey0 = OVERRIDES.includes(
      screen.getByTestId("slice-0").getAttribute("data-color")!,
    );
    expect(isGrey0).toBe(true);
  });

  test("should handle values pass through unchanged (decimals & zeros)", () => {
    // EB feeds values; PieChart filters true zeros internally later.
    const eb = [
      { label: "A", value: 33.333 },
      { label: "B", value: 0 },
      { label: "C", value: 66.667 },
    ];

    render(
      <EquitiesBreakdownChart equitiesBreakdown={eb} assetAllocation={[]} />,
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
});
