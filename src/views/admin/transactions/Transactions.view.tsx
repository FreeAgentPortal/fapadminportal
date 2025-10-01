"use client";
import useApiHook from "@/hooks/useApi";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { Table } from "antd";
import React, { useState } from "react";
import { getReceiptsColumns } from "./ReceiptsColumns";
import { useInterfaceStore } from "@/state/interface";
import { IReceiptType } from "@/types/IReceiptType";
import ReceiptDetailsModal from "./ReceiptDetailsModal";

const Transactions = () => {
  const { addAlert } = useInterfaceStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<IReceiptType | null>(null);
  const { data, isLoading } = useApiHook({
    url: `/payment/receipt`,
    key: ["receipts"],
    method: "GET",
  }) as { data: any; isLoading: boolean; error: any };

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

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedReceipt(null);
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

  // Get table columns
  const columns = getReceiptsColumns({
    copyToClipboard,
    truncateTransactionId,
    onViewReceipt: handleViewReceipt,
  });

  return (
    <SearchWrapper
      buttons={[]}
      filters={[]}
      sort={[]}
      placeholder="Search Transactions"
      queryKey="receipts"
      total={data?.metadata?.totalCount}
      isFetching={isLoading}
    >
      <Table
        dataSource={data?.payload || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      {/* Receipt Details Modal */}
      <ReceiptDetailsModal isVisible={isModalVisible} onClose={handleCloseModal} receipt={selectedReceipt} />
    </SearchWrapper>
  );
};

export default Transactions;
