export type LabeledValue = { readonly label: string; readonly value: number };

export const BASE_PALETTE = [
  "#1A1549",
  "#9DB1DB",
  "#E6EEF6",
  "#A6A6A6",
  "#E7E7E7",
  "#D9D9D9",
  "#BFBFBF",
  "#DCDCDC",
  "#84CC16",
  "#F43F5E",
] as const;

export const OVERRIDES = [
  "#E5E7EB", 
  "#D1D5DB", 
  "#9CA3AF", 
  "#6B7280", 
  "#4B5563", 
  "#374151"
] as const;

/**
 * Normalizes a string for case/space-insensitive matching
 */
export const normalizeLabel = (s: string): string => s.trim().toLowerCase();

export interface ColorizeOptions {
  /**
   * Reference list to check for overlaps
   */
  overlapAgainst?: readonly LabeledValue[];
  /**
   * Custom palette to use instead of BASE_PALETTE
   */
  palette?: readonly string[];
  /**
   * Custom override colors to use instead of OVERRIDES
   */
  overrides?: readonly string[];
}

/**
 * Assign colours from a single base palette, with optional "push-down" overrides for
 * items that overlap with a reference list at the same index.
 *
 * @param items - Array of items to colorize
 * @param options - Configuration options
 * @returns Array of items with assigned colors
 *
 * @example
 * ```tsx
 * const items = [{ label: "Equities", value: 45 }, { label: "Bonds", value: 30 }];
 * const colored = colorizeSinglePalette(items);
 * ```
 *
 * **Behavior:**
 * - Every item gets BASE_PALETTE in order (cycling) by default
 * - If `overlapAgainst` is provided and an item's normalised label exists there:
 *    - If it appears at the SAME index: colour it from override palette and DO NOT advance the palette
 *      index (so the next item gets the colour that would have been used here)
 *    - Otherwise: just keep using the next palette colour (different positions => different colours)
 */
export function colorizeSinglePalette<T extends LabeledValue>(
  items: readonly T[],
  options: ColorizeOptions = {},
): Array<T & { color: string }> {
  if (!items?.length) return [];

  const palette = options?.palette ?? BASE_PALETTE;
  const overrides = options?.overrides ?? OVERRIDES;

  const overlapAgainst = options.overlapAgainst ?? [];
  const overlapAgainstIndex = new Map<string, number>();
  overlapAgainst.forEach((item, index) => 
    overlapAgainstIndex.set(normalizeLabel(item.label), index)
  );

  let paletteIndex = 0; // index into palette (increments for non-override items)
  let overrideIndex = 0; // index into overrides (increments for override items)

  return items.map((item, itemIndex) => {
    const normalizedLabel = normalizeLabel(item.label);
    const sameIndexOverlap = overlapAgainstIndex.has(normalizedLabel) && 
      overlapAgainstIndex.get(normalizedLabel) === itemIndex;

    if (sameIndexOverlap) {
      // overlap at same position => override palette + don't consume palette colour (push-down)
      const color = overrides[overrideIndex++ % overrides.length];
      return { ...item, color };
    }

    const color = palette[paletteIndex++ % palette.length];
    return { ...item, color };
  });
}
