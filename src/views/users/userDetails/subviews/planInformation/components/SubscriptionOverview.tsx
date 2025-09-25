"use client";
import React from "react";
import { Card, Tag, Descriptions, Space, Button } from "antd";
import {
  CrownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import {
  getStatusColor,
  getStatusIconType,
  getCreditsColor,
  getBooleanColor,
  formatBoolean,
} from "../planInformationUtils";
import { BillingData } from "../planInformationTypes";
import styles from "../PlanInformation.module.scss";

interface SubscriptionOverviewProps {
  billing: BillingData;
  isUpdatingBilling: boolean;
  onForceUpdate: () => void;
  onManageCredits: () => void;
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  billing,
  isUpdatingBilling,
  onForceUpdate,
  onManageCredits,
}) => {
  // Helper function to get the actual icon component
  const getStatusIcon = (status: string) => {
    const iconType = getStatusIconType(status);
    return iconType === "check-circle" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />;
  };

  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <CrownOutlined /> Subscription Overview
        </div>
      }
      className={styles.card}
      extra={
        <Space>
          <Tag color={getStatusColor(billing?.status)} icon={getStatusIcon(billing?.status)}>
            {billing?.status?.toUpperCase() || "UNKNOWN"}
          </Tag>
          <Tag color={billing?.isYearly ? "blue" : "orange"}>{billing?.isYearly ? "Yearly" : "Monthly"}</Tag>
          {typeof billing?.credits === "number" && billing?.credits >= 0 && (
            <Tag color="green" icon={<GiftOutlined />}>
              {billing.credits} Credits
            </Tag>
          )}
          <Button
            type="default"
            size="small"
            icon={<GiftOutlined />}
            onClick={onManageCredits}
            style={{ marginRight: 8 }}
          >
            Manage Credits
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            loading={isUpdatingBilling}
            onClick={onForceUpdate}
            disabled={isUpdatingBilling || billing.needsUpdate}
          >
            Force Account Update
          </Button>
        </Space>
      }
    >
      {billing ? (
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
            <Tag color={getBooleanColor(billing.vaulted)}>{formatBoolean(billing.vaulted)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Account Credits">
            <Tag color={getCreditsColor(billing.credits)} icon={<GiftOutlined />}>
              {billing.credits || 0} credits
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created">{new Date(billing.createdAt).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">{new Date(billing.updatedAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No billing information available.</p>
      )}
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
  );
};

export default SubscriptionOverview;
