import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AssetAllocationChart from "./AssetAllocationChart";
import { BASE_PALETTE } from "../ui/chart-colors";

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

  test("should assign colors from the base palette in order", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    mockAllocation.forEach((_item, i) => {
      expect(screen.getByTestId(`slice-${i}`)).toHaveAttribute(
        "data-color",
        BASE_PALETTE[i % BASE_PALETTE.length],
      );
    });
  });

  test("should render nothing when allocation is empty", () => {
    const { container } = render(<AssetAllocationChart allocation={[]} />);

    expect(container.firstChild).toBeNull();
  });

  test("should render nothing when allocation is null", () => {
    const { container } = render(
      <AssetAllocationChart allocation={null as any} />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("should preserve the input order", () => {
    const ordered = [
      { label: "Cash", value: 10 },
      { label: "Bonds", value: 20 },
      { label: "Equities", value: 70 },
    ];

    render(<AssetAllocationChart allocation={ordered} />);

    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-label", "Cash");
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-label",
      "Bonds",
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-label",
      "Equities",
    );
  });

  test("should handle missing or empty labels", () => {
    const allocationWithEmptyLabel = [
      { label: "", value: 50 },
      { label: "Bonds", value: 50 },
    ];

    render(<AssetAllocationChart allocation={allocationWithEmptyLabel} />);

    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-label", "");
  });
});
