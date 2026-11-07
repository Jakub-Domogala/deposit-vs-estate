import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Money } from "@/components/money"
import { SliderInputField } from "@/components/slider-input-field"
import { Stat } from "@/components/stat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-medium">
          Lokata vs mieszkanie
        </h1>
        <ThemeToggle />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Wynik</CardTitle>
          <CardDescription>
            Miesięczny zarobek po podatku, uśredniony na 12 miesięcy.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Przywróć domyślne"
              onClick={() => setInputs(DEFAULTS)}
            >
              <RotateCcw />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Lokata" hint="na miesiąc, po podatku">
              <Money value={r.depositMonthlyNet} />
            </Stat>
            <Stat label="Mieszkanie" hint="na miesiąc, po podatku">
              <Money value={r.rentMonthlyNetAveraged} />
            </Stat>
          </div>
          <div
            className={cn(
              "rounded-2xl p-4 text-center",
              tie
                ? "bg-muted"
                : apartmentWins
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-sky-500/15 text-sky-700 dark:text-sky-300"
            )}
          >
            <p className="text-sm">
              {tie
                ? "Remis"
                : apartmentWins
                  ? "Mieszkanie wygrywa o"
                  : "Lokata wygrywa o"}
            </p>
            <p className="font-mono text-2xl font-medium tabular-nums">
              <Money value={Math.abs(r.difference)} suffix=" / mies." />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lokata</CardTitle>
          <CardDescription>Ile na koncie i jaki procent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <SliderInputField
              id="balance"
              label="Ile na koncie"
              value={inputs.balance}
              onChange={setAmount}
              steps={AMOUNT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={50_000_000}
            />
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
            />
            <SliderInputField
              id="deposit-tax"
              showSlider={false}
              label="Podatek od zysku"
              value={inputs.depositTaxPct}
              onChange={set("depositTaxPct")}
              min={0}
              max={40}
              step={0.5}
              unit="%"
              typedMin={0}
              typedMax={100}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Ile zarobku" hint="miesięcznie, brutto">
              <Money value={r.depositMonthlyGross} />
            </Stat>
            <Stat
              label={`Po podatku ${pct(inputs.depositTaxPct)}`}
              hint="miesięcznie, netto"
            >
              <Money value={r.depositMonthlyNet} />
            </Stat>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mieszkanie</CardTitle>
          <CardDescription>Cena, czynsz i wynajem w roku.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <SliderInputField
              id="price"
              label="Cena mieszkania"
              value={inputs.price}
              onChange={setAmount}
              steps={AMOUNT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={50_000_000}
            />
            <SliderInputField
              id="rent"
              label="Jaki czynsz miesięczny"
              value={inputs.rent}
              onChange={set("rent")}
              steps={RENT_STEPS}
              unit="zł"
              typedMin={0}
              typedMax={500_000}
            />
            <SliderInputField
              id="rent-tax"
              showSlider={false}
              label="Podatek"
              value={inputs.rentTaxPct}
              onChange={set("rentTaxPct")}
              min={0}
              max={20}
              step={0.5}
              unit="%"
              typedMin={0}
              typedMax={100}
            />
            <SliderInputField
              id="months"
              showSlider={false}
              label="Miesiące wynajmu w roku"
              value={inputs.monthsRented}
              onChange={set("monthsRented")}
              min={0}
              max={12}
              step={1}
              typedMin={0}
              typedMax={12}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Ile zarobku %" hint="roczny czynsz / cena">
              <Money value={r.rentYieldPct} format={percentFormat} suffix="%" />
            </Stat>
            <Stat
              label={`Kwota po podatku ${pct(inputs.rentTaxPct)}`}
              hint="czynsz miesięcznie, netto"
            >
              <Money value={r.rentMonthlyNet} />
            </Stat>
            <div className="col-span-2">
              <Stat
                label={`Po podatku ${pct(inputs.rentTaxPct)}, wynajęte przez ${inputs.monthsRented} mies.`}
                hint="średnio na miesiąc w roku"
              >
                <Money value={r.rentMonthlyNetAveraged} />
              </Stat>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
