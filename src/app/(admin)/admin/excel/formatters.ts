const decimalToPercentage = (value: number) => (value * 100).toFixed(2);

// Converts a cell-like value to a percentage number if numeric; otherwise returns defaultValue.
export const toPercentNumber = (
  value: unknown,
  defaultValue: number = 0,
): number => {
  const numericValue =
    typeof value === "number"
      ? value
      : value === undefined || value === null
        ? NaN
        : Number(value);

  return Number.isFinite(numericValue)
    ? Number(decimalToPercentage(numericValue))
    : defaultValue;
};

// Converts a value to its percentage string if numeric; preserves original string otherwise.
export const toPercentStringIfNumeric = (value: unknown): string => {
  const stringValue =
    value === undefined || value === null ? "" : String(value).trim();

  if (stringValue === "") return "";

  const numericValue = Number(stringValue);

  return Number.isFinite(numericValue)
    ? `${decimalToPercentage(numericValue).toString()}%`
    : stringValue;
};
