export default (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match and capture groups for area code, prefix, and line number

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`; // Format as XXX-XXX-XXXX
  }

  // Return the original string if it doesn't match the expected format
  return phoneNumber;
}