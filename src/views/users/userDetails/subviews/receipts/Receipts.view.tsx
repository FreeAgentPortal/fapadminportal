"use client";
import React from "react";
import styles from "./Receipts.module.scss";
import { Card, Table, Tag, Button, Empty, Spin } from "antd";
import { FileTextOutlined, DownloadOutlined, EyeOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";

interface ReceiptsProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const Receipts: React.FC<ReceiptsProps> = ({ userData, onDataUpdate }) => {
  const { id } = useParams();

  // TODO: Implement receipts fetching logic
  // This is a minimal scaffolding that will be expanded later
  const {
    data: receiptsData,
    isLoading,
    error,
  } = useApiHook({
    url: `/user/${id}/receipts`,
    key: ["user", id as string, "receipts"],
    method: "GET",
    enabled: false, // Disabled for now since endpoint doesn't exist yet
  }) as { data: any; isLoading: boolean; error: any };

  // Placeholder columns for future receipts table
  const columns = [
    {
      title: "Receipt ID",
      dataIndex: "receiptId",
      key: "receiptId",
      render: (text: string) => <span className={styles.receiptId}>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <span className={styles.date}>
          <CalendarOutlined /> {date}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span className={styles.amount}>
          <DollarOutlined /> ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "paid" ? "green" : status === "pending" ? "orange" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <div className={styles.actions}>
          <Button type="link" icon={<EyeOutlined />} size="small">
            View
          </Button>
          <Button type="link" icon={<DownloadOutlined />} size="small">
            Download
          </Button>
        </div>
      ),
    },
  ];

  // Placeholder data for demonstration
  const placeholderData: any[] = [
    // Empty array - will be populated when API is ready
  ];

  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.cardTitle}>
            <FileTextOutlined /> User Receipts
          </div>
        }
        className={styles.card}
        extra={
          <Button type="primary" icon={<DownloadOutlined />} disabled>
            Export All Receipts
          </Button>
        }
      >
        <div className={styles.receiptsContent}>
          {isLoading ? (
            <div className={styles.loading}>
              <Spin size="large" />
              <p>Loading receipts...</p>
            </div>
          ) : (
            <>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className={styles.emptyDescription}>
                    <p>No receipts found for this user</p>
                    <p className={styles.subText}>
                      User receipts and billing history will be displayed here when available
                    </p>
                  </div>
                }
              />

              {/* Placeholder table for future implementation */}
              <div className={styles.tableContainer}>
                <Table
                  columns={columns}
                  dataSource={placeholderData}
                  rowKey="receiptId"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} receipts`,
                  }}
                  locale={{
                    emptyText: (
                      <div className={styles.emptyTableText}>
                        <FileTextOutlined className={styles.emptyIcon} />
                        <p>Receipt data will be populated here</p>
                        <p className={styles.subText}>Connect to the receipts API to display user billing history</p>
                      </div>
                    ),
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Summary Stats Placeholder */}
        <div className={styles.summaryStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Total Receipts</h4>
              <p>0</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Total Amount</h4>
              <p>$0.00</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CalendarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Last Payment</h4>
              <p>N/A</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipts;
