type Address = {
  line1: string;
  line2?: string;
  city?: string;
  state: string;
  country?: string;
  postalCode?: string;
};

/**
 * Formats address fields into a clean string, omitting any undefined or empty fields.
 * @param address Address object
 * @returns Formatted address string
 */
export function formatAddress(address: Address): string {
  const { line1, line2, city, state, country, postalCode } = address;

  const parts = [line1, line2, city, state, country, postalCode].filter((part) => part && part.trim() !== '');

  return parts.join(', ');
}
