"use client";
import React from "react";
import { Card, Tag, Descriptions, Space } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import { getTierColor, getTierIcon } from "../planInformationUtils";
import { PlanDetails as PlanDetailsType } from "../planInformationTypes";
import styles from "../PlanInformation.module.scss";

interface PlanDetailsProps {
  planDetails: PlanDetailsType;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ planDetails }) => {
  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <CrownOutlined /> Current Plan Details
        </div>
      }
      className={styles.card}
      extra={
        <Space>
          {planDetails?.mostPopular && <Tag color="gold">Most Popular</Tag>}
          <Tag color={getTierColor(planDetails?.tier)} style={{ color: "white" }}>
            {getTierIcon(planDetails?.tier)} {planDetails?.tier?.toUpperCase() || "STANDARD"}
          </Tag>
        </Space>
      }
    >
      {planDetails ? (
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
      ) : (
        <p>No plan details available.</p>
      )}
    </Card>
  );
};

export default PlanDetails;
