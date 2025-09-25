"use client";
import React from "react";
import { Card, Descriptions, Space, Tag } from "antd";
import { CreditCardOutlined, HomeOutlined } from "@ant-design/icons";
import { formatAddress, formatCardBrand, getBooleanColor, formatCardExpiry } from "../planInformationUtils";
import { StripePaymentMethod } from "../planInformationTypes";
import styles from "../PlanInformation.module.scss";

interface PaymentMethodProps {
  paymentMethod: StripePaymentMethod;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentMethod }) => {
  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <CreditCardOutlined /> Payment Method
        </div>
      }
      className={styles.card}
    >
      {paymentMethod?.card ? (
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Card Brand">
            <Tag color="blue">{formatCardBrand(paymentMethod.card?.brand || "")}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Last 4 Digits">
            <code>**** **** **** {paymentMethod.card?.last4}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Expiry">
            {formatCardExpiry(paymentMethod.card?.exp_month || 0, paymentMethod.card?.exp_year || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {paymentMethod.card?.country?.toUpperCase() || "Unknown"}
          </Descriptions.Item>
          <Descriptions.Item label="Funding">
            <Tag>{paymentMethod.card?.funding?.toUpperCase() || "Unknown"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="3D Secure">
            <Tag color={getBooleanColor(paymentMethod.card?.three_d_secure_usage?.supported || false)}>
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
      ) : (
        <p>No payment method available.</p>
      )}
    </Card>
  );
};

export default PaymentMethod;
