"use client";
import React, { useState } from "react";
import { Table, Form } from "antd";
import styles from "./ScoutProfiles.module.scss";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { IScoutProfile } from "@/types/IScoutProfile";
import columns from "./columns";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { FaPlus } from "react-icons/fa";
import CreateScout from "./CreateScout.modal";

const ScoutProfiles = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScout, setEditingScout] = useState<IScoutProfile | null>(null);
  const [form] = Form.useForm();
  const { addAlert } = useInterfaceStore((state) => state);

  // Fetch scout profiles
  const { data, isLoading, refetch } = useApiHook({
    url: "/profiles/scout",
    key: ["scout-profiles"],
    method: "GET",
  }) as any;

  // Delete scout profile
  const { mutate: deleteScout } = useApiHook({
    method: "DELETE",
    key: "delete-scout",
    queriesToInvalidate: ["scout-profiles"],
  }) as any;

  const handleCreateScout = () => {
    setEditingScout(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditScout = (scout: IScoutProfile) => {
    setEditingScout(scout);
    form.setFieldsValue({
      userId: scout.userId,
      teams: scout.teams,
      sports: scout.sports,
      leagues: scout.leagues,
      bio: scout.bio,
    });
    setIsModalVisible(true);
  };

  const handleDeleteScout = (scoutId: string) => {
    deleteScout(
      { url: `/scout/${scoutId}` },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Scout profile deleted successfully",
            duration: 3000,
          });
        },
        onError: () => {
          addAlert({
            type: "error",
            message: "Failed to delete scout profile",
            duration: 3000,
          });
        },
      }
    );
  };

  return (
    <div className="scout-profiles">
      <SearchWrapper
        buttons={[
          {
            toolTip: "Create Scout Profile",
            onClick: handleCreateScout,
            type: "primary",
            icon: <FaPlus />,
          },
        ]}
        filters={[
          {
            label: "All Scouts",
            key: "",
          },
          {
            label: "Active Scouts",
            key: `userId;{"$exists":true}`,
          },
          {
            label: "Football Scouts",
            key: `sports;{"$in":["football"]}`,
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
          {
            label: "Name A-Z",
            key: "fullName;asc",
          },
          {
            label: "Name Z-A",
            key: "fullName;desc",
          },
        ]}
        placeholder="Search Scout Profiles by name, email, or sport"
        queryKey="scout-profiles"
        total={data?.metadata?.totalCount}
        isFetching={isLoading}
      >
        <CreateScout
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          form={form}
          editingScout={editingScout}
        />
        <Table
          className={styles.table}
          dataSource={data?.payload || []}
          columns={columns(handleEditScout, handleDeleteScout)}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </SearchWrapper>
    </div>
  );
};

export default ScoutProfiles;
