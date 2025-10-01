"use client";
import React, { useState } from "react";
import styles from "./Receipts.module.scss";
import { Card, Table, Tag, Button, Empty, Spin } from "antd";
import { FileTextOutlined, DownloadOutlined, EyeOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import User from "@/types/User";
import { IReceiptType } from "@/types/IReceiptType";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useInterfaceStore } from "@/state/interface";
import { getReceiptsColumns } from "./ReceiptsColumns";
import ReceiptDetailsModal from "./ReceiptDetailsModal";

interface ReceiptsProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const Receipts: React.FC<ReceiptsProps> = ({ userData, onDataUpdate }) => {
  const { id } = useParams();
  const { addAlert } = useInterfaceStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<IReceiptType | null>(null);

  const { data: receiptsData, isLoading } = useApiHook({
    url: `/payment/receipt`,
    key: ["user", id as string, "receipts"],
    method: "GET",
    filter: `userId;${id}`,
  }) as { data: any; isLoading: boolean; error: any };
  const { data: statisticData, isLoading: isLoadingStats } = useApiHook({
    url: `/payment/receipt/payment-statistics/${userData?._id}`,
    key: ["statistics", id as string],
    method: "GET",
    enabled: !!userData?._id,
  }) as any;

  // Function to copy transaction ID to clipboard
  const copyToClipboard = async (transactionId: string) => {
    try {
      await navigator.clipboard.writeText(transactionId);
      addAlert({
        type: "success",
        message: "Transaction ID copied to clipboard",
      });
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to copy to clipboard",
      });
    }
  };

  // Helper function to truncate transaction ID
  const truncateTransactionId = (transactionId: string, maxLength: number = 12) => {
    if (transactionId.length <= maxLength) return transactionId;
    return `${transactionId.substring(0, maxLength)}...`;
  };

  // Function to handle viewing a receipt
  const handleViewReceipt = (receipt: IReceiptType) => {
    setSelectedReceipt(receipt);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedReceipt(null);
  };

  // Get table columns
  const columns = getReceiptsColumns({
    copyToClipboard,
    truncateTransactionId,
    onViewReceipt: handleViewReceipt,
  });

  // Get actual receipts data
  const receipts: IReceiptType[] = receiptsData?.payload || [];

  // Get statistics from API
  const stats = statisticData?.payload || {
    totalReceipts: 0,
    totalAmountPaid: 0,
    totalRefunds: 0,
    totalFailedPayments: 0,
    lastSuccessfulPaymentDate: null,
  };

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
            <div className={styles.tableContainer}>
              <Table
                columns={columns}
                dataSource={receipts}
                rowKey="_id"
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
                      <p>No receipts found for this user</p>
                      <p className={styles.subText}>
                        User receipts and billing history will appear here when available
                      </p>
                    </div>
                  ),
                }}
                scroll={{ x: 600 }}
              />
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className={styles.summaryStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Total Receipts</h4>
              <p>{isLoadingStats ? "..." : stats.totalReceipts}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Total Amount Paid</h4>
              <p>{isLoadingStats ? "..." : `$${stats.totalAmountPaid.toFixed(2)}`}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CalendarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h4>Last Payment</h4>
              <p>
                {isLoadingStats
                  ? "..."
                  : stats.lastSuccessfulPaymentDate
                  ? new Date(stats.lastSuccessfulPaymentDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarOutlined style={{ color: "#ff4d4f" }} />
            </div>
            <div className={styles.statInfo}>
              <h4>Total Refunds</h4>
              <p>{isLoadingStats ? "..." : `$${stats.totalRefunds.toFixed(2)}`}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileTextOutlined style={{ color: "#ff4d4f" }} />
            </div>
            <div className={styles.statInfo}>
              <h4>Failed Payments</h4>
              <p>{isLoadingStats ? "..." : stats.totalFailedPayments}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Receipt Details Modal */}
      <ReceiptDetailsModal isVisible={isModalVisible} onClose={handleCloseModal} receipt={selectedReceipt} />
    </div>
  );
};

export default Receipts;
