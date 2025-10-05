import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AssetAllocationChart from "./AssetAllocationChart";
import { PALETTE_1_5, PALETTE_6_7, PALETTE_8_PLUS } from "../ui/chart-colors";

describe("AssetAllocationChart", () => {
  const mockAllocation = [
    { label: "Equities", value: 45.5 },
    { label: "Fixed Income", value: 30.2 },
    { label: "Cash", value: 15.8 },
    { label: "Alternatives", value: 8.5 },
  ];

  test("should render the chart with correct title", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Asset Allocation (% NAV)",
    );
  });

  test("should render the PieChart component", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  test("should pass correct data to PieChart component", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    // Check that all slices are rendered with correct data
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-label",
      "Equities",
    );
    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-value", "45.5");

    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-label",
      "Fixed Income",
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "30.2");

    expect(screen.getByTestId("slice-2")).toHaveAttribute("data-label", "Cash");
    expect(screen.getByTestId("slice-2")).toHaveAttribute("data-value", "15.8");

    expect(screen.getByTestId("slice-3")).toHaveAttribute(
      "data-label",
      "Alternatives",
    );
    expect(screen.getByTestId("slice-3")).toHaveAttribute("data-value", "8.5");
  });

  test("should use the 1–5 palette for 4 items", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    mockAllocation.forEach((_item, item) => {
      expect(screen.getByTestId(`slice-${item}`)).toHaveAttribute(
        "data-color",
        PALETTE_1_5[item % PALETTE_1_5.length],
      );
    });
  });

  test("should use the 6–7 palette when there are 6 items", () => {
    const six = [
      { label: "A", value: 10 },
      { label: "B", value: 20 },
      { label: "C", value: 15 },
      { label: "D", value: 5 },
      { label: "E", value: 25 },
      { label: "F", value: 25 },
    ];
    render(<AssetAllocationChart allocation={six} />);

    six.forEach((_item, i) => {
      expect(screen.getByTestId(`slice-${i}`)).toHaveAttribute(
        "data-color",
        PALETTE_6_7[i % PALETTE_6_7.length],
      );
    });
  });

  test("should use the 8+ palette when there are 9 items and cycles when needed", () => {
    const nine = Array.from({ length: 9 }, (_, i) => ({
      label: `Asset ${i + 1}`,
      value: 100 / 9,
    }));
    render(<AssetAllocationChart allocation={nine} />);

    // first colour from 8+ palette
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[0],
    );
    // last colour should be the 9th entry in the 8+ palette
    expect(screen.getByTestId("slice-8")).toHaveAttribute(
      "data-color",
      PALETTE_8_PLUS[8 % PALETTE_8_PLUS.length],
    );
  });

  test("should render nothing when allocation is empty", () => {
    const { container } = render(<AssetAllocationChart allocation={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("should handle missing or empty labels", () => {
    const withEmpty = [
      { label: "", value: 50 },
      { label: "Bonds", value: 50 },
    ];
    render(<AssetAllocationChart allocation={withEmpty} />);
    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-label", "");
  });
});
