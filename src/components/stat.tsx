import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Stat({
  label,
  hint,
  emphasize = false,
  children,
}: {
  label: string
  hint?: string
  emphasize?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs leading-tight text-muted-foreground">{label}</p>
      <div
        className={cn(
          "font-mono font-medium tabular-nums",
          emphasize ? "text-3xl text-primary" : "text-base"
        )}
      >
        {children}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
