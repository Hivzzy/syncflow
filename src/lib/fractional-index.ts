/**
 * Fractional Indexing Helper
 * 
 * Used for O(1) task and column reordering without cascading database updates.
 */

const DEFAULT_GAP = 1000.0;
const MIN_GAP = 0.000001;

/**
 * Calculates a new position between two adjacent items.
 * 
 * @param prevPosition - Position of the item above (null if moving to top)
 * @param nextPosition - Position of the item below (null if moving to bottom)
 * @returns The calculated new position (double precision)
 */
export function calculateNewPosition(
  prevPosition: number | null | undefined,
  nextPosition: number | null | undefined
): number {
  // Case 1: Empty list -> Start at default gap (e.g. 1000.0)
  if (prevPosition == null && nextPosition == null) {
    return DEFAULT_GAP;
  }

  // Case 2: Moving to the very top (before the first item)
  if (prevPosition == null && nextPosition != null) {
    return nextPosition / 2.0;
  }

  // Case 3: Moving to the very bottom (after the last item)
  if (prevPosition != null && nextPosition == null) {
    return prevPosition + DEFAULT_GAP;
  }

  // Case 4: Inserting between two items
  if (prevPosition != null && nextPosition != null) {
    return (prevPosition + nextPosition) / 2.0;
  }

  return DEFAULT_GAP;
}

/**
 * Checks if a fractional gap between two positions is getting too small and needs rebalancing.
 */
export function needsRebalance(prevPosition: number, nextPosition: number): boolean {
  return Math.abs(nextPosition - prevPosition) < MIN_GAP;
}
