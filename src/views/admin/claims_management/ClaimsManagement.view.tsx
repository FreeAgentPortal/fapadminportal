"use client";
import React, { useState } from "react";
import { Table, Card, Tag, Input, Select, Button, Space, Avatar, Tooltip, Badge, DatePicker } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "./ClaimsManagement.module.scss";
import useApiHook from "@/hooks/useApi";
import { IClaimType } from "@/types/IClaimType";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import columns from "./columns";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ClaimsManagement = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedClaimType, setSelectedClaimType] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // API Hook for fetching claims
  const { data, isLoading, refetch } = useApiHook({
    method: "GET",
    url: "/auth/claim",
    key: ["claims", selectedStatus, selectedClaimType, dateRange?.map((d) => d.format("YYYY-MM-DD")).join(",") || ""],
    filter: [
      selectedStatus && `status:${selectedStatus}`,
      selectedClaimType && `claimType:${selectedClaimType}`,
      dateRange && `dateFrom:${dateRange[0].format("YYYY-MM-DD")}`,
      dateRange && `dateTo:${dateRange[1].format("YYYY-MM-DD")}`,
    ]
      .filter(Boolean)
      .join("|"),
  }) as any;

  const claimsData = data?.payload;

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedClaimType("");
    setDateRange(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Claims Management</h1>
          <p className={styles.subtitle}>Manage profile claims and user associations</p>
        </div>
        <div className={styles.headerActions}>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      <Card className={styles.filtersCard}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search Claims</label>
            <Search
              placeholder="Search by user name, email, or claim ID..."
              allowClear
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <Select
              placeholder="All Statuses"
              style={{ width: 150 }}
              value={selectedStatus || undefined}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="denied">Denied</Option>
              <Option value="not started">Not Started</Option>
            </Select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Claim Type</label>
            <Select
              placeholder="All Types"
              style={{ width: 150 }}
              value={selectedClaimType || undefined}
              onChange={setSelectedClaimType}
              allowClear
            >
              <Option value="athlete">Athlete</Option>
              <Option value="team">Team</Option>
              <Option value="agent">Agent</Option>
              <Option value="scout">Scout</Option>
            </Select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Date Range</label>
            <RangePicker value={dateRange} onChange={handleDateRangeChange} style={{ width: 250 }} />
          </div>

          <div className={styles.filterActions}>
            <Button icon={<FilterOutlined />} onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableInfo}>
            <span className={styles.totalCount}>
              Total Claims: <strong>{claimsData?.totalCount || 0}</strong>
            </span>
          </div>
        </div>

        <Table
          columns={columns()}
          dataSource={claimsData}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: claimsData?.currentPage || 1,
            pageSize: claimsData?.pageLimit || 20,
            total: claimsData?.totalCount || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} claims`,
          }}
          scroll={{ x: 1200 }}
          className={styles.claimsTable}
        />
      </Card>
    </div>
  );
};

export default ClaimsManagement;
