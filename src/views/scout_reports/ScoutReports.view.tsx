"use client";
import React, { useState } from "react";
import { Table, message } from "antd";
import styles from "./ScoutReports.module.scss";
import useApiHook from "@/hooks/useApi";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import columns from "./columns";
import { IScoutReport } from "@/types/IScoutReport";
import { ViewModal, ConfirmModal } from "./modals";
import { useInterfaceStore } from "@/state/interface";

const ScoutReports = () => {
  const { addAlert } = useInterfaceStore((state) => state);
  const [selectedReport, setSelectedReport] = useState<IScoutReport | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: "approve" | "deny" | "delete";
    title: string;
    content: string;
    onConfirm: (message?: string) => void;
    loading: boolean;
    showMessageInput: boolean;
  }>({
    visible: false,
    type: "approve",
    title: "",
    content: "",
    onConfirm: () => {},
    loading: false,
    showMessageInput: false,
  });

  const { data, isLoading, isError, error } = useApiHook({
    url: "/scout",
    method: "GET",
    key: "scout_reports",
  }) as any;

  const { mutate: updateReport } = useApiHook({
    method: "POST",
    key: "scout_reports_update",
    queriesToInvalidate: ["scout_reports", "scout_reports,pending"],
  }) as any;
  // Action handlers
  const handleView = (record: IScoutReport) => {
    setSelectedReport(record);
    setIsViewModalVisible(true);
  };

  const handleApprove = (record: IScoutReport) => {
    const athleteName =
      (record as any).athlete?.fullName ||
      record.athleteId?._id ||
      (typeof record.athleteId === "string" ? record.athleteId : "Unknown");

    setConfirmModal({
      visible: true,
      type: "approve",
      title: "Approve Scout Report",
      content: `Are you sure you want to approve this scout report for athlete ${athleteName}?`,
      loading: false,
      showMessageInput: true,
      onConfirm: async (message?: string) => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          // TODO: Implement approve API call
          await updateReport(
            {
              url: `/scout/${record._id}/handle`,
              data: { action: "approve", message: message || "" },
            },
            {
              onSuccess: () => {
                addAlert({
                  type: "success",
                  message: "Scout report approved successfully",
                });
                setConfirmModal((prev) => ({ ...prev, visible: false, loading: false }));
              },
            }
          );
        } catch (error) {
          addAlert({
            type: "error",
            message: "Failed to approve scout report",
          });
          setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const handleDeny = (record: IScoutReport) => {
    const athleteName =
      (record as any).athlete?.fullName ||
      record.athleteId?._id ||
      (typeof record.athleteId === "string" ? record.athleteId : "Unknown");

    setConfirmModal({
      visible: true,
      type: "deny",
      title: "Deny Scout Report",
      content: `Are you sure you want to deny this scout report for athlete ${athleteName}?`,
      loading: false,
      showMessageInput: true,
      onConfirm: async (message?: string) => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          // TODO: Implement deny API call
          await updateReport(
            {
              url: `/scout/${record._id}/handle`,
              data: { action: "deny", message: message },
            },
            {
              onSuccess: () => {
                addAlert({
                  type: "success",
                  message: "Scout report denied successfully",
                });
                setConfirmModal((prev) => ({ ...prev, visible: false, loading: false }));
              },
            }
          );
          setConfirmModal((prev) => ({ ...prev, visible: false, loading: false }));
        } catch (error) {
          addAlert({
            type: "error",
            message: "Failed to deny scout report",
          });
          setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const handleDelete = (record: IScoutReport) => {
    setConfirmModal({
      visible: true,
      type: "delete",
      title: "Delete Scout Report",
      content: "Are you sure you want to permanently delete this scout report? This action cannot be undone.",
      loading: false,
      showMessageInput: true,
      onConfirm: async (deleteMessage?: string) => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          // TODO: Implement delete API call with deleteMessage
          message.success("Scout report deleted successfully");
          setConfirmModal((prev) => ({ ...prev, visible: false, loading: false }));
        } catch (error) {
          message.error("Failed to delete scout report");
          setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const tableColumns = columns({
    onView: handleView,
    onApprove: handleApprove,
    onDeny: handleDeny,
    onDelete: handleDelete,
  });

  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[]}
        filters={[
          {
            label: "All Reports",
            key: "",
          },
          {
            label: "Draft",
            key: "isDraft;true",
          },
          {
            label: "Pending Review",
            key: "isFinalized;false",
          },
          {
            label: "Finalized",
            key: "isFinalized;true",
          },
          {
            label: "Public",
            key: "isPublic;true",
          },
        ]}
        sort={[
          {
            label: "Newest First",
            key: "createdAt;desc",
          },
          {
            label: "Oldest First",
            key: "createdAt;asc",
          },
        ]}
        placeholder="Search scout reports by athlete ID, scout ID, or sport..."
        queryKey="scout_reports"
        total={data?.metadata?.totalCount}
        isFetching={isLoading}
      >
        <Table
          className={styles.scoutReportsTable}
          columns={tableColumns}
          dataSource={data?.payload || []}
          loading={isLoading}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </SearchWrapper>

      {/* View Modal */}
      <ViewModal isVisible={isViewModalVisible} onClose={() => setIsViewModalVisible(false)} report={selectedReport} />

      {/* Confirm Modal */}
      <ConfirmModal
        isVisible={confirmModal.visible}
        onClose={() => setConfirmModal((prev) => ({ ...prev, visible: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        content={confirmModal.content}
        type={confirmModal.type}
        loading={confirmModal.loading}
        showMessageInput={confirmModal.showMessageInput}
      />
    </div>
  );
};

export default ScoutReports;
