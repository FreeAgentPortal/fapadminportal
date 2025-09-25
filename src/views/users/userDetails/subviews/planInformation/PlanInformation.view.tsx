"use client";
import React, { useState } from "react";
import styles from "./PlanInformation.module.scss";
import { Card, Spin, Button, Alert } from "antd";
import { CrownOutlined, ReloadOutlined } from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import CreditsUpdateModal from "./CreditsUpdateModal";
import { SubscriptionOverview, PlanDetails, CustomerInformation, PaymentMethod } from "./components";
import { MESSAGES } from "./planInformationConstants";

interface PlanInformationProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const PlanInformation: React.FC<PlanInformationProps> = ({ userData, onDataUpdate }) => {
  const [isCreditsModalVisible, setIsCreditsModalVisible] = useState(false);
  const {
    data: planData,
    isLoading,
    error,
    refetch: refetchBilling,
  } = useApiHook({
    url: `/auth/billing`,
    key: ["auth", "plan", userData?._id as string],
    method: "GET",
    enabled: !!userData?._id,
    filter: `payor;${userData?._id}`,
  }) as any;

  const { mutate: updateBilling, isLoading: isUpdatingBilling } = useApiHook({
    key: ["auth", "plan", "update"],
    method: "PUT",
    queriesToInvalidate: ["auth,plan"],
  }) as any;

  // Fetch plan details
  const {
    data: planDetailsData,
    isLoading: isLoadingPlanDetails,
    error: planDetailsError,
  } = useApiHook({
    url: `/auth/plan/${planData?.payload[0]?.plan?._id}`,
    key: ["plan", planData?.payload[0]?.plan?._id],
    method: "GET",
    enabled: !!planData?.payload[0]?.plan?._id,
  }) as any;

  const { addAlert } = useInterfaceStore((state) => state);

  const billing = planData?.payload[0];
  const planDetails = planDetailsData?.payload;
  const customer = billing?.paymentProcessorData?.stripe?.customer;
  const paymentMethod = billing?.paymentProcessorData?.stripe?.paymentMethod;

  const handleForceUpdate = async () => {
    try {
      await updateBilling({
        url: `/auth/billing/${billing?._id}`,
        formData: { needsUpdate: true },
      });
      addAlert({ message: MESSAGES.SUCCESS_UPDATE, type: "success" });
      // Optionally refresh the data
      onDataUpdate({ ...userData });
    } catch (error) {
      addAlert({ message: MESSAGES.ERROR_UPDATE, type: "error" });
      console.error("Error updating billing:", error);
    }
  };

  const handleCreditsUpdated = () => {
    refetchBilling();
    onDataUpdate({ ...userData });
  };

  if (isLoading || isLoadingPlanDetails) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.loading}>
            <Spin size="large" />
            <p>{MESSAGES.LOADING}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !billing) {
    return (
      <div className={styles.container}>
        <Card
          title={
            <div className={styles.cardTitle}>
              <CrownOutlined /> Plan Information
            </div>
          }
          className={styles.card}
        >
          <Alert
            message={MESSAGES.ERROR_LOAD}
            description={MESSAGES.ERROR_DESCRIPTION}
            type="warning"
            showIcon
            action={
              <Button size="small" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Subscription Overview */}
      <SubscriptionOverview
        billing={billing}
        isUpdatingBilling={isUpdatingBilling}
        onForceUpdate={handleForceUpdate}
        onManageCredits={() => setIsCreditsModalVisible(true)}
      />
      {/* Plan Details */}
     <PlanDetails planDetails={planDetails} />
      {/* Customer Information */}
      <CustomerInformation customer={customer} />
      {/* Payment Method */}
      <PaymentMethod paymentMethod={paymentMethod} />
      {/* Credits Update Modal */}
      {billing && (
        <CreditsUpdateModal
          isVisible={isCreditsModalVisible}
          onClose={() => setIsCreditsModalVisible(false)}
          billingData={billing}
          onCreditsUpdated={handleCreditsUpdated}
        />
      )}
    </div>
  );
};

export default PlanInformation;
