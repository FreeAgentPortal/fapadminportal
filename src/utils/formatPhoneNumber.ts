/**
 * Formats phone numbers for international display
 * Supports various formats without requiring country codes
 */
export default (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Handle empty or very short numbers
  if (cleaned.length < 4) {
    return phoneNumber;
  }

  // Format based on number length
  switch (cleaned.length) {
    case 7:
      // Local number: XXX-XXXX
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;

    case 10:
      // US/Canada: (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;

    case 11:
      // US/Canada with country code: +1 (XXX) XXX-XXXX
      if (cleaned.startsWith("1")) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      // Other 11-digit numbers: +X XXX XXX XXXX
      return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;

    case 12:
      // 12-digit international: +XX XXX XXX XXXX
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;

    case 13:
      // 13-digit international: +XXX XXX XXX XXXX
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;

    default:
      // Handle other lengths with intelligent grouping
      if (cleaned.length > 13) {
        // Very long numbers: +XXXX XXX XXX XXXX...
        return `+${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
      } else if (cleaned.length > 10) {
        // 11+ digit numbers: +XX XXX XXX XXXX
        const countryCodeLength = cleaned.length - 10;
        return `+${cleaned.slice(0, countryCodeLength)} ${cleaned.slice(
          countryCodeLength,
          countryCodeLength + 3
        )} ${cleaned.slice(countryCodeLength + 3, countryCodeLength + 6)} ${cleaned.slice(countryCodeLength + 6)}`;
      } else {
        // 8-9 digit numbers: XXX XXX XX(X)
        const firstGroup = Math.min(3, cleaned.length - 4);
        const secondGroup = Math.min(3, cleaned.length - firstGroup);
        return `${cleaned.slice(0, firstGroup)} ${cleaned.slice(firstGroup, firstGroup + secondGroup)} ${cleaned.slice(
          firstGroup + secondGroup
        )}`;
      }
  }
};
