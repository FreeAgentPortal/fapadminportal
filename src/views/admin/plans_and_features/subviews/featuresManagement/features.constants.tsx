import React from "react";
import { Button, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FeatureType } from "@/types/IFeatureType";

// Feature status helpers
export const getStatusColor = (isActive: boolean): "success" | "default" => {
  return isActive ? "success" : "default";
};

export const getStatusText = (isActive: boolean): string => {
  return isActive ? "Active" : "Inactive";
};

// Feature table column definitions
export const createFeatureColumns = (
  handleEditFeature: (feature: FeatureType) => void,
  handleDeleteFeature: (feature: FeatureType) => void
): ColumnsType<FeatureType> => [
  {
    title: "Feature Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <span style={{ fontWeight: 500, color: "#ffffff" }}>{text}</span>,
  },
  {
    title: "Description",
    dataIndex: "shortDescription",
    key: "shortDescription",
    render: (text: string) => <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>{text}</span>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (text: string) => (
      <Tag
        color="blue"
        style={{
          backgroundColor: "rgba(24, 144, 255, 0.2)",
          color: "#4096ff",
          border: "1px solid #4096ff",
        }}
      >
        {text}
      </Tag>
    ),
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "status",
    render: (isActive: boolean) => <Tag color={getStatusColor(isActive)}>{getStatusText(isActive)}</Tag>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record: FeatureType) => (
      <Space size="small">
        <Button
          type="text"
          icon={<EditOutlined />}
          style={{ color: "#4096ff" }}
          size="small"
          onClick={() => handleEditFeature(record)}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          style={{ color: "#ff4d4f" }}
          size="small"
          onClick={() => handleDeleteFeature(record)}
        />
      </Space>
    ),
  },
];

// Feature type options for modal
export const FEATURE_TYPE_OPTIONS = [
  { value: "core", label: "Core" },
  { value: "premium", label: "Premium" },
  { value: "advanced", label: "Advanced" },
  { value: "enterprise", label: "Enterprise" },
  { value: "add-on", label: "Add-on" },
  { value: "integration", label: "Integration" },
] as const;

// Table pagination configuration
export const TABLE_PAGINATION_CONFIG = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  style: { color: "#ffffff" },
} as const;

// API endpoints
export const FEATURES_API_ENDPOINTS = {
  LIST: "/auth/feature",
  CREATE: "/auth/feature",
  UPDATE: (id: string) => `/auth/feature/${id}`,
  DELETE: (id: string) => `/auth/feature/${id}`,
} as const;
