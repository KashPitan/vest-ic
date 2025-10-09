export type LabeledValue = { readonly label: string; readonly value: number };

export interface ColorizeOptions {
  /**
   * Reference list to check for overlaps
   */
  overlapAgainst?: readonly LabeledValue[];
  /**
   * Override which base palettes to use
   */
  basePalettes?: {
    oneToFive?: readonly string[];
    sixToSeven?: readonly string[];
    eightPlus?: readonly string[];
  };
  /**
   * Override grey palette for overlaps
   */
  overlapPalette?: readonly string[];
}

/**
 * Brand palettes (clockwise order)
 */
// 1–5 items
export const PALETTE_1_5 = [
  "#0B2B1C", // Racing Green
  "#155436", // Regular Green
  "#F59D1C", // Flat Gold
  "#FFF200", // Highlight Yellow
  "#F5F6F1", // Pure White (10S)
] as const;

// 6–7 items
export const PALETTE_6_7 = [
  "#0B2B1C", // Racing Green
  "#124C30", // Regular Green (10S)
  "#2E654A", // Regular Green (10T)
  "#F59D1C", // Flat Gold
  "#FFF200", // Highlight Yellow
  "#DCDCDC", // Mid Grey
  "#F5F6F1", // Pure White (10S)
] as const;

// 8+ items
export const PALETTE_8_PLUS = [
  "#0B2719", // Racing Green (10S)
  "#244133", // Racing Green (10T)
  "#124C30", // Regular Green (10S)
  "#2E654A", // Regular Green (10T)
  "#DC8D1A", // Flat Gold (10S)
  "#F6A733", // Flat Gold (10T)
  "#E5D900", // Highlight Yellow (10S)
  "#FFF318", // Highlight Yellow (10T)
  "#DCDCDC", // Mid Grey
  "#F5F6F1", // Pure White (10S)
] as const;

// Overlap palette used when a label exists in AA
export const OVERLAP_PALETTE = [
  "#000000", // Black
  "#262626", // Almost Black
  "#353637", // Dark Grey
  "#666666", // Grey
  "#7F7F7F", // Light Grey
  "#A6A6A6", // Ash
] as const;

/**
 * Normalizes a string for case/space-insensitive matching
 */
export const normalizeLabel = (s: string) => s.trim().toLowerCase();

/**
 * Pick a base palette based on count, allowing per-band overrides
 */
const getBasePalette = (
  count: number,
  overrides?: ColorizeOptions["basePalettes"],
): readonly string[] => {
  if (count <= 5) return overrides?.oneToFive ?? PALETTE_1_5;
  if (count <= 7) return overrides?.sixToSeven ?? PALETTE_6_7;
  return overrides?.eightPlus ?? PALETTE_8_PLUS;
};

/**
 * Create a set of normalized labels from a list
 */
const toOverlapSet = (list?: readonly LabeledValue[]) =>
  new Set((list ?? []).map((x) => normalizeLabel(x.label)));

/**
 * Colorize an array using size-aware base palettes only (no overlap logic)
 */
export const colorizeBaseOnly = <T extends LabeledValue>(
  items: readonly T[],
  options?: { paletteOverride?: readonly string[] },
): Array<T & { color: string }> => {
  if (!items?.length) return [];

  const palette =
    options?.paletteOverride ?? getBasePalette(items.length);

  return items.map((item, idx) => ({
    ...item,
    color: palette[idx % palette.length],
  }));
};

/**
 * Colorize using:
 * - base palette chosen by the count of NON-overlap items
 * - overlap items coloured from an overlap palette
 *
 * Only EB/FIB should use this (AA and TH should use `colorizeBaseOnly`)
 * Keeps input order. Uses distinct indices for base/overlap so colours stay compact
 */
export const colorizeWithOverlaps = <T extends LabeledValue>(
  items: readonly T[],
  options: ColorizeOptions = {},
): Array<T & { color: string }> => {
  if (!items?.length) return [];

  const overlapSet = toOverlapSet(options.overlapAgainst);

  // true if item’s label exists in overlapAgainst (case-insensitive)
  const isOverlap = items.map((item) => overlapSet.has(normalizeLabel(item.label)));
  const nonOverlapCount = isOverlap.reduce(
    (acc, flag) => acc + (flag ? 0 : 1),
    0,
  );

  const basePalette = getBasePalette(nonOverlapCount, options.basePalettes);
  const overlapPalette = options.overlapPalette ?? OVERLAP_PALETTE;

  let baseIdx = 0;
  let overlapIdx = 0;

  return items.map((item, i) => {
    const color = isOverlap[i]
      ? overlapPalette[overlapIdx++ % overlapPalette.length]
      : basePalette[baseIdx++ % basePalette.length];

    return { ...item, color };
  });
};
