import React, { useState, useEffect } from "react";
import { Form, Button, Select, Space, Typography } from "antd";
import styles from "./AdminProfiles.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Modal } from "antd";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { IAdminType } from "@/types/IAdminType";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import AdminPermissions from "./components/adminPermissions/AdminPermissions.component";
import UserItem from "@/components/userItem/UserItem.component";

type CreateAdminProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: any; // Replace with your form type
  editingUser?: IAdminType | null;
};

const CreateAdmin = ({ isModalVisible, setIsModalVisible, form, editingUser }: CreateAdminProps) => {
  const { addAlert } = useInterfaceStore((state) => state);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Use the permissions hook
  const { selectedPermissions, updatePermissions, applyRoleDefaults, resetPermissions } = useAdminPermissions(
    editingUser?.permissions || []
  );

  // Initialize form values when editing
  useEffect(() => {
    if (editingUser) {
      updatePermissions(editingUser.permissions || [], form);
      setSelectedRole(editingUser.roles?.[0] || "");
      form.setFieldsValue({
        userId: typeof editingUser.user === "string" ? editingUser.user : editingUser.user?._id,
        roles: editingUser.roles,
        permissions: editingUser.permissions || [],
      });
    } else {
      resetPermissions(form);
      setSelectedRole("");
      setUserSearchText("");
    }
  }, [editingUser, form]);

  // Update permissions when role changes
  const handleRoleChange = (roles: string[]) => {
    setSelectedRole(roles[0] || ""); // For display purposes, track primary role
    applyRoleDefaults(roles, form);
  };

  // Create admin user
  const { mutate: mutateAdmin } = useApiHook({
    method: editingUser ? "PUT" : "POST",
    key: "create-admin",
    queriesToInvalidate: ["admin-users"],
  }) as any;

  // query the user table to get the list of available users to assign as admin
  const { data: usersData, isFetching: isLoadingUsers } = useApiHook({
    url: "/user",
    key: ["users-list", userSearchText],
    method: "GET",
    // we only want profiles that do not have a profileRef.admin
    filter: `profileRefs.admin;{"$exists":false}`,
    keyword: userSearchText,
    enabled: isModalVisible, // Only fetch when modal is open
  }) as any;

  // Handle user search with debounce
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userSearchText]);

  const handleUserSearch = (value: string) => {
    setUserSearchText(value);
  };

  const handleSubmit = (values: any) => {
    console.log(values);
    const formData = {
      user: values.userId,
      roles: values.roles, // Convert to array as per interface
      permissions: selectedPermissions,
    };

    // Update existing admin
    mutateAdmin(
      { url: editingUser ? `/admin/${editingUser?._id}` : `/admin`, formData },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: `Admin user ${editingUser ? "updated" : "created"} successfully`,
            duration: 3000,
          });
          setIsModalVisible(false);
          form.resetFields();
          resetPermissions(form);
          setSelectedRole("");
          setUserSearchText("");
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || `Failed to ${editingUser ? "update" : "create"} admin user`,
            duration: 5000,
          });
        },
      }
    );
  };
  return (
    <Modal
      title={editingUser ? "Edit Admin User" : "Create Admin User"}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
        resetPermissions(form);
        setSelectedRole("");
        setUserSearchText("");
      }}
      footer={null}
      width={600}
      className={`${styles.adminModal} admin-profiles`}
    >
      <div className={formStyles.form}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {editingUser ? (
            <UserItem user={editingUser.user} sm />
          ) : (
            <Form.Item
              label={
                <Space>
                  <span>Select User</span>
                  {usersData?.payload && (
                    <Typography.Text type="warning" style={{ fontSize: "12px" }}>
                      ({usersData.payload.length} {userSearchText ? "found" : "available"})
                    </Typography.Text>
                  )}
                </Space>
              }
              name="userId"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder="Search and select a user"
                allowClear
                showSearch
                searchValue={userSearchText}
                onSearch={handleUserSearch}
                loading={isLoadingUsers || isSearching}
                filterOption={false} // Disable client-side filtering since we're doing server-side search
                notFoundContent={isLoadingUsers ? "Loading..." : "No users found"}
                className={styles.userSelect}
              >
                {usersData?.payload?.map((user: any) => (
                  <Select.Option key={user._id} value={user._id}>
                    <div className={styles.userOption}>
                      <div className={styles.userName}>{user.fullName}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="roles" label="Admin Role" rules={[{ required: true, message: "Please select a role" }]}>
            <Select placeholder="Select admin role" onChange={handleRoleChange} mode="multiple">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="developer">Developer</Select.Option>
              <Select.Option value="scout">Scout</Select.Option>
              <Select.Option value="support">Support</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            extra="Customize specific permissions for this admin user. Use 'Reset to Defaults' to apply role-based permissions."
          >
            <AdminPermissions
              selectedPermissions={selectedPermissions}
              onPermissionsChange={(permissions) => updatePermissions(permissions, form)}
              selectedRoles={form.getFieldValue("roles") || []}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={false} className={formStyles.submitButton}>
                {editingUser ? "Update Admin" : "Create Admin"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  resetPermissions(form);
                  setSelectedRole("");
                  setUserSearchText("");
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateAdmin;
