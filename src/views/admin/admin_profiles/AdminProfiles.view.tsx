import React, { useState, useEffect } from "react";
import { Table, Select, Form, Typography } from "antd";
import styles from "./AdminProfiles.module.scss";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { IAdminType } from "@/types/IAdminType";
import columns from "./columns";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import CreateAdmin from "./CreateAdmin.modal";
import { FaPlus } from "react-icons/fa";

const AdminProfiles = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<IAdminType | null>(null);
  const [form] = Form.useForm();
  const { addAlert } = useInterfaceStore((state) => state);

  // Fetch admin users
  const { data, isLoading, refetch } = useApiHook({
    url: "/admin",
    key: ["admin-users"],
    method: "GET",
  }) as any;

  // Delete admin user
  const { mutate: deleteAdmin } = useApiHook({
    method: "DELETE",
    url: "",
    key: "delete-admin",
    queriesToInvalidate: ["admin-users"],
  }) as any;

  const handleCreateAdmin = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAdmin = (user: IAdminType) => {
    setEditingUser(user);
    form.setFieldsValue({});
    setIsModalVisible(true);
  };
  const handleDeleteAdmin = (userId: string) => {
    deleteAdmin(
      { url: `/user/${userId}` },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Admin user deleted successfully",
            duration: 3000,
          });
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || "Failed to delete admin user",
            duration: 5000,
          });
        },
      }
    );
  };

  return (
    <SearchWrapper
      buttons={[
        {
          toolTip: "Create Admin",
          onClick: handleCreateAdmin,
          type: "primary",
          icon: <FaPlus />,
        },
      ]}
      filters={[
        {
          label: "All",
          key: "",
        },
        {
          label: "Admins",
          key: `role;{"$eq": "admin"}`,
        },
        {
          label: "Moderators",
          key: `role;{"$eq": "moderator"}`,
        },
        {
          label: "Developers",
          key: `role;{"$eq": "developer"}`,
        },
        {
          label: "Support",
          key: `role;{"$eq": "support"}`,
        },
      ]}
      sort={[
        {
          label: "None",
          key: "",
        },
      ]}
      placeholder="Search Admin Profiles"
      queryKey="admin-users"
      total={data?.metadata?.totalCount}
      isFetching={isLoading}
    >
      <CreateAdmin
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        form={form}
        editingUser={editingUser}
      />
      <Table
        className={styles.table}
        dataSource={data?.payload || []}
        columns={columns(handleEditAdmin, handleDeleteAdmin)}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
      />
    </SearchWrapper>
  );
};

export default AdminProfiles;
