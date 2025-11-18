/**
 * Formats a number into a human-readable string
 * @param num - The number to format
 * @returns Formatted string (e.g., 1234 -> "1.2K", 1234567 -> "1.2M")
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    // Thousands (K)
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }

  if (num < 1000000000) {
    // Millions (M)
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }

  // Billions (B)
  const billions = num / 1000000000;
  return billions % 1 === 0 ? `${billions}B` : `${billions.toFixed(1)}B`;
};
