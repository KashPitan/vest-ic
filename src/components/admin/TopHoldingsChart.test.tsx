import "./Chart.mocks";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TopHoldingsChart from "./TopHoldingsChart";


describe("TopHoldingsChart", () => {
  const NAVY = "#1A1549";
  const BURGUNDY = "#99103B";

  const mockHoldings = [
    { label: "Top 10 holdings", value: 53.0 },
    { label: "Rest of portfolio", value: 47.0 },
  ];

  test("should render the PieChart component", () => {
    render(<TopHoldingsChart holdings={mockHoldings} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  test("should render the chart with correct title", () => {
    render(<TopHoldingsChart holdings={mockHoldings} />);

    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Top 10 Holdings (% NAV)",
    );
  });

  test("should pass labels and values through unchanged", () => {
    render(<TopHoldingsChart holdings={mockHoldings} />);

    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-label",
      "Top 10 holdings",
    );
    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-value", "53");
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-label",
      "Rest of portfolio",
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute("data-value", "47");
  });

  test('should color "rest" slice as burgundy and others as navy', () => {
    render(<TopHoldingsChart holdings={mockHoldings} />);

    expect(screen.getByTestId("slice-0")).toHaveAttribute("data-color", NAVY);
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-color",
      BURGUNDY,
    );
  });

  test("should render nothing when holdings is empty", () => {
    const { container } = render(<TopHoldingsChart holdings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("should handle zeros and decimals", () => {
    const data = [
      { label: "Top 10 holdings", value: 33.333 },
      { label: "Rest of portfolio", value: 66.667 },
    ];

    render(<TopHoldingsChart holdings={data} />);
    expect(screen.getByTestId("slice-0")).toHaveAttribute(
      "data-value",
      "33.333",
    );
    expect(screen.getByTestId("slice-1")).toHaveAttribute(
      "data-value",
      "66.667",
    );
  });
});
