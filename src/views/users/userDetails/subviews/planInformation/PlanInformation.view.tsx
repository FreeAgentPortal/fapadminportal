"use client";
import React from "react";
import styles from "./PlanInformation.module.scss";
import { Card, Tag, Spin, Empty, Descriptions, Space, Button, Alert, message } from "antd";
import {
  CrownOutlined,
  CalendarOutlined,
  DollarOutlined,
  CreditCardOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";
import { useInterfaceStore } from "@/state/interface";

interface PlanInformationProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const PlanInformation: React.FC<PlanInformationProps> = ({ userData, onDataUpdate }) => {
  const {
    data: planData,
    isLoading,
    error,
  } = useApiHook({
    url: `/auth/billing`,
    key: ["auth", "plan"],
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "cancelled":
        return "orange";
      case "trial":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleOutlined />;
      case "inactive":
      case "cancelled":
        return <ExclamationCircleOutlined />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return "Not provided";
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

  const formatCardBrand = (brand: string) => {
    return brand?.charAt(0).toUpperCase() + brand?.slice(1) || "Unknown";
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "diamond":
        return "#722ed1";
      case "gold":
        return "#faad14";
      case "silver":
        return "#8c8c8c";
      case "bronze":
        return "#d4380d";
      default:
        return "#1890ff";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "diamond":
        return "💎";
      case "gold":
        return "🥇";
      case "silver":
        return "🥈";
      case "bronze":
        return "🥉";
      default:
        return "⭐";
    }
  };

  const handleForceUpdate = async () => {
    try {
      await updateBilling({
        url: `/auth/billing/${billing?._id}`,
        formData: { needsUpdate: true },
      });
      addAlert({ message: "User has been flagged for billing update", type: "success" });
      // Optionally refresh the data
      onDataUpdate({ ...userData });
    } catch (error) {
      addAlert({ message: "Failed to update billing status", type: "error" });
      console.error("Error updating billing:", error);
    }
  };

  if (isLoading || isLoadingPlanDetails) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.loading}>
            <Spin size="large" />
            <p>Loading plan information...</p>
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
            message="Unable to load plan information"
            description="There was an error loading the billing data or no plan is associated with this user."
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
      <Card
        title={
          <div className={styles.cardTitle}>
            <CrownOutlined /> Subscription Overview
          </div>
        }
        className={styles.card}
        extra={
          <Space>
            <Tag color={getStatusColor(billing.status)} icon={getStatusIcon(billing.status)}>
              {billing.status?.toUpperCase() || "UNKNOWN"}
            </Tag>
            <Tag color={billing.isYearly ? "blue" : "orange"}>{billing.isYearly ? "Yearly" : "Monthly"}</Tag>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              loading={isUpdatingBilling}
              onClick={handleForceUpdate}
              disabled={isUpdatingBilling || billing.needsUpdate}
            >
              Force Account Update
            </Button>
          </Space>
        }
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Plan Type">
            <Tag color="blue">{billing.profileType?.toUpperCase() || "Unknown"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Billing Cycle">{billing.isYearly ? "Annual" : "Monthly"}</Descriptions.Item>
          <Descriptions.Item label="Customer ID">
            <code>{billing.customerId}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Profile ID">
            <code>{billing.profileId}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Processor">
            <Tag>{billing.processor?.toUpperCase() || "Unknown"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Vaulted">
            <Tag color={billing.vaulted ? "green" : "red"}>{billing.vaulted ? "Yes" : "No"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created">{new Date(billing.createdAt).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">{new Date(billing.updatedAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>

        {billing.features && billing.features.length > 0 && (
          <div className={styles.featuresSection}>
            <h4>Plan Features</h4>
            <div className={styles.featuresList}>
              {billing.features.map((feature: string, index: number) => (
                <Tag key={index} color="blue">
                  {feature}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Plan Details */}
      {planDetails && (
        <Card
          title={
            <div className={styles.cardTitle}>
              <CrownOutlined /> Current Plan Details
            </div>
          }
          className={styles.card}
          extra={
            <Space>
              {planDetails.mostPopular && <Tag color="gold">Most Popular</Tag>}
              <Tag color={getTierColor(planDetails.tier)} style={{ color: "white" }}>
                {getTierIcon(planDetails.tier)} {planDetails.tier?.toUpperCase() || "STANDARD"}
              </Tag>
            </Space>
          }
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Plan Name">
              <strong>{planDetails.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Monthly Price">
              <Tag color="green" style={{ fontSize: "14px", padding: "4px 8px" }}>
                ${planDetails.price}/month
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tier">
              <Tag color={getTierColor(planDetails.tier)} style={{ color: "white" }}>
                {getTierIcon(planDetails.tier)} {planDetails.tier?.toUpperCase() || "STANDARD"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Customer Information */}
      {customer && (
        <Card
          title={
            <div className={styles.cardTitle}>
              <UserOutlined /> Customer Information
            </div>
          }
          className={styles.card}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Name">{customer.name || "Not provided"}</Descriptions.Item>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined />
                {customer.email || "Not provided"}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <Space>
                <PhoneOutlined />
                {customer.phone || "Not provided"}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Customer Since">
              {customer.created ? new Date(customer.created * 1000).toLocaleDateString() : "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              <Space>
                <HomeOutlined />
                {formatAddress(customer.address)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Account Balance">
              <Tag color={customer.balance === 0 ? "green" : "orange"}>${(customer.balance / 100).toFixed(2)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Delinquent">
              <Tag color={customer.delinquent ? "red" : "green"}>{customer.delinquent ? "Yes" : "No"}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <Card
          title={
            <div className={styles.cardTitle}>
              <CreditCardOutlined /> Payment Method
            </div>
          }
          className={styles.card}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Card Brand">
              <Tag color="blue">{formatCardBrand(paymentMethod.card?.brand)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Last 4 Digits">
              <code>**** **** **** {paymentMethod.card?.last4}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Expiry">
              {paymentMethod.card?.exp_month?.toString().padStart(2, "0")}/{paymentMethod.card?.exp_year}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {paymentMethod.card?.country?.toUpperCase() || "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Funding">
              <Tag>{paymentMethod.card?.funding?.toUpperCase() || "Unknown"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="3D Secure">
              <Tag color={paymentMethod.card?.three_d_secure_usage?.supported ? "green" : "orange"}>
                {paymentMethod.card?.three_d_secure_usage?.supported ? "Supported" : "Not Supported"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Billing Address" span={2}>
              <Space>
                <HomeOutlined />
                {formatAddress(paymentMethod.billing_details?.address)}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default PlanInformation;
