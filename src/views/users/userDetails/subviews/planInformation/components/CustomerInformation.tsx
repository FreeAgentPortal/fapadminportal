"use client";
import React from "react";
import { Card, Descriptions, Space, Tag } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from "@ant-design/icons";
import { formatAddress, formatTimestamp, formatCurrency, formatBoolean } from "../planInformationUtils";
import { StripeCustomer } from "../planInformationTypes";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import styles from "../PlanInformation.module.scss";

interface CustomerInformationProps {
  customer: StripeCustomer;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({ customer }) => {
  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <UserOutlined /> Customer Information
        </div>
      }
      className={styles.card}
    >
      {customer ? (
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
              {formatPhoneNumber(customer.phone || "") || "Not provided"}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Customer Since">
            {customer.created ? formatTimestamp(customer.created) : "Unknown"}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            <Space>
              <HomeOutlined />
              {formatAddress(customer.address)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Account Balance">
            <Tag color={customer.balance === 0 ? "green" : "orange"}>{formatCurrency(customer.balance || 0)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Delinquent">
            <Tag color={customer.delinquent ? "red" : "green"}>{formatBoolean(customer.delinquent || false)}</Tag>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No customer information available.</p>
      )}
    </Card>
  );
};

export default CustomerInformation;
