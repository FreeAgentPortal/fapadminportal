"use client";
import React, { useState } from "react";
import styles from "./FeaturesManagement.module.scss";
import "./FeaturesTable.css";
import { Button, Spin, Table } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { FeatureType } from "@/types/IFeatureType";
import FeatureModal from "./FeatureModal.view";
import { createFeatureColumns, TABLE_PAGINATION_CONFIG, FEATURES_API_ENDPOINTS } from "./features.constants";

const FeaturesManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureType | null>(null);

  // Fetch features data
  const { data, isLoading, error, refetch } = useApiHook({
    url: FEATURES_API_ENDPOINTS.LIST,
    key: ["features"],
    method: "GET",
  }) as { data: { payload: FeatureType[] }; isLoading: boolean; error: any; refetch: () => void }; 
  const features = data?.payload || [];

  const handleCreateFeature = () => {
    setEditingFeature(null);
    setModalVisible(true);
  };

  const handleEditFeature = (feature: FeatureType) => {
    setEditingFeature(feature);
    setModalVisible(true);
  };

  const handleDeleteFeature = (feature: FeatureType) => {
    // TODO: Implement delete functionality
    console.log("Delete feature:", feature);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingFeature(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Refresh the features data
  };

  // Create columns with handlers
  const columns = createFeatureColumns(handleEditFeature, handleDeleteFeature);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>
            <SettingOutlined />
            Features Management
          </h3>
          <p className={styles.subtitle}>Manage features and capabilities available across subscription plans</p>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addButton}
            size="large"
            onClick={handleCreateFeature}
          >
            Create New Feature
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{features.length}</span>
          <span className={styles.statLabel}>Total Features</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{features.filter((f) => f.isActive).length}</span>
          <span className={styles.statLabel}>Active Features</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{[...new Set(features.map((f) => f.type))].length}</span>
          <span className={styles.statLabel}>Types</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statNumber}>{features.filter((f) => !f.isActive).length}</span>
          <span className={styles.statLabel}>Inactive Features</span>
        </div>
      </div>

      {/* Features Table */}
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={features}
          rowKey="_id"
          pagination={TABLE_PAGINATION_CONFIG}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          className="features-table"
        />
      </div>

      <FeatureModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        editingFeature={editingFeature}
      />
    </div>
  );
};

export default FeaturesManagement;
