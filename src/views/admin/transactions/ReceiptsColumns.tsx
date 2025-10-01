import React from "react";
import { Tag, Button } from "antd";
import { EyeOutlined, DownloadOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { IReceiptType } from "@/types/IReceiptType";
import styles from "./Transactions.module.scss";

interface ReceiptsColumnsProps {
  copyToClipboard: (transactionId: string) => void;
  truncateTransactionId: (transactionId: string, maxLength?: number) => string;
  onViewReceipt: (receipt: IReceiptType) => void;
}

export const getReceiptsColumns = ({ copyToClipboard, truncateTransactionId, onViewReceipt }: ReceiptsColumnsProps) => [
  {
    title: "Transaction ID",
    dataIndex: "transactionId",
    key: "transactionId",
    width: 180,
    render: (transactionId: string) => (
      <code
        className={styles.transactionId}
        onClick={() => copyToClipboard(transactionId)}
        style={{ cursor: "pointer" }}
        title="Click to copy"
      >
        {truncateTransactionId(transactionId)}
      </code>
    ),
  },
  {
    title: "Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
    render: (date: string) => (
      <span className={styles.date}>
        <CalendarOutlined /> {new Date(date).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number, record: IReceiptType) => (
      <span className={styles.amount}>
        <DollarOutlined /> {record.currency} {amount.toFixed(2)}
      </span>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type: string) => {
      const color = type === "payment" ? "blue" : type === "refund" ? "orange" : "purple";
      return <Tag color={color}>{type.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const color =
        status === "success" || status === "succeeded" ? "green" : status === "pending" ? "orange" : status === "failed" ? "red" : "default";
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (record: IReceiptType) => (
      <div className={styles.actions}>
        <Button
          type="link"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => onViewReceipt(record)}
          style={{ color: "white" }}
        >
          View
        </Button>
        <Button type="link" icon={<DownloadOutlined />} size="small" disabled>
          Download
        </Button>
      </div>
    ),
  },
];
