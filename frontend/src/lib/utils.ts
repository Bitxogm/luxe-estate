/**
 * Utility helpers compartidos en toda la app.
 */

/**
 * Formatea un precio según el tipo (sale/rent).
 */
export function formatPrice(price: number, priceType: "sale" | "rent"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  return priceType === "rent" ? `${formatted}/mo` : formatted;
}

/**
 * Une clases de Tailwind de forma condicional (sin dependencia de clsx/cn).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
