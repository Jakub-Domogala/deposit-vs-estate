import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Money } from "@/components/money"
import { SliderInputField } from "@/components/slider-input-field"
import { Stat } from "@/components/stat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculate, type Inputs } from "@/lib/calculator"
import { percentFormat } from "@/lib/number-flow"
import { AMOUNT_STEPS, RENT_STEPS } from "@/lib/slider-steps"
import { cn } from "@/lib/utils"

const DEFAULTS: Inputs = {
  balance: 1_000_000,
  depositRatePct: 4,
  depositTaxPct: 19,
  price: 1_000_000,
  rent: 4_000,
  rentTaxPct: 8.5,
  monthsRented: 10,
}

const pct = (n: number) =>
  `${Number(n.toFixed(2)).toString().replace(".", ",")}%`

export function App() {
  const [inputs, setInputs] = React.useState<Inputs>(DEFAULTS)
  const set =
    <K extends keyof Inputs>(key: K) =>
    (value: number) =>
      setInputs((prev) => ({ ...prev, [key]: value }))

  // "Ile na koncie" and "Cena mieszkania" are the same amount: editing either
  // one updates both.
  const setAmount = (value: number) =>
    setInputs((prev) => ({ ...prev, balance: value, price: value }))

  const r = React.useMemo(() => calculate(inputs), [inputs])
  const apartmentWins = r.difference > 0
  const tie = Math.abs(r.difference) < 0.5

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-3 p-3 sm:gap-6 sm:p-6">
      <header className="flex items-center justify-between gap-2">
        <h1 className="font-heading text-xl font-medium">
          Lokata vs mieszkanie
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Przywróć domyślne"
            onClick={() => setInputs(DEFAULTS)}
          >
            <RotateCcw />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid gap-3 min-[600px]:grid-cols-2 sm:gap-6">
        <Card size="sm" className="[--card-spacing:--spacing(3)]">
          <CardHeader>
            <CardTitle>Lokata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SliderInputField
              id="balance"
              label="Ile na koncie"
              value={inputs.balance}
              onChange={setAmount}
              steps={AMOUNT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={1_500_000}
              inputClassName="w-40"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <SliderInputField
                id="deposit-rate"
                label="Jaki procent"
                value={inputs.depositRatePct}
                onChange={set("depositRatePct")}
                min={0}
                max={15}
                step={0.1}
                unit="%"
                typedMin={0}
                typedMax={100}
                inputClassName="w-[5.5rem]"
              />
              <SliderInputField
                id="deposit-tax"
                label="Podatek"
                showSlider={false}
                value={inputs.depositTaxPct}
                onChange={set("depositTaxPct")}
                min={0}
                max={40}
                step={0.5}
                unit="%"
                typedMin={0}
                typedMax={100}
                inputClassName="w-[5.5rem]"
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Ile zarobku">
                <Money value={r.depositMonthlyGross} />
              </Stat>
              <Stat label={`Po podatku ${pct(inputs.depositTaxPct)}`}>
                <Money value={r.depositMonthlyNet} />
              </Stat>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="[--card-spacing:--spacing(3)]">
          <CardHeader>
            <CardTitle>Mieszkanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SliderInputField
              id="price"
              label="Cena mieszkania"
              value={inputs.price}
              onChange={setAmount}
              steps={AMOUNT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={1_500_000}
              inputClassName="w-40"
            />
            <SliderInputField
              id="rent"
              label="Jaki czynsz miesięczny"
              value={inputs.rent}
              onChange={set("rent")}
              steps={RENT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={10_000}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <SliderInputField
                id="rent-tax"
                label="Podatek"
                showSlider={false}
                value={inputs.rentTaxPct}
                onChange={set("rentTaxPct")}
                min={0}
                max={20}
                step={0.5}
                unit="%"
                typedMin={0}
                typedMax={100}
                inputClassName="w-[5.5rem]"
              />
              <SliderInputField
                id="months"
                label="Miesiące w roku"
                showSlider={false}
                value={inputs.monthsRented}
                onChange={set("monthsRented")}
                min={0}
                max={12}
                step={1}
                typedMin={0}
                typedMax={12}
                inputClassName="w-16"
              />
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Ile zarobku %">
                <Money
                  value={r.rentYieldPct}
                  format={percentFormat}
                  suffix="%"
                />
              </Stat>
              <Stat label={`Po podatku ${pct(inputs.rentTaxPct)}`}>
                <Money value={r.rentMonthlyNet} />
              </Stat>
              <Stat label={`Wynajęte ${inputs.monthsRented} mies.`}>
                <Money value={r.rentMonthlyNetAveraged} />
              </Stat>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card size="sm" className="[--card-spacing:--spacing(3)]">
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Lokata">
              <Money value={r.depositMonthlyNet} />
            </Stat>
            <Stat label="Mieszkanie">
              <Money value={r.rentMonthlyNetAveraged} />
            </Stat>
          </div>
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-2xl px-4 py-2",
              tie
                ? "bg-muted"
                : apartmentWins
                  ? "bg-pink-500/15 text-pink-700 dark:text-pink-300"
                  : "bg-violet-500/15 text-violet-700 dark:text-violet-300"
            )}
          >
            <p className="text-sm">
              {tie
                ? "Remis"
                : apartmentWins
                  ? "Mieszkanie wygrywa"
                  : "Lokata wygrywa"}
            </p>
            <p className="font-mono text-lg font-medium tabular-nums">
              <Money value={Math.abs(r.difference)} suffix=" / mies." />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
