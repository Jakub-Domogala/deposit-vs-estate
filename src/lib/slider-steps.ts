/** Fixed "nice" step tables for wide-range sliders (see Invest-Calculator). */

function range(from: number, to: number, step: number): number[] {
  const out: number[] = []
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v))
  return out
}

/** Account balance / apartment price: every 10k, up to 1.5 mln. */
export const AMOUNT_STEPS = range(0, 1_500_000, 10_000)

/** Monthly rent: every 100 zł, up to 10k. */
export const RENT_STEPS = range(0, 10_000, 100)

/** Index of the value in `steps` closest to `value`. */
export function closestStepIndex(steps: number[], value: number): number {
  let closestIndex = 0
  let smallestDiff = Infinity
  for (let index = 0; index < steps.length; index++) {
    const diff = Math.abs(steps[index] - value)
    if (diff < smallestDiff) {
      smallestDiff = diff
      closestIndex = index
    }
  }
  return closestIndex
}
