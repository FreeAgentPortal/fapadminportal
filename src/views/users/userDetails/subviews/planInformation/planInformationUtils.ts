import { StatusType, TierType, ColorType, StripeCustomer } from "./planInformationTypes";
import { STATUS_COLORS, TIER_COLORS, TIER_ICONS, MESSAGES } from "./planInformationConstants";

/**
 * Get the appropriate color for billing status tags
 */
export const getStatusColor = (status: string): ColorType => {
  switch (status?.toLowerCase()) {
    case "active":
      return STATUS_COLORS.ACTIVE as ColorType;
    case "inactive":
      return STATUS_COLORS.INACTIVE as ColorType;
    case "cancelled":
      return STATUS_COLORS.CANCELLED as ColorType;
    case "trial":
      return STATUS_COLORS.TRIAL as ColorType;
    default:
      return STATUS_COLORS.DEFAULT as ColorType;
  }
};

/**
 * Get the status icon type for billing status
 */
export const getStatusIconType = (status: string): "check-circle" | "exclamation-circle" => {
  switch (status?.toLowerCase()) {
    case "active":
      return "check-circle";
    case "inactive":
    case "cancelled":
      return "exclamation-circle";
    default:
      return "check-circle";
  }
};

/**
 * Format address object into a readable string
 */
export const formatAddress = (address: StripeCustomer["address"]): string => {
  if (!address) return MESSAGES.NOT_PROVIDED;
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
};

/**
 * Format card brand name with proper capitalization
 */
export const formatCardBrand = (brand: string): string => {
  return brand?.charAt(0).toUpperCase() + brand?.slice(1) || MESSAGES.UNKNOWN;
};

/**
 * Get color for plan tier tags
 */
export const getTierColor = (tier: string): string => {
  switch (tier?.toLowerCase()) {
    case "diamond":
      return TIER_COLORS.DIAMOND;
    case "gold":
      return TIER_COLORS.GOLD;
    case "silver":
      return TIER_COLORS.SILVER;
    case "bronze":
      return TIER_COLORS.BRONZE;
    default:
      return TIER_COLORS.DEFAULT;
  }
};

/**
 * Get emoji icon for plan tiers
 */
export const getTierIcon = (tier: string): string => {
  switch (tier?.toLowerCase()) {
    case "diamond":
      return TIER_ICONS.DIAMOND;
    case "gold":
      return TIER_ICONS.GOLD;
    case "silver":
      return TIER_ICONS.SILVER;
    case "bronze":
      return TIER_ICONS.BRONZE;
    default:
      return TIER_ICONS.DEFAULT;
  }
};

/**
 * Format Unix timestamp to localized date string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

/**
 * Format monetary amount from cents to dollars
 */
export const formatCurrency = (amountInCents: number): string => {
  return `$${(amountInCents / 100).toFixed(2)}`;
};

/**
 * Get color based on credit balance
 */
export const getCreditsColor = (credits: number): ColorType => {
  return credits > 0 ? "green" : "default";
};

/**
 * Get color for boolean values (Yes/No fields)
 */
export const getBooleanColor = (value: boolean): ColorType => {
  return value ? "green" : "red";
};

/**
 * Format boolean value to Yes/No string
 */
export const formatBoolean = (value: boolean): string => {
  return value ? "Yes" : "No";
};

/**
 * Format card expiry date
 */
export const formatCardExpiry = (month: number, year: number): string => {
  return `${month?.toString().padStart(2, "0")}/${year}`;
};
