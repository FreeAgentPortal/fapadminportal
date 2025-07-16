"use client";
import React, { useState } from "react";
import styles from "./PlansManagement.module.scss";
import { Button, Spin } from "antd";
import { PlusOutlined, DollarOutlined, FileTextOutlined, EditOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { PlanType } from "@/types/IPlanType";
import PlanModal from "./PlanModal.view";
import { calculatePlanStats, PLANS_API_ENDPOINTS } from "./plans.constants";

const PlansManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);

  // Fetch plans data
  const { data, isLoading, error, refetch } = useApiHook({
    url: PLANS_API_ENDPOINTS.LIST,
    key: ["plans"],
    method: "GET",
    // filter: `availableTo;{"$eq": "athelete"}`,
  }) as { data: { payload: PlanType[] }; isLoading: boolean; error: any; refetch: () => void };

  const plans = data?.payload || [];
  const planStats = calculatePlanStats(plans);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setModalVisible(true);
  };

  const handleEditPlan = (plan: PlanType) => {
    setEditingPlan(plan);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingPlan(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Refresh the plans data
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>
            <DollarOutlined />
            Plans Management
          </h3>
          <p className={styles.subtitle}>Create, edit, and manage subscription plans and pricing tiers</p>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addButton}
            size="large"
            onClick={handleCreatePlan}
          >
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{planStats.total}</span>
          <span className={styles.statLabel}>Total Plans</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{planStats.active}</span>
          <span className={styles.statLabel}>Active Plans</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{planStats.popular}</span>
          <span className={styles.statLabel}>Popular Plans</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{planStats.totalFeatures}</span>
          <span className={styles.statLabel}>Total Features</span>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className={styles.emptyState}>
          <FileTextOutlined className={styles.emptyIcon} />
          <h4 className={styles.emptyTitle}>No Plans Created</h4>
          <p className={styles.emptyDescription}>
            Get started by creating your first subscription plan. Define pricing, features, and billing cycles.
          </p>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreatePlan}>
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan._id} className={styles.planCard} onClick={() => handleEditPlan(plan)}>
              <div className={styles.planHeader}>
                <h4 className={styles.planName}>{plan.name}</h4>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPlan(plan);
                  }}
                />
              </div>
              <p className={styles.planDescription}>{plan.description}</p>
              <div className={styles.planPrice}>
                ${plan.price}/{plan.billingCycle}
              </div>
              <div className={styles.planMeta}>
                {plan.features?.length || 0} features • {plan.tier} tier
                {plan.mostPopular && <span className={styles.popularBadge}>Popular</span>}
                {!plan.isActive && <span className={styles.inactiveBadge}>Inactive</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default PlansManagement;
