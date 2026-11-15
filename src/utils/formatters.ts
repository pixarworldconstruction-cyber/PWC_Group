/**
 * Indian Rupee & Construction Units Formatting Utilities
 * P W Construction (Pixar World Construction Pvt Ltd)
 */

/**
 * Formats a currency amount into Lakhs or Crores.
 * - 1 Crore = 100 Lakhs = 10,000,000 INR
 * - 1 Lakh = 100,000 INR
 * e.g., 150000000 -> "₹ 15.00 Cr", 8500000 -> "₹ 85.00 L"
 */
export function formatLakhsOrCrores(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹ 0.00 L';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    // 1 Crore or more
    const cr = (absAmount / 10000000).toFixed(2);
    return `${sign}₹ ${cr} Cr`;
  } else if (absAmount >= 100000) {
    // 1 Lakh or more
    const l = (absAmount / 100000).toFixed(2);
    return `${sign}₹ ${l} L`;
  } else {
    return `${sign}₹ ${absAmount.toLocaleString('en-IN')}`;
  }
}

/**
 * Returns breakdown of value and unit for concise badge rendering
 */
export function formatLakhsOrCroresParts(amount: number | null | undefined): { value: string; unit: string; full: string } {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return { value: '0.00', unit: 'L', full: '₹ 0.00 L' };
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    const val = (absAmount / 10000000).toFixed(2);
    return { value: `${sign}${val}`, unit: 'Cr', full: `${sign}₹ ${val} Cr` };
  } else if (absAmount >= 100000) {
    const val = (absAmount / 100000).toFixed(2);
    return { value: `${sign}${val}`, unit: 'L', full: `${sign}₹ ${val} L` };
  } else {
    const val = absAmount.toLocaleString('en-IN');
    return { value: `${sign}${val}`, unit: 'INR', full: `${sign}₹ ${val}` };
  }
}

/**
 * Formats cement quantity in number of bags
 */
export function formatCementQuantity(quantity: number | null | undefined): string {
  if (quantity === undefined || quantity === null || isNaN(quantity)) {
    return '0 Bags';
  }
  return `${Math.round(quantity).toLocaleString('en-IN')} Bags`;
}
