/**
 * Types for Plan Information components and utilities
 */

export interface PlanInformationProps {
  userData: any; // Replace with proper User type
  onDataUpdate: (updatedData: Partial<any>) => void;
}

export interface CreditsUpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
  billingData: any; // Replace with proper BillingAccountType
  onCreditsUpdated: () => void;
}

export interface StripeCustomer {
  name?: string;
  email?: string;
  phone?: string;
  created?: number;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  balance?: number;
  delinquent?: boolean;
}

export interface StripePaymentMethod {
  card?: {
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
    country?: string;
    funding?: string;
    three_d_secure_usage?: {
      supported?: boolean;
    };
  };
  billing_details?: {
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export interface PlanDetails {
  _id: string;
  name: string;
  price: number;
  tier: string;
  mostPopular?: boolean;
}

export interface BillingData {
  _id: string;
  status: string;
  isYearly: boolean;
  credits: number;
  profileType: string;
  customerId: string;
  profileId: string;
  processor: string;
  vaulted: boolean;
  createdAt: string;
  updatedAt: string;
  needsUpdate?: boolean;
  features?: string[];
  paymentProcessorData?: {
    stripe?: {
      customer?: StripeCustomer;
      paymentMethod?: StripePaymentMethod;
    };
  };
}

export type StatusType = "active" | "inactive" | "cancelled" | "trial";
export type TierType = "diamond" | "gold" | "silver" | "bronze";
export type ColorType = "green" | "red" | "orange" | "blue" | "default";
