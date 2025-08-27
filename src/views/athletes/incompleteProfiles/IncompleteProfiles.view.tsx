"use client";
import React, { useState, useMemo } from "react";
import { Card, Table, Typography, Space, Pagination, Alert, Spin, Button } from "antd";
import { UserOutlined, ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./IncompleteProfiles.module.scss";
import useApiHook from "@/hooks/useApi";
import { createColumns } from "./columns";
import { IncompleteProfilesData } from "./types";

const { Title, Text, Paragraph } = Typography;

const IncompleteProfiles = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isError, error, refetch } = useApiHook({
    url: `/profiles/athlete/scheduler/incomplete`,
    key: ["incomplete-athlete-profiles", currentPage.toString(), pageSize.toString()],
    method: "GET",
    limit: pageSize,
    pageNumber: currentPage
  }) as { data: IncompleteProfilesData; isLoading: boolean; isError: boolean; error: any; refetch: () => void };

  const handleAthleteClick = (athleteId: string) => {
    router.push(`/athletes/${athleteId}`);
  };

  const handleEditClick = (athleteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/athletes/${athleteId}/edit`);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const columns = useMemo(
    () =>
      createColumns({
        handleAthleteClick,
        handleEditClick,
      }),
    []
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: "block", textAlign: "center" }}>Loading incomplete profiles...</Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Error Loading Profiles"
          description={error?.message || "Failed to load incomplete athlete profiles"}
          type="error"
          showIcon
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const profiles = data?.payload || [];
  const metadata = data?.metadata || {};
  const totalCount = metadata?.totalCount || profiles.length;

  return (
    <div className={styles.incompleteProfiles}>
      {/* Header Section */}
      <div className={styles.header}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <div className={styles.titleRow}>
            <Title level={2} style={{ margin: 0 }}>
              <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
              Incomplete Athlete Profiles
            </Title>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading}>
              Refresh
            </Button>
          </div>
          <Paragraph style={{ margin: 0, color: "#666" }}>
            Athletes with missing profile information that may affect team matching capabilities. Click on any athlete
            to view their detailed profile and complete missing fields.
          </Paragraph>
          {totalCount > 0 && (
            <Text type="secondary">
              Showing {profiles.length} of {totalCount} incomplete profiles
            </Text>
          )}
        </Space>
      </div>

      {/* Content Section */}
      {profiles.length === 0 ? (
        <Card className={styles.emptyState}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <UserOutlined style={{ fontSize: "48px", color: "#52c41a", marginBottom: 16 }} />
            <Title level={3} style={{ color: "#52c41a" }}>
              All Profiles Complete!
            </Title>
            <Paragraph style={{ color: "#666" }}>
              Great news! All athlete profiles have complete information. The profile checker found no missing fields.
            </Paragraph>
          </div>
        </Card>
      ) : (
        <>
          {/* Athletes Table */}
          <Table
            columns={columns}
            dataSource={profiles}
            pagination={false}
            rowKey={(record) => record.id || record._id || `athlete-${Math.random()}`}
            className={styles.athletesTable}
            size="middle"
            scroll={{ x: 800 }}
          />

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalCount}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} incomplete profiles`}
                pageSizeOptions={["10", "20", "50", "100"]}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IncompleteProfiles;
