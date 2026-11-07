# deposit-vs-estate

Lokata vs mieszkanie — a mobile-friendly calculator comparing the monthly after-tax earnings of money kept on a deposit account against the same money invested in a rented apartment. Every input recalculates all results instantly.

- **Deposit:** balance × rate / 12, minus 19% tax.
- **Apartment:** yield = rent × 12 / price; net rent = rent minus 8.5% tax; averaged over 12 months given the months actually rented.

## Tech stack

React + TypeScript, Vite, Tailwind CSS, shadcn/ui (Base UI), Number Flow. Deployed to GitHub Pages via `.github/workflows/deploy.yml` (base path `/deposit-vs-estate/`).

## Development

```sh
pnpm install
pnpm dev
```
