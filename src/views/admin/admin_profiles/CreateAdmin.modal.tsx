import React, { useState, useEffect } from "react";
import { Form, Button, Select, Space, Collapse, Checkbox, Divider, Typography, Card } from "antd";
import styles from "./AdminProfiles.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Modal } from "antd";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { IAdminType } from "@/types/IAdminType";
import {
  ADMIN_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getAllPermissions,
  PermissionGroup,
} from "@/data/adminPermissions";

type CreateAdminProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: any; // Replace with your form type
  editingUser?: IAdminType | null;
};

const CreateAdmin = ({ isModalVisible, setIsModalVisible, form, editingUser }: CreateAdminProps) => {
  const { addAlert } = useInterfaceStore((state) => state);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Initialize form values when editing
  useEffect(() => {
    if (editingUser) {
      setSelectedPermissions(editingUser.permissions || []);
      setSelectedRole(editingUser.role?.[0] || "");
      form.setFieldsValue({
        userId: typeof editingUser.user === "string" ? editingUser.user : editingUser.user?._id,
        role: editingUser.role?.[0],
        permissions: editingUser.permissions || [],
      });
    } else {
      setSelectedPermissions([]);
      setSelectedRole("");
      setUserSearchText("");
    }
  }, [editingUser, form]);

  // Update permissions when role changes
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
    setSelectedPermissions(defaultPermissions);
    form.setFieldValue("permissions", defaultPermissions);
  };

  // Handle individual permission changes
  const handlePermissionChange = (permissionValue: string, checked: boolean) => {
    let updatedPermissions = [...selectedPermissions];

    if (checked) {
      updatedPermissions.push(permissionValue);
    } else {
      updatedPermissions = updatedPermissions.filter((p) => p !== permissionValue);
    }

    setSelectedPermissions(updatedPermissions);
    form.setFieldValue("permissions", updatedPermissions);
  };

  // Handle group permission changes
  const handleGroupPermissionChange = (group: PermissionGroup, checked: boolean) => {
    const groupPermissions = group.permissions.map((p) => p.value);
    let updatedPermissions = [...selectedPermissions];

    if (checked) {
      // Add all group permissions that aren't already selected
      groupPermissions.forEach((permission) => {
        if (!updatedPermissions.includes(permission)) {
          updatedPermissions.push(permission);
        }
      });
    } else {
      // Remove all group permissions
      updatedPermissions = updatedPermissions.filter((p) => !groupPermissions.includes(p));
    }

    setSelectedPermissions(updatedPermissions);
    form.setFieldValue("permissions", updatedPermissions);
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (group: PermissionGroup): boolean => {
    return group.permissions.every((permission) => selectedPermissions.includes(permission.value));
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (group: PermissionGroup): boolean => {
    return (
      group.permissions.some((permission) => selectedPermissions.includes(permission.value)) &&
      !isGroupFullySelected(group)
    );
  };
  // Create admin user
  const { mutate: mutateAdmin } = useApiHook({
    method: editingUser ? "PUT" : "POST",
    key: "create-admin",
    queriesToInvalidate: ["admin-users"],
  }) as any;

  // query the user table to get the list of available users to assign as admin
  const {
    data: usersData,
    refetch: refetchUsers,
    isFetching: isLoadingUsers,
  } = useApiHook({
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
    const formData = {
      user: values.userId,
      role: [values.role], // Convert to array as per interface
      permissions: selectedPermissions,
    };

    // Update existing admin
    mutateAdmin(
      { url: editingUser ? `/admin/${editingUser?._id}` : `/admin`, data: formData },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: `Admin user ${editingUser ? "updated" : "created"} successfully`,
            duration: 3000,
          });
          setIsModalVisible(false);
          form.resetFields();
          setSelectedPermissions([]);
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
        setSelectedPermissions([]);
        setSelectedRole("");
        setUserSearchText("");
      }}
      footer={null}
      width={600}
      className={styles.adminModal}
    >
      <div className={formStyles.form}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          <Form.Item name="role" label="Admin Role" rules={[{ required: true, message: "Please select a role" }]}>
            <Select placeholder="Select admin role" onChange={handleRoleChange}>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="developer">Developer</Select.Option>
              <Select.Option value="moderator">Moderator</Select.Option>
              <Select.Option value="support">Support</Select.Option>
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="permissions"
            label="Permissions"
            extra="Select specific permissions for this admin user. Default permissions are applied based on role."
          >
            <Card
              size="small"
              title={
                <Space>
                  <Typography.Text strong>Granulated Permissions</Typography.Text>
                  <Typography.Text type="success">({selectedPermissions.length} selected)</Typography.Text>
                </Space>
              }
              className={styles.permissionsCard}
            >
              <Collapse
                ghost
                size="small"
                items={ADMIN_PERMISSIONS.map((group) => ({
                  key: group.value,
                  label: (
                    <Space>
                      <Checkbox
                        checked={isGroupFullySelected(group)}
                        indeterminate={isGroupPartiallySelected(group)}
                        onChange={(e) => handleGroupPermissionChange(group, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Typography.Text strong>{group.label}</Typography.Text>
                      <Typography.Text type="success">
                        ({group.permissions.filter((p) => selectedPermissions.includes(p.value)).length}/
                        {group.permissions.length})
                      </Typography.Text>
                    </Space>
                  ),
                  children: (
                    <div className={styles.permissionGroup}>
                      {group.permissions.map((permission) => (
                        <div key={permission.value} className={styles.permissionItem}>
                          <Checkbox
                            checked={selectedPermissions.includes(permission.value)}
                            onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                          >
                            <div>
                              <Typography.Text>{permission.label}</Typography.Text>
                              <br />
                              <Typography.Text type="success" style={{ fontSize: "12px" }}>
                                {permission.description}
                              </Typography.Text>
                            </div>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  ),
                }))}
              />

              {selectedPermissions.length > 0 && (
                <>
                  <Divider />
                  <div className={styles.selectedPermissions}>
                    <Typography.Text strong>Selected Permissions:</Typography.Text>
                    <div className={styles.permissionTags}>
                      {selectedPermissions.map((permission) => (
                        <Button
                          key={permission}
                          size="small"
                          type="text"
                          onClick={() => handlePermissionChange(permission, false)}
                          className={styles.permissionTag}
                        >
                          {permission} ×
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </Form.Item> */}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={false} className={formStyles.submitButton}>
                {editingUser ? "Update Admin" : "Create Admin"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setSelectedPermissions([]);
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
