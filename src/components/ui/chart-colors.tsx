export type LabeledValue = { label: string; value: number };

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
];

export const OVERRIDES = ["#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563", "#374151"];

// Case/space-insensitive match
export const norm = (s: string) => s.trim().toLowerCase();

/**
 * Assign colours from a single base palette, with optional "push-down" overrides for
 * items that overlap with a reference list at the same index.
 *
 * - Every item gets BASE_PALETTE in order (cycling) by default
 * - If `overlapAgainst` is provided and an item's normalised label exists there:
 *    - If it appears at the SAME index: colour it grey and DO NOT advance the palette
 *      index (so the next item gets the colour that would have been used here)
 *    - Otherwise: just keep using the next palette colour (different positions => different colours)
 */
export function colorizeSinglePalette<T extends LabeledValue>(
  items: T[],
  options?: {
    overlapAgainst?: LabeledValue[];
    palette?: string[];
    greys?: string[];
  },
): Array<T & { color: string }> {
  if (!items?.length) return [];

  const palette = options?.palette ?? BASE_PALETTE;
  const greys = options?.greys ?? OVERRIDES;

  const oa = options?.overlapAgainst ?? [];
  const oaIndex = new Map<string, number>();
  oa.forEach((a, i) => oaIndex.set(norm(a.label), i));

  let p = 0; // index into palette (increments for non-greyed items)
  let g = 0; // index into greys (increments for greyed items)

  return items.map((it, i) => {
    const k = norm(it.label);
    const sameIndexOverlap = oaIndex.has(k) && oaIndex.get(k) === i;

    if (sameIndexOverlap) {
      // overlap at same position => grey + don't consume palette colour (push-down)
      const color = greys[g++ % greys.length];
      return { ...it, color };
    }

    const color = palette[p++ % palette.length];
    return { ...it, color };
  });
}
