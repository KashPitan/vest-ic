import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AssetAllocationChart from "./AssetAllocationChart";

jest.mock("@/components/ui/pie-chart", () => {
  return function MockPieChart({
    title,
    data,
  }: {
    title?: string;
    data: Array<{ label: string; value: number; color?: string }>;
  }) {
    return (
      <div data-testid="pie-chart">
        {title && <div data-testid="chart-title">{title}</div>}
        <div data-testid="chart-data">
          {data.map((slice, index) => (
            <div
              key={index}
              data-testid={`slice-${index}`}
              data-label={slice.label}
              data-value={slice.value}
              data-color={slice.color}
            >
              {slice.label}: {slice.value}% (Color: {slice.color})
            </div>
          ))}
        </div>
      </div>
    );
  };
});

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

  test("should assign colors from the color palette", () => {
    render(<AssetAllocationChart allocation={mockAllocation} />);

    // Check that colors are assigned from the palette in order
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      "#1A1549",
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      "#99103B",
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-color",
      "#2563EB",
    );
    expect(screen.getByTestId("slice-3")).toHaveAttribute(
      "data-color",
      "#16A34A",
    );
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

  test("should cycle through color palette when more items than colors", () => {
    // Create 12 allocation items (more than the 10 colors in palette)
    const manyAllocations = Array.from({ length: 12 }, (_, i) => ({
      label: `Asset ${i + 1}`,
      value: Math.round((100 / 12) * 100) / 100, // Distribute evenly
    }));

    render(<AssetAllocationChart allocation={manyAllocations} />);

    // First item should use first color
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-color",
      "#1A1549",
    );

    // 10th item should use 10th color (last in palette)
    expect(screen.getByTestId("slice-9")).toHaveAttribute(
      "data-color",
      "#F43F5E",
    );

    // 11th item should cycle back to first color
    expect(screen.getByTestId("slice-10")).toHaveAttribute(
      "data-color",
      "#1A1549",
    );
  });

  test("should handle zero values", () => {
    const allocationWithZero = [
      { label: "Equities", value: 50 },
      { label: "Cash", value: 0 },
      { label: "Bonds", value: 50 },
    ];

    render(<AssetAllocationChart allocation={allocationWithZero} />);

    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "0");
  });

  test("should handle decimal values", () => {
    const allocationWithDecimals = [
      { label: "Equities", value: 33.333 },
      { label: "Bonds", value: 33.333 },
      { label: "Cash", value: 33.334 },
    ];

    render(<AssetAllocationChart allocation={allocationWithDecimals} />);

    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-value",
      "33.333",
    );
    expect(screen.getByTestId("slice-2")).toHaveAttribute(
      "data-value",
      "33.334",
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
