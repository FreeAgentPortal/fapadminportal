import { PlanType } from "./IPlanType";
import User from "./User";

export interface BillingAccountType {
  _id: string;
  customerId: string;
  profileId: string;
  email: string;
  profileType: string;
  features: string[];
  status: string;
  trialLength: number;
  processor?: string;
  setupFeePaid?: boolean;
  createdAt: Date;
  updatedAt: Date;
  vaulted: boolean;
  vaultId: string;
  nextBillingDate?: Date;
  needsUpdate?: boolean;
  payor: User;
  plan: PlanType;
  // is yearly? whether or not the subscription is yearly
  isYearly?: boolean;
  // Payment processor specific data map
  paymentProcessorData?: {
    [processorName: string]: any;
  };
}
