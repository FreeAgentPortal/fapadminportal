"use client";
import React from "react";
import { Modal, Descriptions, Tag, Space, Typography, Divider, Alert } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { IReceiptType } from "@/types/IReceiptType";
import styles from "./Receipts.module.scss";

const { Text, Title } = Typography;

interface ReceiptDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  receipt: IReceiptType | null;
}

const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({ isVisible, onClose, receipt }) => {
  if (!receipt) return null;

  // Helper functions for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      case "refunded":
        return "purple";
      case "voided":
        return "default";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment":
        return "blue";
      case "refund":
        return "orange";
      case "void":
        return "purple";
      default:
        return "default";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileTextOutlined />
          <span>Receipt Details</span>
          <Tag color={getStatusColor(receipt.status)}>{receipt.status.toUpperCase()}</Tag>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.receiptModal}
    >
      <div className={styles.receiptDetails}>
        {/* Transaction Overview */}
        <div className={styles.section}>
          <Title level={5}>
            <InfoCircleOutlined /> Transaction Overview
          </Title>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Transaction ID">
              <Text code copyable>
                {receipt.transactionId}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Internal ID">
              <Text code>{receipt._id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(receipt.status)}>{receipt.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={getTypeColor(receipt.type)}>{receipt.type.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Text strong style={{ fontSize: "16px" }}>
                <DollarOutlined /> {receipt.currency} {receipt.amount.toFixed(2)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Date">
              <Space>
                <CalendarOutlined />
                {formatDate(receipt.transactionDate)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {receipt.description || "No description provided"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Plan Information */}
        {receipt.planInfo && (
          <div className={styles.section}>
            <Title level={5}>
              <CreditCardOutlined /> Plan Information
            </Title>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Plan Name">
                <Text strong>{receipt.planInfo.planName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Plan ID">
                <Text code>{receipt.planInfo.planId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Plan Price">
                <Text strong>${receipt.planInfo.planPrice.toFixed(2)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Billing Cycle">
                <Tag color="blue">{receipt.planInfo.billingCycle.toUpperCase()}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* Customer Information */}
        <div className={styles.section}>
          <Title level={5}>
            <UserOutlined /> Customer Information
          </Title>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Name">{receipt.customer.name}</Descriptions.Item>
            <Descriptions.Item label="Email">
              <Text copyable>{receipt.customer.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <Text copyable>{receipt.customer.phone}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              <Text code>{receipt.userId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Billing Account ID" span={2}>
              <Text code>{receipt.billingAccountId}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Payment Processor Information */}
        <div className={styles.section}>
          <Title level={5}>
            <CreditCardOutlined /> Payment Processor
          </Title>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Processor">
              <Tag color="geekblue">{receipt.processor.name.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Processor Transaction ID">
              <Text code copyable>
                {receipt.processor.transactionId}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Raw Response" span={2}>
              <div className={styles.jsonResponse}>
                <Text>
                  <pre>{JSON.stringify(receipt.processor.response, null, 2)}</pre>
                </Text>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Failure Information */}
        {(receipt.status === "failed" || receipt.failure) && (
          <div className={styles.section}>
            <Alert
              message="Transaction Failure Details"
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: "16px" }}
            />
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Failure Reason">
                <Text type="danger">{receipt.failure?.reason || "No failure reason provided"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Failure Code">
                <Text code type="danger">
                  {receipt.failure?.code || "No failure code provided"}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* Audit Trail */}
        <div className={styles.section}>
          <Title level={5}>
            <CalendarOutlined /> Audit Trail
          </Title>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Created At">
              <Space>
                <CalendarOutlined />
                {formatDate(receipt.createdAt)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              <Space>
                <CalendarOutlined />
                {formatDate(receipt.updatedAt)}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptDetailsModal;
