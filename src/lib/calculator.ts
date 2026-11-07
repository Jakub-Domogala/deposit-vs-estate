export interface Inputs {
  /** Amount on the deposit account (PLN). */
  balance: number
  /** Deposit annual interest rate (%). */
  depositRatePct: number
  /** Tax on deposit interest (%), 19% "Belka" in Poland. */
  depositTaxPct: number
  /** Apartment price (PLN). */
  price: number
  /** Monthly rent (PLN). */
  rent: number
  /** Tax on rental income (%), 8.5% flat for private rent. */
  rentTaxPct: number
  /** Months per year the apartment is actually rented. */
  monthsRented: number
}

export interface Results {
  depositMonthlyGross: number
  depositMonthlyNet: number
  rentYieldPct: number
  rentMonthlyNet: number
  /** Net rent averaged over 12 months, given vacancy. */
  rentMonthlyNetAveraged: number
  /** Apartment (averaged net) minus deposit (net); positive = apartment wins. */
  difference: number
}

export function calculate(i: Inputs): Results {
  const depositMonthlyGross = (i.balance * (i.depositRatePct / 100)) / 12
  const depositMonthlyNet = depositMonthlyGross * (1 - i.depositTaxPct / 100)

  const rentYieldPct = i.price > 0 ? ((i.rent * 12) / i.price) * 100 : 0
  const rentMonthlyNet = i.rent * (1 - i.rentTaxPct / 100)
  const rentMonthlyNetAveraged = (rentMonthlyNet * i.monthsRented) / 12

  return {
    depositMonthlyGross,
    depositMonthlyNet,
    rentYieldPct,
    rentMonthlyNet,
    rentMonthlyNetAveraged,
    difference: rentMonthlyNetAveraged - depositMonthlyNet,
  }
}
