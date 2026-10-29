// Shared Tailwind class strings so buttons and form controls look the same everywhere.

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50";

export const inputBase =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 focus:outline-none";

export const inputError =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20";

export const label = "mb-1.5 block text-sm font-medium text-gray-700";

export const card = "rounded-xl border border-gray-200 bg-white shadow-sm";

export const backLink =
  "inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-teal-700";

// Adds thousands separators without converting to Number, so decimals stay exact.
export function formatAmount(value: string) {
  const [whole, fraction] = value.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}
