/**
 * Constants for Plan Information components
 */

// Status colors mapping
export const STATUS_COLORS = {
  ACTIVE: "green",
  INACTIVE: "red",
  CANCELLED: "orange",
  TRIAL: "blue",
  DEFAULT: "default",
} as const;

// Tier colors mapping
export const TIER_COLORS = {
  DIAMOND: "#722ed1",
  GOLD: "#faad14",
  SILVER: "#8c8c8c",
  BRONZE: "#d4380d",
  DEFAULT: "#1890ff",
} as const;

// Tier icons mapping
export const TIER_ICONS = {
  DIAMOND: "💎",
  GOLD: "🥇",
  SILVER: "🥈",
  BRONZE: "🥉",
  DEFAULT: "⭐",
} as const;

// UI messages
export const MESSAGES = {
  LOADING: "Loading plan information...",
  ERROR_LOAD: "Unable to load plan information",
  ERROR_DESCRIPTION: "There was an error loading the billing data or no plan is associated with this user.",
  SUCCESS_UPDATE: "User has been flagged for billing update",
  ERROR_UPDATE: "Failed to update billing status",
  NOT_PROVIDED: "Not provided",
  UNKNOWN: "Unknown",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BILLING: "/auth/billing",
  PLAN: "/auth/plan",
  CREDITS_UPDATE: "/credits",
} as const;
