export interface IReceiptType {
  _id: string;
  // Basic transaction info
  transactionId: string; // Internal transaction ID
  billingAccountId: string;
  userId: string;
  // Transaction details
  status: "pending" | "success" | "failed" | "refunded" | "voided";
  type: "payment" | "refund" | "void";
  amount: number;
  currency: string;
  description?: string; // Optional description of what the payment was for
  // Plan information snapshot (optional - not all transactions are plan-related)
  planInfo?: {
    planId: string;
    planName: string;
    planPrice: number;
    billingCycle: "monthly" | "yearly";
  };
  // Payment processor info
  processor: {
    name: string;
    transactionId: string;
    response: any; // Raw response from the payment processor
  };
  // Customer info snapshot
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  // Failure tracking
  failure: {
    reason: string;
    code: string;
  };
  // Audit
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
