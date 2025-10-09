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
