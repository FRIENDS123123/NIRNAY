// Shared formatters. Kept in one place so currency, dates and confidence
// percentages read identically everywhere in the profile.

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Indian-convention short form: ₹3.20 Cr / ₹61.00 L / ₹9,800. */
export function formatCompactCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return currencyFormatter.format(value);
}

/** ISO date → "19 Jul 2024". Returns the input unchanged if unparseable. */
export function formatDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return dateFormatter.format(parsed);
}

export function formatDateRange(from: string, to?: string): string {
  return `${formatDate(from)} → ${to ? formatDate(to) : "present"}`;
}

/** 0–1 confidence → "97%". */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function yearOf(iso: string): string {
  return iso.slice(0, 4);
}
