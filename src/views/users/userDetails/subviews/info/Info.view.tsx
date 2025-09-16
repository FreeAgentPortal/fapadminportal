"use client";
import React, { useState } from "react";
import styles from "./Info.module.scss";
import { Card, Form, Input, Button, Switch, Tag, Divider, Modal, Tooltip, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IAdminType } from "@/types/IAdminType";
import { hasRequiredRole } from "@/utils/roleUtils";

interface InfoProps {
  userData: User;
  onDataUpdate: (updatedData: Partial<User>) => void;
}

const Info: React.FC<InfoProps> = ({ userData, onDataUpdate }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(["profile", "admin"]) as { payload: IAdminType };

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdating } = useApiHook({
    method: "PUT",
    key: "user.update",
    queriesToInvalidate: ["user", id as string],
  }) as any;

  // Reset password mutation
  const { mutate: resetPassword, isLoading: isResetting } = useApiHook({
    method: "POST",
    key: "user.resetPassword",
  }) as any;

  // Set custom password mutation
  const { mutate: setCustomPassword, isLoading: isSettingPassword } = useApiHook({
    method: "POST",
    key: "user.setPassword",
  }) as any;

  // Delete user mutation
  const { mutate: deleteUser, isLoading: isDeleting } = useApiHook({
    method: "DELETE",
    key: "user.delete",
  }) as any;

  const handleSaveChanges = async (values: any) => {
    try {
      updateUser(
        {
          url: `/user/${userData?._id}`,
          formData: values,
        },
        {
          onSuccess: (response: any) => {
            addAlert({
              type: "success",
              message: "User updated successfully!",
            });
            setIsEditing(false);
            onDataUpdate(values);
          },
          onError: () => {
            addAlert({
              type: "error",
              message: "Failed to update user",
            });
          },
        }
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleResetPassword = () => {
    setResetPasswordModalVisible(true);
  };

  const confirmResetPassword = () => {
    resetPassword(
      {
        url: `/user/${userData?._id}/reset-password`,
        formData: { sendNotification: true, generateSecure: true },
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Password reset successfully! User will receive an email with their new password.",
          });
          setResetPasswordModalVisible(false);
        },
        onError: () => {
          addAlert({
            type: "error",
            message: "Failed to reset password",
          });
          setResetPasswordModalVisible(false);
        },
      }
    );
  };

  const handleSetCustomPassword = async (values: any) => {
    try {
      setCustomPassword(
        {
          url: `/user/${userData?._id}/reset-password`,
          formData: {
            password: values.password,
            sendNotification: values.sendNotification || false,
          },
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: values.sendNotification
                ? "Password set successfully! User has been notified via email."
                : "Password set successfully!",
            });
            setPasswordModalVisible(false);
            passwordForm.resetFields();
          },
          onError: () => {
            addAlert({
              type: "error",
              message: "Failed to set password",
            });
          },
        }
      );
    } catch (error) {
      console.error("Password set error:", error);
    }
  };

  const handleDeleteUser = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteUser = () => {
    deleteUser(
      {
        url: `/user/${userData?._id}`,
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "User deleted successfully!",
          });
          setDeleteModalVisible(false);
          // Navigate back to users list or appropriate page
          window.history.back();
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || "Failed to delete user",
          });
          setDeleteModalVisible(false);
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* User Information Card */}
      <Card
        title={
          <div className={styles.cardTitle}>
            <UserOutlined /> User Information
          </div>
        }
        className={styles.card}
        extra={
          <Space>
            <Button type="primary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit User"}
            </Button>
            {/* Show delete button only if user has 'users.delete' permission and it's not self-deletion */}
            {hasRequiredRole(selectedProfile?.payload.permissions, ["users.delete"]) && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteUser}
                disabled={selectedProfile?.payload?._id === userData?._id} // Prevent self-deletion
              >
                Delete User
              </Button>
            )}
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            isActive: userData.isActive,
            isEmailVerified: userData.isEmailVerified,
          }}
          onFinish={handleSaveChanges}
        >
          <div className={styles.formGrid}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName">
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input disabled={!isEditing} prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item label="Phone Number" name="phoneNumber">
              <Input disabled={!isEditing} prefix={<PhoneOutlined />} />
            </Form.Item>

            <Form.Item label="Account Active" name="isActive" valuePropName="checked">
              <Switch disabled={!isEditing} />
            </Form.Item>

            <Form.Item label="Email Verified" name="isEmailVerified" valuePropName="checked">
              <Switch disabled={!isEditing} />
            </Form.Item>
          </div>

          {isEditing && (
            <div className={styles.saveActions}>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Save Changes
              </Button>
            </div>
          )}
        </Form>
      </Card>

      {/* Authentication Management Card */}
      <Card
        title={
          <div className={styles.cardTitle}>
            <SafetyOutlined /> Authentication Management
          </div>
        }
        className={styles.card}
      >
        <div className={styles.authSection}>
          <div className={styles.authInfo}>
            <div className={styles.authItem}>
              <KeyOutlined className={styles.authIcon} />
              <div className={styles.authDetails}>
                <h4>Password Management</h4>
                <p>Manage user password and authentication settings</p>
              </div>
            </div>

            {userData.needsBillingSetup && (
              <div className={styles.warning}>
                <Tag color="warning">Billing Setup Required</Tag>
              </div>
            )}
          </div>

          <Divider />

          <div className={styles.passwordActions}>
            <Space size="large" wrap>
              <Tooltip title="Generate a secure password and email it to the user">
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleResetPassword}
                  loading={isResetting}
                >
                  Reset Password (Auto-Generate)
                </Button>
              </Tooltip>

              <Tooltip title="Set a custom password for the user">
                <Button icon={<LockOutlined />} onClick={() => setPasswordModalVisible(true)}>
                  Set Custom Password
                </Button>
              </Tooltip>
            </Space>
          </div>

          {userData.permissions && userData.permissions.length > 0 && (
            <>
              <Divider />
              <div className={styles.permissions}>
                <h4>User Permissions</h4>
                <div className={styles.permissionsList}>
                  {userData.permissions.map((permission, index) => (
                    <Tag key={index} className={styles.permissionTag}>
                      {permission}
                    </Tag>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Custom Password Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <LockOutlined /> Set Custom Password
          </div>
        }
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        className={styles.passwordModal}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleSetCustomPassword}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm the password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item
            label="Notify User"
            name="sendNotification"
            valuePropName="checked"
            tooltip="Send an email notification to the user about the password change"
          >
            <Switch />
          </Form.Item>

          <div className={styles.modalActions}>
            <Button onClick={() => setPasswordModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSettingPassword}>
              Set Password
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Reset Password Confirmation Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Reset User Password
          </div>
        }
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        footer={null}
        className={styles.passwordModal}
      >
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "var(--color-silver)", fontSize: "16px", marginBottom: "16px" }}>
            Are you sure you want to reset the password for <strong>{userData?.fullName}</strong>?
          </p>
          <p style={{ color: "var(--color-silver-dark)", fontSize: "14px" }}>
            A new secure password will be generated and emailed to them automatically.
          </p>
        </div>

        <div className={styles.modalActions}>
          <Button onClick={() => setResetPasswordModalVisible(false)}>Cancel</Button>
          <Button type="primary" danger onClick={confirmResetPassword} loading={isResetting} icon={<ReloadOutlined />}>
            Reset Password
          </Button>
        </div>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Delete User
          </div>
        }
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
        className={styles.passwordModal}
      >
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "var(--color-silver)", fontSize: "16px", marginBottom: "16px" }}>
            Are you sure you want to permanently delete <strong>{userData?.fullName}</strong>?
          </p>
          <p style={{ color: "#ff4d4f", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
            ⚠️ This action cannot be undone!
          </p>
          <p style={{ color: "var(--color-silver-dark)", fontSize: "14px" }}>
            All user data, profile information, and associated records will be permanently removed from the system.
          </p>
        </div>

        <div className={styles.modalActions}>
          <Button onClick={() => setDeleteModalVisible(false)}>Cancel</Button>
          <Button type="primary" danger onClick={confirmDeleteUser} loading={isDeleting} icon={<DeleteOutlined />}>
            Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Info;
