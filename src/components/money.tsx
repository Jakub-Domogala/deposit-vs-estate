import NumberFlow, { type Format } from "@number-flow/react"

import {
  locale,
  numberFlowPlugins,
  opacityTiming,
  plnFormat,
  spinTiming,
  transformTiming,
} from "@/lib/number-flow"

export function Money({
  value,
  format = plnFormat,
  suffix,
}: {
  value: number
  format?: Format
  suffix?: string
}) {
  return (
    <NumberFlow
      value={value}
      format={format}
      suffix={suffix}
      locales={locale}
      plugins={numberFlowPlugins}
      transformTiming={transformTiming}
      spinTiming={spinTiming}
      opacityTiming={opacityTiming}
    />
  )
}
