"use client";
import React, { useState } from "react";
import styles from "./SigningManagement.module.scss";
import useApiHook from "@/hooks/useApi";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getSigningsColumns } from "./SigningsColumns";
import ISigning from "@/types/ISigning";
import IAPIResponse from "@/types/IAPIResponse";
import SigningModal from "./SigningModal";

const SigningManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSigning, setEditingSigning] = useState<ISigning | null>(null);

  const { data, isLoading, refetch } = useApiHook({
    url: `/feed/signing`,
    key: ["signings"],
    method: "GET",
  }) as { data: IAPIResponse<ISigning[]>; isLoading: boolean; error: any; refetch: () => void };

  const { mutate: deleteSigning } = useApiHook({
    method: "DELETE",
    key: "signing.delete",
    queriesToInvalidate: ["signings"],
  }) as any;

  const handleCreateSigning = () => {
    setEditingSigning(null);
    setModalVisible(true);
  };

  const handleEditSigning = (signing: ISigning) => {
    setEditingSigning(signing);
    setModalVisible(true);
  };

  const handleDeleteSigning = (signingId: string) => {
    deleteSigning(
      { url: `/feed/signing/${signingId}` },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingSigning(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const columns = getSigningsColumns({
    onEdit: handleEditSigning,
    onDelete: handleDeleteSigning,
  });
  return (
    <SearchWrapper
      buttons={[
        {
          icon: <PlusOutlined />,
          onClick: handleCreateSigning,
          type: "primary",
          toolTip: "Create a new signing",
        },
      ]}
      filters={[]}
      sort={[]}
      placeholder="Search Signings"
      queryKey="signings"
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

      <SigningModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        editingSigning={editingSigning}
      />
    </SearchWrapper>
  );
};

export default SigningManagement;
