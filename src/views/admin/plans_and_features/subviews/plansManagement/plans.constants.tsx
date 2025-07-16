import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { PlanType } from "@/types/IPlanType";

// Plan tier options for modal
export const PLAN_TIER_OPTIONS = [
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "diamond", label: "Diamond" },
] as const;

// Billing cycle options for modal
export const BILLING_CYCLE_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one-time", label: "One-time" },
] as const;

// Available to options for modal
export const AVAILABLE_TO_OPTIONS = [
  { value: "athlete", label: "Athletes" },
  { value: "team", label: "Teams" },
  { value: "scout", label: "Scouts" },
  { value: "agent", label: "Agents" },
] as const;

// API endpoints
export const PLANS_API_ENDPOINTS = {
  LIST: "/auth/plan",
  CREATE: "/auth/plan",
  UPDATE: (id: string) => `/auth/plan/${id}`,
  DELETE: (id: string) => `/auth/plan/${id}`,
  FEATURES: "/auth/feature",
} as const;

// Plan card helpers
export const getPlanStatusBadge = (plan: PlanType) => {
  const badges = [];

  if (plan.mostPopular) {
    badges.push(
      <span key="popular" className="popular-badge">
        Popular
      </span>
    );
  }

  if (!plan.isActive) {
    badges.push(
      <span key="inactive" className="inactive-badge">
        Inactive
      </span>
    );
  }

  return badges;
};

// Plan statistics helpers
export const calculatePlanStats = (plans: PlanType[]) => ({
  total: plans.length,
  active: plans.filter((plan) => plan.isActive).length,
  popular: plans.filter((plan) => plan.mostPopular).length,
  totalFeatures: plans.reduce((total, plan) => total + (plan.features?.length || 0), 0),
});

// Transfer component configuration for features
export const TRANSFER_CONFIG = {
  titles: ["Available Features", "Included Features"],
  showSearch: true,
  showSelectAll: true,
  listStyle: {
    width: 300,
    height: 400,
  },
};
