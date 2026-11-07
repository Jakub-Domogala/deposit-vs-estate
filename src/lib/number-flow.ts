import type { Format, Plugin } from "@number-flow/react"

export const locale = "pl-PL"

export const plnFormat: Format = {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
}

export const percentFormat: Format = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

/** Single-step digit roll (see Invest-Calculator). */
const singleStepPlugin: Plugin = {
  getDelta(value, prev, context) {
    if (value === prev) return 0
    const trend = context.flow.computedTrend || Math.sign(value - prev)
    if (trend < 0 && value > prev) return -1
    if (trend > 0 && value < prev) return 1
    return value > prev ? 1 : -1
  },
}

export const numberFlowPlugins = [singleStepPlugin]
export const transformTiming: EffectTiming = {
  duration: 350,
  easing: "ease-out",
}
export const spinTiming: EffectTiming = { duration: 350, easing: "ease-out" }
export const opacityTiming: EffectTiming = { duration: 200, easing: "ease-out" }
