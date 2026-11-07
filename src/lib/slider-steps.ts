/** Fixed "nice" step tables for wide-range sliders (see Invest-Calculator). */

function range(from: number, to: number, step: number): number[] {
  const out: number[] = []
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v))
  return out
}

/** Large sums (account balance, apartment price): fine steps, up to 5 mln. */
export const AMOUNT_STEPS = [
  ...range(0, 100_000, 10_000),
  ...range(150_000, 1_000_000, 50_000),
  ...range(1_100_000, 2_000_000, 100_000),
  ...range(2_250_000, 5_000_000, 250_000),
]

/** Monthly rent. */
export const RENT_STEPS = [
  ...range(0, 3_000, 100),
  ...range(3_250, 10_000, 250),
  ...range(11_000, 30_000, 1_000),
]

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
